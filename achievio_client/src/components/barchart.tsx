import Chart from "react-apexcharts";

export default function BarChart({
  series,
  options,
}: {
  series: ApexAxisChartSeries;
  options: object;
}) {
  return <Chart options={options} series={series} type="bar"></Chart>;
}
