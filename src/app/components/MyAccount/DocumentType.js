import React, { useEffect, useState, memo } from 'react';
import FormSelectDocUpload from './Partials/FormSelectDocUpload';
import BothSidesDocUpload from './Partials/BothSidesDocUpload';
import SingleDocUpload from './Partials/SingleDocUpload';

const DocumentTypeForm = ({ companyId, kycRequiredDocsList }) => {
  const [selectedDocs, setSelectedDocs] = useState({});
  const [anyOneDocs, setAnyOneDocs] = useState([]);

  useEffect(() => {
    if (kycRequiredDocsList?.kyc_doc_array) {
      const aggregatedDocs = (Array.isArray(kycRequiredDocsList.kyc_doc_array) ?
        kycRequiredDocsList.kyc_doc_array : [kycRequiredDocsList.kyc_doc_array])
        .flatMap(doc => (Array.isArray(doc.doc_array) ? doc.doc_array : [doc.doc_array]))
        .filter(subDoc => subDoc.is_required === 'Any one' && subDoc.is_both !== '1');

      setAnyOneDocs(aggregatedDocs);
    }
  }, [kycRequiredDocsList]);

  const handleFileChange = (docType, file) => {
    setSelectedDocs(prev => ({ ...prev, [docType]: file }));
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
        <h1 className="text-xl"><b>{kycRequiredDocsList.name}</b></h1>
        {normalizedDocsList.length > 0 ? (
          normalizedDocsList.map((doc, index) => (
            <div key={index} className="col-sm-6">
              <DocumentCategory
                index={index}
                doc={doc}
                anyOneDocs={anyOneDocs}
                handleFileChange={handleFileChange}
                isFirstCategory={index === 0}
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

const DocumentCategory = memo(({ index, doc, anyOneDocs, handleFileChange, isFirstCategory }) => {
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
            anyOneDocs={anyOneDocs}
            handleFileChange={handleFileChange}
            isFirst={isFirstCategory && idx === 0}
          />
        ))
      ) : (
        <div>No documents available in this category.</div>
      )}
    </div>
  );
});

const DocumentUpload = ({ subDoc, anyOneDocs, handleFileChange, isFirst }) => {
  if (subDoc.is_required === 'Any one') {
    return <FormSelectDocUpload docs={anyOneDocs} onChange={handleFileChange} />
  } else if (subDoc.is_both === 1) {
    return <BothSidesDocUpload doc={subDoc} onChange={handleFileChange} />;
  } else {
    return <SingleDocUpload doc={subDoc} onChange={handleFileChange} />;
  }
};

export default DocumentTypeForm;
