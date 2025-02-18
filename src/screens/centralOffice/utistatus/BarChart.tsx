import React, { useEffect, useState } from 'react';
import Chart from 'react-apexcharts';
import { selectData } from '@/redux/dataSlice';
import { useSelector } from 'react-redux';

function BarChart() {
  const data = useSelector(selectData);
  const [chartSeries, setChartSeries] = useState([
    {
      name: 'Operational',
      data: [0, 0, 0, 0],
    },
    {
      name: 'Developmental',
      data: [0, 0, 0, 0],
    },
    {
      name: 'For Training/Others',
      data: [0, 0, 0, 0],
    },
    {
      name: 'Withdraw',
      data: [0, 0, 0, 0],
    },
  ]);

  useEffect(() => {
    const calculateTotals = () => {
      const totals = {
        WP: { operational: 0, developmental: 0, training: 0, withdraw: 0 },
        CO: { operational: 0, developmental: 0, training: 0, withdraw: 0 },
        BP: { operational: 0, developmental: 0, training: 0, withdraw: 0 },
        BC: { operational: 0, developmental: 0, training: 0, withdraw: 0 },
      };

      Object.entries(data).forEach(([permitType, permitData]) => {
        permitData.forEach((monthData: any) => {
          monthData.data.forEach((regionData: any) => {
            totals[permitType].operational += regionData.operational;
            totals[permitType].developmental += regionData.developmental;
            totals[permitType].training += regionData.training;
            totals[permitType].withdraw += regionData.withdraw;
          });
        });
      });

      setChartSeries([
        {
          name: 'Operational',
          data: [
            totals.BP.operational,
            totals.BC.operational,
            totals.WP.operational,
            totals.CO.operational,
          ],
        },
        {
          name: 'Developmental',
          data: [
            totals.BP.developmental,
            totals.BC.developmental,
            totals.WP.developmental,
            totals.CO.developmental,
          ],
        },
        {
          name: 'For Training/Others',
          data: [
            totals.BP.training,
            totals.BC.training,
            totals.WP.training,
            totals.CO.training,
          ],
        },
        {
          name: 'Withdraw',
          data: [
            totals.BP.withdraw,
            totals.BC.withdraw,
            totals.WP.withdraw,
            totals.CO.withdraw,
          ],
        },
      ]);
    };

    calculateTotals();
  }, [data]);

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
        'Certificate of Occupancy',
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

  return (
    <div className='w-full md:w-[800px] flex justify-center p-10 z-0'>
      <Chart className="w-full" options={chartOptions} series={chartSeries} type="bar" height={350} />
    </div>
  );
}

export default BarChart;