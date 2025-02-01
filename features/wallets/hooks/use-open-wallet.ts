import { create } from "zustand";

type NewWalletState = {
  id?: string;
  isOpen: boolean;
  onOpen: (id?: string) => void;
  onClose: () => void;
  type: "CREATE" | "EDIT";
  setType: (type: "CREATE" | "EDIT") => void;
};

export const useOpenWallet = create<NewWalletState>((set, get) => ({
  id: undefined,
  isOpen: false,
  onOpen: (id?: string) => {
    const { type } = get();
    if (type === "CREATE") {
      set({ isOpen: true, id: undefined });
    } else if (type === "EDIT" && id) {
      set({ isOpen: true, id });
    } else {
      console.error("ID is required for editing a wallet");
    }
  },
  onClose: () => set({ isOpen: false, id: undefined }),
  type: "CREATE",
  setType: (type: "CREATE" | "EDIT") => set({ type }),
}));
