import { ChevronDown, ChevronUp } from "lucide-react";
import React from "react";
import { useDispatch, useSelector } from 'react-redux';
import { setProjects, selectProject } from '../../../redux/projectSlice';

const LGUServiceDropdown = () => {
  const [isOpen, setIsOpen] = React.useState(true);
  const dispatch = useDispatch();
  const selectedServices = useSelector(selectProject);

  // Services list
  const services = [
    { name: "Business Permit V1" },
    { name: "Business Permit V2" },
    { name: "Building Permit" },
    { name: "Certificate of Occupancy" },
    { name: "Working Permit" },
    { name: "Barangay Clearance" },
  ];

  const toggleDropdown = () => {
    setIsOpen(!isOpen);
  };

  const handleCheckboxChange = (serviceName: string) => {
    const newServices = selectedServices.includes(serviceName)
      ? selectedServices.filter(service => service !== serviceName)
      : [...selectedServices, serviceName];
    
    dispatch(setProjects(newServices));
  };

  return (
    <div
      className={
        isOpen
          ? "relative mt-2 outline-none w-full min-h-[280px] mb-5 rounded-[100px]"
          : "rounded-none mt-2 outline-none relative w-full"
      }
    >
      <div
        className={`border-gray-300 outline-none mt-2 border-x-0 border-y-2 rounded-none`}
      >
        <button
          onClick={toggleDropdown}
          className="w-full text-left outline-none rounded-none text-white px-4 py-2 focus:outline-none flex justify-between font-gsemibold"
        >
          eLGU Services <span>{isOpen ? <ChevronUp className="rotate-90" /> : <ChevronDown />}</span>
        </button>
      </div>

      {isOpen && (
        <div className="absolute w-full outline-none text-white pb-2 pt-2">
          {services.map((service, index) => (
            <label
              key={index}
              className="flex items-center px-4 py-2 text-sm cursor-pointer"
            >
              <input
                type="checkbox"
                checked={selectedServices.includes(service.name)}
                onChange={() => handleCheckboxChange(service.name)}
                className="mr-2 h-4 w-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
              />
              {service.name}
            </label>
          ))}
        </div>
      )}
    </div>
  );
};

export default LGUServiceDropdown;