import React from 'react';
import { Drawer, Button } from 'rsuite';

function TransactionDetailsModal({ isOpen, onClose, order }) {
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
            <h5 className="main-modal-title">Order Details</h5>
            <div style={{ overflow: 'hidden', padding: '0 10px' }}>
              <table className="table" style={{ width: '100%', tableLayout: 'fixed' }}>
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
              {order.payment_status !== 'pending' && (
                <Button appearance="primary" className="mt-3">Transaction Details</Button>
              )}
              {order.refund_status === 'queued' && (
                <Button appearance="primary" className="mt-3">Refund Details</Button>
              )}
              <Button appearance="primary" className="mt-3">Order Status Flow</Button>
            </div>
          </div>
        ) : (
          <p>Loading...</p>
        )}
      </Drawer.Body>
    </Drawer>
  );
}

export default TransactionDetailsModal;
