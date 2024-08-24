import { Week } from "../types/week";

export async function getWeeks() {
  const res = await fetch("http://localhost:8004/weeks");

  const json_res = await res.json();

  const data: Week[] = json_res["documents"];

  return data;
}
