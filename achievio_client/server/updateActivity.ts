import { Activity } from "../types/activity";

export interface UpdateActivityData {
  name: string;
  points: number;
  type: string;
}

export async function UpdateActivity(data: UpdateActivityData, ID: string) {
  try {
    const response = await fetch(`http://localhost:8004/activities/${ID}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const result: Activity = await response.json();
    return result; // Parsed JSON response
  } catch (error) {
    console.error("Error posting data:", error);
    throw error;
  }
}
