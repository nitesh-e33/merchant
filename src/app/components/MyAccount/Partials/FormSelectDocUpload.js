import React, { useState, useEffect } from 'react';

const FormSelectDocUpload = ({ docs, onChange }) => {
  const docsArray = Array.isArray(docs) ? docs : [docs];
  const [selectedDoc, setSelectedDoc] = useState('');
  const [file, setFile] = useState(null);

  const handleSelectChange = (e) => {
    setSelectedDoc(e.target.value);
    onChange('document_id', e.target.value);
  };

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    setFile(selectedFile);
    onChange('document_image_front', selectedFile);
  };

  return (
    <div className="input-group">
      <select
        className="form-control"
        onChange={handleSelectChange}
        value={selectedDoc}
      >
        <option value="">--Select Document--</option>
        {docsArray.map((option) => (
          <option key={option.id} value={option.id}>
            {option.name}
          </option>
        ))}
      </select>
      <div className="selectDocError" style={{ color: 'red' }}></div>

      {selectedDoc && (
        <div className="file-upload">
          <input
            type="file"
            name="document_image_front"
            className="uploadDoc"
            onChange={handleFileChange}
          />
          {file && <span>{file.name}</span>}
        </div>
      )}
    </div>
  );
};

export default FormSelectDocUpload;
