import React from 'react';

const SingleDocUpload = ({ doc, onChange }) => {
  return (
    <div className="input-group">
      <label>{doc.name}</label>
      <input type="file" className="form-control" onChange={e => onChange(doc.id, e.target.files[0])} />
    </div>
  );
};

export default SingleDocUpload;
