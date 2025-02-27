import { create } from "zustand";

type FormModalState = {
  // Dialog state management
  isOpen: boolean;
  onOpen: (id?: string) => void;
  onClose: () => void;

  // Form state management
  id?: string;
  table: "wallet" | "category" | "transaction";
  type: "create" | "update";
  setTable: (table: "wallet" | "category" | "transaction") => void;
  setType: (type: "create" | "update") => void;
};

export const useFormModal = create<FormModalState>((set, get) => ({
  id: undefined,
  isOpen: false,
  table: "wallet",
  type: "create",
  onOpen: (id?: string) => {
    const { type } = get();
    if (type === "create") {
      set({ isOpen: true, id: undefined });
    } else if (type === "update" && id) {
      set({ isOpen: true, id });
    } else {
      console.error("ID is required for handling create or update a data");
    }
  },
  onClose: () => set({ isOpen: false }),
  setTable: (table: "wallet" | "category" | "transaction") => set({ table }),
  setType: (type: "create" | "update") => set({ type }),
}));
