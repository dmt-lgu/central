import React, { useState, useEffect } from 'react';
import { useDispatch} from 'react-redux';
import { setDate } from '@/redux/dateSlice';
import { Calendar } from 'lucide-react';

interface DatePickerProps {
  onDateChange: (dates: string[]) => void;
}

const months = [
  'January', 'February', 'March', 'April', 
  'May', 'June', 'July', 'August',
  'September', 'October', 'November', 'December'
];

const DatePicker: React.FC<DatePickerProps> = () => {
  const dispatch = useDispatch();
  const currentYear = new Date().getFullYear();
  const years = Array.from({ length: 20 }, (_, i) => currentYear - 10 + i);

  const [isOpen, setIsOpen] = useState(false);
  const [startDate, setStartDate] = useState({
    month: new Date().getMonth(),
    year: currentYear
  });
  
  const [endDate, setEndDate] = useState({
    month: new Date().getMonth(),
    year: currentYear
  });

  const [isRangeSelection, setIsRangeSelection] = useState(false);

  const formatDisplayDate = (date: { month: number; year: number }) => {
    return `${months[date.month]} ${date.year}`;
  };

  const formatDate = (year: number, month: number): string => {
    return `${year}-${String(month + 1).padStart(2, '0')}`;
  };

  useEffect(() => {
    if (isRangeSelection) {
      const dates: string[] = [];
      let currentDate = new Date(startDate.year, startDate.month);
      const endDateTime = new Date(endDate.year, endDate.month);

      while (currentDate <= endDateTime) {
        dates.push(formatDate(currentDate.getFullYear(), currentDate.getMonth()));
        currentDate.setMonth(currentDate.getMonth() + 1);
      }
      dispatch(setDate(dates));
    } else {
      dispatch(setDate([formatDate(startDate.year, startDate.month)]));
    }
  }, [startDate, endDate, isRangeSelection]);

  return (
    <div className="relative inline-block z-20 w-[300px]">
      <div 
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 p-2 border rounded-md cursor-pointer hover:bg-gray-50  border-border bg-white"
      >
        <Calendar className="h-4 w-4 text-gray-500" />
        <span className=" text-gray-700">
          {isRangeSelection 
            ? `${formatDisplayDate(startDate)} - ${formatDisplayDate(endDate)}`
            : formatDisplayDate(startDate)
          }
        </span>
      </div>

      {isOpen && (
        <div className="absolute  mt-2 p-4 bg-white rounded-lg shadow-lg border border-gray-200 ">
          <div className="mb-4">
            <label className="flex items-center gap-2 text-sm text-gray-600">
              <input
                type="checkbox"
                checked={isRangeSelection}
                onChange={(e) => setIsRangeSelection(e.target.checked)}
                className="rounded border-gray-300 text-blue-600 focus:ring-blue-500 cursor-pointer"
              />
              <span>Date Range</span>
            </label>
          </div>

          <div className="flex flex-col gap-4">
            <div className="space-y-2">
              <p className="text-sm font-medium text-gray-700">
                {isRangeSelection ? 'Start Date' : 'Select Date'}
              </p>
              <div className="grid grid-cols-3 gap-2">
                <select
                  value={startDate.month}
                  onChange={(e) => setStartDate(prev => ({ ...prev, month: Number(e.target.value) }))}
                  className="col-span-2 p-2 border rounded-md text-sm bg-white"
                >
                  {months.map((month, index) => (
                    <option key={month} value={index}>{month}</option>
                  ))}
                </select>
                <select
                  value={startDate.year}
                  onChange={(e) => setStartDate(prev => ({ ...prev, year: Number(e.target.value) }))}
                  className="p-2 border rounded-md text-sm bg-white"
                >
                  {years.map(year => (
                    <option key={year} value={year}>{year}</option>
                  ))}
                </select>
              </div>
            </div>

            {isRangeSelection && (
              <div className="space-y-2">
                <p className="text-sm font-medium text-gray-700">End Date</p>
                <div className="grid grid-cols-3 gap-2">
                  <select
                    value={endDate.month}
                    onChange={(e) => setEndDate(prev => ({ ...prev, month: Number(e.target.value) }))}
                    className="col-span-2 p-2 border rounded-md text-sm bg-white"
                  >
                    {months.map((month, index) => (
                      <option key={month} value={index}>{month}</option>
                    ))}
                  </select>
                  <select
                    value={endDate.year}
                    onChange={(e) => setEndDate(prev => ({ ...prev, year: Number(e.target.value) }))}
                    className="p-2 border rounded-md text-sm bg-white"
                  >
                    {years.map(year => (
                      <option key={year} value={year}>{year}</option>
                    ))}
                  </select>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default DatePicker;