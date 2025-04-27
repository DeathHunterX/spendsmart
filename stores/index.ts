import { create } from "zustand";
import { FormModalState, SavingRecordModalState } from "./type";
import { SavingRecord } from "@/types/global";

export const formModalStore = create<FormModalState>((set, get) => ({
  id: undefined,
  isOpen: false,
  table: "wallet",
  type: "create",
  onOpen: (id) => {
    const { type } = get();
    if (type === "create") {
      set({ isOpen: true, id: undefined });
    } else if (type === "update") {
      if (id) {
        set({ isOpen: true, id });
      } else {
        console.error("ID is required for updating data.");
      }
    }
  },
  onClose: () => set({ isOpen: false }),
  setTable: (table) => set({ table }),
  setType: (type) => set({ type }),
}));

export const savingRecordModalStore = create<SavingRecordModalState>(
  (set, get) => ({
    data: undefined,
    isModalOpen: false,
    formType: "create",
    setFormType: (type) => {
      set({ formType: type });
    },
    actionType: "savings",
    setActionType: (type) => {
      set({ actionType: type });
    },
    handleOpen: (data?: SavingRecord) => {
      const { formType } = get();
      if (formType === "create") {
        set({ isModalOpen: true, data: undefined });
      } else if (formType === "update" && data) {
        set({ isModalOpen: true, data });
      } else {
        console.error("ID is required for updating data.");
      }
    },
    handleClose: () => set({ isModalOpen: false }),
  })
);
