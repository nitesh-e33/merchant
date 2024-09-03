import React from 'react';

const OrderStatusFlow = ({ orderStatusHistory, loadingStatus }) => (
  <div className="mt-6">
    {loadingStatus ? (
      <p>Loading...</p>
    ) : (
      <>
        <h5 className="text-lg font-semibold mb-4">Order Status Flow</h5>
        <ul className="list-none p-0">
          {orderStatusHistory.map((status, index) => (
            <li key={index} className="relative pl-8 mb-4">
            <div className="absolute left-0.5 top-1 w-0.5 bg-gray-300 h-24"></div>
            <div className="absolute left-0 top-0 bg-green-500 h-2 w-2 rounded-full"></div>
            <div className="ml-4">
              <p><strong>Order Status: </strong> {status.status}</p>
              <p><strong>Payment Status: </strong> {status.payment_status}</p>
              {status.refund_status && (
                <p><strong>Refund Status: </strong> {status.refund_status}</p>
              )}
              <p><strong>Date: </strong>
                {new Date(status.created_at).toLocaleDateString('en-IN', {
                  day: '2-digit',
                  month: 'short',
                  year: 'numeric',
                  hour: '2-digit',
                  minute: '2-digit',
                  second: '2-digit',
                  hour12: true,
                })}
              </p>
            </div>
          </li>
          ))}
        </ul>
      </>
    )}
  </div>
);

export default OrderStatusFlow;
