import React, { useEffect, useState, useMemo, useCallback, memo } from "react";
import { motion } from 'framer-motion';
import Summary from "./charts/summary";
import PhMap from "./map/phMap";
import { useGesture } from "react-use-gesture";
import axios from "./../../plugin/axios";
import { RegionRanking } from "./charts/ranking";
import RadarChart from "./charts/radaChart";
import LineChart from "./charts/lineChart";
import { useSpring, animated } from "react-spring";
;

// Constants outside component
const MONTHS = [
  "All Months", "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December"
];

const PROJECTS = [
  
  'Business Permit',
  'Working Permit',
  'Certificate of Occupancy',
  'Local Civil Registry',
  'eCedula','All Project'
];

const INITIAL_RESULT = {
  id: "PH",
  operational: 0,
  development: 0,
  trainingOrOthers: 0,
  withdraw: 0,
};

// Memoized child components
const MemoizedRegionRanking: any = memo(RegionRanking);
const MemoizedRadarChart: any = memo(RadarChart);
const MemoizedLineChart: any = memo(LineChart);
const MemoizedSummary = memo(Summary);

// Memoized select component
const SelectDropdown = memo(({ 
  label, 
  options, 
  value, 
  onChange, 
  id 
}: { 
  label: string;
  options: string[];
  value?: string;
  onChange?: (e: React.ChangeEvent<HTMLSelectElement>) => void;
  id: string;
}) => (
  <div className="flex flex-col space-y-2 md:mr-2 mr-5">
    <label htmlFor={id} className="text-lg font-semibold">
      {label}
    </label>
    <select
      id={id}
      className="pointer-events-auto w-full p-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
      value={value}
      onChange={onChange}
    >
      {options.map((option, index) => (
        <option key={index} value={option}>
          {id === 'monthDropdown' ? `${option} 2024` : option}
        </option>
      ))}
    </select>
  </div>
));

const MapComponent: React.FC = () => {


  const [result, setResult] = useState(INITIAL_RESULT);
  const [data, setData] = useState<any[]>([]);
  const [clickedRegion, setClickedRegion] = useState<string | null>(null);
  const [selectedMonth, setSelectedMonth] = useState<string>('All Months');
  const [selectedRegion, setSelectedRegion] = useState<string | null>(null);
  const [transform, setTransform] = useState({ scale: 1, x: 0, y: 0 });

  // Debounced transform update
  const debouncedSetTransform: any = useCallback((newTransform: typeof transform) => {
    requestAnimationFrame(() => {
      setTransform(newTransform);
    });
    
  }, []);

  const getLatestMonth = (data: any[]): string => {
    return data.reduce((latest, item) => {
      const currentDate = new Date(item.date);
      const latestDate = new Date(latest);
      return currentDate > latestDate ? item.date : latest;
    }, data[0]?.date || '');
  };

  console.log("re-rendered");

  const monthToFormattedValue = useCallback((month: string) => {
    const year = new Date().getFullYear();
    const monthIndex = MONTHS.indexOf(month);
    if (monthIndex === 0) return 'All Months';
    return `${year}-${monthIndex}`;
  }, []);

  const getTopRegions = useCallback((data: any[]) => {
    // If no data is available, return an empty array
    if (!data || data.length === 0) {
      return [];
    }

    // Determine the month to use for filtering
    let latestMonth: string = getLatestMonth(data);
    
    // If a specific month is selected, use that instead of the latest month
    if (selectedMonth && selectedMonth !== 'All Months') {
      const formattedMonth = monthToFormattedValue(selectedMonth);
      latestMonth = formattedMonth;
    }

    // Filter data for the selected month
    const filteredMonthData = data.filter((item: any) => item.date === latestMonth);

    // If no data for the selected month, fall back to all data
    const dataToUse = filteredMonthData.length > 0 ? filteredMonthData : data;

    // Create a map to accumulate operational values by region
    const regionTotals: { [key: string]: number } = {};
    
    dataToUse.forEach((item: any) => {
      const region = item.region;
      const operationalValue = parseInt(item.operational) || 0;

      // Accumulate operational values for each region
      regionTotals[region] = (regionTotals[region] || 0) + operationalValue;
    });

    // Convert the regionTotals object to a sorted array of top regions
    const sortedRegions = Object.entries(regionTotals)
      .map(([region, value], index) => ({ 
        id: index + 1, 
        region, 
        value: Number(value) 
      }))
      .sort((a, b) => b.value - a.value);

    // Return top 8 regions, or all if less than 8
    return sortedRegions.slice(0, 8);
  }, [selectedMonth, monthToFormattedValue]);

  const calculateTotals = useCallback((data: any[], date: string) => {
    // Get the latest month data
    const latestMonth = getLatestMonth(data);
    const shouldDate = date === 'All Months' ? latestMonth : date;

    return data.reduce((totals, item) => {
      if (item.date !== shouldDate) return totals;
     
      return {
        operational: totals.operational + parseInt(item.operational),
        development: totals.development + parseInt(item.development),
        trainingOrOthers: totals.trainingOrOthers + parseInt(item.trainingOrOthers),
        withdraw: totals.withdraw + parseInt(item.withdraw),
      };
    }, {
      operational: 0,
      development: 0,
      trainingOrOthers: 0,
      withdraw: 0
    });
  }, []);

  const bind = useGesture({
    onDrag: ({ offset: [x, y] }) => {
      debouncedSetTransform((prev: any) => ({ ...prev, x, y }));
    },
    onPinch: ({ offset: [d] }) => {
      debouncedSetTransform((prev: any) => ({ ...prev, scale: Math.max(0.5, d / 100) }));
    },
    onWheel: ({ delta: [, dy] }) => {
      debouncedSetTransform((prev: any) => ({
        ...prev,
        scale: Math.max(0.5, prev.scale - dy * 0.001)
      }));
    },
  }, {
    drag: {
      initial: () => [transform.x, transform.y],
    },
    pinch: {
      initial: () => [transform.scale * 100, 0],
    },
  });

  const springProps = useSpring({
    transform: `translate(${transform.x}px, ${transform.y}px) scale(${transform.scale})`,
    config: { mass: 1, tension: 500, friction: 50 }
  });

  const GetAllBP = useCallback(() => {
    axios.get('').then((e) => {
      setData(e.data);
      setResult(calculateTotals(e.data, 'All Months'));
    });
  }, [calculateTotals]);

  useEffect(() => {
    GetAllBP();
    setSelectedRegion(`Philippines eLGU IBPLS Status`);
  }, [GetAllBP]);

  const handleMonthChange = useCallback((event: React.ChangeEvent<HTMLSelectElement>) => {
    const selected = event.target.value;
    const formattedMonth = monthToFormattedValue(selected);
    setSelectedMonth(selected);
    if (selected === 'All Months') {
      GetAllBP();
    } else {
      setResult(calculateTotals(data, formattedMonth));
    }
  }, [GetAllBP, calculateTotals, data, monthToFormattedValue]);

  const calculatedWidth = useMemo(() => {
    const charWidth = 16;
    const baseWidth = 0;
    return selectedRegion 
      ? selectedRegion.length * charWidth + baseWidth 
      : 12 * charWidth + baseWidth;
  }, [selectedRegion]);

  const handleRegionClick = useCallback(() => {
    setClickedRegion(null);
    GetAllBP();
    setSelectedRegion(`Philippines eLGU IBPLS Status`);
    setSelectedMonth('All Months');
  }, [GetAllBP]);

  const RegionTitle = useMemo(() => (
    <motion.div 
      className="bg-gradient-to-r from-[#12C6FC] to-[#194ACA] min-w-0 pl-9 rounded-s-sm overflow-hidden"
      initial={{ width: 0, opacity: 0 }}
      animate={{ width: calculatedWidth, opacity: 100 }}
      transition={{ duration: 0.8, ease: 'easeOut' }}
    >
      <h1 
        className="py-5 pr-10 pl-1 truncate text-white font-semibold pointer-events-auto font-gextrabold text-2xl text-end"
        onClick={handleRegionClick}
      >
        {selectedRegion}
      </h1>
    </motion.div>
  ), [selectedRegion, calculatedWidth, handleRegionClick]);

  const memoizedPhMap = useMemo(() => (
    <PhMap
      springProps={springProps}
      data={data}
      setData={setData}
      calculateTotals={calculateTotals}
      selectedMonth={selectedMonth}
      setSelectedRegion={setSelectedRegion}
      selectedRegion={selectedRegion}
      setResult={setResult}
      clickedRegion={clickedRegion}
      setClickedRegion={setClickedRegion}
    />
  ), [springProps, data, calculateTotals, selectedMonth, selectedRegion, clickedRegion]);

  const OperationalSpring = useSpring({
    from: { number: 0 },
    number: result ? result.operational : 0,
    delay: 140,
    config: { mass: 1, tension: 180, friction: 12 },
  });

  return (
    <div className="relative flex w-screen h-screen items-center justify-center">
      <div className="absolute z-20 w-[30vw] flex flex-col left-0 top-0 mt-[10vh]">
        <MemoizedRegionRanking data={getTopRegions(data)} />
      </div>

      <motion.div 
        initial={{ opacity: 0, y: 0 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="z-30 absolute h-[58vh] w-[1250px] items-start pointer-events-none ml-5 flex left-0 bottom-0 flex-col">
          <div className="flex flex-col sm:flex-row sm:justify-between ml-[20vw] sm:items-start gap-0 translate-y-10">
            <h2 className="text-gray-600 sm:text-xl font-gmedium">Total Operational</h2>
            <h1 className="text-[#1a237e] text-4xl sm:text-6xl font-gbold">
              <animated.span>
                {OperationalSpring.number.to((n) => n.toFixed(0))}
              </animated.span>
            </h1>
            <p className="text-gray-600 font-gsemibold text-right">
              eLGU across the {selectedRegion === "Philippines eLGU IBPLS Status" ? "Philippines" : selectedRegion}
            </p>
          </div>
          
          <div className="max-w-[450px] w-full h-full pointer-events-auto">
          <MemoizedRadarChart 
            data={data} 
            selectedMonth={selectedMonth} 
          />
          </div>
        </div>
      </motion.div>

      <div {...bind()} className="relative flex md:m-2 md:w-full w-[100%] sm:h-[80vh] h-[100vh] border overflow-hidden items-start justify-end rounded-md">
        <div className="absolute overflow-hidden pointer-events-none flex items-end justify-end w-screen min-h-[90px] mt-10 z-30 flex-col gap-4">
          {RegionTitle}
          
          <div className="flex gap-3">
            <SelectDropdown
              id="projectDropdown"
              label="Select a Project:"
              options={PROJECTS}
            />
            
            <SelectDropdown
              id="monthDropdown"
              label="Select a Month in 2024:"
              options={MONTHS}
              value={selectedMonth}
              onChange={handleMonthChange}
            />
          </div>

          {result && <MemoizedSummary result={result} />}
        </div>

        <div className="absolute self-end z-30">
          <div className="w-[30vw] h-full m-6">
            <MemoizedLineChart data={data} />
          </div>
        </div>

        {memoizedPhMap}
      </div>
    </div>
  );
};

export default memo(MapComponent);