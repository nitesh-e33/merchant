import React, { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEye, faUpload, faCheckCircle } from '@fortawesome/free-solid-svg-icons';
const SingleDocUpload = ({ doc, onChange }) => {
  const [file, setFile] = useState(null);

  const uploadedDocs = doc.uploadedDocs || null;
  const isVerified = uploadedDocs ? uploadedDocs.is_verified : null;

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
    onChange('document_image_front', e.target.files[0], doc.id);
  };

  return (
    <div className="relative input-group">
      <input
        type="text"
        className="form-control"
        name="docId"
        value={doc.name}
        disabled
      />
      
      <span
        className="absolute right-[-60px] top-1/2 transform -translate-y-1/2"
        data-toggle="tooltip"
        data-placement="top"
        title="View Document"
      >
        {uploadedDocs.length !== 0 && (
          <a
            href={`${process.env.NEXT_PUBLIC_API_ASSET_URL}${uploadedDocs.document_image_front}`}
            target="_blank"
            rel="noopener noreferrer"
          >
            <FontAwesomeIcon icon={faEye} />
          </a>
        )}
      </span>

      <span
        className={`absolute top-1/2 transform -translate-y-1/2 ${
          uploadedDocs
            ? isVerified
              ? 'right-[-30px] verify-icon'
              : 'right-[-30px] upload-icon'
            : 'right-[-30px] upload-icon'
        }`}
        data-toggle="tooltip"
        data-placement="top"
        title={isVerified ? 'Document Verified' : 'Upload Document'}
      >
        <FontAwesomeIcon icon={isVerified ? faCheckCircle : faUpload} />
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
