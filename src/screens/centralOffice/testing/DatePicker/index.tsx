import React, { useRef } from 'react';
import DateInput from './DateInput';
import Calendar from './Calendar';
import { useClickOutside } from './useClickOutside';

interface DatePickerProps {
  value: Date;
  onChange: (date: Date) => void;
}

const DatePicker: React.FC<DatePickerProps> = ({ value, onChange }) => {
  const [isOpen, setIsOpen] = React.useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLDivElement>(null);

  useClickOutside(containerRef, () => setIsOpen(false));

  const handleDateSelect = (date: Date) => {
    onChange(date);
 
  };



  return (
    <div className="relative" ref={containerRef}>
      
      
      <DateInput
        value={value}
        onClick={() => setIsOpen(!isOpen)}
        inputRef={inputRef}
      />
      {isOpen && (
        <Calendar
          selectedDate={value}
          onDateSelect={handleDateSelect}
          onClose={() => setIsOpen(false)}
        />
      )}
      
    </div>
  );
};

export default DatePicker;