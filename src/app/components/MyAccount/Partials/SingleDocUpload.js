import React, { useState, useRef } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEye, faUpload, faCheckCircle } from '@fortawesome/free-solid-svg-icons';
import { apiRequest } from "../../../lib/apiHelper";
import { toast } from 'react-toastify';

const SingleDocUpload = ({ doc, entity_type_id, company_id, kyc_doc_id, onChange }) => {
  const [file, setFile] = useState(null);
  const fileInputRef = useRef(null);

  const uploadedDocs = doc.uploadedDocs || null;
  const isVerified = uploadedDocs ? uploadedDocs.is_verified : null;

  const handleFileChange = async (e) => {
    const newFile = e.target.files[0];
    setFile(newFile);
    onChange('document_image_front', newFile, doc.id);

    // Prepare the FormData object
    const formData = new FormData();
    formData.append('document_image_front', newFile);
    formData.append('document_id', doc.id);
    formData.append('kyc_doc_id', kyc_doc_id);
    formData.append('entity_type_id', entity_type_id);
    formData.append('company_id', company_id);
    formData.append('company_doc_id', uploadedDocs.id);

    try {
      const response = await apiRequest('POST', '/v1/merchant/kyc-document-upload', { post: formData });
      if (response.StatusCode === '1') {
        toast.success(response.Message)
        setTimeout(() => {
          window.location.reload();
        }, 2000);
      } else {
        if (response.Result) {
          toast.error(response.Result);
        } else {
          toast.error('Something went wrong. Please try again later.');
        }
      }
    } catch (error) {
      console.error('Error uploading file', error);
    }
  };

  const handleIconClick = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
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
        {uploadedDocs?.document_image_front && (
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
        onClick={handleIconClick}
      >
        <FontAwesomeIcon icon={isVerified ? faCheckCircle : faUpload} />
      </span>

      <input
        type="file"
        name="document_image_front"
        className="uploadDoc"
        onChange={handleFileChange}
        style={{ display: 'none' }}
        ref={fileInputRef}
      />
    </div>
  );
};

export default SingleDocUpload;
