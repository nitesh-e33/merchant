import { useEffect } from 'react';
import $ from 'jquery';
import moment from 'moment';
import 'daterangepicker/daterangepicker.css';
import 'daterangepicker';

const DashboardHeader = ({ inputs, setInputs }) => {
  useEffect(() => {
    // Initialize date picker
    $('#start_date, #end_date').daterangepicker({
      singleDatePicker: true,
      showDropdowns: true,
      autoUpdateInput: false,
      alwaysShowCalendars: true,
      maxDate: moment(),
      locale: {
        format: 'YYYY-MM-DD',
      },
      opens: 'bottom',
    });

    // Handle start_date selection
    $('#start_date').on('apply.daterangepicker', function (ev, picker) {
      const selectedStartDate = picker.startDate.format('YYYY-MM-DD');
      setInputs((prev) => ({ ...prev, start_date: selectedStartDate }));
    });

    // Handle end_date selection
    $('#end_date').on('apply.daterangepicker', function (ev, picker) {
      const selectedEndDate = picker.startDate.format('YYYY-MM-DD');
      setInputs((prev) => ({ ...prev, end_date: selectedEndDate }));
    });
  }, [setInputs]);

  return (
    <div className="content-header">
      <div className="container-fluid">
        <div className="row mb-2">
          <div className="col-sm-12 col-md-4">
            <h1 className="text-xl mb-2">Dashboard</h1>
          </div>
          <div className="col-sm-12 col-md-8">
            <div className="dashboard-breadcrumb flex justify-between items-center">
              <div className="datepicker-el flex gap-4">
                <div className="form-group flex items-center bg-white border border-gray-300 rounded-lg p-2">
                  <input
                    type="text"
                    id="start_date"
                    name="start_date"
                    value={inputs.start_date}
                    placeholder="Start date"
                    readOnly
                    className="focus:outline-none"
                  />
                  <i className="far fa-calendar-alt ml-2"></i>
                </div>
                <div className="form-group flex items-center bg-white border border-gray-300 rounded-lg p-2">
                  <input
                    type="text"
                    id="end_date"
                    name="end_date"
                    value={inputs.end_date}
                    placeholder="End date"
                    readOnly
                    className="focus:outline-none"
                  />
                  <i className="far fa-calendar-alt ml-2"></i>
                </div>
              </div>

              {/* Breadcrumb */}
              <div className='row'>
                <ol className="breadcrumb float-sm-right">
                  <li className="breadcrumb-item">
                    <a href="#" className="text-blue-600">Home</a>
                  </li>
                  <li className="breadcrumb-item active" aria-current="page">
                    Dashboard
                  </li>
                </ol>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardHeader;
