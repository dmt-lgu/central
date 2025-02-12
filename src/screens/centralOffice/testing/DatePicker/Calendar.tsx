import React from 'react';
import { getDaysInMonth, getFirstDayOfMonth, DAYS_OF_WEEK, MONTH_NAMES } from './dateUtils';
import CalendarHeader from './CalendarHeader';

interface CalendarProps {
  selectedDate: Date;
  onDateSelect: (date: Date) => void;
  onClose: () => void;
}

const formatDate = (input: string | Date): string => {
  const date = new Date(input);
  if (isNaN(date.getTime())) {
    return "Invalid Date";
  }
  return date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
};


const Calendar: React.FC<CalendarProps> = ({ selectedDate, onDateSelect }) => {
  const [currentMonth, setCurrentMonth] = React.useState(selectedDate.getMonth());
  const [currentYear, setCurrentYear] = React.useState(selectedDate.getFullYear());

  const goToPreviousMonth = () => {
    if (currentMonth === 0) {
      setCurrentMonth(11);
      setCurrentYear(currentYear - 1);
    } else {
      setCurrentMonth(currentMonth - 1);
    }
  };

  const goToNextMonth = () => {
    if (currentMonth === 11) {
      setCurrentMonth(0);
      setCurrentYear(currentYear + 1);
    } else {
      setCurrentMonth(currentMonth + 1);
    }
  };

  const handleMonthChange = (month: number) => {
    setCurrentMonth(month);
  };

  const handleYearChange = (year: number) => {
    setCurrentYear(year);
  };

  const handleDateClick = (day: number) => {
    const newDate = new Date(currentYear, currentMonth, day);
    onDateSelect(newDate);
  
  };

  const daysInMonth = getDaysInMonth(currentYear, currentMonth);
  const firstDayOfMonth = getFirstDayOfMonth(currentYear, currentMonth);
  const days = Array.from({ length: daysInMonth }, (_, i) => i + 1);
  const blanks = Array.from({ length: firstDayOfMonth }, (_, i) => i);

  const isCurrentDate = (day: number) => {
    const today = new Date();
    return (
      day === selectedDate.getDate() &&
      currentMonth === selectedDate.getMonth() &&
      currentYear === selectedDate.getFullYear()
    );
  };


  return (
    <div className="absolute mt-1 p-4 bg-white rounded-lg shadow-lg border border-gray-200 z-50 min-w-[320px]">

      
      <CalendarHeader
        currentMonth={currentMonth}
        currentYear={currentYear}
        onMonthChange={handleMonthChange}
        onYearChange={handleYearChange}
        onPrevMonth={goToPreviousMonth}
        onNextMonth={goToNextMonth}
      />
      <h1 className=' text-[#2563eb] text-center mb-2'>{formatDate(selectedDate)}</h1>

      <div className="grid grid-cols-7 gap-2 mb-2">
        {DAYS_OF_WEEK.map((day) => (
          <div key={day} className="text-gray-600 text-sm font-medium text-center">
            {day}
          </div>
        ))}
      </div>

      <div className="grid grid-cols-7 gap-2">
        {blanks.map((blank) => (
          <div key={`blank-${blank}`} className="h-8" />
        ))}
        {days.map((day) => (
          <div
            key={day}
            onClick={() => handleDateClick(day)}
            className={`h-8 flex items-center justify-center text-sm rounded-full cursor-pointer transition-colors
              ${
                isCurrentDate(day)
                  ? 'bg-blue-600 text-white hover:bg-blue-700'
                  : 'text-gray-700 hover:bg-gray-100'
              }`}
          >
            {day}
          </div>
        ))}
      </div>
    </div>
  );
};

export default Calendar;