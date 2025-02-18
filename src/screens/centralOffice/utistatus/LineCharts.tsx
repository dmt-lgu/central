import React, { useEffect, useState } from 'react';
import Chart from 'react-apexcharts';
import { useSelector } from 'react-redux';
import { selectData } from '@/redux/dataSlice';

function LineCharts() {
  const data = useSelector(selectData);
  const [seriesBP, setSeriesBP] = useState([
    { name: 'Operational', data: Array(12).fill(0) },
    { name: 'Developmental', data: Array(12).fill(0) },
    { name: 'For Training/Others', data: Array(12).fill(0) },
    { name: 'Withdraw', data: Array(12).fill(0) },
  ]);
  const [seriesBC, setSeriesBC] = useState([
    { name: 'Operational', data: Array(12).fill(0) },
    { name: 'Developmental', data: Array(12).fill(0) },
    { name: 'For Training/Others', data: Array(12).fill(0) },
    { name: 'Withdraw', data: Array(12).fill(0) },
  ]);
  const [seriesWP, setSeriesWP] = useState([
    { name: 'Operational', data: Array(12).fill(0) },
    { name: 'Developmental', data: Array(12).fill(0) },
    { name: 'For Training/Others', data: Array(12).fill(0) },
    { name: 'Withdraw', data: Array(12).fill(0) },
  ]);
  const [seriesCO, setSeriesCO] = useState([
    { name: 'Operational', data: Array(12).fill(0) },
    { name: 'Developmental', data: Array(12).fill(0) },
    { name: 'For Training/Others', data: Array(12).fill(0) },
    { name: 'Withdraw', data: Array(12).fill(0) },
  ]);

  useEffect(() => {
    const calculateTotals = () => {
      const totals = {
        WP: { operational: Array(12).fill(0), developmental: Array(12).fill(0), training: Array(12).fill(0), withdraw: Array(12).fill(0) },
        CO: { operational: Array(12).fill(0), developmental: Array(12).fill(0), training: Array(12).fill(0), withdraw: Array(12).fill(0) },
        BP: { operational: Array(12).fill(0), developmental: Array(12).fill(0), training: Array(12).fill(0), withdraw: Array(12).fill(0) },
        BC: { operational: Array(12).fill(0), developmental: Array(12).fill(0), training: Array(12).fill(0), withdraw: Array(12).fill(0) },
      };

      Object.entries(data).forEach(([permitType, permitData]) => {
        permitData.forEach((monthData: any) => {
          const monthIndex = new Date(monthData.date).getMonth();
          monthData.data.forEach((regionData: any) => {
            totals[permitType].operational[monthIndex] += regionData.operational;
            totals[permitType].developmental[monthIndex] += regionData.developmental;
            totals[permitType].training[monthIndex] += regionData.training;
            totals[permitType].withdraw[monthIndex] += regionData.withdraw;
          });
        });
      });

      setSeriesBP([
        { name: 'Operational', data: totals.BP.operational },
        { name: 'Developmental', data: totals.BP.developmental },
        { name: 'For Training/Others', data: totals.BP.training },
        { name: 'Withdraw', data: totals.BP.withdraw },
      ]);
      setSeriesBC([
        { name: 'Operational', data: totals.BC.operational },
        { name: 'Developmental', data: totals.BC.developmental },
        { name: 'For Training/Others', data: totals.BC.training },
        { name: 'Withdraw', data: totals.BC.withdraw },
      ]);
      setSeriesWP([
        { name: 'Operational', data: totals.WP.operational },
        { name: 'Developmental', data: totals.WP.developmental },
        { name: 'For Training/Others', data: totals.WP.training },
        { name: 'Withdraw', data: totals.WP.withdraw },
      ]);
      setSeriesCO([
        { name: 'Operational', data: totals.CO.operational },
        { name: 'Developmental', data: totals.CO.developmental },
        { name: 'For Training/Others', data: totals.CO.training },
        { name: 'Withdraw', data: totals.CO.withdraw },
      ]);
    };

    calculateTotals();
  }, [data]);

  const categories = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  const options = {
    chart: {
      type: 'line',
      height: 350,
    },
    xaxis: {
      categories: categories,
    },
    yaxis: {
      title: {
        text: 'Values',
      },
    },
    stroke: {
      curve: 'straight',
    },
    markers: {
      size: 5,
    },
  };

  const chartHeight = 350;

  const optionsBP = {
    ...options,
    title: {
      text: 'Business Permit',
      align: 'left',
    },
    colors: ['#0136A8', '#F8CD1C', '#CE1126', '#72CFF1'],
    chart: {
      height: chartHeight,
    },
  };

  const optionsBC = {
    ...options,
    title: {
      text: 'Barangay Clearance',
      align: 'left',
    },
    colors: ['#0136A8', '#F8CD1C', '#CE1126', '#72CFF1'],
    chart: {
      height: chartHeight,
    },
  };

  const optionsWP = {
    ...options,
    title: {
      text: 'Working Permit',
      align: 'left',
    },
    colors: ['#0136A8', '#F8CD1C', '#CE1126', '#72CFF1'],
    chart: {
      height: chartHeight,
    },
  };

  const optionsCO = {
    ...options,
    title: {
      text: 'Certificate of Occupancy',
      align: 'left',
    },
    colors: ['#0136A8', '#F8CD1C', '#CE1126', '#72CFF1'],
    chart: {
      height: chartHeight,
    },
  };

  return (
    <div className='grid grid-cols-2 gap-4 w-full md:grid-cols-1'>
      <div className='bg-white rounded-lg border shadow-md p-3'>
        <Chart options={optionsBP} series={seriesBP} type="line" />
      </div>
      <div className='bg-white rounded-lg border shadow-md p-3'>
        <Chart options={optionsBC} series={seriesBC} type="line" />
      </div>
      <div className='bg-white rounded-lg border shadow-md p-3'>
        <Chart options={optionsWP} series={seriesWP} type="line" />
      </div>
      <div className='bg-white rounded-lg border shadow-md p-3'>
        <Chart options={optionsCO} series={seriesCO} type="line" />
      </div>
    </div>
  );
}

export default LineCharts;