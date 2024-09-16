'use client'
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { generateAndCompareDeviceId } from '../lib/helper';
import { apiRequest } from '../../app/lib/apiHelper';
import '@/styles/dashboard/dashboard.css'

function DashboardPage() {
  const router = useRouter();
  const [inputs, setInputs] = useState({});
  const [dashboardData, setDashboardData] = useState({});
  const [txnStatusData, setTxnStatusData] = useState([]);
  const [paymentData, setPaymentData] = useState([]);
  const [serviceTypeData, setServiceTypeData] = useState([]);
  const [hourlyData, setHourlyData] = useState({
    success: [],
    failed: [],
    other: []
  });

  useEffect(() => {
    // generateAndCompareDeviceId(router);

    const fetchData = async () => {
      try {
        setInputs({
          start_date: '2024-09-01',
          end_date: '2024-09-16'
        });
        const response = await apiRequest('POST', '/v1/merchant/dashboard', { post: inputs });
        const dashboardData = response.Result;
        setDashboardData(dashboardData);
        setTxnStatusData(dashboardData.txn_status_data || []);
        setPaymentData(dashboardData.txn_mode_data || []);
        setServiceTypeData(dashboardData.txt_service_type || []);

        const txtHourlyData = dashboardData.txt_hourly_data || [];
        const successData = {}, failedData = {}, otherData = {};

        txtHourlyData.forEach(item => {
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

        const formatHourlyData = (data) => {
          return Object.keys(data).map(hourly => ({
            hourly,
            total: data[hourly]
          }));
        };

        setHourlyData({
          success: formatHourlyData(successData),
          failed: formatHourlyData(failedData),
          other: formatHourlyData(otherData)
        });

      } catch (error) {
        console.error('Error fetching dashboard data', error);
      }
    };

    fetchData();
  }, [router, inputs]);

  const calculateRates = () => {
    const totalTransactions = txnStatusData.filter(item => ['success', 'failed'].includes(item.txn_status)).reduce((sum, item) => sum + item.total, 0);
    const successTransactions = txnStatusData.filter(item => item.txn_status === 'success').reduce((sum, item) => sum + item.total, 0);
    const failedTransactions = txnStatusData.filter(item => item.txn_status === 'failed').reduce((sum, item) => sum + item.total, 0);
    const successRate = totalTransactions > 0 ? (successTransactions / totalTransactions) * 100 : 0;
    const failureRate = totalTransactions > 0 ? (failedTransactions / totalTransactions) * 100 : 0;

    return { successRate, failureRate };
  };
  const { successRate, failureRate } = calculateRates();

  return (
    <>
      <h1 className='text-xl mb-3'>Dashboard</h1>
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Total Transactions */}
        <div className="small-box bg-totaltxn fixed-box">
          <div className="inner text-center text-white h-32">
            <h5 className="primary-title font-weight-bold">Total Transactions</h5>
            <h3 className="total-txn text-center text-2xl mt-2">{txnStatusData.reduce((sum, item) => sum + item.total, 0)}</h3>
            <p className="txn_amount">Total Amount: {txnStatusData.reduce((sum, item) => sum + item.total_txn_amount, 0)} /-</p>
          </div>
        </div>

        {/* Success Transactions */}
        <div className="small-box bg-successtxn fixed-box">
          <div className="inner text-center text-white h-32">
            <h5 className="primary-title font-weight-bold">Success Transactions</h5>
            <h3 className="total-txn text-center text-2xl mt-2">{txnStatusData.filter(item => item.txn_status === 'success').reduce((sum, item) => sum + item.total, 0)}</h3>
            <p className="text-center text-sm">Success Rate: {successRate.toFixed(2)}%</p>
            <p className="txn_amount">Success Amount: {txnStatusData.filter(item => item.txn_status === 'success').reduce((sum, item) => sum + item.total_txn_amount, 0)} /-</p>
          </div>
        </div>

        {/* Failed Transactions */}
        <div className="small-box bg-failedtxn fixed-box">
          <div className="inner text-center text-white h-32">
            <h5 className="primary-title font-weight-bold">Failed Transactions</h5>
            <h3 className="total-txn text-center text-2xl mt-2">{txnStatusData.filter(item => item.txn_status === 'failed').reduce((sum, item) => sum + item.total, 0)}</h3>
            <p className="text-center text-sm">Failure Rate: {failureRate.toFixed(2)}%</p>
            <p className="txn_amount">Failure Amount: {txnStatusData.filter(item => item.txn_status === 'failed').reduce((sum, item) => sum + item.total_txn_amount, 0)} /-</p>
          </div>
        </div>

        {/* Other Transactions */}
        <div className="small-box bg-othertxn fixed-box">
          <div className="inner text-center text-white h-32">
            <h5 className="primary-title font-weight-bold">Other Transactions</h5>
            <h3 className="total-txn text-center text-2xl mt-2">{txnStatusData.filter(item => !['success', 'failed'].includes(item.txn_status)).reduce((sum, item) => sum + item.total, 0)}</h3>
            <p className="txn_amount">Other Amount: {txnStatusData.filter(item => !['success', 'failed'].includes(item.txn_status)).reduce((sum, item) => sum + item.total_txn_amount, 0)} /-</p>
          </div>
        </div>
      </div>
    </>
  );
}

export default DashboardPage;
