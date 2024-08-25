import { DarkThemeToggle, Navbar, Spinner } from "flowbite-react";
import { Button, Card } from "flowbite-react";
import BarChart from "./components/barchart";
import { useEffect, useState } from "react";
import { Activity } from "../types/activity";
import { useQuery } from "react-query";
import { getWeeks } from "../server/getWeeks";
import { getActivities } from "../server/getActivities";
import { Week } from "../types/week";
import { PlusIcon, TrophyIcon } from "@heroicons/react/16/solid";
import { RewardsDrawer } from "./components/prices";
import { AddActivity } from "./components/add-activity";
import ActivityCard from "./components/activities";
import { useWeekStore } from "../stores/weeks";
import { options } from "./options";
import { useActivityStore } from "../stores/activites";

function formatDate(dateString: string): string {
  const date = new Date(dateString);

  const dayOfWeek = date.toLocaleDateString("en-GB", { weekday: "short" });

  const day = date.getDate().toString().padStart(2, "0");
  const month = (date.getMonth() + 1).toString().padStart(2, "0"); // Months are 0-indexed
  const year = date.getFullYear();

  return `${dayOfWeek} ${day}-${month}-${year}`;
}

function App() {
  const [number, setNumber] = useState(232);
  const weekStore = useWeekStore((state) => state);
  const activityStore = useActivityStore((state) => state);
  const weeks = useQuery("weeks", getWeeks);

  const activities = useQuery("activities", getActivities);

  const [openRewards, setOpenRewards] = useState(false);

  const [openCreateActivity, setOpenCreateActivity] = useState(false);

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

  useEffect(() => {
    if (weeks.data) {
      weekStore.setWeekList(weeks.data);
      const current_week = weeks.data.find((val: Week) => val.current);
      weekStore.setCurrentScore(current_week ? current_week.score : 0);
    }
    if (activities.data) {
      const activitiesList = activities.data.filter(
        (a: Activity) => a.type !== "R",
      );
      activityStore.setActivitiesList(activitiesList);
      const rewards = activities.data.filter(
        (act: Activity) => act.type === "R",
      );
      console.log(rewards);
      activityStore.setRewardsList(rewards);
    }
  }, [weeks.data, activities.data]);

  return (
    <main>
      <Navbar fluid border rounded>
        <Navbar.Brand href="https://flowbite-react.com">
          <span className="self-center whitespace-nowrap text-xl font-semibold dark:text-white">
            Achievio
          </span>
        </Navbar.Brand>
        <Navbar.Toggle />
        <Navbar.Collapse className="flex items-center justify-center">
          <div className="flex items-center justify-center gap-7">
            <Navbar.Link
              className="flex cursor-pointer"
              onClick={() => setOpenRewards(true)}
            >
              <TrophyIcon className="mr-1 size-5" /> Prices
            </Navbar.Link>
            <Navbar.Link
              className="flex cursor-pointer"
              onClick={() => setOpenCreateActivity(true)}
            >
              <PlusIcon className="mr-1 size-5" />
              Add new activity
            </Navbar.Link>
            <Navbar.Link>
              <DarkThemeToggle />
            </Navbar.Link>
          </div>{" "}
        </Navbar.Collapse>
      </Navbar>

      <AddActivity
        isOpen={openCreateActivity}
        setIsOpen={setOpenCreateActivity}
      />

      {activities.data ? (
        <div className="flex min-h-screen  justify-center gap-2 dark:bg-gray-800">
          <Card className="my-5 ml-10 mr-auto w-full">
            <h5 className="text-2xl font-bold tracking-tight text-gray-900 dark:text-white">
              Total of points on the last 10 weeks
            </h5>
            <h2 className="text-2xl font-bold tracking-tight text-gray-900 dark:text-white">
              Available points: {weekStore.currentScore}
            </h2>
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
              {activityStore.activitesList.map(
                (activity: Activity, idx: number) => (
                  <ActivityCard activity={activity} key={idx} />
                ),
              )}
            </div>
          </div>

          <RewardsDrawer
            isOpen={openRewards}
            setIsOpen={setOpenRewards}
            rewards={activityStore.rewardsList}
          />
        </div>
      ) : (
        <Spinner />
      )}
    </main>
  );
}

export default App;
