import React from 'react';

const FormSelectDocUpload = ({ doc, onChange }) => {
  return (
    <div className="input-group">
      <select className="form-control" onChange={e => onChange(doc.id, e.target.value)}>
        <option value="">--Select Document--</option>
        {doc.docArray.map((option, index) => (
          <option key={index} value={option.id}>{option.name}</option>
        ))}
      </select>
      <input type="file" onChange={e => onChange(doc.id, e.target.files[0])} style={{ display: 'none' }} />
    </div>
  );
};

export default FormSelectDocUpload;
