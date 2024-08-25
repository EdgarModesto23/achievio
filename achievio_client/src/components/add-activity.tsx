import { Button, Checkbox, Label, Modal, TextInput } from "flowbite-react";
import { FormEvent, useState } from "react";
import { useActivityStore } from "../../stores/activites";
import { UpdateActivityData } from "../../server/updateActivity";
import { Activity } from "../../types/activity";
import { PostActivity } from "../../server/postActivity";

export function AddActivity({
  isOpen,
  setIsOpen,
}: {
  isOpen: boolean;
  setIsOpen: (s: boolean) => void;
}) {
  const [name, setName] = useState<string>("");
  const [points, setPoint] = useState<number>(0);
  const [isMultiplier, setIsMultiplier] = useState<boolean>(false);
  const activitiesStore = useActivityStore((state) => state);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

  function onCloseModal() {
    setIsOpen(false);
    setPoint(0);
    setIsMultiplier(false);
  }

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    const type = isMultiplier ? "M" : "A";
    const data: UpdateActivityData = { name: name, points: points, type: type };
    console.log(data);
    const res: Activity = await PostActivity(data);
    activitiesStore.setActivitiesList([...activitiesStore.activitesList, res]);
    setIsSubmitting(false);
    setIsOpen(false);
  };
  return (
    <>
      <Modal dismissible show={isOpen} size="md" onClose={onCloseModal} popup>
        <Modal.Header />
        <Modal.Body>
          <div className="space-y-6">
            <h3 className="text-xl font-medium text-gray-900 dark:text-white">
              Create a new Activity
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
                  <Label htmlFor="points" value="Value of points" />
                </div>
                <TextInput
                  id="points"
                  type="number"
                  onChange={(e) => setPoint(Number(e.target.value))}
                  required
                />
              </div>
              <div className="mt-3 flex justify-between">
                <div className="flex items-center gap-2">
                  <Checkbox
                    id="type"
                    onChange={() => setIsMultiplier(!isMultiplier)}
                  />
                  <Label htmlFor="type">Is multiplier</Label>
                </div>
              </div>
              <div className="mt-5 w-full">
                <Button disabled={isSubmitting} type="submit">
                  Create activity
                </Button>
              </div>
            </form>
          </div>
        </Modal.Body>
      </Modal>
    </>
  );
}
