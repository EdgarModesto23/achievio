import { create } from "zustand";
import { Week } from "../types/week";

export interface WeekStore {
  weekList: Week[];
  currentScore: number;
  setCurrentScore: (score: number) => void;
  setWeekList: (list: Week[]) => void;
}

export const useWeekStore = create<WeekStore>((set) => ({
  weekList: [],
  currentScore: 0,
  setCurrentScore: (score: number) => set(() => ({ currentScore: score })),
  setWeekList: (list: Week[]) => set(() => ({ weekList: list })),
}));
