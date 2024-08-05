import React from 'react';

const BothSidesDocUpload = ({ doc, onChange }) => {
  return (
    <div>
      <label>{doc.name} Front</label>
      <input type="file" className="form-control" onChange={e => onChange(doc.id, 'front', e.target.files[0])} />
      <label>{doc.name} Back</label>
      <input type="file" className="form-control" onChange={e => onChange(doc.id, 'back', e.target.files[0])} />
    </div>
  );
};

export default BothSidesDocUpload;
