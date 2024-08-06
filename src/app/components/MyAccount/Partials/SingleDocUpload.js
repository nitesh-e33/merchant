import React, { useState } from 'react';

const SingleDocUpload = ({ doc, onChange }) => {
  const [file, setFile] = useState(null);

  const uploadedDocs = doc.uploadedDocs || null;
  const isVerified = uploadedDocs ? uploadedDocs.is_verified : null;

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
    onChange('document_image_front', e.target.files[0], doc.id);
  };

  return (
    <div className="input-group">
      <input
        type="text"
        className="form-control"
        name="docId"
        value={doc.name}
        disabled
      />
      
      <span className="view-icon" data-toggle="tooltip" data-placement="top" title="View Document">
        {uploadedDocs && (
          <a
            href={`${process.env.NEXT_PUBLIC_API_ASSET_URL}${uploadedDocs.document_image_front}`}
            target="_blank"
            rel="noopener noreferrer"
          >
            <i className="fas fa-eye"></i>
          </a>
        )}
      </span>

      <span
        className={`${
          uploadedDocs
            ? isVerified
              ? 'verify-icon'
              : 'upload-icon'
            : 'upload-icon'
        }`}
        data-toggle="tooltip"
        data-placement="top"
        title={isVerified ? 'Document Verified' : 'Upload Document'}
      >
        <i className={isVerified ? 'fa fa-check-circle' : 'fas fa-upload'}></i>
      </span>

      <input
        type="file"
        name="document_image_front"
        className="uploadDoc"
        onChange={handleFileChange}
        style={{ display: 'none' }}
      />
    </div>
  );
};

export default SingleDocUpload;
