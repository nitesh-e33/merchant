import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEye, faUpload, faCheckCircle } from '@fortawesome/free-solid-svg-icons';
import { apiRequest } from "../../../lib/apiHelper";
import { toast } from 'react-toastify';

const BothSidesDocUpload = ({ doc, entity_type_id, company_id, kyc_doc_id, onChange }) => {
  const [uploadedDocs, setUploadedDocs] = useState(doc.uploadedDocs || {});
  const [isVerified, setIsVerified] = useState(uploadedDocs.is_verified === '1');
  const [errorMessage, setErrorMessage] = useState('');
  const [frontFile, setFrontFile] = useState(null);
  const [backFile, setBackFile] = useState(null);

  const handleFileChange = (docType, file) => {
    if (docType === 'front') {
      setFrontFile(file);
    } else {
      setBackFile(file);
    }
    onChange(doc.id, docType, file);
  };

  const handleUpload = async () => {
    if (!frontFile || !backFile) {
      setErrorMessage('Please select both front and back files.');
      return;
    }

    const formData = new FormData();
    formData.append('document_image_front', frontFile);
    formData.append('document_image_back', backFile);
    formData.append('document_id', doc.id);
    formData.append('kyc_doc_id', kyc_doc_id);
    formData.append('entity_type_id', entity_type_id);
    formData.append('company_id', company_id);
    if (typeof uploadedDocs === 'object' && !Array.isArray(uploadedDocs) && uploadedDocs !== null && uploadedDocs.id) {
      formData.append('company_doc_id', uploadedDocs.id);
    }

    try {
      localStorage.removeItem('mdprofile');
      const response = await apiRequest('POST', '/v1/merchant/kyc-document-upload', { post: formData });
      if (response.StatusCode === '1') {
        toast.success(response.Message);
        setTimeout(() => {
          window.location.reload();
        }, 2000);
      } else {
        toast.error(response.Result || 'Something went wrong. Please try again later.');
      }
    } catch (error) {
      console.error('Error uploading files', error);
    }
  };

  return (
    <div>
      <div className="relative input-group">
        <input type="text" className="form-control" name="document_id" value={doc.name} disabled />
        <span className="upload-btn absolute right-[-30px] top-1/2 transform -translate-y-1/2" onClick={handleUpload}>
          <FontAwesomeIcon icon={faUpload} />
        </span>
      </div>
      {errorMessage && <div id="error-message" style={{ color: 'red' }}>{errorMessage}</div>}
      <div className="input-group">
        <label htmlFor="doc_front">{doc.name} Front</label>
        <div className="input-icon-wrapper">
          <input
            type="file"
            className="form-control"
            name="document_image_front"
            id="doc_front"
            onChange={e => handleFileChange('front', e.target.files[0])}
          />
          {uploadedDocs.document_image_front && (
            <span className="view-front-btn" title="View Document">
              <a href={`${process.env.NEXT_PUBLIC_API_ASSET_URL}${uploadedDocs.document_image_front}`} target="_blank" rel="noopener noreferrer">
                <FontAwesomeIcon icon={faEye} />
              </a>
            </span>
          )}
        </div>
      </div>
      <div className="input-group">
        <label htmlFor="doc_back">{doc.name} Back</label>
        <div className="input-icon-wrapper">
          <input
            type="file"
            className="form-control"
            name="document_image_back"
            id="doc_back"
            onChange={e => handleFileChange('back', e.target.files[0])}
          />
          {uploadedDocs.document_image_back && (
            <span className="view-back-btn" title="View Document">
              <a href={`${process.env.NEXT_PUBLIC_API_ASSET_URL}${uploadedDocs.document_image_back}`} target="_blank" rel="noopener noreferrer">
                <FontAwesomeIcon icon={faEye} />
              </a>
            </span>
          )}
        </div>
      </div>
      {uploadedDocs && isVerified && (
        <span className="verify-icon" title="Document Verified">
          <FontAwesomeIcon icon={faCheckCircle} />
        </span>
      )}
    </div>
  );
};

BothSidesDocUpload.propTypes = {
  doc: PropTypes.object.isRequired,
  entity_type_id: PropTypes.string.isRequired,
  company_id: PropTypes.string.isRequired,
  kyc_doc_id: PropTypes.string.isRequired,
  onChange: PropTypes.func.isRequired,
};

export default BothSidesDocUpload;
