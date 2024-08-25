import { useActivityStore } from "../../stores/activites";
import { FormEvent, useState } from "react";
import { Activity } from "../../types/activity";
import {
  Button,
  Card,
  Checkbox,
  Label,
  Modal,
  TextInput,
} from "flowbite-react";
import {
  UpdateActivity,
  UpdateActivityData,
} from "../../server/updateActivity";

function EditActivity({
  activity,
  isOpen,
  setIsOpen,
  reward,
}: {
  activity: Activity;
  isOpen: boolean;
  setIsOpen: (s: boolean) => void;
  reward: boolean;
}) {
  const [name, setName] = useState<string>(activity.name);
  const [points, setPoint] = useState<number>(activity.points);
  const [isMultiplier, setIsMultiplier] = useState<boolean>(
    activity.type === "M" ? true : false,
  );
  const updateActList = useActivityStore((state) => state.updateActivity);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

  function onCloseModal() {
    setIsOpen(false);
  }

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    const type = isMultiplier ? "M" : "A";
    const data: UpdateActivityData = { name: name, points: points, type: type };
    const res: Activity = await UpdateActivity(data, activity.id);
    updateActList(res.id, res);
    setIsSubmitting(false);
    setIsOpen(false);
  };

  return (
    <Modal dismissible show={isOpen} size="md" onClose={onCloseModal} popup>
      <Modal.Header />
      <Modal.Body>
        <div className="space-y-6">
          <h3 className="text-xl font-medium text-gray-900 dark:text-white">
            Edit activity
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
            <div className="mt-3">
              <div className="mb-2 block">
                <Label htmlFor="points" value="Value of points" />
              </div>
              <TextInput
                id="points"
                onChange={(event) => setPoint(Number(event.target.value))}
                value={points}
                type="number"
                required
              />
            </div>
            {reward ? (
              <div></div>
            ) : (
              <div className="mt-5 flex justify-between">
                <div className="flex items-center gap-2">
                  <Checkbox
                    id="type"
                    checked={isMultiplier}
                    onChange={() => setIsMultiplier(!isMultiplier)}
                  />
                  <Label htmlFor="type">Is multiplier</Label>
                </div>
              </div>
            )}
            <div className="mt-7 w-full">
              <Button disabled={isSubmitting} type="submit">
                Save
              </Button>
            </div>
          </form>
        </div>
      </Modal.Body>
    </Modal>
  );
}

export default function ActivityCard({
  activity,
  reward,
}: {
  activity: Activity;
  reward: boolean;
}) {
  const [openEdit, setOpenEdit] = useState<boolean>(false);

  return (
    <div>
      <Card className="flex w-full flex-col">
        <h5 className="text-2xl font-bold tracking-tight text-gray-900 dark:text-white">
          {activity.name} -{" "}
          {activity.type === "M" ? `${activity.points}x` : activity.points} pts
        </h5>
        <div className="grid grid-cols-2 gap-2">
          <Button>{reward ? "Redeem" : "Score"}</Button>
          <Button onClick={() => setOpenEdit(true)} color="gray">
            Edit
          </Button>
        </div>
      </Card>
      <EditActivity
        activity={activity}
        isOpen={openEdit}
        setIsOpen={setOpenEdit}
        reward={reward ? true : false}
      />
    </div>
  );
}
