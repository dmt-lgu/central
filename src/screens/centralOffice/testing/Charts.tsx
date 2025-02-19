import React, { useEffect, useRef } from 'react';
import Chart from 'react-apexcharts';
import { ApexOptions } from 'apexcharts';
import { useSelector } from 'react-redux';
import { selectCharts } from './../../../redux/chartSlice';
import { selectData } from '@/redux/dataSlice';
import { selectProject } from '@/redux/projectSlice';

import { useReactToPrint } from 'react-to-print';
import { selectDate } from '@/redux/dateSlice';
import { selectRegions } from '@/redux/regionSlice';

const ChartsDashboard: React.FC = () => {
  const charts = useSelector(selectCharts);
  const data = useSelector(selectData);
  const date = useSelector(selectDate);
  const regionss = useSelector(selectRegions);

  const project = useSelector(selectProject);
  const componentRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    console.log(data);
  }, [data]);

  useEffect(() => {
    console.log(charts);
  }, [charts]);

  const regions = Object.keys(data).reduce((acc: string[], serviceKey: string) => {
    const serviceData = data[serviceKey];
    serviceData.forEach((monthData: any) => {
      monthData.data.forEach((regionData: any) => {
        if (!acc.includes(regionData.region)) {
          acc.push(regionData.region);
        }
      });
    });
    return acc;
  }, []);

  const calculateValues = () => {
    const operationalValues = Array(regions.length).fill(0);
    const developmentalValues = Array(regions.length).fill(0);

    Object.entries(data).forEach(([_permitType, serviceData]: [string, any]) => {
      // Only get the most recent month's data
      if (serviceData.length > 0) {
        const mostRecentData = serviceData[serviceData.length - 1];
        
        mostRecentData.data.forEach((regionData: any) => {
          const regionIndex = regions.indexOf(regionData.region);
          if (regionIndex !== -1) {
            operationalValues[regionIndex] += regionData.operational;
            developmentalValues[regionIndex] += regionData.developmental;
          }
        });
      }
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
      text: 'Operational vs. Developmental Performance',
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
      text: 'Trend Analysis ',
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

    Object.entries(data).forEach(([_permitType, serviceData]: [string, any]) => {
      if (serviceData.length > 0) {
        const mostRecentData = serviceData[serviceData.length - 1];
        
        mostRecentData.data.forEach((regionData: any) => {
          operationalTotal += regionData.operational;
          developmentalTotal += regionData.developmental;
          trainingTotal += regionData.training;
          withdrawTotal += regionData.withdraw;
        });
      }
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

  const formatProjectList = (items: any[]) => {
    if (!Array.isArray(items)) return '';
    
    // Map items to their string representation
    const stringItems = items.map(item => {
      // If item is an object with a name or value property, use that
      if (typeof item === 'object' && item !== null) {
        return item.name || item.value || item.toString();
      }
      // Otherwise use the item directly
      return item;
    });

    if (stringItems.length === 0) return '';
    if (stringItems.length === 1) return stringItems[0];
    
    const lastItem = stringItems[stringItems.length - 1];
    const otherItems = stringItems.slice(0, -1);
    
    return `${otherItems.join(', ')} and ${lastItem}`;
  };

  const formatDateRange = (dates: string[]) => {
    if (dates.length <= 1) return dates.join('');
    return `${dates[0]} - ${dates[dates.length - 1]}`;
  };

  



  const getTrendIcon = (trend: string) => {
    switch (trend) {
      case 'increase': return '↑';
      case 'decrease': return '↓';
      default: return '→';
    }
  };



  const getTrendColor = (trend: string, metric: string) => {
    if (metric === 'withdraw') {
      return trend === 'increase' ? 'text-red-600' : trend === 'decrease' ? 'text-green-600' : 'text-gray-600';
    }
    return trend === 'increase' ? 'text-green-600' : trend === 'decrease' ? 'text-red-600' : 'text-gray-600';
  };

  const formatPercentage = (current: number, previous: number): string => {
    if (previous === 0) return '0%';
    const percentage = ((current - previous) / previous) * 100;
    return `${percentage > 0 ? '+' : ''}${percentage.toFixed(1)}%`;
  };

  return (
    <div className="p-6 bg-gray-100 print:bg-white print:p-0" ref={componentRef}>
      <div className="flex flex-col gap-10 print:gap-16">
        {isBarGraphVisible && (
          <div className="bg-white rounded-lg shadow-md p-4 overflow-x-auto print:shadow-none print:overflow-visible">
            <div className='w-full print:w-[100%] print:h-auto'>
              <Chart 
                options={{
                  ...barChartOptions,
                  chart: {
                    ...barChartOptions.chart,
                    width: '100%',
                    height: 400,
                  }
                }} 
                series={barChartSeries} 
                type="bar"
                height={350}
              />
            </div>
            <p className='text-sm mt-4'>{`This bar chart compares operational and developmental performance across ${formatProjectList(regionss)} for  `}
              <span className=' font-gbold'>{`${formatProjectList(project)} `}</span>
              from
              <span className=' font-gbold'>{` ${formatDateRange(date)}. `}</span>
              </p>
          </div>
        )}

        <div className="print-break" /> {/* Page break for next chart */}

        {isLineGraphVisible && (
          <div className="bg-white rounded-lg shadow-md p-4 overflow-x-auto print:shadow-none print:overflow-visible">
            <div className='w-full print:w-[100%] print:h-auto'>
              <Chart 
                options={{
                  ...lineChartOptions,
                  chart: {
                    ...lineChartOptions.chart,
                    width: '100%',
                    height: 400,
                  }
                }} 
                series={lineChartSeries} 
                type="line"
                height={350}
              />
            </div>
            <p className='text-sm mt-4'>{`Trend analysis of operational and developmental metrics over time across ${formatProjectList(regionss)} for `}
              <span className='font-gbold'>{`${formatProjectList(project)} `}</span>
              from
              <span className='font-gbold'>{` ${formatDateRange(date)}. `}</span>
            </p>
          </div>
        )}

        <div className="print-break" /> {/* Page break for analytics */}
        {isLineGraphVisible && (
        Object.entries(data).map(([service, serviceData]: [string, any]) => (
          <div key={service} className="w-[68vw] bg-white rounded-lg shadow-md p-4 print:w-full print:shadow-none">
            <h2 className="text-xl font-bold mb-4">{service}</h2>
            <div className="overflow-x-auto print:overflow-visible">
              <div className="flex gap-4 pb-4 w-full print:grid print:grid-cols-3 print:gap-4">
                {serviceData.map((monthData: any, index: number) => {
          const date = monthData.date;
          // Sort regions to maintain consistent order
          const sortedRegionData = [...monthData.data].sort((a, b) => 
            a.region.localeCompare(b.region)
          );
          
          return (
            <div key={date} className="min-w-[250px] sm:min-w-[300px] flex-shrink-0 print:min-w-0">
              <h3 className="font-bold text-lg mb-2">{date}</h3>
              <div className="space-y-4">
                {sortedRegionData.map((regionData: any) => {
                  const prevMonthData =
                    index > 0
                      ? serviceData[index - 1].data.find(
                          (d: any) => d.region === regionData.region
                        )
                      : null;

                  return (
                    <div
                      key={`${date}-${regionData.region}`}
                      className="bg-gray-50 p-4 rounded-lg shadow-sm h-[220px]" // Increased height
                    >
                      <h4 className="font-bold mb-2">{regionData.region + ` - ${date}`}</h4>
                      <div className="grid grid-cols-2 gap-2">
                        {["operational", "developmental", "training", "withdraw"].map((type) => (
                          <div
                            key={type}
                            className={`flex flex-col items-center gap-1 p-2 rounded ${getTrendColor(
                              prevMonthData
                                ? regionData[type] > prevMonthData[type]
                                  ? "increase"
                                  : regionData[type] < prevMonthData[type]
                                  ? "decrease"
                                  : "stable"
                                : "stable",
                              type
                            )}`}
                          >
                            <span className="font-medium text-sm whitespace-nowrap">
                              {regionData[type]} {type === 'operational' ? 'Op' : 
                                               type === 'developmental' ? 'Dev' : 
                                               type === 'training' ? 'Train' : 'With'}
                            </span>
                            {prevMonthData && (
                              <div className="flex flex-col items-center text-sm">
                                <span>
                                  {getTrendIcon(
                                    regionData[type] > prevMonthData[type]
                                      ? "increase"
                                      : regionData[type] < prevMonthData[type]
                                      ? "decrease"
                                      : "stable"
                                  )}
                                  {regionData[type] - prevMonthData[type]}
                                </span>
                                <span className="text-xs opacity-75">
                                  ({formatPercentage(regionData[type], prevMonthData[type])})
                                </span>
                              </div>
                            )}
                          </div>
                        ))}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          );
        })}
              </div>
            </div>
          </div>
        )))}

        <div className="print-break" /> {/* Page break for pie chart */}

        {isPieGraphVisible && (
          <div className="bg-white rounded-lg shadow-md p-4 print:shadow-none">
            <div className='print:w-[100%] print:h-auto'>
              <Chart
                options={{
                  ...pieChartOptions,
                  chart: {
                    ...pieChartOptions.chart,
                    width: '100%',
                    height: 400,
                  }
                }}
                series={getPieChartData()}
                type="pie"
                height={350}
              />
            </div>
            <p className='text-sm mt-4'>{`Overall distribution of operational, developmental, training, and withdrawal statuses across ${formatProjectList(regionss)} for `}
              <span className=' font-gbold'>{`${formatProjectList(project)}  `}</span>combined from
              <span className=' font-gbold'>{` ${formatDateRange(date)}. `}</span>
              </p>
          </div>
        )}
      </div>

      <button 
        onClick={handlePrint} 
        className="z-50 fixed bottom-5 right-5 bg-blue-500 text-white p-3 rounded-full shadow-lg print:hidden"
      >
        Print PDF
      </button>
    </div>
  );
};

export default ChartsDashboard;