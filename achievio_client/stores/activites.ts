import { create } from "zustand";
import { Activity } from "../types/activity";

export interface ActivityStore {
  activitesList: Activity[];
  rewardsList: Activity[];
  setRewardsList: (acts: Activity[]) => void;
  addActivity: (act: Activity) => void;
  updateActivity: (id: string, updatedActivity: Activity) => void;
  setActivitiesList: (acts: Activity[]) => void;
}

export const useActivityStore = create<ActivityStore>((set) => ({
  activitesList: [],
  rewardsList: [],
  setRewardsList: (acts) => {
    set(() => ({ rewardsList: acts }));
  },
  addActivity: (act) =>
    set((state) => ({ activitesList: [...state.activitesList, act] })),
  updateActivity: (id, updatedActivity) =>
    set((state) => ({
      activitesList: state.activitesList.map((activity) =>
        activity.id === id ? updatedActivity : activity,
      ),
    })),
  setActivitiesList: (acts) => {
    set(() => ({ activitesList: acts }));
  },
}));
