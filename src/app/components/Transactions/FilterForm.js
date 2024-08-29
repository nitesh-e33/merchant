import { DateRangePicker, Stack } from 'rsuite';
import 'rsuite/dist/rsuite.min.css';
import startOfWeek from 'date-fns/startOfWeek';
import endOfWeek from 'date-fns/endOfWeek';
import addDays from 'date-fns/addDays';
import startOfMonth from 'date-fns/startOfMonth';
import endOfMonth from 'date-fns/endOfMonth';
import addMonths from 'date-fns/addMonths';
import subWeeks from 'date-fns/subWeeks';
import { useState } from 'react';

const predefinedRanges = [
  {
    label: 'Today',
    value: [new Date(), new Date()],
    placement: 'left',
    dto: 'today'
  },
  {
    label: 'Yesterday',
    value: [addDays(new Date(), -1), addDays(new Date(), -1)],
    placement: 'left',
    dto: 'yesterday'
  },
  {
    label: 'This week',
    value: [startOfWeek(new Date()), endOfWeek(new Date())],
    placement: 'left',
    dto: 'this_week'
  },
  {
    label: 'Last week',
    value: [startOfWeek(subWeeks(new Date(), 1)), endOfWeek(subWeeks(new Date(), 1))],
    placement: 'left',
    dto: 'last_week'
  },
  {
    label: 'This month',
    value: [startOfMonth(new Date()), new Date()],
    placement: 'left',
    dto: 'this_month'
  },
  {
    label: 'Last month',
    value: [startOfMonth(addMonths(new Date(), -1)), endOfMonth(addMonths(new Date(), -1))],
    placement: 'left',
    dto: 'last_month'
  },
  {
    label: 'Lifetime',
    value: [new Date(new Date().getFullYear() - 1, 0, 1), new Date()],
    placement: 'left',
    dto: 'lifetime'
  },
  {
    label: 'Custom Range',
    closeOverlay: false,
    appearance: 'default',
    custom: true
  }
];

function FilterForm({ paymentStatus, setPaymentStatus, paymentMode, setPaymentMode, onDateRangeChange }) {
  const [customRange, setCustomRange] = useState([null, null]);

  const handleShortcutClick = (shortcut) => {
    if (shortcut.custom) {
      onDateRangeChange('custom_range', customRange);
    } else {
      onDateRangeChange(shortcut.dto, shortcut.value);
    }
  };

  const handleCustomRangeChange = (value) => {
    setCustomRange(value);
    onDateRangeChange('custom_range', value);
  };

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
          <Stack direction="column" spacing={8} alignItems="flex-start">
            <DateRangePicker
              ranges={predefinedRanges}
              showOneCalendar
              placeholder="Select Date Range"
              style={{ width: 300 }}
              onShortcutClick={handleShortcutClick}
              onChange={handleCustomRangeChange}
            />
          </Stack>
        </div>
      </div>
    </form>
  );
}

export default FilterForm;
