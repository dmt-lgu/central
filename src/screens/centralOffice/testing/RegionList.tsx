import { useEffect, useState } from 'react';
import { ChevronDown } from 'lucide-react';
import { useSelector, useDispatch } from 'react-redux';
import { setRegions, selectRegions } from './../../../redux/regionSlice';
import { AppDispatch } from './../../../redux/store';

const regions = [
  { id: 'BARMM I', name: 'BARMM I' },
  { id: 'BARMM II', name: 'BARMM II' },
  { id: 'CAR', name: 'CAR' },
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
  { id: 'NCR', name: 'NCR' },
];

const RegionSelector = () => {
  const regionss = useSelector(selectRegions);
  const [isOpen, setIsOpen] = useState(false);
  const [selectedRegions, setSelectedRegions] = useState<string[]>(regionss);
  const [selectAll, setSelectAll] = useState(false);

  const dispatch: AppDispatch = useDispatch();

  const handleRegionChange = (regionId: string) => {
    setSelectedRegions(prev =>
      prev.includes(regionId)
        ? prev.filter(id => id !== regionId)
        : [...prev, regionId]
    );
  };

  const handleSelectAllChange = () => {
    if (selectAll) {
      setSelectedRegions([]);
    } else {
      setSelectedRegions(regions.map(region => region.id));
    }
    setSelectAll(!selectAll);
  };

  useEffect(() => {
    dispatch(setRegions(selectedRegions));
  }, [selectedRegions]);

  useEffect(() => {
    setSelectAll(selectedRegions.length === regions.length);
  }, [selectedRegions]);

  return (
    <div className="relative w-full inline-block text-left">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="inline-flex w-full justify-between items-center px-4 py-2 text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
      >
        Select Region
        <ChevronDown className="w-4 h-4 ml-2" />
      </button>

      {isOpen && (
        <div className="absolute z-10 mt-2 w-full bg-white border border-gray-200 rounded-md shadow-lg">
          <div className="p-4">
            <div className="mb-4">
              <label className="flex items-center">
                <input
                  type="checkbox"
                  className="form-checkbox h-4 w-4 text-blue-600 rounded border-gray-300"
                  checked={selectAll}
                  onChange={handleSelectAllChange}
                />
                <span className="ml-2 text-sm text-gray-700">Select All</span>
              </label>
            </div>

            <div>
              <h3 className="text-sm font-medium text-blue-600 mb-2">Region</h3>
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