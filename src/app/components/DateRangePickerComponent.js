import { forwardRef, useImperativeHandle, useState, useEffect } from 'react';
import { DateRangePicker, Stack } from 'rsuite';
import startOfWeek from 'date-fns/startOfWeek';
import endOfWeek from 'date-fns/endOfWeek';
import addDays from 'date-fns/addDays';
import startOfMonth from 'date-fns/startOfMonth';
import endOfMonth from 'date-fns/endOfMonth';
import addMonths from 'date-fns/addMonths';
import subWeeks from 'date-fns/subWeeks';

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

const DateRangePickerComponent = forwardRef(({ onShortcutClick, onChange }, ref) => {
  const [customRange, setCustomRange] = useState([startOfMonth(new Date()), new Date()]); // Default to 'This month'
  const [selectedLabel, setSelectedLabel] = useState('This month');

  useEffect(() => {
    onShortcutClick('this_month', customRange);
  }, [onShortcutClick, customRange]);

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

  const handleReset = () => {
    const thisMonthRange = [startOfMonth(new Date()), new Date()];
    setCustomRange(thisMonthRange);
    setSelectedLabel('This month');
    onShortcutClick('this_month', thisMonthRange);
  };

  useImperativeHandle(ref, () => ({
    reset: handleReset
  }));

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
        value={customRange}
      />
    </Stack>
  );
});

// Set the display name
DateRangePickerComponent.displayName = 'DateRangePickerComponent';

export default DateRangePickerComponent;
