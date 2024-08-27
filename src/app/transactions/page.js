'use client'
import React, { useEffect } from 'react';
import $ from 'jquery';

function Page() {
  useEffect(() => {
    $(document).ready(function () {
      $('#example').DataTable();
    });
  }, []);

  return (
    <>
      <div>
        <br />
      </div>
      <div className='card'>
        <div className="card-header">
          <h3 className="card-title">Transaction List</h3>
        </div>
        <div className="card-body transaction-table">
          <table id="example" className="table table-bordered table-striped">
            <thead>
              <tr>
                <th>Name</th>
                <th>Position</th>
                <th>Office</th>
                <th>Age</th>
                <th>Start date</th>
                <th>Salary</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>Tiger Nixon</td>
                <td>System Architect</td>
                <td>Edinburgh</td>
                <td>61</td>
                <td>2011/04/25</td>
                <td>$320,800</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </>
  );
}

export default Page;
