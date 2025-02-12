import { animated } from "react-spring";
import phRegions from "./phRegions.json";
import { useCallback, useEffect, useState } from "react";
import { useSelector, useDispatch } from 'react-redux';
import { setRegions, selectRegions } from './../../../redux/regionSlice';
import { AppDispatch } from './../../../redux/store';

const MONTHS = [
  "All Months", "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December"
];

type Region = {
  id: string;
  name: string;
  x: number;
  y: number;
  d: string;
};

type DataItem = {
  date: string;
  region: string;
  operational: string;
  development: string;
  trainingOrOthers: string;
  withdraw: string;
};

type Totals = {
  id: string;
  operational: number;
  development: number;
  trainingOrOthers: number;
  withdraw: number;
};

interface PhMapProps {
  selectedMonth: string;
  data: DataItem[];
  setResult: (result: Totals) => void;
  setSelectedRegion: (regions: string[]) => void;
  springProps: any;
  clickedRegion: string[] | null | undefined;  // Allow null/undefined
  setClickedRegion: (regions: string[]) => void;
}
function PhMap({
  selectedMonth,
  data,
  setResult,
  setSelectedRegion,
  springProps,
  clickedRegion = [],  // Provide default empty array
  setClickedRegion
}: PhMapProps) {
  const [hoveredRegion, setHoveredRegion] = useState<string | null>(null);

  const getLatestMonth = (data: DataItem[]): string => {
    if (!data.length) return '';
    return data.reduce((latest, item) => {
      const currentDate = new Date(item.date);
      const latestDate = new Date(latest);
      return currentDate > latestDate ? item.date : latest;
    }, data[0].date);
  };

  const monthToFormattedValue = useCallback((month: string): string => {
    const year = new Date().getFullYear();
    const monthIndex = MONTHS.indexOf(month);
    if (monthIndex === 0) return 'All Months';
    return `${year}-${monthIndex}`;
  }, []);

  const calculateTotals = (data: DataItem[], _date: string): Totals => {
    if (!data || data.length === 0) {
      return {
        id: "PH",
        operational: 0,
        development: 0,
        trainingOrOthers: 0,
        withdraw: 0,
      };
    }

    let latestMonth: string = getLatestMonth(data);

    if (selectedMonth && selectedMonth !== 'All Months') {
      const formattedMonth = monthToFormattedValue(selectedMonth);
      latestMonth = formattedMonth;
    }

    let totals: Totals = {
      id: "PH",
      operational: 0,
      development: 0,
      trainingOrOthers: 0,
      withdraw: 0,
    };

    data.filter(item => item.date === latestMonth)
      .forEach(item => {
        totals.operational += parseInt(item.operational);
        totals.development += parseInt(item.development);
        totals.trainingOrOthers += parseInt(item.trainingOrOthers);
        totals.withdraw += parseInt(item.withdraw);
      });

    return totals;
  };

  const regions = useSelector(selectRegions);
  const dispatch: AppDispatch = useDispatch();

  useEffect(()=>{
    setClickedRegion(regions);
  },[regions])

  const handleRegionClick = (region: Region): void => {
    const currentClickedRegions = clickedRegion ?? [];  // Use nullish coalescing
    let newClickedRegions: string[];

    if (currentClickedRegions.includes(region.id)) {
      newClickedRegions = currentClickedRegions.filter(id => id !== region.id);
    } else {
      newClickedRegions = [...currentClickedRegions, region.id];
    }

    const newSelectedRegions = newClickedRegions.map(id => {
      const regionInfo = phRegions.find(r => r.id === id);
      return id;
    });

    
    setSelectedRegion(newSelectedRegions);
    dispatch(setRegions(newSelectedRegions));

    const selectedRegionsData = data.filter(x => 
      newClickedRegions.includes(x.region)
    );
    setResult(calculateTotals(selectedRegionsData, selectedMonth));
  };

  return (
    <animated.svg
      className="animate__animated animate__fadeIn"
      width="100%"
      height="100%"
      viewBox="200 0 602.39 1109.44"
      style={{ ...springProps, cursor: "grab", touchAction: "none" }}
      xmlns="http://www.w3.org/2000/svg"
    >
      {phRegions.map((region: Region) => (
        <g key={region.id}>
          <path
            id={region.id}
            d={region.d}
            fill={
              (clickedRegion ?? []).includes(region.id)  // Use nullish coalescing
                ? "#1e40af"
                : hoveredRegion === region.id
                ? "#c52731"
                : "#323233"
            }
            onMouseEnter={() => setHoveredRegion(region.id)}
            onMouseLeave={() => setHoveredRegion(null)}
            onClick={() => {
            
              handleRegionClick(region)}}
            className="cursor-pointer"
          >
            <title>{region.id}</title>
          </path>
          <text
            x={region.x}
            y={region.y}
            fontSize="8"
            fill="#e7be16"
            textAnchor="middle"
            pointerEvents="none"
            dominantBaseline="middle"
          >
            {['NIR', 'BARMM', 'NCR', 'CAR'].includes(region.id) ? region.id : 'Region-' + region.id
  }
          </text>
        </g>
      ))}
    </animated.svg>
  );
}

export default PhMap;