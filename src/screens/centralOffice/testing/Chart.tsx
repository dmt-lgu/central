import React from 'react';
import ReactApexChart from 'react-apexcharts';
import { ApexOptions } from 'apexcharts';

export const Chart: React.FC = () => {
  const options: ApexOptions = {
    chart: {
      type: 'bar',
      height: 350,
    },
    plotOptions: {
      bar: {
        horizontal: false,
        columnWidth: '55%',
      },
    },
    dataLabels: {
      enabled: false,
    },
    stroke: {
      show: true,
      width: 2,
      colors: ['transparent'],
    },
    xaxis: {
      categories: ['NCR', 'CAR', 'Region I', 'Region II', 'Region III', 'Region IV'],
    },
    fill: {
      opacity: 1,
    },
    tooltip: {
      y: {
        formatter: function (val) {
          return val + "";
        },
      },
    },
    legend: {
      position: 'top',
    },
    colors: ['#1e40af', '#fbbf24'],
  };

  const series = [
    {
      name: 'Operational',
      data: [30, 40, 35, 20, 35, 30],
    },
    {
      name: 'Developmental',
      data: [20, 35, 25, 30, 25, 20],
    },
  ];

  return (
    <div className="bg-white p-4 rounded-lg shadow">
      <ReactApexChart
        options={options}
        series={series}
        type="bar"
        height={350}
      />
      <div className="text-center mt-4 text-gray-600">
        Select Period 2024-12
      </div>
    </div>
  );
};