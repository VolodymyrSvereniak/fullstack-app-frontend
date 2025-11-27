import { useState, useEffect } from "react";
import type { Client, Mode } from "../types/types";

interface ModalFormProps {
  isOpen: boolean;
  onClose: () => void;
  mode: Mode;
  OnSubmit: (client: Omit<Client, "id">) => Promise<void> | void;
  clientData?: Client | null;
}

export default function ModalForm({
  isOpen,
  onClose,
  mode,
  OnSubmit,
  clientData,
}: ModalFormProps) {
  const [name, setName] = useState<string>("");
  const [email, setEmail] = useState<string>("");
  const [job, setJob] = useState<string>("");
  const [rate, setRate] = useState<string>("");
  const [status, setStatus] = useState<boolean>(false);

  const handleStatusChange = (
    e: React.ChangeEvent<HTMLSelectElement>
  ): void => {
    setStatus(e.target.value === "Active");
  };

  const handleSubmit = async (
    e: React.FormEvent<HTMLFormElement>
  ): Promise<void> => {
    e.preventDefault();
    try {
      const payload: Omit<Client, "id"> = {
        name,
        email,
        job,
        rate: Number(rate),
        is_active: status,
      };
      await OnSubmit(payload);
      onClose();
    } catch (err) {
      console.error("Error adding client", err);
    }
  };

  useEffect(() => {
    if (mode === "edit" && clientData) {
      setName(clientData.name);
      setEmail(clientData.email);
      setJob(clientData.job);
      setRate(clientData.rate?.toString() ?? "");
      setStatus(clientData.is_active);
    } else {
      setName("");
      setEmail("");
      setJob("");
      setRate("");
      setStatus(false);
    }
  }, [mode, clientData]);

  return (
    <>
      <dialog id="my_modal_3" className="modal" open={isOpen}>
        <div className="modal-box">
          <h3 className="font-bold text-lg py-4">
            {mode === "edit" ? "Edit Client" : "Client Details"}
          </h3>
          <form method="dialog" onSubmit={handleSubmit}>
            <label className="input input-bordered my-4 flex items-center gap-2">
              Name
              <input
                type="text"
                className="grow"
                value={name}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                  setName(e.target.value)
                }
              />
            </label>
            <label className="input input-bordered my-4 flex items-center gap-2">
              Email
              <input
                type="text"
                className="grow"
                value={email}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                  setEmail(e.target.value)
                }
              />
            </label>
            <label className="input input-bordered my-4 flex items-center gap-2">
              Job
              <input
                type="text"
                className="grow"
                value={job}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                  setJob(e.target.value)
                }
              />
            </label>

            <div className="flex mb-4 justify-between my-4">
              <label className="input input-bordered mr-4 flex items-center gap-2">
                Rate
                <input
                  type="number"
                  className="grow"
                  value={rate}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                    setRate(e.target.value)
                  }
                />
              </label>
              <select
                className="select select-bordered w-full max-w-xs"
                onChange={handleStatusChange}
              >
                <option value={"Inactive"}>Inactive</option>
                <option value={"Active"}>Active</option>
              </select>
            </div>

            <button
              type="button"
              className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2"
              onClick={onClose}
            >
              ✕
            </button>

            <button type="submit" className="btn btn-success">
              {mode === "edit" ? "Save Changes" : "Add Client"}
            </button>
          </form>
        </div>
      </dialog>
    </>
  );
}
