import React from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { MONTH_NAMES } from './dateUtils';

interface CalendarHeaderProps {
  currentMonth: number;
  currentYear: number;
  onMonthChange: (month: number) => void;
  onYearChange: (year: number) => void;
  onPrevMonth: () => void;
  onNextMonth: () => void;
}

const CalendarHeader: React.FC<CalendarHeaderProps> = ({
  currentMonth,
  currentYear,
  onMonthChange,
  onYearChange,
  onPrevMonth,
  onNextMonth,
}) => {
  const years = Array.from({ length: 41 }, (_, i) => currentYear - 20 + i);

  return (
    <div className="mb-4">
      <div className="flex items-center justify-between mb-2">
        <button
          onClick={onPrevMonth}
          className="p-1 hover:bg-gray-100 rounded-full transition-colors"
          aria-label="Previous month"
        >
          <ChevronLeft className="w-5 h-5" />
        </button>
        <button
          onClick={onNextMonth}
          className="p-1 hover:bg-gray-100 rounded-full transition-colors"
          aria-label="Next month"
        >
          <ChevronRight className="w-5 h-5" />
        </button>
      </div>
      
      <div className="flex gap-2">
        <select
          value={currentMonth}
          onChange={(e) => onMonthChange(Number(e.target.value))}
          className="flex-1 px-2 py-1 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        >
          {MONTH_NAMES.map((month, index) => (
            <option key={month} value={index}>
              {month}
            </option>
          ))}
        </select>
        
        <select
          value={currentYear}
          onChange={(e) => onYearChange(Number(e.target.value))}
          className="flex-1 px-2 py-1 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        >
          {years.map((year) => (
            <option key={year} value={year}>
              {year}
            </option>
          ))}
        </select>
      </div>
    </div>
  );
};

export default CalendarHeader;