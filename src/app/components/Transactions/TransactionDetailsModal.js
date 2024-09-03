import React, { useEffect, useState } from 'react';
import { Drawer, Button } from 'rsuite';
import { apiRequest } from '@/app/lib/apiHelper';
import TransactionDetails from './TransactionDetailsView/TransactionDetails';
import OrderStatusFlow from './TransactionDetailsView/OrderStatusFlow';
import RefundDetails from './TransactionDetailsView/RefundDetails';

function TransactionDetailsModal({ isOpen, onClose, order }) {
  const [showTransactionDetails, setShowTransactionDetails] = useState(false);
  const [showRefundDetails, setShowRefundDetails] = useState(false);
  const [orderStatusHistory, setOrderStatusHistory] = useState([]);
  const [loadingStatus, setLoadingStatus] = useState(false);
  const [isOrderStatusFetched, setIsOrderStatusFetched] = useState(false);
  const [showOrderStatus, setShowOrderStatus] = useState(false);
  const getValue = (value) => (value ? value : '');

  useEffect(() => {
    if (!isOpen) {
      setShowTransactionDetails(false);
      setShowRefundDetails(false);
      setOrderStatusHistory([]);
      setIsOrderStatusFetched(false);
      setShowOrderStatus(false);
    }
  }, [isOpen]);

  const fetchOrderStatusHistory = async () => {
    if (!isOrderStatusFetched) {
      setLoadingStatus(true);
      try {
        const response = await apiRequest('GET', '/v1/merchant/order-status-history', {
          get: { order_id: order?.order_id }
        });
        setOrderStatusHistory(response.Result);
        setIsOrderStatusFetched(true);
        setShowOrderStatus(true);
      } catch (error) {
        console.error('Failed to fetch order status history', error);
      } finally {
        setLoadingStatus(false);
      }
    } else {
      setShowOrderStatus((prev) => !prev);
    }
  };

  return (
    <Drawer placement="right" open={isOpen} onClose={onClose} size="md">
      <Drawer.Header>
        <Drawer.Title>Transaction Details</Drawer.Title>
        <Drawer.Actions>
          <Button onClick={onClose} appearance="subtle">
            Close
          </Button>
        </Drawer.Actions>
      </Drawer.Header>
      <Drawer.Body>
        {order ? (
          <div>
            {/* Order Details Table */}
            <h5 className="main-modal-title text-lg font-semibold mb-4">Order Details</h5>
            <table className="table w-full table-fixed">
              <tbody>
                <tr>
                  <th>Droompay Transaction ID:</th>
                  <td>{getValue(order.dp_trans_id)}</td>
                  <th>Customer Name:</th>
                  <td>{getValue(order.customer_name)}</td>
                </tr>
                <tr>
                  <th>Customer Email:</th>
                  <td>{getValue(order.customer_email)}</td>
                  <th>Customer Mobile:</th>
                  <td>{getValue(order.customer_phone)}</td>
                </tr>
                <tr>
                  <th>Product Name:</th>
                  <td>{getValue(order.item_name)}</td>
                  <th>Payment Status:</th>
                  <td>{getValue(order.payment_status)}</td>
                </tr>
                <tr>
                  <th>Refund Status:</th>
                  <td>{getValue(order.refund_status)}</td>
                  <th>Created At:</th>
                  <td>
                    {new Date(order.created_at).toLocaleDateString('en-IN', {
                      day: '2-digit',
                      month: 'short',
                      year: 'numeric',
                    })}
                  </td>
                </tr>
                {Array.from({ length: 10 }).map((_, index) => (
                  order[`udf${index + 1}`] ? (
                    <tr key={index}>
                      <th>UDF{index + 1}:</th>
                      <td>{getValue(order[`udf${index + 1}`])}</td>
                    </tr>
                  ) : null
                ))}
              </tbody>
            </table>
            {/* Buttons */}
            <div className="mt-4">
              {order.payment_status !== 'pending' && (
                <Button
                  appearance="primary"
                  className="mt-3 mr-4"
                  onClick={() => {
                    setShowTransactionDetails((prev) => !prev);
                    setShowRefundDetails(false);
                    setShowOrderStatus(false);
                  }}
                >
                  Transaction Details
                </Button>
              )}
              {order.refund_status === 'queued' && (
                <Button
                  appearance="primary"
                  className="mt-3 mr-4"
                  onClick={() => {
                    setShowRefundDetails((prev) => !prev);
                    setShowTransactionDetails(false);
                    setShowOrderStatus(false);
                  }}
                >
                  Refund Details
                </Button>
              )}
              <Button
                appearance="primary"
                className="mt-3"
                onClick={() => {
                  fetchOrderStatusHistory();
                  setShowTransactionDetails(false);
                  setShowRefundDetails(false);
                }}
              >
                Order Status Flow
              </Button>
            </div>

            {/* Displaying Corresponding Details */}
            {showTransactionDetails && <TransactionDetails order={order} getValue={getValue} />}
            {showRefundDetails && <RefundDetails order={order} getValue={getValue} />}
            {showOrderStatus && <OrderStatusFlow orderStatusHistory={orderStatusHistory} loadingStatus={loadingStatus} />}
          </div>
        ) : (
          <p>Loading...</p>
        )}
      </Drawer.Body>
    </Drawer>
  );
}

export default TransactionDetailsModal;
