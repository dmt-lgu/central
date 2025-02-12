import React, { useState, useEffect } from 'react';
import Chart from 'react-apexcharts';
import { ApexOptions } from 'apexcharts';
import { useSelector } from 'react-redux';
import { selectCharts } from './../../../redux/chartSlice';

const ChartsDashboard: React.FC = () => {
  const charts = useSelector(selectCharts);
  const [selectedMetric, setSelectedMetric] = useState<'Operational' | 'Developmental'>('Operational');

  useEffect(() => {
    console.log(charts);
  }, [charts]);

  let xaxis = {
    categories: [
      'NCR', 'CAR', 'Region I', 'Region II', 'Region III', 'Region IV-A',
      'Region IV-B', 'Region V', 'Region VI', 'Region VII', 'Region VIII',
      'Region IX', 'Region X', 'Region XI', 'Region XII', 'Region XIII', 'BARMM'
    ]
  }
  
  let values = [
    {
      name: 'Operational',
      data: [45, 32, 38, 29, 42, 40, 25, 33, 47, 41, 28, 31, 35, 39, 34, 27, 30]
    },
    {
      name: 'Developmental',
      data: [35, 25, 28, 22, 32, 30, 18, 24, 29, 31, 20, 23, 26, 30, 25, 19, 22]
    }
  ]

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
      scrollable: {
        enabled: true,
        offsetX: 0,
        offsetY: 0
      }
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
      text: 'Operational vs Developmental Metrics',
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
      scrollable: {
        enabled: true,
        offsetX: 0,
        offsetY: 0
      }
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
    const metricData = values.find(v => v.name === selectedMetric);
    return metricData ? metricData.data : [];
  };

  // Updated Pie Chart Configuration
  const pieChartOptions: ApexOptions = {
    chart: {
      type: 'pie',
      height: 350,
    },
    labels: xaxis.categories,
    colors:  [ '#fbbf24','#1e40af'],
    legend: {
      position: 'right',
      fontSize: '12px',
      height: 230,
      
    },
    title: {
      text: `Regional Distribution - ${selectedMetric}`,
      align: 'left',
    },
  };

  const isBarGraphVisible = charts.includes('Bar Graph');
  const isLineGraphVisible = charts.includes('Line Graph');
  const isPieGraphVisible = charts.includes('Pie Graph');

  return (
    <div className="p-6 bg-gray-100 min-h-0  w-full">
      <div className=" flex flex-col gap-10 ">
        {isBarGraphVisible && (
          <div className="bg-white rounded-lg shadow-md p-4 overflow-x-auto">
            <div className=' w-full'>
              <Chart options={barChartOptions} series={barChartSeries} type="bar" height={350} />
            </div>
          </div>
        )}

        {isLineGraphVisible && (
          <div className="bg-white rounded-lg shadow-md p-4 overflow-x-auto">
            <div className=' w-full'>
              <Chart options={lineChartOptions} series={lineChartSeries} type="line" height={350} />
            </div>
          </div>
        )}

        {isPieGraphVisible && (
          <div className="bg-white rounded-lg className=' w-full' shadow-md p-4">
            <div className="mb-4">
              <select 
                value={selectedMetric}
                onChange={(e) => setSelectedMetric(e.target.value as 'Operational' | 'Developmental')}
                className="w-full md:w-auto px-4 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="Operational">Operational</option>
                <option value="Developmental">Developmental</option>
              </select>
            </div>
            <Chart 
              options={pieChartOptions} 
              series={getPieChartData()} 
              type="pie" 
              height={350} 
            />
          </div>
        )}
      </div>
    </div>
  );
};

export default ChartsDashboard;