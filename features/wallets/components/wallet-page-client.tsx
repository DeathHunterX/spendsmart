"use client";

import React from "react";
import { Wallet } from "@/types/global";
import { useOpenWallet } from "../hooks/use-open-wallet";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";

import { columns } from "@/features/wallets/components/table/columns";
import { deleteWalletBulk } from "@/lib/actions/wallet.action";
import { toast } from "@/hooks/use-toast";
import { DataTable } from "./table/data-table";

const WalletClientPage = ({ data }: { data: Wallet[] }) => {
  const { onOpen, setType } = useOpenWallet();

  const handleCreateWallet = () => {
    setType("CREATE");
    onOpen();
  };
  // TODO: Add skeleton component for this page
  return (
    <div className="max-w-screen-2xl mx-auto pb-10">
      <div className="flex lg:flex-row justify-between lg:items-center">
        <h3 className="font-bold text-xl line-clamp-1 py-2">Wallet page</h3>
        <div className="">
          <Button onClick={handleCreateWallet} className="">
            <Plus className="w-4 h-4" />
            Add new
          </Button>
        </div>
      </div>
      <div className="">
        <DataTable
          data={data}
          columns={columns}
          filterKey="name"
          onDelete={async (row) => {
            const ids = row.map((r) => r.original.id);
            // TODO: add delete wallet bulk
            const result = await deleteWalletBulk({ ids });

            if (result.success === true) {
              toast({
                title: "Delete wallet successfully ",
              });
            }
          }}
          disabled={false}
        />
      </div>
    </div>
  );
};

export default WalletClientPage;
