import React from 'react';
import { Drawer, Button } from 'rsuite';
import { formatDate, formatDateTime } from '../../../lib/helper';

function DebitRequestModal({ isOpen, onClose, debitRequest }) {
  const getValue = (value) => (value ? value : '');

  return (
    <Drawer placement="right" open={isOpen} onClose={onClose} size="md">
      <Drawer.Header>
        <Drawer.Title>Debit Request Information</Drawer.Title>
        <Drawer.Actions>
          <Button onClick={onClose} appearance="subtle">
            Close
          </Button>
        </Drawer.Actions>
      </Drawer.Header>
      <Drawer.Body>
      {debitRequest ? (
          <div>
            {/* Debit Information Table */}
            <h5 className="main-modal-title text-lg font-semibold mb-2">Debit Request Information</h5>
            <table className="table-auto w-full border-collapse border border-gray-300">
              <tbody>
                <tr>
                  <th className="border border-gray-300 p-2 text-left bg-gray-100">First Name:</th>
                  <td className="border border-gray-300 p-2">{getValue(debitRequest.first_name)}</td>
                </tr>
                <tr>
                  <th className="border border-gray-300 p-2 text-left bg-gray-100">Email:</th>
                  <td className="border border-gray-300 p-2">{getValue(debitRequest.email)}</td>
                </tr>
                <tr>
                  <th className="border border-gray-300 p-2 text-left bg-gray-100">Phone:</th>
                  <td className="border border-gray-300 p-2">{getValue(debitRequest.phone)}</td>
                </tr>
                <tr>
                  <th className="border border-gray-300 p-2 text-left bg-gray-100">Amount:</th>
                  <td className="border border-gray-300 p-2">{getValue(debitRequest.amount)}</td>
                </tr>
                <tr>
                  <th className="border border-gray-300 p-2 text-left bg-gray-100">Customer Authentication ID:</th>
                  <td className="border border-gray-300 p-2">{getValue(debitRequest.customer_authentication_id)}</td>
                </tr>
                <tr>
                  <th className="border border-gray-300 p-2 text-left bg-gray-100">Request State:</th>
                  <td className="border border-gray-300 p-2">{getValue(debitRequest.request_state)}</td>
                </tr>
                <tr>
                  <th className="border border-gray-300 p-2 text-left bg-gray-100">Remark:</th>
                  <td className="border border-gray-300 p-2">{getValue(debitRequest.remark)}</td>
                </tr>
                <tr>
                  <th className="border border-gray-300 p-2 text-left bg-gray-100">Created At:</th>
                  <td className="border border-gray-300 p-2">{formatDateTime(debitRequest.created_at)}</td>
                </tr>
              </tbody>
            </table>

            {/* Order Details Table */}
            <h5 className="text-lg font-semibold mb-2 mt-6">Order Details</h5>
            <table className="table-auto w-full border-collapse border border-gray-300">
              <tbody>
                <tr>
                  <th className="border border-gray-300 p-2 text-left bg-gray-100">Droompay Transaction ID:</th>
                  <td className="border border-gray-300 p-2">{getValue(debitRequest.orders.dp_trans_id)}</td>
                  <th className="border border-gray-300 p-2 text-left bg-gray-100">Reference Id:</th>
                  <td className="border border-gray-300 p-2">{getValue(debitRequest.orders.reference_id)}</td>
                </tr>
                <tr>
                  <th className="border border-gray-300 p-2 text-left bg-gray-100">Product Name:</th>
                  <td className="border border-gray-300 p-2">{getValue(debitRequest.orders.item_name)}</td>
                  <th className="border border-gray-300 p-2 text-left bg-gray-100">Amount:</th>
                  <td className="border border-gray-300 p-2">
                    {getValue(debitRequest.orders.currency)} {getValue(debitRequest.orders.amount)}
                  </td>
                </tr>
                <tr>
                  <th className="border border-gray-300 p-2 text-left bg-gray-100">Source:</th>
                  <td className="border border-gray-300 p-2">{getValue(debitRequest.orders.source)}</td>
                  <th className="border border-gray-300 p-2 text-left bg-gray-100">Payment Method:</th>
                  <td className="border border-gray-300 p-2">{getValue(debitRequest.orders.payment_method)}</td>
                </tr>
                <tr>
                  <th className="border border-gray-300 p-2 text-left bg-gray-100">Payment Status:</th>
                  <td className="border border-gray-300 p-2">{getValue(debitRequest.orders.payment_status)}</td>
                  <th className="border border-gray-300 p-2 text-left bg-gray-100">Service Type:</th>
                  <td className="border border-gray-300 p-2">{getValue(debitRequest.orders.service_type)}</td>
                </tr>
                <tr>
                    {debitRequest.orders.penny_drop_reference_id && debitRequest.orders.penny_drop_reference_id !== 'NA' ? (
                        <>
                        <th className="border border-gray-300 p-2 text-left bg-gray-100">Penny Drop Reference ID:</th>
                        <td className="border border-gray-300 p-2">{getValue(debitRequest.orders.penny_drop_reference_id)}</td>
                        </>
                    ) : null}
                    <th className="border border-gray-300 p-2 text-left bg-gray-100">Date of Transaction:</th>
                    <td className="border border-gray-300 p-2">{formatDateTime(debitRequest.orders.created_at)}</td>
                    {!(debitRequest.orders.penny_drop_reference_id && debitRequest.orders.penny_drop_reference_id !== 'NA') && (
                        <>
                        <th className="border border-gray-300 p-2"></th>
                        <td className="border border-gray-300 p-2"></td>
                        </>
                    )}
                </tr>
              </tbody>
            </table>

            {/* Customer Details Table */}
            <h5 className="text-lg font-semibold mb-2 mt-6">Customer Details</h5>
            <table className="table-auto w-full border-collapse border border-gray-300">
              <tbody>
                <tr>
                    <th className="border border-gray-300 p-2 text-left bg-gray-100">Customer Id:</th>
                    <td className="border border-gray-300 p-2">{getValue(debitRequest.orders.customer_id)}</td>
                    <th className="border border-gray-300 p-2 text-left bg-gray-100">Customer Name:</th>
                    <td className="border border-gray-300 p-2">{getValue(debitRequest.orders.customer_name)}</td>
                  </tr>
                  <tr>
                    <th className="border border-gray-300 p-2 text-left bg-gray-100">Customer Email:</th>
                    <td className="border border-gray-300 p-2">{getValue(debitRequest.orders.customer_email)}</td>
                    <th className="border border-gray-300 p-2 text-left bg-gray-100">Customer Phone:</th>
                    <td className="border border-gray-300 p-2">{getValue(debitRequest.orders.customer_phone)}</td>
                  </tr>
              </tbody>
            </table>

            {/* Transaction Attempts */}
            {debitRequest.orders.payment_status !== 'pending' && (
              <div className="table-responsive mb-20">
                <h5 className="text-lg font-semibold mb-2 mt-6">Transaction Attempts</h5>
                <table className="table-auto w-full border-collapse border border-gray-300">
                  <tbody>
                    <tr>
                      <th className="border border-gray-300 p-2 text-left bg-gray-100">Transaction ID:</th>
                      <td className="border border-gray-300 p-2">
                        {getValue(debitRequest.orders.enach_transactions.merchant_payments?.id)}
                      </td>
                      <th className="border border-gray-300 p-2 text-left bg-gray-100">Transaction Date:</th>
                      <td className="border border-gray-300 p-2">{formatDateTime(debitRequest.orders.enach_transactions.merchant_payments?.transaction_date)}</td>
                    </tr>
                    <tr>
                      <th className="border border-gray-300 p-2 text-left bg-gray-100">Status:</th>
                      <td className="border border-gray-300 p-2">{getValue(debitRequest.orders.enach_transactions.merchant_payments?.status)}</td>
                      <th className="border border-gray-300 p-2 text-left bg-gray-100">Message:</th>
                      <td className="border border-gray-300 p-2">{getValue(debitRequest.orders.enach_transactions.merchant_payments?.error_Message)}</td>
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

export default DebitRequestModal;
