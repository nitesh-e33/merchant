'use client';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { generateAndCompareDeviceId } from '../lib/helper';
import '@/styles/dashboard/dashboard.css'
import { apiRequest } from '../../app/lib/apiHelper';
import moment from 'moment';
import 'daterangepicker/daterangepicker.css';
import $ from 'jquery';
import 'daterangepicker';

function DashboardPage() {
  const router = useRouter();
  const [inputs, setInputs] = useState({
    start_date: moment().format('YYYY-MM-DD'),
    end_date: moment().format('YYYY-MM-DD')
  });
  const [dashboardData, setDashboardData] = useState({});
  const [txnStatusData, setTxnStatusData] = useState([]);
  const [paymentData, setPaymentData] = useState([]);
  const [serviceTypeData, setServiceTypeData] = useState([]);
  const [hourlyData, setHourlyData] = useState({
    success: [],
    failed: [],
    other: []
  });

  // Handle the date range selection
  useEffect(() => {
    // Initialize date picker
    $('#start_date, #end_date').daterangepicker({
      singleDatePicker: true,
      showDropdowns: true,
      autoUpdateInput: false,
      alwaysShowCalendars: true,
      maxDate: moment(),
      locale: {
        format: 'YYYY-MM-DD',
      },
      opens: 'bottom',
    });

    // Handle start_date selection
    $('#start_date').on('apply.daterangepicker', function (ev, picker) {
      const selectedStartDate = picker.startDate.format('YYYY-MM-DD');
      setInputs((prev) => ({ ...prev, start_date: selectedStartDate }));
    });

    // Handle end_date selection
    $('#end_date').on('apply.daterangepicker', function (ev, picker) {
      const selectedEndDate = picker.startDate.format('YYYY-MM-DD');
      setInputs((prev) => ({ ...prev, end_date: selectedEndDate }));
    });
  }, []);

  // Fetch data whenever the date range changes
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await apiRequest('POST', '/v1/merchant/dashboard', { post: inputs });
        const dashboardData = response.Result;
        setDashboardData(dashboardData);
        setTxnStatusData(dashboardData.txn_status_data || []);
        setPaymentData(dashboardData.txn_mode_data || []);
        setServiceTypeData(dashboardData.txt_service_type || []);

        const txtHourlyData = dashboardData.txt_hourly_data || [];
        const successData = {}, failedData = {}, otherData = {};

        txtHourlyData.forEach((item) => {
          const { txn_status, hourly, total } = item;
          switch (txn_status) {
            case 'success':
              successData[hourly] = (successData[hourly] || 0) + total;
              break;
            case 'failed':
              failedData[hourly] = (failedData[hourly] || 0) + total;
              break;
            default:
              otherData[hourly] = (otherData[hourly] || 0) + total;
              break;
          }
        });

        const formatHourlyData = (data) =>
          Object.keys(data).map((hourly) => ({
            hourly,
            total: data[hourly],
          }));

        setHourlyData({
          success: formatHourlyData(successData),
          failed: formatHourlyData(failedData),
          other: formatHourlyData(otherData),
        });
      } catch (error) {
        console.error('Error fetching dashboard data', error);
      }
    };

    fetchData();
  }, [inputs]);

  const calculateRates = () => {
    const totalTransactions = txnStatusData
      .filter((item) => ['success', 'failed'].includes(item.txn_status))
      .reduce((sum, item) => sum + item.total, 0);
    const successTransactions = txnStatusData
      .filter((item) => item.txn_status === 'success')
      .reduce((sum, item) => sum + item.total, 0);
    const failedTransactions = txnStatusData
      .filter((item) => item.txn_status === 'failed')
      .reduce((sum, item) => sum + item.total, 0);
    const successRate = totalTransactions > 0 ? (successTransactions / totalTransactions) * 100 : 0;
    const failureRate = totalTransactions > 0 ? (failedTransactions / totalTransactions) * 100 : 0;

    return { successRate, failureRate };
  };
  const { successRate, failureRate } = calculateRates();

  return (
    <>
      {/* Date Range and Breadcrumb Section */}
      <div className="content-header">
        <div className="container-fluid">
          <div className="row mb-2">
            <div className="col-sm-12 col-md-4">
              <h1 className="text-xl mb-2">Dashboard</h1>
            </div>
            <div className="col-sm-12 col-md-8">
              <div className="dashboard-breadcrumb flex justify-between items-center">
                {/* Date Range Picker */}
                <div className="datepicker-el flex gap-4">
                  <div className="form-group flex items-center bg-white border border-gray-300 rounded-lg p-2">
                    <input
                      type="text"
                      id="start_date"
                      name="start_date"
                      value={inputs.start_date}
                      placeholder="Start date"
                      readOnly
                      className="focus:outline-none"
                    />
                    <i className="far fa-calendar-alt ml-2"></i>
                  </div>
                  <div className="form-group flex items-center bg-white border border-gray-300 rounded-lg p-2">
                    <input
                      type="text"
                      id="end_date"
                      name="end_date"
                      value={inputs.end_date}
                      placeholder="End date"
                      readOnly
                      className="focus:outline-none"
                    />
                    <i className="far fa-calendar-alt ml-2"></i>
                  </div>
                </div>

                {/* Breadcrumb */}
                <div className='row'>
                  <ol className="breadcrumb float-sm-right">
                    <li className="breadcrumb-item">
                      <a href="#" className="text-blue-600">Home</a>
                    </li>
                    <li className="breadcrumb-item active" aria-current="page">
                      Dashboard
                    </li>
                  </ol>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Transaction Boxes */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Total Transactions */}
        <div className="small-box bg-totaltxn fixed-box">
          <div className="inner text-center text-white h-32">
            <h5 className="primary-title font-weight-bold">Total Transactions</h5>
            <h3 className="total-txn text-center text-2xl mt-2">
              {txnStatusData.reduce((sum, item) => sum + item.total, 0)}
            </h3>
            <p className="txn_amount">
              Total Amount: {txnStatusData.reduce((sum, item) => sum + item.total_txn_amount, 0)} /-
            </p>
          </div>
        </div>

        {/* Success Transactions */}
        <div className="small-box bg-successtxn fixed-box">
          <div className="inner text-center text-white h-32">
            <h5 className="primary-title font-weight-bold">Success Transactions</h5>
            <h3 className="total-txn text-center text-2xl mt-2">
              {txnStatusData.filter((item) => item.txn_status === 'success').reduce((sum, item) => sum + item.total, 0)}
            </h3>
            <p className="text-center text-sm">Success Rate: {successRate.toFixed(2)}%</p>
            <p className="txn_amount">
              Success Amount: {txnStatusData.filter((item) => item.txn_status === 'success').reduce((sum, item) => sum + item.total_txn_amount, 0)} /-
            </p>
          </div>
        </div>

        {/* Failed Transactions */}
        <div className="small-box bg-failedtxn fixed-box">
          <div className="inner text-center text-white h-32">
            <h5 className="primary-title font-weight-bold">Failed Transactions</h5>
            <h3 className="total-txn text-center text-2xl mt-2">
              {txnStatusData.filter((item) => item.txn_status === 'failed').reduce((sum, item) => sum + item.total, 0)}
            </h3>
            <p className="text-center text-sm">Failure Rate: {failureRate.toFixed(2)}%</p>
            <p className="txn_amount">
              Failed Amount: {txnStatusData.filter((item) => item.txn_status === 'failed').reduce((sum, item) => sum + item.total_txn_amount, 0)} /-
            </p>
          </div>
        </div>

        {/* Other Transactions */}
        <div className="small-box bg-othertxn fixed-box">
          <div className="inner text-center text-white h-32">
            <h5 className="primary-title font-weight-bold">Other Transactions</h5>
            <h3 className="total-txn text-center text-2xl mt-2">
              {txnStatusData.filter((item) => !['success', 'failed'].includes(item.txn_status)).reduce((sum, item) => sum + item.total, 0)}
            </h3>
            <p className="text-center text-sm">Other Rate: {100 - (successRate + failureRate).toFixed(2)}%</p>
            <p className="txn_amount">
              Other Amount: {txnStatusData.filter((item) => !['success', 'failed'].includes(item.txn_status)).reduce((sum, item) => sum + item.total_txn_amount, 0)} /-
            </p>
          </div>
        </div>
      </div>
    </>
  );
}

export default DashboardPage;
