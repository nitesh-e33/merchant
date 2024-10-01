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
                entity_type_id={kycRequiredDocsList.id}
                company_id={companyId}
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

// Memoized Component: DocumentCategory
const DocumentCategory = memo(({ index, doc, entity_type_id, company_id, anyOneDocs, handleFileChange, isFirstCategory }) => {
  const normalizedDocArray = Array.isArray(doc.doc_array)
    ? doc.doc_array
    : [doc.doc_array];

  let firstAnyOneFound = false; // Flag to identify the first "Any one" document

  return (
    <div className="form-group">
      <h5>{index + 1}. {doc.name}:</h5>
      {normalizedDocArray.length > 0 ? (
        normalizedDocArray.map((subDoc, idx) => {
          const isFirst = !firstAnyOneFound && subDoc.is_required === 'Any one';

          if (isFirst) {
            firstAnyOneFound = true; // Set the flag once the first "Any one" doc is found
          }

          return (
            <DocumentUpload
              key={idx}
              subDoc={subDoc}
              entity_type_id={entity_type_id}
              company_id={company_id}
              kyc_doc_id={doc.id}
              anyOneDocs={anyOneDocs}
              handleFileChange={handleFileChange}
              isFirst={isFirst}
            />
          );
        })
      ) : (
        <div>No documents available in this category.</div>
      )}
    </div>
  );
});

// Assign displayName to DocumentCategory
DocumentCategory.displayName = 'DocumentCategory';

// Component: DocumentUpload
const DocumentUpload = ({ subDoc, entity_type_id, company_id, kyc_doc_id, anyOneDocs, handleFileChange, isFirst }) => {
  if (isFirst && subDoc.is_required === 'Any one') {
    return (
      <FormSelectDocUpload
        docs={anyOneDocs}
        entity_type_id={entity_type_id}
        company_id={company_id}
        kyc_doc_id={kyc_doc_id}
        onChange={handleFileChange}
      />
    );
  } else if (subDoc.is_both === 1) {
    return (
      <BothSidesDocUpload
        doc={subDoc}
        entity_type_id={entity_type_id}
        company_id={company_id}
        kyc_doc_id={kyc_doc_id}
        onChange={handleFileChange}
      />
    );
  } else if (subDoc.is_required !== 'Any one') {
    return (
      <SingleDocUpload
        doc={subDoc}
        entity_type_id={entity_type_id}
        company_id={company_id}
        kyc_doc_id={kyc_doc_id}
        onChange={handleFileChange}
      />
    );
  } else {
    return null; // Return null if none of the conditions match
  }
};

// (Optional) Assign displayName to DocumentUpload if needed
// DocumentUpload.displayName = 'DocumentUpload';

export default DocumentTypeForm;
