import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTimes } from '@fortawesome/free-solid-svg-icons';

const ConfirmationModal = ({ isOpen, onClose, onConfirm }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-white rounded-lg shadow-lg w-128">
        <div className="flex justify-between items-center p-4 border-b">
          <h4 className="text-lg font-semibold">Confirmation</h4>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
            <FontAwesomeIcon icon={faTimes} />
          </button>
        </div>
        <div className="p-4">
          <label>Do you want to generate a new Client Secret Token?</label>
          <br />
          <span className="text-gray-500 text-sm">
            (Clicking "Confirm" will update the Client Secret Token for all linked payment services.)
          </span>
        </div>
        <div className="flex justify-end p-4 border-t">
          <button
            onClick={onClose}
            className="btn btn-secondary mr-2"
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            className="btn btn-info"
          >
            Confirm
          </button>
        </div>
      </div>
    </div>
  );
};

export default ConfirmationModal;
