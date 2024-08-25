export interface ScoreSpendData {
  week_id: string;
  points: number;
}

export async function Score(data: ScoreSpendData) {
  try {
    const response = await fetch(`http://localhost:8004/add-pts`, {
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
