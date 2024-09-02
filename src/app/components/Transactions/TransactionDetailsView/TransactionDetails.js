import React from 'react';

const TransactionDetails = ({ order, getValue }) => (
  <div className="mt-6">
    <h5 className="text-lg font-semibold mb-4">Transaction Details</h5>
    <table className="table w-full table-fixed">
      <tbody>
        <tr>
          <th>Company Name:</th>
          <td>{getValue(order.companyName)}</td>
          <th>Reference ID:</th>
          <td>{getValue(order.payment_data?.reference_id)}</td>
        </tr>
        <tr>
          <th>Payment Mode:</th>
          <td>{getValue(order.payment_data?.payment_method)}</td>
          <th>Amount:</th>
          <td>{getValue(order.payment_data?.currency)} {getValue(order.payment_data?.amount)}</td>
        </tr>
        <tr>
          <th>Transaction Date:</th>
          <td>{new Date(order.payment_data?.transaction_date).toLocaleDateString('en-IN')}</td>
          <th>Message:</th>
          <td>{getValue(order.payment_data?.error_Message)}</td>
        </tr>
      </tbody>
    </table>
  </div>
);

export default TransactionDetails;
