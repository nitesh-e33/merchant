import React, { useEffect, useRef, useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEye, faUpload, faCheckCircle } from '@fortawesome/free-solid-svg-icons';
import $ from 'jquery';
import PropTypes from 'prop-types';
import { toast } from 'react-toastify';
import { apiRequest } from '../../../lib/apiHelper';

const FormSelectDocUpload = ({ docs, entity_type_id, company_id, kyc_doc_id, onChange }) => {
  const docsArray = Array.isArray(docs) ? docs : [docs];
  const [selectedDoc, setSelectedDoc] = useState('');
  const [uploadedDoc, setUploadedDoc] = useState(null);
  const [errorMessage, setErrorMessage] = useState('');
  const fileInputRef = useRef(null);

  useEffect(() => {
    $(document).ready(function() {
      $('.select2').select2();
    });
    // Check if a document is already uploaded and update state accordingly
    const existingDoc = docsArray.find(doc => doc.uploadedDocs && doc.uploadedDocs.length !== 0);
    if (existingDoc) {
      setSelectedDoc(existingDoc.id);
      setUploadedDoc(existingDoc.uploadedDocs);
      onChange('document_id', existingDoc.id);
    }
  }, [docsArray, selectedDoc]);

  const handleSelectChange = (e) => {
    const selectedDocId = e.target.value;
    setSelectedDoc(selectedDocId);
    setErrorMessage(''); // Clear error message when a valid selection is made
    onChange('document_id', selectedDocId);
  };

  const handleFileChange = async (e) => {
    const selectedFile = e.target.files[0];
    onChange('document_image_front', selectedFile);

    if (!selectedDoc) {
      setErrorMessage('Please select a document type before uploading.');
      return;
    }

    const formData = new FormData();
    formData.append('document_image_front', selectedFile);
    formData.append('document_id', selectedDoc);
    formData.append('kyc_doc_id', kyc_doc_id);
    formData.append('entity_type_id', entity_type_id);
    formData.append('company_id', company_id);
    formData.append('company_doc_id', uploadedDoc?.id);

    try {
      localStorage.removeItem('docs');
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
      console.error('Error uploading file', error);
      toast.error('Failed to upload document. Please try again.');
    }
  };

  const handleIconClick = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  return (
    <div className="relative input-group">
      <div className="w-full">
        <select
          className="form-control select2 document_id w-full"
          name="document_id"
          onChange={handleSelectChange}
          value={selectedDoc}
          disabled={!!uploadedDoc}
          style={{ width: '100%' }}
        >
          <option value="">--Select Document--</option>
          {docsArray.map((doc) => (
            <option key={doc.id} value={doc.id}>
              {doc.name}
            </option>
          ))}
        </select>
        {errorMessage && <div className="text-red-500 mt-1">{errorMessage}</div>}
      </div>

      {uploadedDoc && (
        <div>
          <span
            className="absolute right-[-60px] top-1/2 transform -translate-y-1/2"
            title="View Document"
          >
            <a
              href={`${process.env.NEXT_PUBLIC_API_ASSET_URL}${uploadedDoc.document_image_front}`}
              target="_blank"
              rel="noopener noreferrer"
            >
              <FontAwesomeIcon icon={faEye} />
            </a>
          </span>
          {uploadedDoc.is_verified === '0' ? (
            <span
              className="absolute right-[-30px] top-1/2 transform -translate-y-1/2"
              title="Upload Document"
              onClick={handleIconClick}
            >
              <FontAwesomeIcon icon={faUpload} />
            </span>
          ) : (
            <span
              className="absolute right-[-30px] top-1/2 transform -translate-y-1/2 pointer-events-none"
              title="Document Verified"
            >
              <FontAwesomeIcon icon={faCheckCircle} />
            </span>
          )}
        </div>
      )}

      {!uploadedDoc && (
        <span
          className="absolute right-[-30px] top-1/2 transform -translate-y-1/2"
          title="Upload Document"
          onClick={handleIconClick}
        >
          <FontAwesomeIcon icon={faUpload} />
        </span>
      )}

      <input
        type="file"
        name="document_image_front"
        className="hidden"
        onChange={handleFileChange}
        ref={fileInputRef}
      />
    </div>
  );
};

FormSelectDocUpload.propTypes = {
  docs: PropTypes.oneOfType([PropTypes.array, PropTypes.object]).isRequired,
  entity_type_id: PropTypes.string.isRequired,
  company_id: PropTypes.string.isRequired,
  kyc_doc_id: PropTypes.string.isRequired,
  onChange: PropTypes.func.isRequired,
};

export default FormSelectDocUpload;
