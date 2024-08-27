'use client';
import React, { useEffect, useState } from 'react';
import $ from 'jquery';
import { apiRequest } from '../lib/apiHelper';
import { toast } from 'react-toastify';

async function fetchMerchantTransactions() {
  try {
    const response = await apiRequest('POST', '/v1/merchant/transactions', { post: { 'dto': 'lifetime' } });
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

  useEffect(() => {
    async function loadData() {
      const data = await fetchMerchantTransactions();
      setTransactions(data);
    }
    loadData();
  }, []);

  useEffect(() => {
    if (transactions.length > 0) {
      $('#example').DataTable({
        scrollX: true,
        order: [[0, 'desc']]
      });
    }
  }, [transactions]);

  return (
    <>
      <div>
        <br />
      </div>
      <div className='card'>
        <div className="card-header">
          <h3 className="card-title">Transaction List</h3>
        </div>
        <div className="card-body transaction-table">
          <table id="example" className="table table-bordered table-striped">
            <thead>
              <tr>
                <th>DP Transaction ID</th>
                <th>Customer Name</th>
                <th>Phone</th>
                <th>Email</th>
                <th>Amount</th>
                <th>Payment Status</th>
                <th>Payment Mode</th>
                <th>Reference ID</th>
                <th>Date</th>
                <th>View</th>
              </tr>
            </thead>
            <tbody>
              {transactions.length > 0 ? (
                transactions.map((transaction) => (
                  <tr key={transaction.order_id}>
                    <td>{transaction.dp_trans_id}</td>
                    <td>{transaction.customer_name}</td>
                    <td>{transaction.customer_phone}</td>
                    <td>{transaction.customer_email}</td>
                    <td>{transaction.amount}</td>
                    <td>{transaction.payment_status}</td>
                    <td>{transaction.payment_method || 'NA'}</td>
                    <td>{transaction.reference_id}</td>
                    <td>{new Date(transaction.created_at).toLocaleString('en-IN', { timeZone: 'Asia/Kolkata', dateStyle: 'short', timeStyle: 'short' })}</td>
                    <td>
                      <button className="btn btn-info btn-sm order-details" data-order-id={transaction.order_id}>view</button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="10">
                    <center>No Data Found</center>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </>
  );
}

export default Page;
