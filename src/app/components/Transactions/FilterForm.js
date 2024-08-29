import DateRangePickerComponent from '../DateRangePickerComponent';

function FilterForm({ paymentStatus, setPaymentStatus, paymentMode, setPaymentMode, onDateRangeChange }) {
  return (
    <form id="data-range-form" onSubmit={(e) => e.preventDefault()} className="col-md-12">
      <div className="row align-items-center">
        <div className="col-3">
          <div className="form-group">
            <label htmlFor="paymentStatus">Payment Status:</label>
            <select
              className="form-control select2"
              name="paymentStatus"
              value={paymentStatus}
              onChange={(e) => setPaymentStatus(e.target.value)}
            >
              <option value="">Status: All</option>
              <option value="pending">Pending</option>
              <option value="success">Success</option>
              <option value="failed">Failed</option>
              <option value="usercancel">User Cancel</option>
            </select>
          </div>
        </div>
        <div className="col-3">
          <div className="form-group">
            <label htmlFor="paymentMode">Payment Mode:</label>
            <select
              className="form-control select2"
              name="paymentMode"
              value={paymentMode}
              onChange={(e) => setPaymentMode(e.target.value)}
            >
              <option value="">Payment Method: All</option>
              <option value="CC">CC</option>
              <option value="DC">DC</option>
              <option value="NB">NB</option>
              <option value="MW">MW</option>
              <option value="UPI">UPI</option>
              <option value="OM">OM</option>
              <option value="EMI">EMI</option>
              <option value="CBT">CBT</option>
              <option value="BT">BT</option>
            </select>
          </div>
        </div>

        <div className="col-3">
          <DateRangePickerComponent
            onShortcutClick={onDateRangeChange}
            onChange={onDateRangeChange}
          />
        </div>
      </div>
    </form>
  );
}

export default FilterForm;
