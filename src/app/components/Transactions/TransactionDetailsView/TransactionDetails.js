import React from 'react';

const TransactionDetails = ({ order, getValue }) => (
  <div className="mt-6">
    <h5 className="text-lg font-semibold mb-4">Transaction Details</h5>
    <table className="table-auto w-full border-collapse border border-gray-300">
      <tbody>
        <tr>
          <th className="border border-gray-300 p-2 text-left bg-gray-100">Company Name:</th>
          <td className="border border-gray-300 p-2">{getValue(order.companyName)}</td>
          <th className="border border-gray-300 p-2 text-left bg-gray-100">Reference ID:</th>
          <td className="border border-gray-300 p-2">{getValue(order.payment_data?.reference_id)}</td>
        </tr>
        <tr>
          <th className="border border-gray-300 p-2 text-left bg-gray-100">Payment Mode:</th>
          <td className="border border-gray-300 p-2">{getValue(order.payment_data?.payment_method)}</td>
          <th className="border border-gray-300 p-2 text-left bg-gray-100">Amount:</th>
          <td className="border border-gray-300 p-2">
            {getValue(order.payment_data?.currency)} {getValue(order.payment_data?.amount)}
          </td>
        </tr>
        <tr>
          <th className="border border-gray-300 p-2 text-left bg-gray-100">Transaction Date:</th>
          <td className="border border-gray-300 p-2">
            {new Date(order.payment_data?.transaction_date).toLocaleDateString("en-IN", {
              day: "2-digit",
              month: "short",
              year: "numeric",
            })}
          </td>
          <th className="border border-gray-300 p-2 text-left bg-gray-100">Message:</th>
          <td className="border border-gray-300 p-2">{getValue(order.payment_data?.error_Message)}</td>
        </tr>
      </tbody>
    </table>
  </div>
);

export default TransactionDetails;
