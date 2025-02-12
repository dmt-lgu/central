import React from 'react';
import { Listbox } from '@headlessui/react';

interface FiltersProps {
  selectedMonth: string;
  selectedYear: string;
  selectedRegion: string;
  onMonthChange: (month: string) => void;
  onYearChange: (year: string) => void;
  onRegionChange: (region: string) => void;
}

export const Filters: React.FC<FiltersProps> = ({
  selectedMonth,
  selectedYear,
  selectedRegion,
  onMonthChange,
  onYearChange,
  onRegionChange,
}) => {
  const months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
  const years = ['2024', '2023', '2022', '2021'];
  const regions = ['Region I', 'Region II', 'Region III', 'Region IV', 'Region V', 'NCR', 'CAR'];

  return (
    <div className="flex flex-wrap gap-4 p-4 bg-gray-100 rounded-lg">
      <div className="w-full md:w-auto">
        <Listbox value={selectedMonth} onChange={onMonthChange}>
          <div className="relative">
            <Listbox.Button className="w-full bg-white py-2 px-4 rounded border">
              {selectedMonth || 'Select Month'}
            </Listbox.Button>
            <Listbox.Options className="absolute z-10 w-full bg-white border rounded mt-1">
              {months.map((month) => (
                <Listbox.Option
                  key={month}
                  value={month}
                  className={({ active }) =>
                    `${active ? 'bg-blue-100' : ''} cursor-pointer p-2`
                  }
                >
                  {month}
                </Listbox.Option>
              ))}
            </Listbox.Options>
          </div>
        </Listbox>
      </div>

      <div className="w-full md:w-auto">
        <Listbox value={selectedYear} onChange={onYearChange}>
          <div className="relative">
            <Listbox.Button className="w-full bg-white py-2 px-4 rounded border">
              {selectedYear || 'Select Year'}
            </Listbox.Button>
            <Listbox.Options className="absolute z-10 w-full bg-white border rounded mt-1">
              {years.map((year) => (
                <Listbox.Option
                  key={year}
                  value={year}
                  className={({ active }) =>
                    `${active ? 'bg-blue-100' : ''} cursor-pointer p-2`
                  }
                >
                  {year}
                </Listbox.Option>
              ))}
            </Listbox.Options>
          </div>
        </Listbox>
      </div>

      <div className="w-full md:w-auto">
        <Listbox value={selectedRegion} onChange={onRegionChange}>
          <div className="relative">
            <Listbox.Button className="w-full bg-white py-2 px-4 rounded border">
              {selectedRegion || 'Select Region'}
            </Listbox.Button>
            <Listbox.Options className="absolute z-10 w-full bg-white border rounded mt-1">
              {regions.map((region) => (
                <Listbox.Option
                  key={region}
                  value={region}
                  className={({ active }:any) =>
                    `${active ? 'bg-blue-100' : ''} cursor-pointer p-2`
                  }
                >
                  {region}
                </Listbox.Option>
              ))}
            </Listbox.Options>
          </div>
        </Listbox>
      </div>
    </div>
  );
};