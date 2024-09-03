import React, { useState } from 'react';
import { Drawer, Button } from 'rsuite';
import 'rsuite/dist/rsuite.min.css';
import { apiRequest } from '@/app/lib/apiHelper';

function RefundDetailsModal({ isOpen, onClose, refund }) {
  const [orderStatus, setOrderStatus] = useState(null);
  const [loadingOrderStatus, setLoadingOrderStatus] = useState(false);

  const getValue = (value) => (value ? value : '');

  const handleOrderStatusFlowClick = async (orderId) => {
    if (orderStatus) {
      setOrderStatus(null); // Toggle to hide if clicked again
    } else {
      setLoadingOrderStatus(true);
      try {
        const response = await apiRequest('GET', '/v1/merchant/order-status-history', {
          get: { order_id: orderId }
        });

        if (response.data.code === 'success') {
          setOrderStatus(response.Result);
          scrollToOrderStatus();
        } else {
          console.error(response.data.data || 'Something went wrong. Please try again later.');
        }
      } catch (error) {
        console.error('Error fetching order status:', error);
      } finally {
        setLoadingOrderStatus(false);
      }
    }
  };

  const scrollToOrderStatus = () => {
    const modalBody = document.querySelector('.rs-drawer-body');
    const orderStatusDiv = document.querySelector('.order-status');

    if (modalBody && orderStatusDiv) {
      const yOffset = orderStatusDiv.offsetTop - modalBody.offsetTop;
      modalBody.scrollTop = yOffset;
    }
  };

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
                    {new Date(refund.refund_date).toLocaleString('en-IN', {
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
                  {new Date(refund.payments.transaction_date).toLocaleString('en-IN', {
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
                loading={loadingOrderStatus}
              >
                Order Status Flow
              </Button>
            </div>

            {/* Order Status Content */}
            {orderStatus && (
              <div className="order-status mt-4">
                {/* Render order status content here */}
                <div dangerouslySetInnerHTML={{ __html: orderStatus }} />
              </div>
            )}
          </div>
        ) : (
          <p>Loading...</p>
        )}
      </Drawer.Body>
    </Drawer>
  );
}

export default RefundDetailsModal;
