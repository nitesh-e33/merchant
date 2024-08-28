'use client';
import React, { useEffect, useRef, useState } from 'react';
import $ from 'jquery';
import { apiRequest } from '../lib/apiHelper';
import { toast } from 'react-toastify';
import TransactionTable from '../components/Transactions/TransactionTable';

async function fetchMerchantTransactions(searchParams = {}) {
  try {
    const response = await apiRequest('POST', '/v1/merchant/transactions', {
      post: { 'dto': 'lifetime', ...searchParams }
    });
    if (response.StatusCode === "1") {
      return response.Result.transaction_history;
    } else {
      toast.error(response.Result || 'Something went wrong. Please try again later.');
      return [];
    }
  } catch (error) {
    toast.error('An error occurred while fetching the transactions');
    console.error('Error fetching transactions:', error);
    return [];
  }
}

function Page() {
  const [transactions, setTransactions] = useState([]);
  const [searchName, setSearchName] = useState('');
  const [searchValue, setSearchValue] = useState('');
  const [paymentStatus, setPaymentStatus] = useState('');
  const [paymentMode, setPaymentMode] = useState('');
  const tableRef = useRef(null);

  useEffect(() => {
    // Initialize select2 and set up event listeners
    const initSelect2 = () => {
      $('.select2').select2();

      $('.select2').on('change', function () {
        const name = $(this).attr('name');
        const value = $(this).val();
        if (name === 'searchName') {
          setSearchName(value);
        } else if (name === 'paymentStatus') {
          setPaymentStatus(value);
        } else if (name === 'paymentMode') {
          setPaymentMode(value);
        }
      });
    };

    // Fetch data based on initial states
    const fetchData = async () => {
      const searchParams = {
        payment_status: paymentStatus,
        payment_method: paymentMode,
        [searchName]: searchValue
      };
      const data = await fetchMerchantTransactions(searchParams);
      setTransactions(data);
    };

    initSelect2();
    fetchData();

    // Cleanup select2 event listeners on component unmount
    return () => {
      $('.select2').off('change');
    };
  }, [paymentStatus, paymentMode]);

  useEffect(() => {
    const table = $(tableRef.current);
    if ($.fn.DataTable.isDataTable(table)) {
      table.DataTable().clear().destroy();
    }
    table.DataTable({
      scrollX: true,
      order: [[0, 'desc']],
      data: transactions, // Data will be populated here
      columns: [
        { title: 'DP Transaction ID', data: 'dp_trans_id' },
        { title: 'Customer Name', data: 'customer_name' },
        { title: 'Phone', data: 'customer_phone' },
        { title: 'Email', data: 'customer_email' },
        { title: 'Amount', data: 'amount' },
        { title: 'Payment Status', data: 'payment_status' },
        { title: 'Payment Mode', data: 'payment_method' },
        { title: 'Reference ID', data: 'reference_id' },
        { title: 'Date', data: 'created_at', render: (data) => new Date(data).toLocaleString('en-IN', { timeZone: 'Asia/Kolkata', dateStyle: 'short', timeStyle: 'short' }) },
        { title: 'View', data: null, render: (data, type, row) => `<button class="btn btn-info btn-sm order-details" data-order-id="${row.order_id}">View</button>` }
      ],
    });
    // Cleanup DataTable on component unmount
    return () => {
      if ($.fn.DataTable.isDataTable(table)) {
        table.DataTable().destroy();
      }
    };
  }, [transactions]);

  const handleSearch = async () => {
    if (!searchName || !searchValue) {
      toast.error('Please select a search criteria and enter a search value.');
      return;
    }
    const searchParams = { [searchName]: searchValue, payment_status: paymentStatus, payment_method: paymentMode };
    const data = await fetchMerchantTransactions(searchParams);
    setTransactions(data);
  };

  const resetSearch = async () => {
    setSearchName('');
    setSearchValue('');
    setPaymentStatus('');
    setPaymentMode('');
    $('.select2').val('').trigger('change');
    const data = await fetchMerchantTransactions();
    setTransactions(data);
  };

  return (
    <>
      <div className="row mb-2">
        <div className="col-sm-6">
          <h1 className="text-xl mt-2">Transactions</h1>
        </div>
        <div className="col-sm-6 mt-2">
          <ol className="breadcrumb float-sm-right">
            <li className="breadcrumb-item"><a href="/">Home</a></li>
            <li className="breadcrumb-item active"><a href="/dashboard">Dashboard</a></li>
            <li className="breadcrumb-item active">Transaction List</li>
          </ol>
        </div>
      </div>

      <div className="row">
        <form id="searchForm" onSubmit={(e) => e.preventDefault()} className="col-md-12">
          <div className="row align-items-center">
            <div className="col-3">
              <div className="form-group">
                <label htmlFor="search">Search By:</label>
                <select
                  className="form-control select2"
                  name="searchName"
                  value={searchName}
                >
                  <option value="">--Select--</option>
                  <option value="dp_trans_id">Droompay Transaction ID</option>
                  <option value="reference_id">Reference ID</option>
                  <option value="customer_id">Customer ID</option>
                  <option value="refund_id">Refund ID</option>
                  <option value="customer_name">Customer Name</option>
                  <option value="customer_email">Customer Email</option>
                  <option value="customer_phone">Customer Phone</option>
                </select>
              </div>
            </div>
            <div className="col-3">
              <div className="input-group input-group-sm">
                <input
                  type="text"
                  className="form-control searchValue"
                  placeholder="Search"
                  value={searchValue}
                  onChange={(e) => setSearchValue(e.target.value)}
                />
                <span className="input-group-append">
                  <button type="button" className="btn btn-info btn-flat" onClick={handleSearch}>Go!</button>
                </span>
              </div>
            </div>
            <div className="col-2">
              <button className="btn btn-danger btn-sm" onClick={resetSearch}>Reset</button>
            </div>
          </div>
        </form>
      </div>

      <div className="row">
        <form id="data-range-form" onSubmit={(e) => e.preventDefault()} className="col-md-12">
          <div className="row align-items-center">
            <div className="col-3">
              <div className="form-group">
                <label htmlFor="paymentStatus">Payment Status:</label>
                <select
                  className="form-control select2"
                  name="paymentStatus"
                  value={paymentStatus}
                >
                  <option value="">Status: All</option>
                  <option value="pending">Pending</option>
                  <option value="success">Success</option>
                  <option value="failed">Failed</option>
                  <option value="usercancel">User Cancel</option>
                </select>
              </div>
            </div>

            <div className="col-3">
              <div className="form-group">
                <label htmlFor="paymentMode">Payment Mode:</label>
                <select
                  className="form-control select2"
                  name="paymentMode"
                  value={paymentMode}
                >
                  <option value="">Payment Method: All</option>
                  <option value="CC">CC</option>
                  <option value="DC">DC</option>
                  <option value="NB">NB</option>
                  <option value="MW">MW</option>
                  <option value="UPI">UPI</option>
                  <option value="OM">OM</option>
                  <option value="EMI">EMI</option>
                  <option value="CBT">CBT</option>
                  <option value="BT">BT</option>
                </select>
              </div>
            </div>
          </div>
        </form>
      </div>

      <TransactionTable transactions={transactions} tableRef={tableRef} />
    </>
  );
}

export default Page;
