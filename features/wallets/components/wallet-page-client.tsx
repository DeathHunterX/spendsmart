"use client";

import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";

import { columns } from "@/features/wallets/components/table/columns";
import { deleteWalletBulk } from "@/lib/actions/wallet.action";
import { toast } from "@/hooks/use-toast";
import { DataTable } from "./table/data-table";

import { useBulkDeleteWallet, useGetWallets } from "@/hooks/api/useWallet";
import { useFormModal } from "@/hooks/use-form-modal";
import { Wallet } from "@/types/global";

const WalletClientPage = () => {
  const { onOpen, setType, setTable } = useFormModal();

  const walletQuery = useGetWallets();
  const deleteWalletBulkMutation = useBulkDeleteWallet();

  const handleCreateWallet = () => {
    setType("create");
    setTable("wallet");
    onOpen();
  };
  // TODO: Add skeleton component for this page
  return (
    <div className="max-w-screen-2xl mx-auto pb-10">
      <div className="flex lg:flex-row justify-between lg:items-center">
        <h3 className="font-bold text-xl line-clamp-1 py-2">Wallet page</h3>
        <div className="">
          <Button size="sm" onClick={handleCreateWallet}>
            <Plus className="w-4 h-4" />
            Add new
          </Button>
        </div>
      </div>
      <div className="">
        <DataTable
          data={walletQuery.data || []}
          columns={columns}
          filterKey="name"
          onDelete={async (row) => {
            const ids = row.map((r) => r.original.id);
            deleteWalletBulkMutation.mutate(ids);
          }}
          disabled={false}
        />
      </div>
    </div>
  );
};

export default WalletClientPage;
