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

    console.log(webhookList);

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
    // Use the current value if it exists, otherwise use the original webhook URL or an empty string
    const key = id || webhookType;
    const urlToSave = editValues[key] !== undefined ? editValues[key] : webhookList.find(webhook => webhook.id === id)?.webhook_url || '';

    if(urlToSave == '') {
      toast.error('webhook url is not empty')
      return;
    }

    const requestData = {
      webhook_url: urlToSave,
      webhook_type: webhookType,
      flag: flag,
    };
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
        [key]: false,
      }));
    } catch (error) {
      console.error('Error saving webhook URL:', error);
    }
  };

  return (
    <div className="bg-white shadow-md rounded-lg overflow-hidden">
      <div className="bg-gray-200 p-3">
        <h3 className="text-lg font-semibold">Webhook Setting</h3>
      </div>
      <div className="p-4">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Description</th>
              <th className="px-6 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">URL with your registered domain</th>
              <th className="px-6 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Settings</th>
              <th className="px-6 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Enable</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {webhookList && webhookList.map((webhook) => (
              <tr key={webhook.id}>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{`${webhook.webhook_type.charAt(0).toUpperCase() + webhook.webhook_type.slice(1)} Webhook`}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  <div className="relative">
                    <input
                      type="text"
                      className={`block w-full px-3 py-1.5 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-1 focus:ring-blue-500 sm:text-sm ${!editModes[webhook.id] ? 'cursor-not-allowed bg-gray-100' : ''}`}
                      value={editModes[webhook.id] ? (editValues[webhook.id] !== undefined ? editValues[webhook.id] : webhook.webhook_url) : webhook.webhook_url}
                      disabled={!editModes[webhook.id]} // Disable input based on edit mode
                      onChange={(e) => handleInputChange(webhook.id, e.target.value)}
                    />
                    {editModes[webhook.id] && (
                      <span
                        className="absolute inset-y-0 right-0 flex items-center pr-3 cursor-pointer text-light-blue hover:text-blue-500"
                        onClick={() => handleSaveClick(webhook.id, webhook.webhook_type, 1)}
                      >
                        <FontAwesomeIcon icon={faCheck} />
                      </span>
                    )}
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                  <span
                    className="cursor-pointer text-blue-500 hover:text-blue-700"
                    onClick={() => handleEditClick(webhook.id)} // Handle edit icon click
                  >
                    <FontAwesomeIcon icon={editModes[webhook.id] ? faTimes : faEdit} />
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      className="sr-only peer"
                      data-webhook-id={webhook.id}
                      data-status={webhook.status}
                      data-webhook-type={webhook.webhook_type}
                      defaultChecked={webhook.status === '1'}
                    />
                    <div className="w-10 h-5 bg-gray-300 rounded-full peer-focus:ring-blue-500 peer-checked:bg-blue-600 transition-colors duration-300 ease-in-out flex items-center">
                      <span className="block w-4 h-4 bg-white rounded-full transform transition-transform duration-300 ease-in-out peer-checked:translate-x-5"></span>
                    </div>
                  </label>
                </td>
              </tr>
            ))}

            {/* Handle missing webhooks */}
            {!hasTransactionWebhook && (
              <tr>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">Transaction Webhook</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  <div className="relative">
                    <input
                      type="text"
                      className={`block w-full px-3 py-1.5 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-1 focus:ring-blue-500 sm:text-sm ${!editModes['transaction'] ? 'cursor-not-allowed bg-gray-100' : ''}`}
                      value={editModes['transaction'] ? (editValues['transaction'] !== undefined ? editValues['transaction'] : '') : ''}
                      disabled={!editModes['transaction']}
                      onChange={(e) => handleInputChange('transaction', e.target.value)}
                    />
                    {editModes['transaction'] && (
                      <span
                        className="absolute inset-y-0 right-0 flex items-center pr-3 cursor-pointer text-light-blue hover:text-blue-500"
                        onClick={() => handleSaveClick('', 'transaction', 0)}
                      >
                        <FontAwesomeIcon icon={faCheck} />
                      </span>
                    )}
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                  <span
                    className="cursor-pointer text-blue-500 hover:text-blue-700"
                    onClick={() => handleEditClick('transaction')}
                  >
                    <FontAwesomeIcon icon={editModes['transaction'] ? faTimes : faEdit} />
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      className="sr-only peer"
                      data-webhook-id=""
                      data-status="0"
                      data-webhook-type="transaction"
                    />
                    <div className="w-10 h-5 bg-gray-300 rounded-full peer-focus:ring-blue-500 peer-checked:bg-blue-600 transition-colors duration-300 ease-in-out flex items-center">
                      <span className="block w-4 h-4 bg-white rounded-full transform transition-transform duration-300 ease-in-out peer-checked:translate-x-5"></span>
                    </div>
                  </label>
                </td>
              </tr>
            )}

            {!hasRefundWebhook && (
              <tr>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">Refund Webhook</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  <div className="relative">
                    <input
                      type="text"
                      className={`block w-full px-3 py-1.5 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-1 focus:ring-blue-500 sm:text-sm ${!editModes['refund'] ? 'cursor-not-allowed bg-gray-100' : ''}`}
                      value={editModes['refund'] ? (editValues['refund'] !== undefined ? editValues['refund'] : '') : ''}
                      disabled={!editModes['refund']}
                      onChange={(e) => handleInputChange('refund', e.target.value)}
                    />
                    {editModes['refund'] && (
                      <span
                        className="absolute inset-y-0 right-0 flex items-center pr-3 cursor-pointer text-light-blue hover:text-blue-500"
                        onClick={() => handleSaveClick('', 'refund', 0)}
                      >
                        <FontAwesomeIcon icon={faCheck} />
                      </span>
                    )}
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                  <span
                    className="cursor-pointer text-blue-500 hover:text-blue-700"
                    onClick={() => handleEditClick('refund')}
                  >
                    <FontAwesomeIcon icon={editModes['refund'] ? faTimes : faEdit} />
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      className="sr-only peer"
                      data-webhook-id=""
                      data-status="0"
                      data-webhook-type="refund"
                    />
                    <div className="w-10 h-5 bg-gray-300 rounded-full peer-focus:ring-blue-500 peer-checked:bg-blue-600 transition-colors duration-300 ease-in-out flex items-center">
                      <span className="block w-4 h-4 bg-white rounded-full transform transition-transform duration-300 ease-in-out peer-checked:translate-x-5"></span>
                    </div>
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
