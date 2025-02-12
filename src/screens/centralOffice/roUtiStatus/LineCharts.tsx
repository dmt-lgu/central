import Chart from 'react-apexcharts';

function LineCharts() {

    const combinedSeries = [
        {
          name: "Operational",
          data: [10, 40, 20, 50, 30, 40, 35, 45, 55, 65, 75, 85],
        },
        {
          name: "Developmental",
          data: [15, 35, 25, 45, 35, 45, 40, 50, 60, 70, 80, 90]
        },
        {
          name: "For Training/Others",
          data: [20, 30, 30, 40, 40, 50, 45, 55, 65, 75, 85, 95]
        },
        {
          name: "Withdraw",
          data: [25, 25, 35, 35, 45, 55, 50, 60, 70, 80, 90, 100]
        }
      ];
    
      const categories = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
      const options2 = {
        chart: {
          type: 'line',
          height: 350
        },
        xaxis: {
          categories: categories
        },
        yaxis: {
          title: {
            text: 'Values'
          }
        },
        stroke: {
          curve: 'straight'
        },
        markers: {
          size: 5
        }
      };
    
      const chartHeight = 350;
    
      const optionsOperational = {
        ...options2,
        title: {
          text: 'Business Permit',
          align: 'left'
        },
        colors: ['#0136A8', '#F8CD1C', '#CE1126', '#72CFF1'],
        chart: {
          height: chartHeight,
        }
      };
    
      const optionsDevelopmental = {
        ...options2,
        title: {
          text: 'Barangay Clearance',
          align: 'left'
        },
        colors: ['#0136A8', '#F8CD1C', '#CE1126', '#72CFF1'],
        chart: {
          height: chartHeight
        }
      };
    
      const optionsForTraining = {
        ...options2,
        title: {
          text: 'Working Permit',
          align: 'left'
        },
        colors: ['#0136A8', '#F8CD1C', '#CE1126', '#72CFF1'],
        chart: {
          height: chartHeight
        }
      };
    
      const optionsWithdraw = {
        ...options2,
        title: {
          text: 'Building Permit and Certificate of Occupancy',
          align: 'left',
          style: {
            fontSize: '12px' 
          }
        },
        colors: ['#0136A8', '#F8CD1C', '#CE1126', '#72CFF1'],
        chart: {
          height: chartHeight
        }
      };
  return (
    <div className='grid grid-cols-2 gap-4 md:flex-wrap p-4 w-full overflow-x-auto'>
        <div className='bg-white p-4 rounded-lg border shadow-md w-full md:w-1/2 lg:w-1/4'>
            <Chart options={optionsOperational} series={combinedSeries} type="line" />
        </div>
        <div className='bg-white p-4 rounded-lg border shadow-md w-full md:w-1/2 lg:w-1/4'>
            <Chart options={optionsDevelopmental} series={combinedSeries} type="line" />
        </div>
        <div className='bg-white p-4 rounded-lg border shadow-md w-full md:w-1/2 lg:w-1/4'>
            <Chart options={optionsForTraining} series={combinedSeries} type="line" />
        </div>
        <div className='bg-white p-4 rounded-lg border shadow-md w-full md:w-1/2 lg:w-1/4'>
            <Chart options={optionsWithdraw} series={combinedSeries} type="line" />
        </div>
    </div>
  )
}

export default LineCharts