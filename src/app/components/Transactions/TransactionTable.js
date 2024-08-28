import React from 'react';

function TransactionTable({ tableRef }) {
  return (
    <div className='card'>
      <div className="card-header">
        <h3 className="card-title">Transaction List</h3>
      </div>
      <div className="card-body transaction-table">
        <table id="example" ref={tableRef} className="table table-bordered table-striped">
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
            {/* DataTable will render the body */}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default TransactionTable;
