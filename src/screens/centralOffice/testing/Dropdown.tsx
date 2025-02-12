import { memo } from "react";

const SelectDropdown = memo(({ 
    options, 
    value, 
    onChange, 
    id, 
    placeholder 
  }: { 
    options: string[];
    value?: string;
    onChange?: (e: React.ChangeEvent<HTMLSelectElement>) => void;
    id: string;
    placeholder?: string; // New prop for the placeholder
  }) => (
    <div className="flex flex-col space-y-2 md:mr-2 mr-5 w-full">
      <div className="relative">
        {/* Select Dropdown Container */}
        <select
          id={id}
          className=" text-sm pointer-events-auto w-full p-2 pl-4 pr-10 rounded-sm border border-gray-300 cursor-pointer shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 appearance-none"
          value={value}
          onChange={onChange}
        >
          {/* Placeholder option */}
          {placeholder && (
            <option value="" className=" cursor-pointer" disabled hidden>
              {placeholder}
            </option>
          )}
          {/* Render options */}
          {options.map((option, index) => (
            <option className="border cursor-pointer p-2 text-sm hover:bg-gray-100" key={index} value={option}>
              {id === 'monthDropdown' ? `${option}` : option}
            </option>
          ))}
        </select>

        {/* Custom Chevron (for appearance) */}
        <div className="absolute right-3 top-1/2 transform -translate-y-1/2 pointer-events-none">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-gray-600" viewBox="0 0 24 24" fill="none" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
          </svg>
        </div>
      </div>
    </div>
  )
);

export default SelectDropdown;
