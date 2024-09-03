import React from 'react';

const RefundDetails = ({ order, getValue }) => (
  <div className="mt-6">
    <h5 className="text-lg font-semibold mb-4">Refund Details</h5>
    <table className="table-auto w-full border-collapse border border-gray-300">
      <tbody>
        <tr>
          <th className="border border-gray-300 p-2 text-left bg-gray-100">ID:</th>
          <td className="border border-gray-300 p-2">{getValue(order.refunds?.id)}</td>
          <th className="border border-gray-300 p-2 text-left bg-gray-100">Payment ID:</th>
          <td className="border border-gray-300 p-2">{getValue(order.refunds?.payment_id)}</td>
        </tr>
        <tr>
          <th className="border border-gray-300 p-2 text-left bg-gray-100">Refund ID:</th>
          <td className="border border-gray-300 p-2">{getValue(order.refunds?.refund_id)}</td>
          <th className="border border-gray-300 p-2 text-left bg-gray-100">Droompay Transaction ID:</th>
          <td className="border border-gray-300 p-2">{getValue(order.refunds?.order_id)}</td>
        </tr>
        <tr>
          <th className="border border-gray-300 p-2 text-left bg-gray-100">Refund Amount:</th>
          <td className="border border-gray-300 p-2">{getValue(order.refunds?.refund_amount)}</td>
          <th className="border border-gray-300 p-2 text-left bg-gray-100">Refund Amount Request:</th>
          <td className="border border-gray-300 p-2">{getValue(order.refunds?.refund_amount_request)}</td>
        </tr>
        <tr>
          <th className="border border-gray-300 p-2 text-left bg-gray-100">Reason:</th>
          <td className="border border-gray-300 p-2">{getValue(order.refunds?.reason)}</td>
          <th className="border border-gray-300 p-2 text-left bg-gray-100"></th>
          <td className="border border-gray-300 p-2"></td>
        </tr>
      </tbody>
    </table>
  </div>
);

export default RefundDetails;
