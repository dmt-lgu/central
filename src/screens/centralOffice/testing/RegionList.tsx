import React, { useEffect, useState } from 'react';
import { ChevronDown } from 'lucide-react';
import { useSelector, useDispatch } from 'react-redux';
import { setRegions,selectRegions } from './../../../redux/regionSlice';
import { AppDispatch } from './../../../redux/store';
const groupOfIslands = [
  { id: 'luzon', name: 'Luzon' },
  { id: 'visayas', name: 'Visayas' },
  { id: 'mindanao', name: 'Mindanao' },
];

const regions = [
  { id: 'I', name: 'I' },
  { id: 'II', name: 'II' },
  { id: 'III', name: 'III' },
  { id: 'IV-A', name: 'IV-A' },
  { id: 'IV-B', name: 'IV-B' },

  
  { id: 'V', name: 'V' },
  { id: 'CAR', name: 'CAR' },
  { id: 'NCR', name: 'NCR' },
  { id: 'VI', name: 'VI' },
  { id: 'VII', name: 'VII' },
  { id: 'VIII', name: 'VIII' },
  { id: 'IX', name: 'IX' },
  { id: 'X', name: 'X' },
  { id: 'XI', name: 'XI' },
  { id: 'XII', name: 'XII' },
  { id: 'XIII', name: 'XIII' },
  { id: 'BARMM', name: 'BARMM' },
];

const regionsByGroup = {
  luzon: ['I', 'II', 'III', 'IV-A', 'V', 'CAR', 'NCR','IV-B'],
  visayas: ['VI', 'VII', 'VIII', 'NIR'],
  mindanao: ['IX', 'X', 'XI', 'XII', 'XIII', 'BARMM']
};

const RegionSelector = () => { 
  const regionss = useSelector(selectRegions);
  const [isOpen, setIsOpen] = useState(false);
  const [selectedRegions, setSelectedRegions] = useState<string[]>(regionss);
  const [selectedIslands, setSelectedIslands] = useState<string[]>([]);


 
  const dispatch: AppDispatch = useDispatch();


  const handleRegionChange = (regionId: string) => {
    setSelectedRegions(prev =>
      prev.includes(regionId)
        ? prev.filter(id => id !== regionId)
        : [...prev, regionId]
    );
  };



  const handleIslandChange = (islandId: string) => {
    const regionsInGroup = regionsByGroup[islandId as keyof typeof regionsByGroup];
    
    setSelectedIslands(prev => {
      const newIslands = prev.includes(islandId)
        ? prev.filter(id => id !== islandId)
        : [...prev, islandId];
      
      setSelectedRegions(prevRegions => {
        if (prev.includes(islandId)) {
          // If island was selected, remove its regions
          return prevRegions.filter(id => !regionsInGroup.includes(id));
        } else {
          // If island was not selected, add its regions
          const existingRegions = prevRegions.filter(id => !regionsInGroup.includes(id));
          return [...existingRegions, ...regionsInGroup];
        }
      });
      
      return newIslands;
    });
  };

  useEffect(()=>{
    dispatch(setRegions(selectedRegions));
  },[selectedRegions])

  return (
    <div className="relative w-full inline-block text-left">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="inline-flex w-full justify-between items-center  px-4 py-2 text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
      >
        Select Region
        <ChevronDown className="w-4 h-4 ml-2" />
      </button>

      {isOpen && (
        <div className="absolute z-10 mt-2 w-full bg-white border border-gray-200 rounded-md shadow-lg">
          <div className="p-4">
            <div className="mb-4">
              <h3 className="text-sm font-gmedium text-blue-600 mb-2">Group of Islands</h3>
              <div className=" flex gap-5">
                {groupOfIslands.map((island) => (
                  <label key={island.id} className="flex items-center">
                    <input
                      type="checkbox"
                      className="form-checkbox h-4 w-4 text-blue-600 rounded border-gray-300"
                      checked={selectedIslands.includes(island.id)}
                      onChange={() => handleIslandChange(island.id)}
                    />
                    <span className="ml-2 text-sm text-gray-700">{island.name}</span>
                  </label>
                ))}
              </div>
            </div>

            <div>
              <h3 className="text-sm font-gmedium text-blue-600 mb-2">Region</h3>
              <div className="grid grid-cols-3 gap-2">
                {regions.map((region) => (
                  <label key={region.id} className="flex items-center">
                    <input
                      type="checkbox"
                      className="form-checkbox h-4 w-4 text-blue-600 rounded border-gray-300"
                      checked={regionss.includes(region.id)}
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