"use client";

import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "../ui/sheet";

import { useFormModal } from "@/hooks/use-form-modal";
import dynamic from "next/dynamic";

const WalletForm = dynamic(() => import("./forms/WalletForm"), {
  loading: () => <h1>Loading...</h1>,
});

const CategoryForm = dynamic(() => import("./forms/CategoryForm"), {
  loading: () => <h1>Loading...</h1>,
});

const TransactionForm = dynamic(() => import("./forms/TransactionForm"), {
  loading: () => <h1>Loading...</h1>,
});

const forms: {
  [key: string]: (
    type: "create" | "update",
    onClose: () => void,
    id?: string,
    data?: any,
    relatedData?: any
  ) => JSX.Element;
} = {
  wallet: (type, onClose, id, data, relatedData) => (
    <WalletForm
      id={id}
      type={type}
      onClose={onClose}
      data={data}
      relatedData={relatedData}
    />
  ),
  category: (type, onClose, id, data, relatedData) => (
    <CategoryForm
      id={id}
      type={type}
      onClose={onClose}
      data={data}
      relatedData={relatedData}
    />
  ),
  transaction: (type, onClose, id, data, relatedData) => (
    <TransactionForm
      id={id}
      type={type}
      onClose={onClose}
      data={data}
      relatedData={relatedData}
    />
  ),
};

const FormModal = ({
  table,
  type,
  data,
  relatedData,
  id,
  title,
  description,
}: {
  table: "wallet" | "category" | "transaction";
  type: "create" | "update" | "delete";
  data?: any;
  relatedData?: any;
  id?: string;
  title?: string;
  description?: string;
}) => {
  const { isOpen, onClose } = useFormModal();

  const Form = () => {
    return type === "create" || type === "update"
      ? forms[table](type, onClose, id, data, relatedData)
      : "Form not found!";
  };
  return (
    <>
      <Sheet open={isOpen} onOpenChange={onClose}>
        <SheetContent
          side="right"
          className="overflow-y-auto w-full lg:max-w-md"
        >
          <SheetHeader className="pb-2">
            <SheetTitle>{title}</SheetTitle>
            <SheetDescription>{description}</SheetDescription>
          </SheetHeader>
          <Form />
        </SheetContent>
      </Sheet>
    </>
  );
};

export default FormModal;
