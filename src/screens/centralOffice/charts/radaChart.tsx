import React, { useCallback } from "react";
import ReactApexChart from "react-apexcharts";
import { ApexOptions } from "apexcharts";

const MONTHS = [
  "All Months", "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December",
];

interface RadarChartProps {
  data: any[];
  selectedMonth: string;
}

const RadarChart: React.FC<RadarChartProps> = ({ data, selectedMonth }) => {
  const monthToFormattedValue = useCallback((month: string) => {
    const year = new Date().getFullYear();
    const monthIndex = MONTHS.indexOf(month);
    if (monthIndex === 0) return "All Months";
    return `${year}-${String(monthIndex).padStart(2, "0")}`;
  }, []);

  const calculateLatestRegionalTotals = useCallback((data: any[]) => {
    if (!data || data.length === 0) {
      return [];
    }

    let latestDate = new Date(Math.max(...data.map(item => new Date(item.date).getTime())));

    if (selectedMonth && selectedMonth !== "All Months") {
      const formattedMonth = monthToFormattedValue(selectedMonth);
      latestDate = new Date(`${formattedMonth}-01`);
    }

    const latestMonthData = data.filter(item => {
      const itemDate = new Date(item.date);
      return (
        itemDate.getMonth() === latestDate.getMonth() &&
        itemDate.getFullYear() === latestDate.getFullYear()
      );
    });

    const uniqueRegions = [...new Set(latestMonthData.map(item => item.region))];
    const regionalTotals = uniqueRegions.reduce((acc, region) => {
      acc[region] = { operational: 0, development: 0, trainingOrOthers: 0, withdraw: 0 };
      return acc;
    }, {} as Record<string, Record<string, number>>);

    latestMonthData.forEach(item => {
      regionalTotals[item.region].operational += parseInt(String(item.operational)) || 0;
      regionalTotals[item.region].development += parseInt(String(item.development)) || 0;
      regionalTotals[item.region].trainingOrOthers += parseInt(String(item.trainingOrOthers)) || 0;
      regionalTotals[item.region].withdraw += parseInt(String(item.withdraw)) || 0;
    });

    return uniqueRegions
      .map(region => ({
        name: region,
        data: [
          regionalTotals[region].operational,
          regionalTotals[region].development,
          regionalTotals[region].trainingOrOthers,
          regionalTotals[region].withdraw,
        ],
        operationalValue: regionalTotals[region].operational,
      }))
      .sort((a, b) => b.operationalValue - a.operationalValue)
      .slice(0, 8)
      .map(({ name, data }) => ({ name, data }));
  }, [monthToFormattedValue, selectedMonth]);

  const options: ApexOptions = {
    chart: { type: "radar", toolbar: { show: false } },
    colors: ["#10b981", "#f59e0b", "#ec4899", "#06b6d4"],
    stroke: { width: 2 },
    fill: { opacity: 0.25 },
    markers: { size: 3, shape: "square" },
    xaxis: { categories: ["Operational", "Development", "Training", "Withdraw"] },
    legend: {
      position: "right",
      fontSize: "8px",
      offsetY: 20,
      horizontalAlign: "center",
    },
    responsive: [
      {
        breakpoint: 640,
        options: {
          legend: { fontSize: "10px" },
        },
      },
    ],
  };

  const series = data ? calculateLatestRegionalTotals(data) : [];

  return (
    <div className="w-full h-full">
      <ReactApexChart options={options} series={series} type="radar" height="100%" />
    </div>
  );
};

export default RadarChart;
