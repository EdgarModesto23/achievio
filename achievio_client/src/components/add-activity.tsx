import { Button, Checkbox, Label, Modal, TextInput } from "flowbite-react";
import { useState } from "react";

export function AddActivity({
  isOpen,
  setIsOpen,
}: {
  isOpen: boolean;
  setIsOpen: (s: boolean) => void;
}) {
  const [name, setName] = useState("");

  function onCloseModal() {
    setIsOpen(false);
    setName("");
  }

  return (
    <>
      <Modal dismissible show={isOpen} size="md" onClose={onCloseModal} popup>
        <Modal.Header />
        <Modal.Body>
          <div className="space-y-6">
            <h3 className="text-xl font-medium text-gray-900 dark:text-white">
              Create a new Activity
            </h3>
            <form>
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
                <TextInput id="points" type="number" required />
              </div>
              <div className="flex justify-between">
                <div className="flex items-center gap-2">
                  <Checkbox id="type" />
                  <Label htmlFor="type">Is multiplier</Label>
                </div>
              </div>
            </form>
            <div className="w-full">
              <Button type="submit">Create activity</Button>
            </div>
          </div>
        </Modal.Body>
      </Modal>
    </>
  );
}
