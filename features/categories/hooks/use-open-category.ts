import { create } from "zustand";

type NewCategoryState = {
  id?: string;
  isOpen: boolean;
  onOpen: (id?: string) => void;
  onClose: () => void;
  type: "CREATE" | "EDIT";
  setType: (type: "CREATE" | "EDIT") => void;
};

export const useOpenCategory = create<NewCategoryState>((set, get) => ({
  id: undefined,
  isOpen: false,
  onOpen: (id?: string) => {
    const { type } = get();
    if (type === "CREATE") {
      set({ isOpen: true, id: undefined });
    } else if (type === "EDIT" && id) {
      set({ isOpen: true, id });
    } else {
      console.error("ID is required for editing a category");
    }
  },
  onClose: () => set({ isOpen: false, id: undefined }),
  type: "CREATE",
  setType: (type: "CREATE" | "EDIT") => set({ type }),
}));
