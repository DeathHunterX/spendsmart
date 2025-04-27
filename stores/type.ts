import { SavingRecord } from "@/types/global";

export type TableType =
  | "wallet"
  | "category"
  | "transaction"
  | "saving"
  | "budget"
  | "recurring";
// | "analysis"
// | "tracking"
// | "report";

export type FormModalState = {
  // Dialog state management
  isOpen: boolean;
  onOpen: (id?: string) => void;
  onClose: () => void;

  // Form state management
  id?: string;
  table: TableType;
  type: "create" | "update";
  setTable: (table: TableType) => void;
  setType: (type: "create" | "update") => void;
};

export type SavingRecordModalState = {
  data: SavingRecord | undefined;
  isModalOpen: boolean;
  handleOpen: (data?: SavingRecord) => void;
  handleClose: () => void;
  formType: "create" | "update";
  setFormType: (type: "create" | "update") => void;
  actionType: "savings" | "withdrawals";
  setActionType: (type: "savings" | "withdrawals") => void;
};
