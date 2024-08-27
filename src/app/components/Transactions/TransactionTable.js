import React from 'react';

function TransactionTable({ transactions }) {
  return (
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
  );
}

export default TransactionTable;
