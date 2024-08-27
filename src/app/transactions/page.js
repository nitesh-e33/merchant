'use client';
import React, { useEffect, useState } from 'react';
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

  useEffect(() => {
    async function loadData() {
      const data = await fetchMerchantTransactions();
      setTransactions(data);
    }
    $('.select2').select2().on('change', function () {
      // This ensures that when a value is selected in the dropdown, the state is updated.
      setSearchName($(this).val());
    });

    loadData();
  }, []);

  useEffect(() => {
    if (transactions.length > 0) {
      $('#example').DataTable({
        scrollX: true,
        order: [[0, 'desc']],
        destroy: true,
      });
    }
  }, [transactions]);

  const handleSearch = async () => {
    if (!searchName || !searchValue) {
      toast.error('Please select a search criteria and enter a search value.');
      return;
    }
    const searchParams = {
      [searchName]: searchValue
    };
    const data = await fetchMerchantTransactions(searchParams);
    setTransactions(data);
  };

  const resetSearch = async () => {
    setSearchName('');
    setSearchValue('');
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
                  className="form-control select2 searchName"
                  value={searchName}
                  onChange={(e) => setSearchName(e.target.value)}
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
                <p id="searchError" className="text-danger"></p>
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

      <TransactionTable transactions={transactions} />
    </>
  );
}

export default Page;
