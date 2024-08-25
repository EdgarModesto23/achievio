import { Drawer } from "flowbite-react";
import { Activity } from "../../types/activity";
import ActivityCard from "./activities";

export function RewardsDrawer({
  isOpen,
  setIsOpen,
  rewards,
}: {
  isOpen: boolean;
  setIsOpen: (s: boolean) => void;
  rewards: Activity[];
}) {
  const handleClose = () => setIsOpen(false);

  return (
    <>
      <Drawer open={isOpen} onClose={handleClose}>
        <Drawer.Header title="Rewards" />
        <Drawer.Items>
          <p className="mb-6 text-sm text-gray-500 dark:text-gray-400">
            Redeem your rewards!
          </p>
          <div className="grid grid-cols-1 gap-4">
            {rewards.map((reward: Activity, idx: number) => (
              <ActivityCard activity={reward} key={idx} />
            ))}
          </div>
        </Drawer.Items>
      </Drawer>
    </>
  );
}
