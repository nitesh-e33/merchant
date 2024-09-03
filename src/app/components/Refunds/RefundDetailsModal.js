import React, { useEffect, useState } from 'react';
import { Drawer, Button } from 'rsuite';
import 'rsuite/dist/rsuite.min.css';

function RefundDetailsModal({ isOpen, onClose, refund }) {
  const getValue = (value) => (value ? value : '');

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
            <h5 className="main-modal-title text-lg font-semibold mb-4">Refund Details</h5>
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
                  <td className="border border-gray-300 p-2">{new Date(refund.refund_date).toLocaleString('en-IN', { timeZone: 'Asia/Kolkata', dateStyle: 'short', timeStyle: 'short' })}</td>
                  <th className="border border-gray-300 p-2 text-left bg-gray-100">Reason:</th>
                  <td className="border border-gray-300 p-2">{getValue(refund.reason)}</td>
                </tr>
              </tbody>
            </table>
            {/* Buttons */}
            <div className="mt-4">
              <Button
                appearance="primary"
                className="mt-3"
              >
                Order Status Flow
              </Button>
            </div>


          </div>
        ) : (
          <p>Loading...</p>
        )}
      </Drawer.Body>
    </Drawer>
  );
}

export default RefundDetailsModal;
