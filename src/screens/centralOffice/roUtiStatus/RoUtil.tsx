import { useState } from 'react';
import DatePicker from '../testing/DatePicker';
import RegionSelector from '../testing/RegionList';
import BarChart from '../roUtiStatus/BarChart';
import TableStatus from '../roUtiStatus/TableStatus';
import LineCharts from '../roUtiStatus/LineCharts';

const RoUtil = () => {
    const [selectedDate, setSelectedDate] = useState(new Date());

    return (
        <div className='min-h-[100vh] w-full z-10 flex flex-col items-center'>
      <div className='w-[90%] flex flex-col gap-10 min-h-[10px]'>
        <div className='w-ful items-center z-[4] justify-between px-5 flex min-h-[100px] bg-[#ebeff5] border rounded-sm md:flex-col md:py-2 md:gap-3'>
          <div className='flex gap-2 w-[500px] md:w-full'>
            <DatePicker value={selectedDate} onChange={setSelectedDate} />
          </div>
          <div className='z-[99999] w-[30%] md:w-full'>
            <RegionSelector />
          </div>
        </div>

        {/* Bar Chart */}
        <div className='relative w-full flex md:flex-col h-full justify-center gap-10 bg-white rounded-lg mb-5 border p-4'>
          <BarChart />
        </div>

        {/* Table Status*/}
        <div className='relative flex md:flex-col h-full justify-between gap-10 bg-white rounded-lg w-full mb-5 border p-4'>
          <TableStatus />
        </div>

        {/* Line Charts */}
        <div className='relative w-full flex md:flex-col h-full justify-center gap-10 bg-white rounded-lg mb-5 border p-4'>
          <LineCharts />
        </div>
      </div>
    </div>
    );
}

export default RoUtil;