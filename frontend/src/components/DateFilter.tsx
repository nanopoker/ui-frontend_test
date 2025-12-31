import { useState } from 'react';
import { format, startOfMonth, endOfMonth, startOfYear, endOfYear } from 'date-fns';

interface DateFilterProps {
  onFilterChange: (startDate: Date | null, endDate: Date | null) => void;
}

const DateFilter = ({ onFilterChange }: DateFilterProps) => {
  const [selectedMonth, setSelectedMonth] = useState<string>('');
  const [startDate, setStartDate] = useState<string>('');
  const [endDate, setEndDate] = useState<string>('');

  const handleMonthChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const monthValue = e.target.value;
    setSelectedMonth(monthValue);
    setStartDate('');
    setEndDate('');

    if (monthValue) {
      const [year, month] = monthValue.split('-').map(Number);
      const monthStart = startOfMonth(new Date(year, month - 1));
      const monthEnd = endOfMonth(new Date(year, month - 1));
      onFilterChange(monthStart, monthEnd);
    } else {
      onFilterChange(null, null);
    }
  };

  const handleDateRangeChange = () => {
    if (startDate && endDate) {
      onFilterChange(new Date(startDate), new Date(endDate));
    } else {
      onFilterChange(null, null);
    }
  };

  const handleClear = () => {
    setSelectedMonth('');
    setStartDate('');
    setEndDate('');
    onFilterChange(null, null);
  };

  // Generate month options for the next 12 months
  const monthOptions = [];
  const currentDate = new Date();
  for (let i = -6; i <= 6; i++) {
    const date = new Date(currentDate.getFullYear(), currentDate.getMonth() + i, 1);
    const value = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
    const label = format(date, 'MMMM yyyy');
    monthOptions.push({ value, label });
  }

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-4 shadow-sm animate-fade-in">
      <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Filters</h3>
      
      <div className="space-y-4">
        <div>
          <label htmlFor="month" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Filter by Month
          </label>
          <select
            id="month"
            value={selectedMonth}
            onChange={handleMonthChange}
            className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none transition-all duration-200"
          >
            <option value="">All Months</option>
            {monthOptions.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </div>

        <div className="border-t border-gray-200 dark:border-gray-700 pt-4">
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Filter by Date Range
          </label>
          <div className="grid grid-cols-2 gap-2">
            <div>
              <label htmlFor="startDate" className="block text-xs text-gray-500 dark:text-gray-400 mb-1">
                Start Date
              </label>
              <input
                id="startDate"
                type="date"
                value={startDate}
                onChange={(e) => {
                  setStartDate(e.target.value);
                  setSelectedMonth('');
                  if (e.target.value && endDate) {
                    setTimeout(handleDateRangeChange, 0);
                  }
                }}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none text-sm transition-all duration-200"
              />
            </div>
            <div>
              <label htmlFor="endDate" className="block text-xs text-gray-500 dark:text-gray-400 mb-1">
                End Date
              </label>
              <input
                id="endDate"
                type="date"
                value={endDate}
                onChange={(e) => {
                  setEndDate(e.target.value);
                  setSelectedMonth('');
                  if (startDate && e.target.value) {
                    setTimeout(handleDateRangeChange, 0);
                  }
                }}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none text-sm transition-all duration-200"
              />
            </div>
          </div>
        </div>

        <button
          onClick={handleClear}
          className="w-full text-sm text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white py-2 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-all duration-200"
        >
          Clear Filters
        </button>
      </div>
    </div>
  );
};

export default DateFilter;

