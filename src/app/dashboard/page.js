'use client';
import { useState, useEffect } from 'react';
import { apiRequest } from '../../app/lib/apiHelper';
import '@/styles/dashboard/dashboard.css';
import DashboardHeader from '../components/Dashboard/DashboardHeader';
import TransactionBoxes from '../components/Dashboard/TransactionBoxes';
import moment from 'moment';

function DashboardPage() {
  const [inputs, setInputs] = useState({
    start_date: moment().format('YYYY-MM-DD'),
    end_date: moment().format('YYYY-MM-DD')
  });
  const [txnStatusData, setTxnStatusData] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      const response = await apiRequest('POST', '/v1/merchant/dashboard', { post: inputs });
      setTxnStatusData(response.Result.txn_status_data || []);
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
    </>
  );
}

export default DashboardPage;
