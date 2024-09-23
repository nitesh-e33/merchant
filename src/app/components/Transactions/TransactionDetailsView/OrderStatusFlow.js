import React from 'react';
import { formatDateTime } from '@/app/lib/helper';

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
            <div className='border-l-2 border-gray-200 h-[calc(100%-(-20px))] left-25 position absolute top-[10px] ml-1'></div>
            <div className="absolute bg-white border-2 border-[#52c41a] rounded-full h-2.5 w-2.5 mt-1"></div>
            <div className="ml-4">
              <p><strong>Order Status: </strong> {status.status}</p>
              <p><strong>Payment Status: </strong> {status.payment_status}</p>
              {status.refund_status && (
                <p><strong>Refund Status: </strong> {status.refund_status}</p>
              )}
              <p><strong>Date: </strong>
                { formatDateTime(status.created_at) }
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
