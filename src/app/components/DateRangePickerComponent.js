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
    value: [new Date(new Date().getFullYear() - 10, 0, 1), new Date()],
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

function DateRangePickerComponent({ onShortcutClick, onChange }) {
  const [customRange, setCustomRange] = useState([null, null]);
  const [selectedLabel, setSelectedLabel] = useState('Select Date Range');

  const handleShortcutClick = (shortcut) => {
    if (shortcut.custom) {
      onShortcutClick('custom_range', customRange);
      setSelectedLabel('Custom Range');
    } else {
      onShortcutClick(shortcut.dto, shortcut.value);
      setSelectedLabel(shortcut.label);
    }
  };

  const handleCustomRangeChange = (value) => {
    setCustomRange(value);
    onChange('custom_range', value);
    setSelectedLabel('Custom Range');
  };

  const renderSelectedValue = () => {
    return selectedLabel;
  };

  return (
    <Stack direction="column" spacing={8} alignItems="flex-start">
      <DateRangePicker
        ranges={predefinedRanges}
        showOneCalendar
        placeholder="Select Date Range"
        className="w-full sm:w-52 mt-2"
        onShortcutClick={handleShortcutClick}
        onChange={handleCustomRangeChange}
        renderValue={renderSelectedValue}
      />
    </Stack>
  );
}

export default DateRangePickerComponent;
