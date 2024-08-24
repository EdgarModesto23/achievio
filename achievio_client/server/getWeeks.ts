import { Week } from "../types/week";

export async function getWeeks() {
  const res = await fetch("http://localhost:8004/weeks");

  const data = await res.json();

  return data["documents"];
}
