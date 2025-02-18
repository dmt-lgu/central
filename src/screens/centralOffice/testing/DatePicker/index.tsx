import React, { useState, useEffect, useRef } from 'react';
import Select from 'react-select';
import { useDispatch, useSelector} from 'react-redux';
import { selectDate } from '@/redux/dateSlice';
import { setDate } from '@/redux/dateSlice';

interface DatePickerProps {
  onDateChange: (dates: string[]) => void;
}

// Add these custom styles for the floating effect and scrollable year selection
const customStyles = {
  control: (base: any) => ({
    ...base,
    borderColor: '#e2e8f0',
    '&:hover': { borderColor: '#cbd5e1' }
  }),
  menu: (base: any) => ({
    ...base,
    maxHeight: '150px',
    overflowY: 'auto',
    scrollbarWidth: 'thin',
    '&::-webkit-scrollbar': {
      width: '6px',
      height: '6px',
    },
    '&::-webkit-scrollbar-thumb': {
      backgroundColor: '#cbd5e1',
      borderRadius: '3px',
    }
  })
};

const DatePicker: React.FC<DatePickerProps> = ({ onDateChange }) => {
  const date = useSelector(selectDate);
  const dispatch = useDispatch();

  // Enhanced parseDefaultDate to handle all cases
  const parseDefaultDate = () => {
    if (!date || !date.length) return { 
      year: 2024, 
      month: 0, 
      isRange: false, 
      quarters: [] 
    };

    // Clean the date strings (remove escaped quotes if present)
    const cleanDates = date.map(d => d.replace(/\\/g, ''));

    // Handle quarterly selection (6 months)
    if (cleanDates.length === 6) {
      const [year] = cleanDates[0].split('-').map(Number);
      return {
        year,
        month: 0,
        isRange: false,
        quarters: [1, 2] // Q1 and Q2
      };
    }

    // Handle range selection
    if (cleanDates.length > 1) {
      const [startYear, startMonth] = cleanDates[0].split('-').map(Number);
      const [, endMonth] = cleanDates[cleanDates.length - 1].split('-').map(Number);
      return {
        year: startYear,
        month: startMonth - 1,
        isRange: true,
        rangeStart: startMonth - 1,
        rangeEnd: endMonth - 1,
        quarters: []
      };
    }

    // Handle single month
    const [year, month] = cleanDates[0].split('-').map(Number);
    return {
      year: year || 2024,
      month: (month || 1) - 1,
      isRange: false,
      quarters: []
    };
  };

  const defaultDate = parseDefaultDate();

  // Update initial states with parsed values
  const [selectedYear, setSelectedYear] = useState<number>(defaultDate.year);
  const [selectedPeriod, setSelectedPeriod] = useState<string>(defaultDate.quarters.length > 0 ? 'quarter' : 'month');
  const [selectedMonth, setSelectedMonth] = useState<number>(defaultDate.month);
  const [selectedQuarters, setSelectedQuarters] = useState<number[]>(defaultDate.quarters);
  const [isRangeSelection, setIsRangeSelection] = useState<boolean>(defaultDate.isRange || false);
  const [rangeStart, setRangeStart] = useState<number>(defaultDate.rangeStart || defaultDate.month);
  const [rangeEnd, setRangeEnd] = useState<number>(defaultDate.rangeEnd || defaultDate.month);






  // Modify the years array to include more years
  const years = Array.from(
    { length: 20 }, 
    (_, i) => new Date().getFullYear() - 10 + i
  );
  
  const months = [
    { value: 0, label: 'January' }, { value: 1, label: 'February' },
    { value: 2, label: 'March' }, { value: 3, label: 'April' },
    { value: 4, label: 'May' }, { value: 5, label: 'June' },
    { value: 6, label: 'July' }, { value: 7, label: 'August' },
    { value: 8, label: 'September' }, { value: 9, label: 'October' },
    { value: 10, label: 'November' }, { value: 11, label: 'December' }
  ];

  const quarters = [
    { value: 1, label: 'Q1', description: 'Jan-Mar', months: [0, 1, 2] },
    { value: 2, label: 'Q2', description: 'Apr-Jun', months: [3, 4, 5] },
    { value: 3, label: 'Q3', description: 'Jul-Sep', months: [6, 7, 8] },
    { value: 4, label: 'Q4', description: 'Oct-Dec', months: [9, 10, 11] }
  ];

  const formatDate = (year: number, month: number): string => {
    return `${year}-${String(month + 1).padStart(2, '0')}`;
  };

  // Replace the existing useEffect with this updated version
  useEffect(() => {
    if (selectedPeriod === 'month') {
      if (isRangeSelection) {
        const start = Math.min(rangeStart, rangeEnd);
        const end = Math.max(rangeStart, rangeEnd);
        // Generate array of all months in the range
        const dates = Array.from(
          { length: end - start + 1 },
          (_, i) => formatDate(selectedYear, start + i)
        );
        dispatch(setDate(dates));
        
      } else {
        const date = [formatDate(selectedYear, selectedMonth)];
    
        dispatch(setDate(date));
      }
    } else {
      const allSelectedMonths = selectedQuarters.flatMap(q => 
        quarters.find(quarter => quarter.value === q)?.months || []
      );
      const dates = allSelectedMonths.map(month => formatDate(selectedYear, month));
      dispatch(setDate(dates));
   
    }
  }, [selectedYear, selectedMonth, selectedQuarters, rangeStart, rangeEnd, isRangeSelection, selectedPeriod]);

  return (
    <div className="relative inline-block">
      <div className=" flex  gap-3 justify-center z-50 bg-white rounded-lg shadow-lg p-2 w-fit border border-gray-200 transform transition-all duration-200 ease-in-out hover:shadow-xl">
        <div className="flex gap-3 items-center ">
          <Select
            className="w-32"
            classNamePrefix="select"
            options={[
              { value: 'month', label: 'Monthly' },
              { value: 'quarter', label: 'Quarterly' }
            ]}
            value={{ value: selectedPeriod, label: selectedPeriod === 'month' ? 'Monthly' : 'Quarterly' }}
            onChange={(option: any) => {
              setSelectedPeriod(option.value);
              setSelectedQuarters([]);
              setIsRangeSelection(false);
            }}
            styles={customStyles}
          />

          <Select
            className="w-28"
            classNamePrefix="select"
            options={years.map(year => ({ value: year, label: year }))}
            value={{ value: selectedYear, label: selectedYear }}
            onChange={(option: any) => setSelectedYear(option.value)}
            styles={customStyles}
            isSearchable={false}
            maxMenuHeight={150}
          />
        </div>

        {selectedPeriod === 'month' && (
          <div className=" flex gap-4 self-center">
            <label className="flex items-center justify-center gap-2 text-sm text-gray-600 ">
              <input
                type="checkbox"
                checked={isRangeSelection}
                onChange={(e) => setIsRangeSelection(e.target.checked)}
                className="rounded border-gray-300 text-blue-600 focus:ring-blue-500 cursor-pointer"
              />
              <span> Range</span>
            </label>

            <div className="flex gap-2 items-center">
              {isRangeSelection ? (
                <>
                  <Select
                    className="w-36"
                    classNamePrefix="select"
                    options={months}
                    value={months.find(m => m.value === rangeStart)}
                    onChange={(option: any) => setRangeStart(option.value)}
                    placeholder="Start Month"
                  />
                  <span className="text-gray-400">to</span>
                  <Select
                    className="w-36"
                    classNamePrefix="select"
                    options={months}
                    value={months.find(m => m.value === rangeEnd)}
                    onChange={(option: any) => setRangeEnd(option.value)}
                    placeholder="End Month"
                  />
                </>
              ) : (
                <Select
                  className="w-36"
                  classNamePrefix="select"
                  options={months}
                  value={months.find(m => m.value === selectedMonth)}
                  onChange={(option: any) => setSelectedMonth(option.value)}
                  placeholder="Select Month"
                />
              )}
            </div>
          </div>
        )}

        {selectedPeriod === 'quarter' && (
          <div className="flex gap-3 h-full">
            {quarters.map((quarter) => (
              <label
                key={quarter.value}
                className={`
                  flex items-center gap-2 p-2 rounded border cursor-pointer
                  ${selectedQuarters.includes(quarter.value)
                    ? 'border-blue-500 bg-blue-50'
                    : 'border-gray-200 hover:bg-gray-50'}
                `}
              >
                <input
                  type="checkbox"
                  checked={selectedQuarters.includes(quarter.value)}
                  onChange={() => {
                    setSelectedQuarters(prev =>
                      prev.includes(quarter.value)
                        ? prev.filter(q => q !== quarter.value)
                        : [...prev, quarter.value]
                    );
                  }}
                  className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                />
                <div className=' flex gap-2 items-center'>
                  <div className="font-medium">{quarter.label}</div>
                  <div className="text-xs text-gray-500">{quarter.description}</div>
                </div>
              </label>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default DatePicker;