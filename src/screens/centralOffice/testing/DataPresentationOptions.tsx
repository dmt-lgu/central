import { ChevronDown, ChevronUp } from "lucide-react";
import { useEffect, useState } from "react";
import { useSelector, useDispatch } from 'react-redux';
import { setCharts, selectCharts } from './../../../redux/chartSlice';
import { AppDispatch } from './../../../redux/store';

const DataPresentationOptions = () => {
  const dispatch: AppDispatch = useDispatch();
  const charts = useSelector(selectCharts);
  const [isOpen, setIsOpen] = useState(true);

  // Set the initial state for presentation options from localStorage or Redux state
  const [presentationOptions, setPresentationOptions] = useState(() => {
    const storedCharts = localStorage.getItem('charts');
    if (storedCharts) {
      return JSON.parse(storedCharts);
    }
    // Fallback to the Redux state or default value
    return charts.length ? charts : [
      { "name": "Bar Graph", "state": true },
      { "name": "Line Graph", "state": true },
      { "name": "Pie Graph", "state": true }
    ];
  });

  useEffect(() => {
    // Sync with Redux whenever the options change
    dispatch(setCharts(presentationOptions.filter((option:any) => option.state).map(option => option.name)));

    // Save to localStorage whenever options change
    localStorage.setItem('charts', JSON.stringify(presentationOptions));
  }, [presentationOptions, dispatch]);

  const toggleDropdown = () => {
    setIsOpen(!isOpen);
  };

  const handleCheckboxChange = (optionName: string) => {
    setPresentationOptions((prevOptions: any) =>
      prevOptions.map((option: any) =>
        option.name === optionName
          ? { ...option, state: !option.state }
          : option
      )
    );
  };

  return (
    <div className={isOpen ? "relative w-full h-[270px] rounded-[100px]" : "rounded-none relative w-full"}>
      {/* Dropdown Box */}
      <div className="border-gray-300 outline-none mt-2 border-x-0 border-y-2 rounded-none">
        {/* Dropdown Button */}
        <button
          onClick={toggleDropdown}
          className="w-full text-left rounded-none text-white px-4 py-2 focus:outline-none flex justify-between font-gsemibold"
        >
          Data Presentation{" "}
          <span>{isOpen ? <ChevronUp className=" rotate-90" /> : <ChevronDown />}</span>
        </button>
      </div>

      {/* Dropdown Menu */}
      {isOpen && (
        <div className="absolute w-full text-white border-gray-300 pb-2 pt-2">
          {presentationOptions.map((option: any, index: any) => (
            <label
              key={index}
              className="flex items-center px-4 py-2 text-sm cursor-pointer"
            >
              <input
                type="checkbox"
                checked={option.state}
                onChange={() => handleCheckboxChange(option.name)}
                className="mr-2 h-4 w-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
              />
              {option.name}
            </label>
          ))}
        </div>
      )}
    </div>
  );
};

export default DataPresentationOptions;
