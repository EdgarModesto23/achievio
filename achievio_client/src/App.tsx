import { DarkThemeToggle, Spinner } from "flowbite-react";
import { Button, Card } from "flowbite-react";
import BarChart from "./components/barchart";
import { useState } from "react";
import { Activity } from "../types/activity";
import { useQuery } from "react-query";
import { getWeeks } from "../server/getWeeks";
import { getActivities } from "../server/getActivities";
import { Week } from "../types/week";

function formatDate(dateString: string): string {
  // Create a Date object from the input string
  const date = new Date(dateString);

  // Get the day of the week as a short string (e.g., "Fri")
  const dayOfWeek = date.toLocaleDateString("en-GB", { weekday: "short" });

  // Get the day, month, and year
  const day = date.getDate().toString().padStart(2, "0");
  const month = (date.getMonth() + 1).toString().padStart(2, "0"); // Months are 0-indexed
  const year = date.getFullYear();

  // Return the formatted date
  return `${dayOfWeek} ${day}-${month}-${year}`;
}

function App() {
  const [number, setNumber] = useState(232);

  const weeks = useQuery("weeks", getWeeks);

  const activities = useQuery("activities", getActivities);

  const formated_weeks = weeks.data
    ? weeks.data.map((w: Week) => ({ x: formatDate(w.date), y: w.total_score }))
    : null;

  const series: ApexAxisChartSeries = [
    {
      name: "Points",
      color: "#FDBA8C",
      data: formated_weeks ? formated_weeks : [],
    },
  ];
  const options: object = {
    colors: ["#FDBA8C"],
    chart: {
      type: "bar",
      height: "320px",
      fontFamily: "Inter, sans-serif",
      toolbar: {
        show: false,
      },
    },
    plotOptions: {
      bar: {
        horizontal: true,
        columnWidth: "70%",
        borderRadiusApplication: "end",
        borderRadius: 8,
      },
    },
    tooltip: {
      shared: true,
      intersect: false,
      style: {
        fontFamily: "Inter, sans-serif",
      },
    },
    states: {
      hover: {
        filter: {
          type: "darken",
          value: 1,
        },
      },
    },
    stroke: {
      show: true,
      width: 0,
      colors: ["transparent"],
    },
    grid: {
      show: false,
      strokeDashArray: 4,
      padding: {
        left: 2,
        right: 2,
        top: -14,
      },
    },
    dataLabels: {
      enabled: true,
    },
    legend: {
      show: false,
    },
    xaxis: {
      floating: false,
      labels: {
        show: true,
        style: {
          fontFamily: "Inter, sans-serif",
          cssClass: "text-xs font-normal fill-gray-500 dark:fill-gray-400",
        },
      },
      axisBorder: {
        show: false,
      },
      axisTicks: {
        show: false,
      },
    },
    yaxis: {
      show: true,
    },
    fill: {
      opacity: 1,
    },
  };
  return (
    <main>
      {activities.data ? (
        <div className="flex min-h-screen  justify-center gap-2 dark:bg-gray-800">
          <Card className="my-40 ml-10 mr-auto w-full">
            <h5 className="text-2xl font-bold tracking-tight text-gray-900 dark:text-white">
              Total of points on the last 10 weeks
            </h5>
            <BarChart series={series} options={options} />
            <Button onClick={() => setNumber(number + 50)}>
              See full history
              <svg
                className="-mr-1 ml-2 size-4"
                fill="currentColor"
                viewBox="0 0 20 20"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  fillRule="evenodd"
                  d="M10.293 3.293a1 1 0 011.414 0l6 6a1 1 0 010 1.414l-6 6a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-4.293-4.293a1 1 0 010-1.414z"
                  clipRule="evenodd"
                />
              </svg>
            </Button>
          </Card>
          <div className="mr-10 h-screen overflow-y-scroll">
            <Card className="mt-5  flex w-full">
              <h5 className="w-fit text-2xl font-bold tracking-tight text-gray-900 dark:text-white">
                Activities
              </h5>
            </Card>
            <div className="mt-5 flex h-5/6 flex-col items-start gap-2 overflow-y-scroll">
              {activities.data.map((activity: Activity) => (
                <Card className="flex w-full flex-col">
                  <h5 className="text-2xl font-bold tracking-tight text-gray-900 dark:text-white">
                    {activity.name} - {activity.points} pts
                  </h5>
                  <Button>Score</Button>
                </Card>
              ))}
            </div>
          </div>
        </div>
      ) : (
        <Spinner />
      )}
    </main>
  );
}

export default App;
