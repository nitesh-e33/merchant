import React, { useEffect, useState } from 'react';
import { Drawer, Button } from 'rsuite';
import 'rsuite/dist/rsuite.min.css';
import { apiRequest } from '@/app/lib/apiHelper';
import OrderStatusFlow from '../Transactions/TransactionDetailsView/OrderStatusFlow';

function RefundDetailsModal({ isOpen, onClose, refund }) {
  const [orderStatusHistory, setOrderStatusHistory] = useState([]);
  const [loadingStatus, setLoadingStatus] = useState(false);
  const [isOrderStatusFetched, setIsOrderStatusFetched] = useState(false);
  const [showOrderStatus, setShowOrderStatus] = useState(false);

  const getValue = (value) => (value ? value : '');

  useEffect(() => {
    if (!isOpen) {
      setOrderStatusHistory([]);
      setIsOrderStatusFetched(false);
      setShowOrderStatus(false);
    }
  }, [isOpen]);

  const handleOrderStatusFlowClick = async (orderId) => {
    if (!isOrderStatusFetched) {
      setLoadingStatus(true);
      try {
        const response = await apiRequest('GET', '/v1/merchant/order-status-history', {
          get: { order_id: orderId }
        });
        if (response.StatusCode === '1') {
          setOrderStatusHistory(response.Result);
          setIsOrderStatusFetched(true);
          setShowOrderStatus(true);
        } else {
          console.error(response.Message || 'Something went wrong. Please try again later.');
        }
      } catch (error) {
        console.error('Failed to fetch order status history', error);
      } finally {
        setLoadingStatus(false);
      }
    } else {
      setShowOrderStatus((prev) => !prev);
    }
  }

  return (
    <Drawer placement="right" open={isOpen} onClose={onClose} size="md">
      <Drawer.Header>
        <Drawer.Title>Refund Details</Drawer.Title>
        <Drawer.Actions>
          <Button onClick={onClose} appearance="subtle">
            Close
          </Button>
        </Drawer.Actions>
      </Drawer.Header>
      <Drawer.Body>
        {refund ? (
          <div>
            {/* Refund Details Table */}
            <h5 className="main-modal-title text-lg font-semibold mb-2">Refund Details</h5>
            <table className="table-auto w-full border-collapse border border-gray-300">
              <tbody>
                <tr>
                  <th className="border border-gray-300 p-2 text-left bg-gray-100">ID :</th>
                  <td className="border border-gray-300 p-2">{getValue(refund.id)}</td>
                  <th className="border border-gray-300 p-2 text-left bg-gray-100">Droompay Transaction ID:</th>
                  <td className="border border-gray-300 p-2">{getValue(refund.order_id)}</td>
                </tr>
                <tr>
                  <th className="border border-gray-300 p-2 text-left bg-gray-100">Payment ID:</th>
                  <td className="border border-gray-300 p-2">{getValue(refund.payment_id)}</td>
                  <th className="border border-gray-300 p-2 text-left bg-gray-100">Refund ID:</th>
                  <td className="border border-gray-300 p-2">{getValue(refund.refund_id)}</td>
                </tr>
                <tr>
                  <th className="border border-gray-300 p-2 text-left bg-gray-100">Refund Amount:</th>
                  <td className="border border-gray-300 p-2">{getValue(refund.refund_amount)}</td>
                  <th className="border border-gray-300 p-2 text-left bg-gray-100">Refund Type:</th>
                  <td className="border border-gray-300 p-2">{getValue(refund.refund_type)}</td>
                </tr>
                <tr>
                  <th className="border border-gray-300 p-2 text-left bg-gray-100">Refund Amount Request:</th>
                  <td className="border border-gray-300 p-2">{getValue(refund.refund_amount_request)}</td>
                  <th className="border border-gray-300 p-2 text-left bg-gray-100">Status:</th>
                  <td className="border border-gray-300 p-2">{getValue(refund.status)}</td>
                </tr>
                <tr>
                  <th className="border border-gray-300 p-2 text-left bg-gray-100">Refund Date:</th>
                  <td className="border border-gray-300 p-2">
                    {refund.refund_date && new Date(refund.refund_date).toLocaleString('en-IN', {
                      day: "2-digit",
                      month: "short",
                      year: "numeric",
                    })}
                  </td>
                  <th className="border border-gray-300 p-2 text-left bg-gray-100">Reason:</th>
                  <td className="border border-gray-300 p-2">{getValue(refund.reason)}</td>
                </tr>
              </tbody>
            </table>

            {/* Order Details Table */}
            <h5 className="text-lg font-semibold mb-2 mt-6">Order Details</h5>
            <table className="table-auto w-full border-collapse border border-gray-300">
              <tbody>
                <tr>
                  <th className="border border-gray-300 p-2 text-left bg-gray-100">Droompay Transaction ID:</th>
                  <td className="border border-gray-300 p-2">{getValue(refund.orders.dp_trans_id)}</td>
                  <th className="border border-gray-300 p-2 text-left bg-gray-100">Product Name:</th>
                  <td className="border border-gray-300 p-2">{getValue(refund.orders.item_name)}</td>
                </tr>
                <tr>
                  <th className="border border-gray-300 p-2 text-left bg-gray-100">Reference Id:</th>
                  <td className="border border-gray-300 p-2">{getValue(refund.orders.reference_id)}</td>
                  <th className="border border-gray-300 p-2 text-left bg-gray-100">Amount::</th>
                  <td className="border border-gray-300 p-2">
                    {getValue(refund.orders.currency)} {getValue(refund.orders.amount)}
                  </td>
                </tr>
                <tr>
                  <th className="border border-gray-300 p-2 text-left bg-gray-100">Customer Id:</th>
                  <td className="border border-gray-300 p-2">{getValue(refund.orders.customer_id)}</td>
                  <th className="border border-gray-300 p-2 text-left bg-gray-100">Customer Name:</th>
                  <td className="border border-gray-300 p-2">{getValue(refund.orders.customer_name)}</td>
                </tr>
                <tr>
                  <th className="border border-gray-300 p-2 text-left bg-gray-100">Customer Email:</th>
                  <td className="border border-gray-300 p-2">{getValue(refund.orders.customer_email)}</td>
                  <th className="border border-gray-300 p-2 text-left bg-gray-100">Customer Phone:</th>
                  <td className="border border-gray-300 p-2">{getValue(refund.orders.customer_phone)}</td>
                </tr>
                <tr>
                  <th className="border border-gray-300 p-2 text-left bg-gray-100">Refund Id:</th>
                  <td className="border border-gray-300 p-2">{getValue(refund.orders.refund_id)}</td>
                  <th className="border border-gray-300 p-2 text-left bg-gray-100">Payment Method:</th>
                  <td className="border border-gray-300 p-2">{getValue(refund.orders.item_name)}</td>
                </tr>
                <tr>
                  <th className="border border-gray-300 p-2 text-left bg-gray-100">Refund Status:</th>
                  <td className="border border-gray-300 p-2">{getValue(refund.orders.refund_status)}</td>
                  <th className="border border-gray-300 p-2 text-left bg-gray-100">Created At:</th>
                  <td className="border border-gray-300 p-2">
                    {new Date(refund.orders.created_at).toLocaleString('en-IN', {
                      day: "2-digit",
                      month: "short",
                      year: "numeric",
                    })}
                  </td>
                </tr>
              </tbody>
            </table>

            {/* Payment Details Table */}
            <h5 className="text-lg font-semibold mb-2 mt-6">Payment Details</h5>
            <table className="table-auto w-full border-collapse border border-gray-300">
              <tbody>
                <tr>
                  <th className="border border-gray-300 p-2 text-left bg-gray-100">ID:</th>
                  <td className="border border-gray-300 p-2">{getValue(refund.payments.id)}</td>
                  <th className="border border-gray-300 p-2 text-left bg-gray-100">Reference Id:</th>
                  <td className="border border-gray-300 p-2">{getValue(refund.payments.reference_id)}</td>
                </tr>
                <tr>
                  <th className="border border-gray-300 p-2 text-left bg-gray-100">Amount:</th>
                  <td className="border border-gray-300 p-2">{getValue(refund.payments.currency)} {getValue(refund.payments.amount)}</td>
                  <th className="border border-gray-300 p-2 text-left bg-gray-100">Droompay Transaction Id:</th>
                  <td className="border border-gray-300 p-2">{getValue(refund.payments.order_id)}</td>
                </tr>
                <tr>
                  <th className="border border-gray-300 p-2 text-left bg-gray-100">Payment Method:</th>
                  <td className="border border-gray-300 p-2">{getValue(refund.payments.payment_method)}</td>
                  <th className="border border-gray-300 p-2 text-left bg-gray-100">Status:</th>
                  <td className="border border-gray-300 p-2">{getValue(refund.payments.status)}</td>
                </tr>
                <tr>
                  <th className="border border-gray-300 p-2 text-left bg-gray-100">Transaction Date:</th>
                  <td className="border border-gray-300 p-2">
                  {refund.payments.transaction_date && new Date(refund.payments.transaction_date).toLocaleString('en-IN', {
                      day: "2-digit",
                      month: "short",
                      year: "numeric",
                    })}
                  </td>
                  <th className="border border-gray-300 p-2 text-left bg-gray-100">Message:</th>
                  <td className="border border-gray-300 p-2">{getValue(refund.payments.error_Message)}</td>
                </tr>
              </tbody>
            </table>

            {/* Order Status Flow Button */}
            <div className="mt-4">
              <Button
                appearance="primary"
                className="mt-3"
                onClick={() => handleOrderStatusFlowClick(refund.payments.order_id)}
                loading={loadingStatus}
              >
                Order Status Flow
              </Button>
            </div>

            {showOrderStatus && <OrderStatusFlow orderStatusHistory={orderStatusHistory} loadingStatus={loadingStatus} />}
          </div>
        ) : (
          <p>Loading...</p>
        )}
      </Drawer.Body>
    </Drawer>
  );
}

export default RefundDetailsModal;
