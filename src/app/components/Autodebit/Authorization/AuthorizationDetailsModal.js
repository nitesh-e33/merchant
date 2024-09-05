import React from 'react';
import { Drawer, Button } from 'rsuite';
import { formatDate, formatDateTime } from '../../../lib/helper';

function AuthorizationDetailsModal({ isOpen, onClose, authorizations }) {
  const debitInfo = [
    { label: 'Auto Debit Auth Msg', value: authorizations?.auto_debit_auth_msg },
    { label: 'Cancellation Reason', value: authorizations?.cancellation_reason },
    { label: 'Auto Debit Auth Error', value: authorizations?.auto_debit_auth_error },
  ];

  const getValue = (value) => (value ? value : '');

  return (
    <Drawer placement="right" open={isOpen} onClose={onClose} size="md">
      <Drawer.Header>
        <Drawer.Title>Debit Information</Drawer.Title>
        <Drawer.Actions>
          <Button onClick={onClose} appearance="subtle">
            Close
          </Button>
        </Drawer.Actions>
      </Drawer.Header>
      <Drawer.Body>
      {authorizations ? (
          <div>
            {/* Debit Information Table */}
            <h5 className="main-modal-title text-lg font-semibold mb-2">Debit Information</h5>
            <table className="table-auto w-full border-collapse border border-gray-300">
              <tbody>
                <tr>
                  <th className="border border-gray-300 p-2 text-left bg-gray-100">Customer Authentication ID:</th>
                  <td className="border border-gray-300 p-2">{getValue(authorizations.customer_authentication_id)}</td>
                </tr>
                <tr>
                  <th className="border border-gray-300 p-2 text-left bg-gray-100">Customer Unique ID:</th>
                  <td className="border border-gray-300 p-2">{getValue(authorizations.customer_unique_id)}</td>
                </tr>
                <tr>
                  <th className="border border-gray-300 p-2 text-left bg-gray-100">Start Date:</th>
                  <td className="border border-gray-300 p-2">{formatDate(authorizations.start_date)}</td>
                </tr>
                <tr>
                  <th className="border border-gray-300 p-2 text-left bg-gray-100">Frequency:</th>
                  <td className="border border-gray-300 p-2">{getValue(authorizations.frequency)}</td>
                </tr>
                <tr>
                  <th className="border border-gray-300 p-2 text-left bg-gray-100">Next Transaction Date:</th>
                  <td className="border border-gray-300 p-2">{formatDate(authorizations.next_transaction_date)}</td>
                </tr>
                <tr>
                  <th className="border border-gray-300 p-2 text-left bg-gray-100">Final Collection Date:</th>
                  <td className="border border-gray-300 p-2">{formatDate(authorizations.final_collection_date)}</td>
                </tr>
                <tr>
                  <th className="border border-gray-300 p-2 text-left bg-gray-100">Amount:</th>
                  <td className="border border-gray-300 p-2">{getValue(authorizations.amount)}</td>
                </tr>
                <tr>
                  <th className="border border-gray-300 p-2 text-left bg-gray-100">Enach Request Amount:</th>
                  <td className="border border-gray-300 p-2">{getValue(authorizations.enach_request_amount)}</td>
                </tr>
                <tr>
                  <th className="border border-gray-300 p-2 text-left bg-gray-100">Status:</th>
                  <td className="border border-gray-300 p-2">{getValue(authorizations.status)}</td>
                </tr>
                <tr>
                  <th className="border border-gray-300 p-2 text-left bg-gray-100">Authorization Status:</th>
                  <td className="border border-gray-300 p-2">{getValue(authorizations.authorization_status)}</td>
                </tr>

                {/* Debit Info Fields */}
                {debitInfo.map(
                  (field, index) =>
                    field.value && field.value !== 'null' && field.value !== 'NA' && (
                      <tr key={index}>
                        <th className="border border-gray-300 p-2 text-left bg-gray-100">{field.label}:</th>
                        <td className="border border-gray-300 p-2">{getValue(field.value)}</td>
                      </tr>
                    )
                )}

                {/* Conditional Fields */}
                {authorizations.authorization_status && (
                  <tr>
                    <th className="border border-gray-300 p-2 text-left bg-gray-100">Auto Debit Authorization Date:</th>
                    <td className="border border-gray-300 p-2">{formatDateTime(authorizations.auto_debit_access_key_datetime)}</td>
                  </tr>
                )}
                {authorizations.authorization_status === 'rejected' && (
                  <tr>
                    <th className="border border-gray-300 p-2 text-left bg-gray-100">Cancel Requested At:</th>
                    <td className="border border-gray-300 p-2">{getValue(authorizations.cancel_requested_at)}</td>
                  </tr>
                )}
              </tbody>
            </table>

            {/* Transaction Details Table */}
            <h5 className="text-lg font-semibold mb-2 mt-6">Transaction Details</h5>
            <table className="table-auto w-full border-collapse border border-gray-300">
              <tbody>
                <tr>
                  <th className="border border-gray-300 p-2 text-left bg-gray-100">Droompay Transaction ID:</th>
                  <td className="border border-gray-300 p-2">{getValue(authorizations.transaction_details.dp_trans_id)}</td>
                  <th className="border border-gray-300 p-2 text-left bg-gray-100">Reference Id:</th>
                  <td className="border border-gray-300 p-2">{getValue(authorizations.transaction_details.reference_id)}</td>
                </tr>
                <tr>
                  <th className="border border-gray-300 p-2 text-left bg-gray-100">Product Name:</th>
                  <td className="border border-gray-300 p-2">{getValue(authorizations.transaction_details.item_name)}</td>
                  <th className="border border-gray-300 p-2 text-left bg-gray-100">Penny Drop Reference ID:</th>
                  <td className="border border-gray-300 p-2">{getValue(authorizations.transaction_details.penny_drop_reference_id)}</td>
                </tr>
                <tr>
                  <th className="border border-gray-300 p-2 text-left bg-gray-100">Amount:</th>
                  <td className="border border-gray-300 p-2">
                    {getValue(authorizations.transaction_details.currency)} {getValue(authorizations.transaction_details.amount)}
                  </td>
                  <th className="border border-gray-300 p-2 text-left bg-gray-100">Payment Method:</th>
                  <td className="border border-gray-300 p-2">{getValue(authorizations.transaction_details.payment_method)}</td>
                </tr>
                <tr>
                  <th className="border border-gray-300 p-2 text-left bg-gray-100">Payment Status:</th>
                  <td className="border border-gray-300 p-2">{getValue(authorizations.transaction_details.payment_status)}</td>
                  <th className="border border-gray-300 p-2 text-left bg-gray-100">Source:</th>
                  <td className="border border-gray-300 p-2">{getValue(authorizations.transaction_details.source)}</td>
                </tr>
                <tr>
                  <th className="border border-gray-300 p-2 text-left bg-gray-100">Service Type:</th>
                  <td className="border border-gray-300 p-2">{getValue(authorizations.transaction_details.service_type)}</td>
                  <th className="border border-gray-300 p-2 text-left bg-gray-100">Date of Transaction:</th>
                  <td className="border border-gray-300 p-2">{formatDateTime(authorizations.transaction_details.created_at)}</td></tr>
              </tbody>
            </table>

            {/* Customer Details Table */}
            <h5 className="text-lg font-semibold mb-2 mt-6">Customer Details</h5>
            <table className="table-auto w-full border-collapse border border-gray-300">
              <tbody>
                <tr>
                    <th className="border border-gray-300 p-2 text-left bg-gray-100">Customer Id:</th>
                    <td className="border border-gray-300 p-2">{getValue(authorizations.transaction_details.customer_id)}</td>
                    <th className="border border-gray-300 p-2 text-left bg-gray-100">Customer Name:</th>
                    <td className="border border-gray-300 p-2">{getValue(authorizations.transaction_details.customer_name)}</td>
                  </tr>
                  <tr>
                    <th className="border border-gray-300 p-2 text-left bg-gray-100">Customer Email:</th>
                    <td className="border border-gray-300 p-2">{getValue(authorizations.transaction_details.customer_email)}</td>
                    <th className="border border-gray-300 p-2 text-left bg-gray-100">Customer Phone:</th>
                    <td className="border border-gray-300 p-2">{getValue(authorizations.transaction_details.customer_phone)}</td>
                  </tr>
              </tbody>
            </table>

            {/* Merchant Specific Parameters */}
            <h5 className="text-lg font-semibold mb-2 mt-6">Merchant Specific Parameters</h5>
            <table className="table-auto w-full border-collapse border border-gray-300">
              <tbody>
                {[...Array(10).keys()].filter(i => i % 2 === 0).map(i => (
                  <tr key={i}>
                    <th className="border border-gray-300 p-2 text-left bg-gray-100">UDF{i + 1}:</th>
                    <td className="border border-gray-300 p-2">{getValue(authorizations.transaction_details[`udf${i + 1}`])}</td>
                    <th className="border border-gray-300 p-2 text-left bg-gray-100">UDF{i + 2}:</th>
                    <td className="border border-gray-300 p-2">{getValue(authorizations.transaction_details[`udf${i + 2}`])}</td>
                  </tr>
                ))}
              </tbody>
            </table>

            {/* Transaction Attempts */}
            {authorizations.transaction_details.payment_status !== 'pending' && (
              <div className="table-responsive mb-20">
                <h5 className="text-lg font-semibold mb-2 mt-6">Transaction Attempts</h5>
                <table className="table-auto w-full border-collapse border border-gray-300">
                  <tbody>
                    <tr>
                      <th className="border border-gray-300 p-2 text-left bg-gray-100">Transaction ID:</th>
                      <td className="border border-gray-300 p-2">
                        {getValue(authorizations.transaction_details.merchant_payments?.id)}
                      </td>
                      <th className="border border-gray-300 p-2 text-left bg-gray-100">Transaction Date:</th>
                      <td className="border border-gray-300 p-2">{formatDateTime(authorizations.transaction_details.merchant_payments?.transaction_date)}</td>
                    </tr>
                    <tr>
                      <th className="border border-gray-300 p-2 text-left bg-gray-100">Status:</th>
                      <td className="border border-gray-300 p-2">{getValue(authorizations.transaction_details.merchant_payments?.status)}</td>
                      <th className="border border-gray-300 p-2 text-left bg-gray-100">Message:</th>
                      <td className="border border-gray-300 p-2">{getValue(authorizations.transaction_details.merchant_payments?.error_Message)}</td>
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

export default AuthorizationDetailsModal;
