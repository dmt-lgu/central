import React, { useCallback, useEffect, useState } from 'react';
import ReactApexChart from 'react-apexcharts';
import { ApexOptions } from 'apexcharts';

const LineChart: React.FC = (data:any) => {
  const calculateMonthlyTotals = useCallback((data: any[]) => {
    // Initialize an array to hold totals for each month
    const monthlyTotals = {
      operational: Array(12).fill(0),
      development: Array(12).fill(0),
      trainingOrOthers: Array(12).fill(0),
      withdraw: Array(12).fill(0),
    };
  
    // Iterate through the data to accumulate totals by month
    data.forEach(item => {
      const itemDate = new Date(item.date);
      const monthIndex = itemDate.getMonth(); // Get month index (0-11)
  
      // Accumulate totals for each category
      monthlyTotals.operational[monthIndex] += parseInt(item.operational) || 0;
      monthlyTotals.development[monthIndex] += parseInt(item.development) || 0;
      monthlyTotals.trainingOrOthers[monthIndex] += parseInt(item.trainingOrOthers) || 0;
      monthlyTotals.withdraw[monthIndex] += parseInt(item.withdraw) || 0;
    });
  
    // Transform the monthly totals into the desired format
  
  
    return [
      {
        name: 'Operational',
        data: monthlyTotals.operational,
      },
      {
        name: 'Developmental',
        data: monthlyTotals.development,
      },
      {
        name: 'Training',
        data: monthlyTotals.trainingOrOthers,
      },
      {
        name: 'Withdraw',
        data: monthlyTotals.withdraw,
      },
    ];
  }, []);
  // State to trigger initial animation
  const [chartKey, setChartKey] = useState(0);

  useEffect(() => {
    // Force a re-render to trigger animations
    setChartKey((prev) => prev + 1);
  }, []);

  const options: ApexOptions = {
    chart: {
      type: 'line',
      toolbar: {
        show: false,
      },
      animations: {
        enabled: true,
        easing: 'easeinout',
        speed: 1000, // Slightly slower speed for more effect
        animateGradually: {
          enabled: true,
          delay: 200,
        },
        dynamicAnimation: {
          enabled: true,
          speed: 500,
        },
      },
      zoom: {
        enabled: false,
      },
    },
    colors: [
      '#4ade80', // emerald-500 (Operational)
      '#facc15', // amber-500 (Developmental)
      '#ea580c', // pink-500 (Training)
      '#dc2626', // cyan-500 (Withdraw)
    ],
    stroke: {
      width: 3,
      curve: 'smooth',
    },
    xaxis: {
      categories: [
        'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
        'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec',
      ],
      labels: {
        style: {
          colors: '#64748b',
          fontSize: '12px',
        },
      },
      axisBorder: {
        show: false,
      },
      axisTicks: {
        show: false,
      },
      tooltip: {
        enabled: false,
      },
    },
    yaxis: {
      labels: {
        style: {
          colors: '#64748b',
          fontSize: '12px',
        },
      },
      min: 0,
      max: 400,
      tickAmount: 4,
    },
    grid: {
      borderColor: '#e2e8f0',
      strokeDashArray: 4,
      xaxis: {
        lines: {
          show: true,
        },
      },
    },
    markers: {
      size: 5,
      hover: {
        size: 7,
      },
    },
    legend: {
      show: false,
    },
    tooltip: {
      theme: 'light',
      y: {
        formatter: (value: number) => value.toString(),
      },
    },
  };

  const series = data ? calculateMonthlyTotals(data.data): [];

  return (
    <div className="w-full h-[300px]">
      <div className="w-full h-full overflow-x-scroll overflow-y-hidden">
        <div className="min-w-[800px] h-full">
          <ReactApexChart
            key={chartKey} // Using the key to re-render and trigger animations
            options={options}
            series={series}
            type="line"
            height="100%"
          />
        </div>
      </div>
    </div>
  );
};

export default LineChart;
