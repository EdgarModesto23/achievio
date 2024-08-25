import { create } from "zustand";
import { Week } from "../types/week";

export interface WeekStore {
  weekList: Week[];
  currentWeek: Week;
  setCurrentWeek: (week: Week) => void;
  currentScore: number;
  setCurrentScore: (score: number) => void;
  setWeekList: (list: Week[]) => void;
}

export const useWeekStore = create<WeekStore>((set) => ({
  weekList: [],
  currentScore: 0,
  currentWeek: { id: "", score: 0, total_score: 0, date: "", current: "false" },
  setCurrentWeek: (week: Week) => set(() => ({ currentWeek: week })),
  setCurrentScore: (score: number) => set(() => ({ currentScore: score })),
  setWeekList: (list: Week[]) => set(() => ({ weekList: list })),
}));
