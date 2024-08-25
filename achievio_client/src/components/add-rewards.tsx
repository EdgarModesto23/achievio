import { Button, Label, Modal, TextInput } from "flowbite-react";
import { FormEvent, useState } from "react";
import { UpdateActivityData } from "../../server/updateActivity";
import { PostActivity } from "../../server/postActivity";
import { useActivityStore } from "../../stores/activites";
import { Activity } from "../../types/activity";

export function AddReward({
  isOpen,
  setIsOpen,
}: {
  isOpen: boolean;
  setIsOpen: (s: boolean) => void;
}) {
  const [name, setName] = useState<string>("");
  const [points, setPoints] = useState<number>(0);
  const activityStore = useActivityStore((state) => state);
  const [isSubmitting, setIsSubmiting] = useState<boolean>(false);

  function onCloseModal() {
    setIsOpen(false);
    setName("");
  }

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setIsSubmiting(true);
    console.log("hey");
    const data: UpdateActivityData = { name: name, points: points, type: "R" };
    const res: Activity = await PostActivity(data);
    console.log(res);
    activityStore.setRewardsList([...activityStore.rewardsList, res]);
    setIsSubmiting(false);
    setIsOpen(false);
  };

  return (
    <>
      <Modal dismissible show={isOpen} size="md" onClose={onCloseModal} popup>
        <Modal.Header />
        <Modal.Body>
          <div className="space-y-6">
            <h3 className="text-xl font-medium text-gray-900 dark:text-white">
              Create a new Reward!
            </h3>
            <form onSubmit={(e) => handleSubmit(e)}>
              <div>
                <div className="mb-2 block">
                  <Label htmlFor="name" value="Name of the activity" />
                </div>
                <TextInput
                  id="name"
                  placeholder="Name..."
                  value={name}
                  onChange={(event) => setName(event.target.value)}
                  required
                />
              </div>
              <div>
                <div className="mb-2 block">
                  <Label htmlFor="points" value="Cost of reward" />
                </div>
                <TextInput
                  id="points"
                  type="number"
                  onChange={(e) => setPoints(Number(e.target.value))}
                  required
                />
              </div>
              <div className="mt-5 w-full">
                <Button type="submit" disabled={isSubmitting}>
                  Create reward
                </Button>
              </div>
            </form>
          </div>
        </Modal.Body>
      </Modal>
    </>
  );
}
