import React, { useEffect, useState } from 'react';
import FormSelectDocUpload from './Partials/FormSelectDocUpload';
import BothSidesDocUpload from './Partials/BothSidesDocUpload';
import SingleDocUpload from './Partials/SingleDocUpload';

const DocumentTypeForm = ({ companyId, kycRequiredDocsList }) => {
  const [selectedDocs, setSelectedDocs] = useState({});

  // useEffect(() => {
  //   console.log('Setting kycRequiredDocsList:', kycRequiredDocsList);
  //   console.log('Type of kycRequiredDocsList:', Array.isArray(kycRequiredDocsList));
  // }, [kycRequiredDocsList]);

  const handleFileChange = (docType, fileId, file) => {
    setSelectedDocs(prev => ({ ...prev, [`${docType}-${fileId}`]: file }));
  };

  if (!kycRequiredDocsList || !kycRequiredDocsList.kyc_doc_array) {
    return <div>No Data Found</div>;
  }

  const normalizedDocsList = Array.isArray(kycRequiredDocsList.kyc_doc_array)
    ? kycRequiredDocsList.kyc_doc_array
    : [kycRequiredDocsList.kyc_doc_array];

  return (
    <div className="row">
      <div className="col-sm-12">
        <h1><b>{kycRequiredDocsList.name}</b></h1>
        {normalizedDocsList.length > 0 ? (
          normalizedDocsList.map((doc, index) => (
            <div key={index} className="col-sm-6">
              <DocumentCategory
                index={index}
                doc={doc}
                handleFileChange={handleFileChange}
              />
            </div>
          ))
        ) : (
          <div>No documents available.</div>
        )}
      </div>
    </div>
  );
};

const DocumentCategory = ({ index, doc, handleFileChange }) => {
  const normalizedDocArray = Array.isArray(doc.doc_array)
    ? doc.doc_array
    : [doc.doc_array];

  return (
    <div className="form-group">
      <h5>{index + 1}. {doc.name}:</h5>
      {normalizedDocArray.length > 0 ? (
        normalizedDocArray.map((subDoc, idx) => (
          <DocumentUpload
            key={idx}
            subDoc={subDoc}
            handleFileChange={handleFileChange}
          />
        ))
      ) : (
        <div>No documents available in this category.</div>
      )}
    </div>
  );
};

const DocumentUpload = ({ subDoc, handleFileChange }) => {
  console.log('subDoc', subDoc);
  if (subDoc.is_required === 'Any one' && subDoc.is_both !== '1') {
    return <FormSelectDocUpload doc={subDoc} onChange={handleFileChange} />;
  } else if (subDoc.is_both === '1') {
    return <BothSidesDocUpload doc={subDoc} onChange={handleFileChange} />;
  } else {
    return <SingleDocUpload doc={subDoc} onChange={handleFileChange} />;
  }
};

export default DocumentTypeForm;
