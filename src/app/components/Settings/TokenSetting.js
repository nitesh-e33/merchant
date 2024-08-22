import React, { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEye, faEyeSlash, faCopy } from '@fortawesome/free-solid-svg-icons';

function TokenSetting({ credentials }) {
  const hiddenText = 'xxxxxxxxxxxxxxxx';
  const actualClientID = credentials?.client_id || hiddenText;
  const actualPrivateKey = credentials?.private_key || hiddenText;

  const [isClientIDVisible, setIsClientIDVisible] = useState(false);
  const [isPrivateKeyVisible, setIsPrivateKeyVisible] = useState(false);

  const toggleClientIDVisibility = () => {
    setIsClientIDVisible(!isClientIDVisible);
  };

  const togglePrivateKeyVisibility = () => {
    setIsPrivateKeyVisible(!isPrivateKeyVisible);
  };

  return (
    <div className="row">
      <div className="col-12">
        <div className="card">
          <div className="card-header flex justify-between items-center">
            <h4>Merchant Details</h4>
            <button
              className="btn btn-success float-right"
              data-company-id={credentials?.company_id}
              data-credential-id={credentials?.credential_id}
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
                  {credentials?.client_secret !== hiddenText && (
                    <span
                      className="icon id-copy-icon ml-2 cursor-pointer"
                      title="Copy Secret Token"
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
    </div>
  );
}

export default TokenSetting;
