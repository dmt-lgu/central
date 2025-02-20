import { useRef, useState } from 'react';
import DatePicker from '../testing/DatePicker';
import RegionSelector from '../testing/RegionList';
import BarChart from './BarChart';
import TableStatus from './TableStatus';
import LineCharts from './LineCharts';
import { useReactToPrint } from 'react-to-print';

export const UtiStatus = () => {
const componentRef = useRef<HTMLDivElement>(null);
  const [_selectedDates, setSelectedDates] = useState<string[]>(['2024-01']);
   const handlePrint = useReactToPrint({
     content: () => componentRef.current,
     pageStyle: `
       @page {
         size: A4 landscape;
         margin: 20mm;
       }
       @media print {
         html, body {
           height: initial !important;
           overflow: initial !important;
           -webkit-print-color-adjust: exact;
           print-color-adjust: exact;
         }
         .print-break {
           page-break-before: always;
         }
       }
     `,
   });
  return (
    <div ref={componentRef} className='min-h-[100vh] w-full z-10 flex flex-col items-center'>
      <div className='w-[90%] md:mt-52 flex flex-col gap-10 min-h-[10px]'>
        <div className="w-ful items-center gap-5 justify-between px-5 flex min-h-[100px] bg-[#ebeff5] border rounded-sm md:flex-col md:py-2 md:gap-3">
          <div className="flex gap-2 md:w-full">
            <DatePicker onDateChange={setSelectedDates} />
          </div>
          <div className="md:z-[100] w-[30%] md:w-full">
            <RegionSelector />
          </div>
        </div>

        {/* Bar Chart */}
        <div className='relative w-full flex md:flex-col h-full justify-center gap-10 bg-white rounded-lg mb-5 border p-4 overflow-auto'>
          <BarChart />
        </div>

        {/* Table Status*/}
        <div className='relative flex md:flex-col h-full justify-between gap-10 bg-white rounded-lg w-full mb-5 border p-4 overflow-auto'>
          <TableStatus />
        </div>

        {/* Line Charts */}
        <div className='relative w-full flex md:flex-col h-full justify-center gap-10 bg-white rounded-lg mb-5 border p-4'>
          <LineCharts />
        </div>
        <button 
        onClick={handlePrint} 
        className="z-50 fixed bottom-5 right-5 bg-blue-500 text-white p-3 rounded-full shadow-lg print:hidden"
      >
        Print PDF
      </button>
      </div>
    </div>
  );
};

export default UtiStatus;