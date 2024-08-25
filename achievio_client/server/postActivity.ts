import { UpdateActivityData } from "./updateActivity";

export async function PostActivity(data: UpdateActivityData) {
  try {
    const response = await fetch(`http://localhost:8004/activities`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const result = await response.json();
    return result["document"]; // Parsed JSON response
  } catch (error) {
    console.error("Error posting data:", error);
    throw error;
  }
}
