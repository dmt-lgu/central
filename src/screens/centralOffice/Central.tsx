import  { useCallback, useMemo, useState, useRef, memo, } from 'react';
import { animated, useSpring } from 'react-spring';
import { useGesture } from 'react-use-gesture';
import debounce from 'lodash/debounce';

import PhMap from './map/phMap';

import ChartsDashboard from './testing/Charts';

import DatePicker from './testing/DatePicker';
import RegionSelector from './testing/RegionList';


const INITIAL_RESULT = {
    id: "PH",
    operational: 0,
    development: 0,
    trainingOrOthers: 0,
    withdraw: 0,
};

function Central() {

  const [result, setResult] = useState(INITIAL_RESULT);
  const [data, setData] = useState<any[]>([]);
  const [clickedRegion, setClickedRegion] = useState<string | null>(null);
  const [selectedMonth, setSelectedMonth] = useState<string>('All Months');
  const [selectedRegion, setSelectedRegion] = useState<string[] | null>(null);
  const [selectedValue, setSelectedValue] = useState<any>("");
  const [selectedValue2, setSelectedValue2] = useState<any>("");
  const [selectedDate, setSelectedDate] = useState(new Date());

  // Transform state for zoom and pan
  const [transform, setTransform] = useState({
    scale: 1,
    x: 0,
    y: 0
  });

  // Ref for the map container and transform state
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const transformRef = useRef({
    scale: 1,
    x: 0,
    y: 0
  });

  // Create a debounced function to update the transform state
  const debouncedStateUpdate = useCallback(
    debounce((newTransform: typeof transformRef.current) => {
      setTransform(newTransform);
    }, 16),
    []
  );

  // Update the ref and trigger debounced state update
  const updateTransform = useCallback((newTransform: Partial<typeof transformRef.current>) => {
    transformRef.current = {
      ...transformRef.current,
      ...newTransform
    };
    debouncedStateUpdate(transformRef.current);
  }, [debouncedStateUpdate]);

  // Spring animation with manual api control
  const [springProps, api] = useSpring(() => ({
    transform: `translate(0px, 0px) scale(1)`,
    config: {
      mass: 1,
      tension: 100,
      friction: 20,
    },
  }));

  // Gesture handling for drag
  const bind = useGesture(
    {
      onDrag: ({ offset: [x, y] }) => {
        transformRef.current.x = x;
        transformRef.current.y = y;
        // Use the ref value directly for the spring animation
        api.start({
          transform: `translate(${x}px, ${y}px) scale(${transformRef.current.scale})`
        });
      },
      onDragEnd: () => {
        // Only update state when dragging ends
        debouncedStateUpdate(transformRef.current);
      }
    },
    {
      drag: {
        from: () => [transformRef.current.x, transformRef.current.y],
        bounds: { left: -300, right: 300, top: -300, bottom: 300 },
      }
    }
  );

  // Zoom In and Zoom Out functions
  const handleZoomIn = useCallback(() => {
    const newScale = Math.min(transformRef.current.scale + 0.1, 3);
    updateTransform({ scale: newScale });
    api.start({
      transform: `translate(${transformRef.current.x}px, ${transformRef.current.y}px) scale(${newScale})`
    });
  }, [updateTransform, api]);

  const handleZoomOut = useCallback(() => {
    const newScale = Math.max(transformRef.current.scale - 0.1, 0.8);
    updateTransform({ scale: newScale });
    api.start({
      transform: `translate(${transformRef.current.x}px, ${transformRef.current.y}px) scale(${newScale})`
    });
  }, [updateTransform, api]);

  // Memoized map component
  const memoizedPhMap = useMemo(
    () => (
      <PhMap
        springProps={springProps}
        data={data}
        setData={setData}
        selectedMonth={selectedMonth}
        setSelectedRegion={setSelectedRegion}
        selectedRegion={selectedRegion}
        setResult={setResult}
        clickedRegion={clickedRegion}
        setClickedRegion={setClickedRegion}
      />
    ),
    [springProps, data, selectedMonth, selectedRegion, clickedRegion]
  );

 


  return (
    <div className="min-h-[100vh] w-full z-10 flex flex-col items-center">
      <div className='w-[90%] flex flex-col gap-10 min-h-[10px]'>
        <div className='w-ful items-center z-[4] justify-between px-5 flex min-h-[100px] bg-[#ebeff5] border rounded-sm md:flex-col md:py-2 md:gap-3'>
          <div className='flex gap-2 w-[500px] md:w-full'>
            <DatePicker value={selectedDate} onChange={setSelectedDate} />
          </div>
          <div className='z-[99999] w-[30%] md:w-full'>
            <RegionSelector/>
          </div>
        </div>

        <div className='relative w-full flex md:flex-col h-full justify-between gap-10'>
          <div className='w-full h-full flex flex-col gap-10'>
            <div 
              ref={mapContainerRef}
              {...bind()}
              className='relative w-full h-[70vh] flex flex-col bg-[#ebeff5] rounded-sm border border-border overflow-hidden'
              style={{
                touchAction: 'none',
                userSelect: 'none',
              }}
            >
              <div className="absolute z-20 bottom-4 right-4 flex flex-col space-y-2">
                <button 
                  onClick={handleZoomIn} 
                  className="p-2 bg-[#323232] text-white rounded shadow hover:bg-gray-800"
                >
                  +
                </button>
                <button 
                  onClick={handleZoomOut} 
                  className="p-2 bg-[#323232] text-white rounded shadow hover:bg-gray-800"
                >
                  -
                </button>
              </div>

              <animated.div
                style={{
                  width: '100%',
                  height: '100%',
                  transformOrigin: 'center center',
                  ...springProps,
                }}
              >
                {memoizedPhMap}
              </animated.div>
            </div>
            <ChartsDashboard/>
          </div>
        </div>
      </div>
    </div>
  );
}

export default memo(Central);