import React from 'react';
import { Calendar as CalendarIcon, ChevronDown } from 'lucide-react';

interface DateInputProps {
  value: Date;
  onClick: () => void;
  inputRef: React.RefObject<HTMLDivElement>;
}

const DateInput: React.FC<DateInputProps> = ({ value, onClick, inputRef }) => {
  return (
    <div
      ref={inputRef}
      onClick={onClick}
      className="inline-flex items-center justify-between px-4 py-2 bg-white border border-gray-300 rounded-lg cursor-pointer hover:border-blue-500 w-full focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
    >
      <span className="text-gray-700">
        {value.toLocaleDateString('en-US', {
          month: 'long',
          day: 'numeric',
          year: 'numeric',
        })}
      </span>
      <ChevronDown className="w-5 h-5 ml-2 text-gray-500" />
    </div>
  );
}

export default DateInput;