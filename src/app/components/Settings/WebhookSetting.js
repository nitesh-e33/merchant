import React, { useEffect, useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCheck, faEdit, faTimes } from '@fortawesome/free-solid-svg-icons';
import { apiRequest } from '@/app/lib/apiHelper';
import { toast } from 'react-toastify';
import WebhookStatusChangeModal from './Modal/WebhookStatusChangeModal';

function WebhookSetting({ webhookList }) {
  const [editModes, setEditModes] = useState({});
  const [editValues, setEditValues] = useState({});
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedWebhook, setSelectedWebhook] = useState(null);
  const [originalStatus, setOriginalStatus] = useState(null);

  useEffect(() => {
    // Initialize edit modes and values based on the webhook list
    const initialEditModes = {};
    const initialEditValues = {};

    webhookList.forEach((webhook) => {
      initialEditModes[webhook.id] = false;
      initialEditValues[webhook.id] = webhook.webhook_url;
    });

    setEditModes(initialEditModes);
    setEditValues(initialEditValues);
  }, [webhookList]);

  const handleEditClick = (id) => {
    setEditModes((prevModes) => ({
      ...prevModes,
      [id]: !prevModes[id],
    }));
  };

  const handleInputChange = (id, value) => {
    setEditValues((prevValues) => ({
      ...prevValues,
      [id]: value,
    }));
  };

  const handleSaveClick = async (id, webhookType, flag) => {
    const urlToSave = editValues[id] || '';

    if (!urlToSave) {
      toast.error('Webhook URL cannot be empty');
      return;
    }

    try {
      localStorage.removeItem('webhookList');
      const response = await apiRequest('POST', '/v1/merchant/webhook/setting', {
        post: { webhook_url: urlToSave, webhook_type: webhookType, flag },
      });

      if (response.StatusCode === "1") {
        toast.success(response.Message);
        setTimeout(() => {
          window.location.reload();
        }, 2000);
      } else {
        toast.error(response.Result || 'Something went wrong. Please try again later.');
      }

      setEditModes((prevModes) => ({ ...prevModes, [id]: false }));
    } catch (error) {
      console.error('Error saving webhook URL:', error);
    }
  };

  const handleWebhookStatus = (webhook) => {
    setSelectedWebhook(webhook);
    setOriginalStatus(webhook.status);
    setIsModalOpen(true);
  };

  const handleModalClose = () => {
    if (selectedWebhook) {
      const webhookElement = document.querySelector(`input[data-webhook-id="${selectedWebhook.id}"]`);
      if (webhookElement) {
        webhookElement.checked = originalStatus === '1';
      }
    }
    setIsModalOpen(false);
  };

  const handleModalConfirm = async () => {
    if (!selectedWebhook) return;
    const newStatus = selectedWebhook.status === '1' ? '0' : '1';
    if(selectedWebhook.webhook_url === '') {
      setIsModalOpen(false);
      toast.error('The webhook id field is required.');
      return;
    }
    try {
      localStorage.removeItem('webhookList');
      const response = await apiRequest('POST', '/v1/merchant/webhook/status', {
        post: { webhook_id: selectedWebhook.id, status: newStatus },
      });

      if (response.StatusCode === "1") {
        toast.success(response.Message);
        setTimeout(() => {
          window.location.reload();
        }, 2000);
      } else {
        toast.error(response.Result || 'Something went wrong. Please try again later.');
      }
    } catch (error) {
      toast.error('An error occurred. Please try again later.');
      console.error(error);
    } finally {
      setIsModalOpen(false);
    }
  };

  const renderWebhookRow = (webhook, isMissing) => {
    const id = webhook.id || webhook.webhook_type;
    const isEditMode = editModes[id];

    return (
      <tr key={id}>
        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
          {`${webhook.webhook_type.charAt(0).toUpperCase() + webhook.webhook_type.slice(1)} Webhook`}
        </td>
        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
          <div className="relative">
            <input
              type="text"
              className={`block w-full px-3 py-1.5 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-1 focus:ring-blue-500 sm:text-sm ${!isEditMode ? 'cursor-not-allowed bg-gray-100' : ''}`}
              value={isEditMode ? editValues[id] : webhook.webhook_url}
              disabled={!isEditMode}
              onChange={(e) => handleInputChange(id, e.target.value)}
            />
            {isEditMode && (
              <span
                className="absolute inset-y-0 right-0 flex items-center pr-3 cursor-pointer text-light-blue hover:text-blue-500"
                onClick={() => handleSaveClick(id, webhook.webhook_type, isMissing ? 0 : 1)}
              >
                <FontAwesomeIcon icon={faCheck} />
              </span>
            )}
          </div>
        </td>
        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
          <span
            className="cursor-pointer text-blue-500 hover:text-blue-700"
            onClick={() => handleEditClick(id)}
          >
            <FontAwesomeIcon icon={isEditMode ? faTimes : faEdit} />
          </span>
        </td>
        <td className="px-6 py-4 whitespace-nowrap">
          <label className="relative inline-flex items-center cursor-pointer">
            <input
              type="checkbox"
              className="sr-only peer"
              data-webhook-id={id}
              defaultChecked={webhook.status === '1'}
              onChange={() => handleWebhookStatus(webhook)}
            />
            <div
              className="relative w-10 h-5 bg-gray-300 rounded-full transition-colors duration-300 ease-in-out flex items-center"
              style={{
                backgroundColor: webhook.status === '1' ? 'blue' : 'gray',
              }}
            >
              <span
                className="absolute top-0.5 left-0.5 w-4 h-4 bg-white rounded-full transform transition-transform duration-300 ease-in-out"
                style={{
                  transform: webhook.status === '1' ? 'translateX(1.25rem)' : 'translateX(0)',
                }}
              ></span>
            </div>
          </label>
        </td>
      </tr>
    );
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
            {webhookList.map((webhook) => renderWebhookRow(webhook, false))}

            {/* Handle missing webhooks */}
            {!webhookList.some(webhook => webhook.webhook_type === 'transaction') &&
              renderWebhookRow({ webhook_type: 'transaction', webhook_url: '', status: '0' }, true)
            }
            {!webhookList.some(webhook => webhook.webhook_type === 'refund') &&
              renderWebhookRow({ webhook_type: 'refund', webhook_url: '', status: '0' }, true)
            }
          </tbody>
        </table>
      </div>

      {isModalOpen && (
        <WebhookStatusChangeModal
          isOpen={isModalOpen}
          onClose={handleModalClose}
          onConfirm={handleModalConfirm}
          webhook={selectedWebhook}
        />
      )}
    </div>
  );
}

export default WebhookSetting;
