import { Activity } from "../types/activity";

export async function getActivities() {
  const res = await fetch("http://localhost:8004/activities");

  const data = await res.json();

  return data["documents"];
}
