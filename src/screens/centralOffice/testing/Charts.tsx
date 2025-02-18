import React, { useState, useEffect, useRef } from 'react';
import Chart from 'react-apexcharts';
import { ApexOptions } from 'apexcharts';
import { useSelector } from 'react-redux';
import { selectCharts } from './../../../redux/chartSlice';
import { selectData } from '@/redux/dataSlice';
import { useReactToPrint } from 'react-to-print';

const ChartsDashboard: React.FC = () => {
  const charts = useSelector(selectCharts);
  const data = useSelector(selectData);
  const componentRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    console.log(data);
  }, [data]);

  const [selectedMetric, setSelectedMetric] = useState<'Operational' | 'Developmental'>('Operational');

  useEffect(() => {
    console.log(charts);
  }, [charts]);

  const regions = [
    'BARMM I', 'BARMM II', 'CAR', 'R1', 'R10', 'R11', 'R12', 'R13', 'R2', 'R3', 'R4A', 'R4B', 'R5', 'R6', 'R7', 'R8', 'R9'
  ];

  const calculateValues = () => {
    const operationalValues = Array(regions.length).fill(0);
    const developmentalValues = Array(regions.length).fill(0);

    Object.values(data).forEach((serviceData: any) => {
      serviceData.forEach((monthData: any) => {
        monthData.data.forEach((regionData: any) => {
          const regionIndex = regions.indexOf(regionData.region);
          if (regionIndex !== -1) {
            operationalValues[regionIndex] += regionData.operational;
            developmentalValues[regionIndex] += regionData.developmental;
          }
        });
      });
    });

    return [
      {
        name: 'Operational',
        data: operationalValues
      },
      {
        name: 'Developmental',
        data: developmentalValues
      }
    ];
  };

  const values = calculateValues();

  let xaxis = {
    categories: regions
  };

  // Bar Chart Configuration
  const barChartOptions: ApexOptions = {
    chart: {
      type: 'bar',
      height: 350,
      width: '100%',
      toolbar: {
        show: true,
        tools: {
          download: true,
          zoom: true,
          zoomin: true,
          zoomout: true,
          pan: true,
        }
      },
      zoom: {
        enabled: true
      }
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
      ...xaxis,
      tickPlacement: 'on',
      labels: {
        rotate: -45,
        trim: false,
        style: {
          fontSize: '12px'
        }
      },
    },
    yaxis: {
      title: {
        text: 'Values'
      }
    },
    fill: {
      opacity: 1,
    },
    tooltip: {
      y: {
        formatter: function (val) {
          return val + '';
        },
      },
    },
    legend: {
      position: 'top',
    },
    colors: ['#1e40af', '#fbbf24'],
    title: {
      text: 'Operational vs. Developmental Performance Across Regions',
      align: 'left',
    },
    responsive: [{
      breakpoint: 1000,
      options: {
        chart: {
          width: '100%'
        }
      }
    }]
  };

  const barChartSeries = values;

  // Line Chart Configuration
  const lineChartOptions: ApexOptions = {
    chart: {
      type: 'line',
      height: 350,
      width: '100%',
      toolbar: {
        show: true,
        tools: {
          download: true,
          zoom: true,
          zoomin: true,
          zoomout: true,
          pan: true,
        }
      },
      zoom: {
        enabled: true
      }
    },
    stroke: {
      curve: 'smooth',
      width: 3,
    },
    xaxis: {
      ...xaxis,
      tickPlacement: 'on',
      labels: {
        rotate: -45,
        trim: false,
        style: {
          fontSize: '12px'
        }
      },
    },
    colors: ['#1e40af', '#fbbf24'],
    legend: {
      position: 'top',
    },
    title: {
      text: 'Trend Analysis',
      align: 'left',
    },
    responsive: [{
      breakpoint: 1000,
      options: {
        chart: {
          width: '100%'
        }
      }
    }]
  };

  const lineChartSeries = values;

  // Get data for pie chart based on selected metric
  const getPieChartData = () => {
    let operationalTotal = 0;
    let developmentalTotal = 0;
    let trainingTotal = 0;
    let withdrawTotal = 0;

    Object.values(data).forEach((serviceData: any) => {
      serviceData.forEach((monthData: any) => {
        monthData.data.forEach((regionData: any) => {
          operationalTotal += regionData.operational;
          developmentalTotal += regionData.developmental;
          trainingTotal += regionData.training;
          withdrawTotal += regionData.withdraw;
        });
      });
    });

    return [operationalTotal, developmentalTotal, trainingTotal, withdrawTotal];
  };

  // Updated Pie Chart Configuration
  const pieChartOptions: ApexOptions = {
    chart: {
      type: 'pie',
      height: 350,
    },
    labels: [
      'Operational', 'Developmental', 'For Training/Others', 'Withdraw'
    ],
    colors: ['#0134b2', '#f5cf1b', '#6fd0f2', '#d01028'],
    legend: {
      position: 'right',
      fontSize: '12px',
      height: 230,
    },
    title: {
      text: `Overall Status Distribution`,
      align: 'left',
    },
  };

  const isBarGraphVisible = charts.includes('Bar Graph');
  const isLineGraphVisible = charts.includes('Line Graph');
  const isPieGraphVisible = charts.includes('Pie Graph');

  const handlePrint = useReactToPrint({
    content: () => componentRef.current,
  });

  return (
    <div className="p-6 bg-gray-100 min-h-0 w-full" ref={componentRef}>
      <div className="flex flex-col gap-10">
        {isBarGraphVisible && (
          <div className="bg-white rounded-lg shadow-md p-4 overflow-x-auto">
            <div className='w-full'>
              <Chart options={barChartOptions} series={barChartSeries} type="bar" height={350} />
              <p className="text-center mt-2">This bar chart shows the comparison of operational and developmental performance across different regions.</p>
            </div>
          </div>
        )}

        {isLineGraphVisible && (
          <div className="bg-white rounded-lg shadow-md p-4 overflow-x-auto">
            <div className='w-full'>
              <Chart options={lineChartOptions} series={lineChartSeries} type="line" height={350} />
              <p className="text-center mt-2">This line chart illustrates the trend analysis of operational and developmental metrics over time.</p>
            </div>
          </div>
        )}

        {isPieGraphVisible && (
          <div className="bg-white rounded-lg shadow-md p-4">
            <Chart
              options={pieChartOptions}
              series={getPieChartData()}
              type="pie"
              height={350}
            />
            <p className="text-center mt-2">This pie chart represents the overall distribution of operational, developmental, training, and withdraw statuses.</p>
          </div>
        )}
      </div>
      <button onClick={handlePrint} className="fixed bottom-5 right-5 bg-blue-500 text-white p-3 rounded-full shadow-lg">
        Print PDF
      </button>
    </div>
  );
};

export default ChartsDashboard;