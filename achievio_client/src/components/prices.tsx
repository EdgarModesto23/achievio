import { Button, Card, Drawer } from "flowbite-react";
import { Activity } from "../../types/activity";

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
            {rewards.map((reward: Activity) => (
              <Card className="w-full flex-col">
                <h5 className="text-2xl font-bold tracking-tight text-gray-900 dark:text-white">
                  {reward.name} - {reward.points} pts
                </h5>
                <div className="grid grid-cols-2 gap-2">
                  <Button>Redeem</Button>
                  <Button color="gray">Edit</Button>
                </div>
              </Card>
            ))}
          </div>
        </Drawer.Items>
      </Drawer>
    </>
  );
}
