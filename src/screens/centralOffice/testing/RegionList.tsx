import { useEffect, useState } from 'react';
import { ChevronDown } from 'lucide-react';
import { useSelector, useDispatch } from 'react-redux';
import { setRegions, selectRegions } from './../../../redux/regionSlice';
import { AppDispatch } from './../../../redux/store';

const regions = [
  { id: 'BARMM I', name: 'BARMM I' }, // Updated to match map regions
  { id: 'CAR', name: 'CAR' },
  { id: 'NCR', name: 'NCR' },
  { id: 'R1', name: 'R1' },
  { id: 'R2', name: 'R2' },
  { id: 'R3', name: 'R3' },
  { id: 'R4A', name: 'R4A' },
  { id: 'R4B', name: 'R4B' },
  { id: 'R5', name: 'R5' },
  { id: 'R6', name: 'R6' },
  { id: 'R7', name: 'R7' },
  { id: 'R8', name: 'R8' },
  { id: 'R9', name: 'R9' },
  { id: 'R10', name: 'R10' },
  { id: 'R11', name: 'R11' },
  { id: 'R12', name: 'R12' },
  { id: 'R13', name: 'R13' },
];

const RegionSelector = () => {
  const regionFromStore = useSelector(selectRegions);
  const [isOpen, setIsOpen] = useState(false);
  const [selectedRegions, setSelectedRegions] = useState<string[]>(regionFromStore);
  const dispatch: AppDispatch = useDispatch();

  // Update local state when redux store changes
  useEffect(() => {
    setSelectedRegions(regionFromStore);
  }, [regionFromStore]);

  const handleRegionChange = (regionId: string) => {
    const newSelectedRegions = selectedRegions.includes(regionId)
      ? selectedRegions.filter(id => id !== regionId)
      : [...selectedRegions, regionId];
    
    setSelectedRegions(newSelectedRegions);
    dispatch(setRegions(newSelectedRegions));
  };

  const handleSelectAllChange = () => {
    const newSelectedRegions = selectedRegions.length === regions.length 
      ? [] 
      : regions.map(region => region.id);
    
    setSelectedRegions(newSelectedRegions);
    dispatch(setRegions(newSelectedRegions));
  };

  const handleDeselectAll = () => {
    setSelectedRegions([]);
    dispatch(setRegions([]));
  };

  const isAllSelected = selectedRegions.length === regions.length;

  return (
    <div className="relative w-full inline-block text-left">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="inline-flex w-full justify-between items-center px-4 py-2 text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
      >
        {selectedRegions.length > 0 
          ? `${selectedRegions.length} region${selectedRegions.length > 1 ? 's' : ''} selected`
          : 'Select Region'}
        <ChevronDown className="w-4 h-4 ml-2" />
      </button>

      {isOpen && (
        <div className="absolute z-10 mt-2 w-full bg-white border border-gray-200 rounded-md shadow-lg">
          <div className="p-4">
            <div className="mb-4 flex justify-between items-center">
              <label className="flex items-center">
                <input
                  type="checkbox"
                  className="form-checkbox h-4 w-4 text-blue-600 rounded border-gray-300"
                  checked={isAllSelected}
                  onChange={handleSelectAllChange}
                />
                <span className="ml-2 text-sm text-gray-700">Select All</span>
              </label>
              {selectedRegions.length > 0 && (
                <button
                  onClick={handleDeselectAll}
                  className="text-sm text-red-600 hover:text-red-800 font-medium"
                >
                  Deselect All
                </button>
              )}
            </div>

            <div>
              <h3 className="text-sm font-medium text-blue-600 mb-2">Regions</h3>
              <div className="grid grid-cols-3 gap-2">
                {regions.map((region) => (
                  <label key={region.id} className="flex items-center">
                    <input
                      type="checkbox"
                      className="form-checkbox h-4 w-4 text-blue-600 rounded border-gray-300"
                      checked={selectedRegions.includes(region.id)}
                      onChange={() => handleRegionChange(region.id)}
                    />
                    <span className="ml-2 text-sm text-gray-700">{region.name}</span>
                  </label>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default RegionSelector;