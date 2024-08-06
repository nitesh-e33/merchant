import React from 'react';

const BothSidesDocUpload = ({ doc, onChange }) => {
  const docsArray = Array.isArray(doc) ? doc : [doc];
  return (
    <div>
      <label>{docsArray.name} Front</label>
      <input type="file" className="form-control" onChange={e => onChange(docsArray.id, 'front', e.target.files[0])} />
      <label>{docsArray.name} Back</label>
      <input type="file" className="form-control" onChange={e => onChange(docsArray.id, 'back', e.target.files[0])} />
    </div>
  );
};

export default BothSidesDocUpload;
