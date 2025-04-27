"use client";
import { useState } from "react";

import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import UploadButton from "@/components/shared/button/UploadButton";
import CSVImportedCard from "@/components/shared/card/CSVImportedCard";

import { Loader2, Plus } from "lucide-react";

import { DataTable } from "./_components/(table)/data-table";
import { columns } from "./_components/(table)/columns/columns";

import { formModalStore } from "@/stores";
import {
  useBulkDeleteTransaction,
  useCreateBulkTransactions,
  useGetTransactions,
} from "@/hooks/api/useTransaction";
import { toast } from "@/hooks/use-toast";

enum VARIANTS {
  LIST = "LIST",
  IMPORT = "IMPORT",
}

const INITIAL_IMPORT_RESULTS = {
  data: [],
  errors: [],
  meta: {},
};

const TransactionClientPage = () => {
  // State
  const [variant, setVariant] = useState<VARIANTS>(VARIANTS.LIST);
  const [importResults, setImportResults] = useState(INITIAL_IMPORT_RESULTS);

  // Hooks
  const { onOpen, setType, setTable } = formModalStore();
  const transactionQuery = useGetTransactions();
  const createTransactionsMutation = useCreateBulkTransactions();
  const transactionBulkDeleteMutation = useBulkDeleteTransaction();

  const isDisabled =
    transactionQuery.isLoading || transactionBulkDeleteMutation.isPending;

  const handleCreateTransaction = () => {
    setType("create");
    setTable("transaction");
    onOpen();
  };

  const onUploadCSVData = (results: typeof INITIAL_IMPORT_RESULTS) => {
    setImportResults(results);
    setVariant(VARIANTS.IMPORT);
  };

  const onCancelImportCSVData = () => {
    setImportResults(INITIAL_IMPORT_RESULTS);
    setVariant(VARIANTS.LIST);
  };

  const onImportCSVData = async (
    values: CreateTransactionParams[],
    walletId: string
  ) => {
    if (!values || !walletId) {
      toast({
        title: `Import Error!`,
        description:
          "Missing table selection. Please select an account to continue.",
        variant: "destructive",
      });
      return;
    }
    const data = values.map((value) => ({
      ...value,
      notes: "",
      categoryId: null,
      walletId: walletId as string,
    }));

    createTransactionsMutation.mutate(data, {
      onSuccess: () => {
        onCancelImportCSVData();
      },
    });
  };

  if (transactionQuery.isLoading) {
    return (
      <div className="max-w-screen-2xl mx-auto pb-10">
        <div className="flex lg:flex-row justify-between lg:items-center">
          <h3 className="font-bold text-xl line-clamp-1 py-2">
            Transaction History
          </h3>
          <div className="flex flex-row">
            <Skeleton className="w-[100px] h-[44px] rounded mr-4" />

            <Skeleton className="w-[100px] h-[44px] rounded" />
          </div>
        </div>
        <div className="">
          <div className="flex flex-row justify-between items-center py-8">
            <Skeleton className="w-[100px] h-[44px] rounded" />
            <Skeleton className="w-[100px] h-[44px] rounded" />
          </div>
          <div className="h-[250px] w-full flex items-center justify-center">
            <Loader2 className="size-6 text-slate-300 animate-spin" />
          </div>
        </div>
      </div>
    );
  }
  return (
    <>
      <CSVImportedCard
        data={importResults.data}
        variant={variant}
        onCancel={onCancelImportCSVData}
        onSubmit={onImportCSVData}
      />
      <div className="max-w-screen-2xl mx-auto pb-10">
        <div className="flex lg:flex-row justify-between lg:items-center">
          <h3 className="font-bold text-xl line-clamp-1 py-2">
            Transaction History
          </h3>
          <div className="flex flex-row gap-x-3">
            <UploadButton onUpload={onUploadCSVData} />
            <Button size="sm" onClick={handleCreateTransaction}>
              <Plus className="w-4 h-4" />
              Add new
            </Button>
          </div>
        </div>
        <div className="relative">
          <DataTable
            data={transactionQuery.data || []}
            columns={columns}
            filterKey="payee"
            onDelete={async (row) => {
              const ids = row.map((r) => r.original.id);
              // TODO: add delete transaction bulk
              transactionBulkDeleteMutation.mutate(ids);
            }}
            disabled={false}
          />
        </div>
      </div>
    </>
  );
};

export default TransactionClientPage;
