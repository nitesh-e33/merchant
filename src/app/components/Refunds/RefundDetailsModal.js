import React, { useEffect, useState } from 'react';
import { Drawer, Button } from 'rsuite';

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
            {/* Order Details Table */}
            <h5 className="main-modal-title text-lg font-semibold mb-4">Refund Details</h5>
            <table className="table w-full table-fixed">
              <tbody>
                <tr>
                  <th>ID :</th>
                  <td>{getValue(refund.id)}</td>
                  <th>Droompay Transaction ID:</th>
                  <td>{getValue(refund.order_id)}</td>
                </tr>
                <tr>
                  <th>Payment ID:</th>
                  <td>{getValue(refund.payment_id)}</td>
                  <th>Refund ID:</th>
                  <td>{getValue(refund.refund_id)}</td>
                </tr>
                <tr>
                  <th>Refund Amount:</th>
                  <td>{getValue(refund.refund_amount)}</td>
                  <th>Refund Type:</th>
                  <td>{getValue(refund.refund_type)}</td>
                </tr>
                <tr>
                  <th>Refund Amount Request:</th>
                  <td>{getValue(refund.refund_amount_request)}</td>
                  <th>Status:</th>
                  <td>{getValue(refund.status)}</td>
                </tr>
                <tr>
                  <th>Refund Date:</th>
                  <td>{new Date(refund.refund_date).toLocaleString('en-IN', { timeZone: 'Asia/Kolkata', dateStyle: 'short', timeStyle: 'short' })}</td>
                  <th>Reason:</th>
                  <td>{getValue(refund.reason)}</td>
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
