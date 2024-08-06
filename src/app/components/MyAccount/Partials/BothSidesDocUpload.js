import React, { useState } from 'react';
import PropTypes from 'prop-types';

const BothSidesDocUpload = ({ doc, onChange }) => {
  const [uploadedDocs, setUploadedDocs] = useState(doc.uploadedDocs || {});
  const [isVerified, setIsVerified] = useState(uploadedDocs.is_verified === '1');
  const [errorMessage, setErrorMessage] = useState('');

  const handleFileChange = (docType, file) => {
    onChange(doc.id, docType, file);
  };

  const handleUpload = () => {
    // Call your upload function here
    // For example:
    // uploadDocs(doc.id, uploadedDocs.id || '');
    // Update state or perform additional actions as needed
  };

  return (
    <div>
      <div className="input-group">
        <input type="text" className="form-control" name="document_id" value={doc.name} disabled />
      </div>
      <div className="input-group">
        <label htmlFor="doc_front">{doc.name} Front</label>
        <input
          type="file"
          className="form-control"
          name="document_image_front"
          id="doc_front"
          onChange={e => handleFileChange('front', e.target.files[0])}
        />
      </div>
      <div className="input-group">
        <label htmlFor="doc_back">{doc.name} Back</label>
        <input
          type="file"
          className="form-control"
          name="document_image_back"
          id="doc_back"
          onChange={e => handleFileChange('back', e.target.files[0])}
        />
      </div>
      {uploadedDocs && (
        <div>
          {uploadedDocs.document_image_front && (
            <span className="view-front-btn" title="View Document">
              <a href={`${process.env.API_ASSET_URL}${uploadedDocs.document_image_front}`} target="_blank" rel="noopener noreferrer">
                <i className="fas fa-eye"></i>
              </a>
            </span>
          )}
          {uploadedDocs.document_image_back && (
            <span className="view-back-btn" title="View Document">
              <a href={`${process.env.API_ASSET_URL}${uploadedDocs.document_image_back}`} target="_blank" rel="noopener noreferrer">
                <i className="fas fa-eye"></i>
              </a>
            </span>
          )}
          {!isVerified && (
            <>
              <button className="upload-btn btn btn-info" type="button" onClick={handleUpload}>
                Upload
              </button>
              {errorMessage && <div id="error-message" style={{ color: 'red' }}>{errorMessage}</div>}
            </>
          )}
          {isVerified && (
            <span className="verify-icon" title="Document Verified">
              <i className="fa fa-check-circle"></i>
            </span>
          )}
        </div>
      )}
      {!uploadedDocs && (
        <>
          <button className="upload-btn btn btn-info" type="button" onClick={handleUpload}>
            Upload
          </button>
          {errorMessage && <div id="error-message" style={{ color: 'red' }}>{errorMessage}</div>}
        </>
      )}
    </div>
  );
};

// BothSidesDocUpload.propTypes = {
//   doc: PropTypes.object.isRequired,
//   onChange: PropTypes.func.isRequired,
// };

export default BothSidesDocUpload;
