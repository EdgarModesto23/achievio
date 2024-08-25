import { Button, Drawer } from "flowbite-react";
import { Activity } from "../../types/activity";
import ActivityCard from "./activities";
import { useState } from "react";
import { AddReward } from "./add-rewards";

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
  const [openCreate, setOpenCreate] = useState<boolean>(false);

  return (
    <>
      <div>
        <Drawer open={isOpen} onClose={handleClose}>
          <Drawer.Header title="Rewards" />
          <Drawer.Items>
            <p className="mb-6 text-sm text-gray-500 dark:text-gray-400">
              Redeem your rewards!
            </p>
            <Button onClick={() => setOpenCreate(true)}>Add reward</Button>
            <div className="mt-10 grid h-full grid-cols-1 gap-4">
              {rewards.map((reward: Activity, idx: number) => (
                <ActivityCard reward activity={reward} key={idx} />
              ))}
            </div>
          </Drawer.Items>
        </Drawer>
        <AddReward isOpen={openCreate} setIsOpen={setOpenCreate} />
      </div>
    </>
  );
}
