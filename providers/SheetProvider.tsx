import NewCategorySheet from "@/features/categories/components/new-category-sheet";
import NewWalletSheet from "@/features/wallets/components/new-wallet-sheet";
import React from "react";

const SheetProvider = () => {
  return (
    <>
      <NewWalletSheet />
      <NewCategorySheet />
    </>
  );
};

export default SheetProvider;
