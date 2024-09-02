import React from 'react';

function PaymentTable({ tableRef, title }) {
  return (
    <div className='card'>
      <div className="card-header">
        <h3 className="card-title">{title}</h3>
      </div>
      <div className="card-body">
        <table id="example" ref={tableRef} className="table table-bordered table-striped">
          <thead>
            {/* DataTable will render the title */}
          </thead>
          <tbody>
            {/* DataTable will render the body */}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default PaymentTable;
