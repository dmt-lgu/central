import { useEffect, useState } from "react";
import ReactApexChart from "react-apexcharts";

const PieChart01 = (props: any) => {
   
  // Initialize chartData with default values
  const [chartData, setChartData] = useState<any>({
    series: [0, 0, 0, 0],
    options: {
      chart: {
        width: 230,
        type: "pie",
        animations: {
            enabled: true,
            easing: 'easeinout',
            speed: 800,
            animateGradually: {
                enabled: true,
                delay: 150
            },
            dynamicAnimation: {
                enabled: true,
                speed: 350
            }
        }
      },
      labels: [
        "Operational",
        "Developmental",
        "For Training/Others",
        "Withdraw",
      ],
      colors: ['#5ae08b', '#facc15', '#ea5c12', '#dc2626'],
      legend: {
        show: false, // This will hide the legend
      },
      responsive: [
        {
          breakpoint: 480,
          options: {
            chart: {
              width: 200,
            },
            legend: {
              show: false, // Ensure the legend is hidden on smaller screens as well
            },
          },
        },
      ],
    },
  });

  // Update chart data when props.data changes
  useEffect(() => {
    if (props.data) {
      const valueList = Object.values(props.data);
      setChartData({
        series: [valueList[1], valueList[2], valueList[3], valueList[4]],
        options: { ...chartData.options },
      });
    }
  }, [props.data]);

  return (
    <div>
      <div id="chart" className=" animate__animated animate__slideInUp ">
        <ReactApexChart
          options={chartData.options}
          series={chartData.series}
          type="pie"
          width={230}
        />
      </div>
    </div>
  );
};

export default PieChart01;
