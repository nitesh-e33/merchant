import React, { useEffect, useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCheck, faEdit, faTimes } from '@fortawesome/free-solid-svg-icons';
import { apiRequest } from '@/app/lib/apiHelper';
import { toast } from 'react-toastify';

function WebhookSetting({ webhookList }) {
  const [editModes, setEditModes] = useState({}); // Object to track edit mode for each row
  const [editValues, setEditValues] = useState({}); // Object to track edit values for each row
  const [hasTransactionWebhook, setHasTransactionWebhook] = useState(false);
  const [hasRefundWebhook, setHasRefundWebhook] = useState(false);

  useEffect(() => {
    // Initialize webhook presence checks
    let transactionFound = false;
    let refundFound = false;

    webhookList.forEach((webhook) => {
      const webhookType = webhook.webhook_type;
      if (webhookType === 'transaction') {
        transactionFound = true;
      }
      if (webhookType === 'refund') {
        refundFound = true;
      }
    });

    setHasTransactionWebhook(transactionFound);
    setHasRefundWebhook(refundFound);
  }, [webhookList]);

  const handleEditClick = (id) => {
    setEditModes((prevModes) => ({
      ...prevModes,
      [id]: !prevModes[id], // Toggle edit mode
    }));
  };

  const handleInputChange = (id, value) => {
    setEditValues((prevValues) => ({
      ...prevValues,
      [id]: value,
    }));
  };

  const handleSaveClick = async (id, webhookType, flag) => {
    // Use the current value if it exists, otherwise use the original webhook URL
    const urlToSave = editValues[id] !== undefined ? editValues[id] : webhookList.find(webhook => webhook.id === id).webhook_url;

    const requestData = {
      webhook_url: urlToSave,
      webhook_type: webhookType,
      flag: flag,
    };

    console.log(requestData);
    return;
    try {
      const response = await apiRequest('POST', '/v1/merchant/webhook/setting', { post: requestData });
      if (response.StatusCode === "1") {
        toast.success(response.Message);
        setTimeout(() => {
          window.location.reload();
        }, 2000);
      } else {
        toast.error(response.Result || 'Something went wrong. Please try again later.');
      }

      // Disable edit mode after saving
      setEditModes((prevModes) => ({
        ...prevModes,
        [id]: false,
      }));
    } catch (error) {
      console.error('Error saving webhook URL:', error);
    }
  };

  return (
    <div className="card">
      <div className="card-header">
        <h3 className="card-title">Webhook Setting</h3>
      </div>
      <div className="card-body webhook-table">
        <table className="table table-bordered table-striped">
          <thead>
            <tr>
              <th>Description</th>
              <th>URL with your registered domain</th>
              <th>Settings</th>
              <th>Enable</th>
            </tr>
          </thead>
          <tbody>
            {webhookList && webhookList.map((webhook) => (
              <tr key={webhook.id}>
                <td>{`${webhook.webhook_type.charAt(0).toUpperCase() + webhook.webhook_type.slice(1)} Webhook`}</td>
                <td>
                  <div className="webhook-url-container">
                    <input
                      type="text"
                      className="webhook-url"
                      value={editModes[webhook.id] ? (editValues[webhook.id] !== undefined ? editValues[webhook.id] : webhook.webhook_url) : webhook.webhook_url}
                      disabled={!editModes[webhook.id]} // Disable input based on edit mode
                      onChange={(e) => handleInputChange(webhook.id, e.target.value)}
                    />
                    <span
                      className="right-click-icon"
                      style={{ display: editModes[webhook.id] ? 'inline-block' : 'none' }}
                      onClick={() => handleSaveClick(webhook.id, webhook.webhook_type, 1)}
                    >
                      <FontAwesomeIcon icon={faCheck} />
                    </span>
                  </div>
                </td>
                <td>
                  <span
                    className="webhook-edit-icon"
                    onClick={() => handleEditClick(webhook.id)} // Handle edit icon click
                  >
                    <FontAwesomeIcon icon={editModes[webhook.id] ? faTimes : faEdit} />
                  </span>
                </td>
                <td>
                  <label className="switch">
                    <input
                      type="checkbox"
                      className="toggle-switch"
                      data-webhook-id={webhook.id}
                      data-status={webhook.status}
                      data-webhook-type={webhook.webhook_type}
                      defaultChecked={webhook.status === 1}
                    />
                    <span className="slider"></span>
                  </label>
                </td>
              </tr>
            ))}

            {/* Handle missing webhooks */}
            {!hasTransactionWebhook && (
              <tr>
                <td>Transaction Webhook</td>
                <td>
                  <div className="webhook-url-container">
                    <input
                      type="text"
                      className="webhook-url"
                      value={editModes['transaction'] ? (editValues['transaction'] !== undefined ? editValues['transaction'] : '') : ''}
                      disabled={!editModes['transaction']}
                      onChange={(e) => handleInputChange('transaction', e.target.value)}
                    />
                    <span
                      className="right-click-icon"
                      style={{ display: editModes['transaction'] ? 'inline-block' : 'none' }}
                      onClick={() => handleSaveClick('', 'transaction', 0)}
                    >
                      <FontAwesomeIcon icon={faCheck} />
                    </span>
                  </div>
                </td>
                <td>
                  <span
                    className="webhook-edit-icon"
                    onClick={() => handleEditClick('transaction')}
                  >
                    <FontAwesomeIcon icon={editModes['transaction'] ? faTimes : faEdit} />
                  </span>
                </td>
                <td>
                  <label className="switch">
                    <input
                      type="checkbox"
                      className="toggle-switch"
                      data-webhook-id=""
                      data-status="0"
                      data-webhook-type="transaction"
                    />
                    <span className="slider"></span>
                  </label>
                </td>
              </tr>
            )}

            {!hasRefundWebhook && (
              <tr>
                <td>Refund Webhook</td>
                <td>
                  <div className="webhook-url-container">
                    <input
                      type="text"
                      className="webhook-url"
                      value={editModes['refund'] ? (editValues['refund'] !== undefined ? editValues['refund'] : '') : ''}
                      disabled={!editModes['refund']}
                      onChange={(e) => handleInputChange('refund', e.target.value)}
                    />
                    <span
                      className="right-click-icon"
                      style={{ display: editModes['refund'] ? 'inline-block' : 'none' }}
                      onClick={() => handleSaveClick('', 'refund', 0)}
                    >
                      <FontAwesomeIcon icon={faCheck} />
                    </span>
                  </div>
                </td>
                <td>
                  <span
                    className="webhook-edit-icon"
                    onClick={() => handleEditClick('refund')}
                  >
                    <FontAwesomeIcon icon={editModes['refund'] ? faTimes : faEdit} />
                  </span>
                </td>
                <td>
                  <label className="switch">
                    <input
                      type="checkbox"
                      className="toggle-switch"
                      data-webhook-id=""
                      data-status="0"
                      data-webhook-type="refund"
                    />
                    <span className="slider"></span>
                  </label>
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default WebhookSetting;
