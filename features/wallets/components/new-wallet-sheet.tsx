"use client";
import React, { useEffect, useState } from "react";

// Hooks
import { useOpenWallet } from "../hooks/use-open-wallet";

import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import WalletForm from "./wallet-form";
import { CreateWalletSchema } from "@/lib/validation";
import {
  addWallet,
  editWallet,
  getWalletById,
} from "@/lib/actions/wallet.action";
import { Wallet } from "@/types/global";

const NewWalletSheet = () => {
  const { isOpen, onClose, type, id } = useOpenWallet();

  const [walletData, setWalletData] = useState<Wallet>();

  useEffect(() => {
    // Fetch wallet data if in edit mode and id is available
    const fetchWalletData = async () => {
      if (type === "EDIT" && id) {
        const res = await getWalletById({ id });
        setWalletData(res.data);
      }
    };
    fetchWalletData();
  }, [type, id]);

  const handleSubmit = async (data: any) => {
    if (type === "EDIT" && id) {
      const response = await editWallet({ ...data, walletId: id });
      return response;
    } else {
      const response = await addWallet(data);
      return response;
    }
  };

  return (
    <Sheet open={isOpen} onOpenChange={onClose}>
      <SheetContent side="right" className="overflow-y-auto w-full lg:max-w-md">
        <SheetHeader>
          <SheetTitle>
            {type === "EDIT" ? "Edit Wallet" : "New Wallet"}
          </SheetTitle>
          <SheetDescription>
            {type === "EDIT"
              ? "Make changes to your wallet here. Click save when you're done."
              : "Add your wallet here."}
          </SheetDescription>
        </SheetHeader>
        <WalletForm
          formType={type}
          schema={CreateWalletSchema}
          defaultValues={
            type === "EDIT"
              ? {
                  name: walletData?.name ?? "",
                  description: walletData?.description ?? "",
                  initialBalance: walletData?.initialBalance ?? "0",
                }
              : { name: "", description: "", initialBalance: "0" }
          }
          onSubmit={handleSubmit}
        />
      </SheetContent>
    </Sheet>
  );
};

export default NewWalletSheet;
