'use client';
import { useState, useEffect } from 'react';
import { apiRequest } from '../../app/lib/apiHelper';
import '@/styles/dashboard/dashboard.css';
import DashboardHeader from '../components/Dashboard/DashboardHeader';
import TransactionBoxes from '../components/Dashboard/TransactionBoxes';
import Charts from '../components/Dashboard/Charts';
import moment from 'moment';

function DashboardPage() {
  const [inputs, setInputs] = useState({
    start_date: moment().format('YYYY-MM-DD'),
    end_date: moment().format('YYYY-MM-DD')
  });
  const [txnStatusData, setTxnStatusData] = useState([]);
  const [paymentData, setPaymentData] = useState([]);
  const [serviceTypeData, setServiceTypeData] = useState([]);
  const [hourlyData, setHourlyData] = useState({
    success: [],
    failed: [],
    other: []
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await apiRequest('POST', '/v1/merchant/dashboard', { post: inputs });
        const dashboardData = response.Result;
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
    const totalTransactions = txnStatusData.filter((item) => ['success', 'failed'].includes(item.txn_status)).reduce((sum, item) => sum + item.total, 0);
    const successTransactions = txnStatusData.filter((item) => item.txn_status === 'success').reduce((sum, item) => sum + item.total, 0);
    const successRate = totalTransactions > 0 ? (successTransactions / totalTransactions) * 100 : 0;
    const failureRate = totalTransactions > 0 ? (txnStatusData.filter((item) => item.txn_status === 'failed').reduce((sum, item) => sum + item.total, 0) / totalTransactions) * 100 : 0;
    return { successRate, failureRate };
  };

  const { successRate, failureRate } = calculateRates();

  return (
    <>
      <DashboardHeader inputs={inputs} setInputs={setInputs} />
      <TransactionBoxes txnStatusData={txnStatusData} successRate={successRate} failureRate={failureRate} />
      <Charts
        txnStatusData={txnStatusData}
        paymentData={paymentData}
        serviceTypeData={serviceTypeData}
        hourlyData={hourlyData}
      />
    </>
  );
}

export default DashboardPage;
