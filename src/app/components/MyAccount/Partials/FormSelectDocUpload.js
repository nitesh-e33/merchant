import React, { useEffect, useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEye, faUpload, faCheckCircle } from '@fortawesome/free-solid-svg-icons';

const FormSelectDocUpload = ({ docs, onChange }) => {
  const docsArray = Array.isArray(docs) ? docs : [docs];
  const [selectedDoc, setSelectedDoc] = useState('');
  const [file, setFile] = useState(null);
  const [showUploadIcon, setShowUploadIcon] = useState(true);

  // Handle document selection
  const handleSelectChange = (e) => {
    setSelectedDoc(e.target.value);
    onChange('document_id', e.target.value);
  };

  // Handle file change
  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    setFile(selectedFile);
    onChange('document_image_front', selectedFile);
  };

  // Check if upload icon should be shown
  const checkShowUploadIcon = () => {
    for (const doc of docsArray) {
      if (doc.uploadedDocs) {
        setShowUploadIcon(false);
        break;
      }
    }
  };

  useEffect(() => {
    checkShowUploadIcon();
  }, [docsArray]);

  return (
    <div className="relative input-group">
      <select
        className="form-control select2 document_id"
        name="document_id"
        onChange={handleSelectChange}
        value={selectedDoc}
      >
        <option value="">--Select Document--</option>
        {docsArray.map((doc) => (
          <option
            key={doc.id}
            value={doc.id}
            disabled={doc.uploadedDocs ? true : false}
          >
            {doc.name}
          </option>
        ))}
      </select>
      <div className="selectDocError text-red-500 mt-2"></div>

      {docsArray.map((doc) => (
        doc.uploadedDocs && (
          <div key={doc.id}>
            <span
              className="absolute right-[-60px] top-1/2 transform -translate-y-1/2"
              data-toggle="tooltip"
              data-placement="top"
              title="View Document"
            >
              <a
                href={`${process.env.NEXT_PUBLIC_API_ASSET_URL}${doc.uploadedDocs.document_image_front}`}
                target="_blank"
                rel="noopener noreferrer"
              >
                <FontAwesomeIcon icon={faEye} />
              </a>
            </span>
            {doc.uploadedDocs.is_verified === '0' ? (
              <span
                className="absolute right-[-30px] top-1/2 transform -translate-y-1/2"
                data-toggle="tooltip"
                data-placement="top"
                title="Upload Document"
              >
                <FontAwesomeIcon icon={faUpload} />
              </span>
            ) : (
              <span
                className="absolute right-[-30px] top-1/2 transform -translate-y-1/2"
                data-toggle="tooltip"
                data-placement="top"
                title="Document Verified"
              >
                <FontAwesomeIcon icon={faCheckCircle} />
              </span>
            )}
          </div>
        )
      ))}

      {showUploadIcon && (
        <span
          className="absolute right-[-30px] top-1/2 transform -translate-y-1/2"
          data-toggle="tooltip"
          data-placement="top"
          title="Upload Document"
        >
          <FontAwesomeIcon icon={faUpload} />
        </span>
      )}

      <input
        type="file"
        name="document_image_front"
        className="uploadDoc hidden"
        onChange={handleFileChange}
      />
    </div>
  );
};

export default FormSelectDocUpload;
