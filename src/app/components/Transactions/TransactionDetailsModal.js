import React, { useState } from 'react';
import { Drawer, Button } from 'rsuite';

function TransactionDetailsModal({ isOpen, onClose, order }) {
  const [showTransactionDetails, setShowTransactionDetails] = useState(false);
  const [showRefundDetails, setShowRefundDetails] = useState(false);
  const getValue = (value) => (value ? value : '');

  return (
    <Drawer
      placement="right"
      open={isOpen}
      onClose={onClose}
      size="md"
    >
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
                  <td>{new Date(order.created_at).toLocaleString('en-IN', { timeZone: 'Asia/Kolkata', dateStyle: 'short', timeStyle: 'short' })}</td>
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
                    setShowTransactionDetails(true);
                    setShowRefundDetails(false);
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
                    setShowTransactionDetails(false);
                    setShowRefundDetails(true);
                  }}
                >
                  Refund Details
                </Button>
              )}
              <Button
                appearance="primary"
                className="mt-3"
                onClick={() => {}}
              >
                Order Status Flow
              </Button>
            </div>

            {/* Conditional Rendering for Transaction and Refund Details */}
            {showTransactionDetails && (
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
            )}
            {showRefundDetails && (
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
            )}
          </div>
        ) : (
          <p>Loading...</p>
        )}
      </Drawer.Body>
    </Drawer>
  );
}

export default TransactionDetailsModal;
