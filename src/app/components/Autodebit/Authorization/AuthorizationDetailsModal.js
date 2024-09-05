import React from 'react';
import { Drawer, Button } from 'rsuite';
import 'rsuite/dist/rsuite.min.css';

function AuthorizationDetailsModal({ isOpen, onClose, authorizations }) {
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
            <h1>Hello</h1>
      </Drawer.Body>
    </Drawer>
  );
}

export default AuthorizationDetailsModal;
