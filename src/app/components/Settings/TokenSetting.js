import React, { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEye, faEyeSlash, faCopy } from '@fortawesome/free-solid-svg-icons';
import { toast } from 'react-toastify';
import ConfirmationModal from './Modal/ConfirmationModal'
import { apiRequest } from '@/app/lib/apiHelper';

function TokenSetting({ credentials }) {
  const hiddenText = 'xxxxxxxxxxxxxxxx';
  const actualClientID = credentials?.client_id || hiddenText;
  const actualPrivateKey = credentials?.private_key || hiddenText;

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isClientIDVisible, setIsClientIDVisible] = useState(false);
  const [isPrivateKeyVisible, setIsPrivateKeyVisible] = useState(false);
  const [isClientSecretCopied, setIsClientSecretCopied] = useState(false);

  const toggleClientIDVisibility = () => {
    setIsClientIDVisible(!isClientIDVisible);
  };

  const togglePrivateKeyVisibility = () => {
    setIsPrivateKeyVisible(!isPrivateKeyVisible);
  };

  const handleCopyClientSecret = () => {
    const clientSecret = credentials?.client_secret || hiddenText;

    // Copy the client secret to the clipboard
    navigator.clipboard.writeText(clientSecret).then(
      () => {
        toast.success('Client secret copied successfully.');
        setIsClientSecretCopied(true);

        // Save the key in localStorage to mark it as copied
        const cacheKey = `ClientId_${credentials.client_id}`;
        localStorage.setItem(cacheKey, '1');

        // Mask the client secret after copying
        credentials.client_secret = hiddenText;
      },
      (err) => {
        toast.error('Failed to copy client secret.');
        console.error('Could not copy text: ', err);
      }
    );
  };

  const handleGenerateSecretToken = () => {
    setIsModalOpen(true);
  };

  const handleModalClose = () => {
    setIsModalOpen(false);
  };

  const handleModalConfirm = async () => {
    try {
      const clientKey = `ClientId_${credentials.client_id}`;

      // Delete the local storage key if it exists
      if (localStorage.getItem(clientKey)) {
        localStorage.removeItem(clientKey);
      }

      const credentialInfo = {
        company_id: credentials.company_id,
        credential_id: credentials.credential_id
      };

      localStorage.removeItem('credentials');
      // Make the API call to generate the new client secret
      const response = await apiRequest('POST', '/v1/merchant/generate-new-client-secret', {post: credentialInfo});

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
      setIsModalOpen(false); // Close the modal after the process
    }
  };

  return (
    <div className="row">
      <div className="col-12">
        <div className="card">
          <div className="card-header flex justify-between items-center">
            <b>Merchant Details</b>
            <button
              className="btn btn-success float-right"
              data-company-id={credentials?.company_id}
              data-credential-id={credentials?.credential_id}
              onClick={handleGenerateSecretToken} // Trigger modal on button click
            >
              Generate Secret Token
            </button>
          </div>
          <div className="card-body">
            <ul className="box-list space-y-4">
              <li>
                <div className="box flex items-center">
                  <label htmlFor="client_id" className="mr-2">
                    Client ID :
                  </label>
                  <span id="client_id">
                    {isClientIDVisible ? actualClientID : hiddenText}
                  </span>
                  <span
                    className="icon id-view-icon ml-2 cursor-pointer"
                    title={isClientIDVisible ? 'Hide Client ID' : 'View Client ID'}
                    onClick={toggleClientIDVisibility}
                  >
                    <FontAwesomeIcon icon={isClientIDVisible ? faEyeSlash : faEye} />
                  </span>
                </div>
              </li>
              <li>
                <div className="box flex items-center">
                  <label htmlFor="client_secret" className="mr-2">
                    Client Secret :
                  </label>
                  <span id="client_secret">
                    {credentials?.client_secret || hiddenText}
                  </span>
                  {credentials?.client_secret !== hiddenText && !isClientSecretCopied && (
                    <span
                      className="icon id-copy-icon ml-2 cursor-pointer"
                      title="Copy Secret Token"
                      onClick={handleCopyClientSecret}
                    >
                      <FontAwesomeIcon icon={faCopy} />
                    </span>
                  )}
                </div>
              </li>
              <li>
                <div className="box flex items-center">
                  <label htmlFor="private_key" className="mr-2">
                    Private Key :
                  </label>
                  <span id="private_key">
                    {isPrivateKeyVisible ? actualPrivateKey : hiddenText}
                  </span>
                  <span
                    className="icon key-view-icon ml-2 cursor-pointer"
                    title={isPrivateKeyVisible ? 'Hide Private Key' : 'View Private Key'}
                    onClick={togglePrivateKeyVisibility}
                  >
                    <FontAwesomeIcon icon={isPrivateKeyVisible ? faEyeSlash : faEye} />
                  </span>
                </div>
              </li>
            </ul>
          </div>
        </div>
      </div>
      <ConfirmationModal
        isOpen={isModalOpen}
        onClose={handleModalClose}
        onConfirm={handleModalConfirm}
      />
    </div>
  );
}

export default TokenSetting;
