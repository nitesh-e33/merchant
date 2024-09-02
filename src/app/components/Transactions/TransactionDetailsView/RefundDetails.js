import React from 'react';

const RefundDetails = ({ order, getValue }) => (
  <div className="mt-6">
    <h5 className="text-lg font-semibold mb-4">Refund Details</h5>
    <table className="table w-full table-fixed">
      <tbody>
        <tr>
          <th>ID:</th>
          <td>{getValue(order.refunds?.id)}</td>
          <th>Payment ID:</th>
          <td>{getValue(order.refunds?.payment_id)}</td>
        </tr>
        <tr>
          <th>Refund ID:</th>
          <td>{getValue(order.refunds?.refund_id)}</td>
          <th>Droompay Transaction ID:</th>
          <td>{getValue(order.refunds?.order_id)}</td>
        </tr>
        <tr>
          <th>Refund Amount:</th>
          <td>{getValue(order.refunds?.refund_amount)}</td>
          <th>Refund Amount Request:</th>
          <td>{getValue(order.refunds?.refund_amount_request)}</td>
        </tr>
        <tr>
          <th>Reason:</th>
          <td>{getValue(order.refunds?.reason)}</td>
          <th></th>
          <td></td>
        </tr>
      </tbody>
    </table>
  </div>
);

export default RefundDetails;
