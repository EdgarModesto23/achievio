import { create } from "zustand";
import { Activity } from "../types/activity";

export interface ActivityStore {
  activitesList: Activity[];
  addActivity: (act: Activity) => void;
}

export const useActivityStore = create<ActivityStore>((set) => ({
  activitesList: [],
  addActivity: (act) =>
    set((state) => ({ activitesList: [...state.activitesList, act] })),
}));
