import Chart from 'react-apexcharts';

function BarChart() {
    const chartOptions = {
        chart: {
            type: 'bar',
        },
        plotOptions: {
            bar: {
            horizontal: false,
            },
        },
        xaxis: {
            categories: [
            'Business Permit', 
            'Barangay Clearance', 
            'Working Permit', 
            'Building Permit and Certificate of Occupancy'
            ],
            labels: {
            rotate: 0,
            },
        },
        yaxis: {
            title: {
            text: 'Number of Permits',
            },
        },
        title: {
            text: 'Comparison of Different Types of Permits',
        },
        colors: ['#0136A8', '#F8CD1C', '#CE1126', '#72CFF1'], 
    };

    const chartSeries = [
        {
          name: 'Operational',
          data: [12, 19, 3, 5],
        },
        {
          name: 'Developmental',
          data: [3, 10, 13, 15],
        },
        {
          name: 'For Training/Others',
          data: [2, 3, 20, 5],
        },
        {
          name: 'Withdraw',
          data: [15, 9, 10, 10],
        },
    ];
    return (
        <div className='min-w-[1000px] flex justify-center p-10 z-0'>
            <Chart className="w-full" options={chartOptions} series={chartSeries} type="bar" height={350} />
        </div>
  )
}

export default BarChart