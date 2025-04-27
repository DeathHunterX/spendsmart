"use client";

import { SavingRecord } from "@/types/global";
import { format } from "date-fns";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { cn, formatCurrency } from "@/lib/utils";
import { EllipsisVertical, Pencil, Trash } from "lucide-react";
import { savingRecordModalStore } from "@/stores";
import { useConfirm } from "@/hooks/use-confirm";
import { useDeleteSavingRecord } from "@/hooks/api/useSavingRecord";

const SavingRecordCard = ({ data }: { data: SavingRecord }) => {
  const { handleOpen, setFormType, setActionType } = savingRecordModalStore();
  const deleteSavingRecordMutation = useDeleteSavingRecord(data?.goalId);

  const handleOpenForm = () => {
    setActionType(data?.recordType);
    setFormType("update");
    handleOpen(data);
  };

  const [ConfirmationDialog, confirm] = useConfirm(
    "Are you sure?",
    "You are about to perform a saving record delete"
  );

  const handleDeleteSavingRecord = async () => {
    const ok = await confirm();
    if (ok) {
      deleteSavingRecordMutation.mutate(data?.id);
    }
  };

  return (
    <>
      <ConfirmationDialog />
      <div
        className="flex flex-row gap-x-8 items-center justify-between w-full px-6 py-4 border rounded-md "
        key={data?.id}
      >
        <div className="grid grid-cols-2 w-full">
          <div className="col-span-1">
            <h3 className="font-semibold text-xl">
              {format(data?.date, "LLL dd, yyyy")}
            </h3>
          </div>
          <div className="col-span-1 text-right">
            <h3
              className={cn(
                "font-semibold text-lg",
                data?.recordType === "withdrawals"
                  ? "text-rose-500"
                  : "text-emerald-500"
              )}
            >
              {formatCurrency({
                value:
                  data?.recordType === "withdrawals"
                    ? -data?.amount
                    : data?.amount,
              })}
            </h3>
          </div>
          <div className="col-span-1">
            <p className="font-light text-sm">{data?.recordType}</p>
          </div>
          <div className="col-span-1 text-right">
            <p className="font-light text-sm">{data?.notes ?? " "}</p>
          </div>
        </div>
        <DropdownMenu>
          <DropdownMenuTrigger className="px-2 py-3">
            <EllipsisVertical size={16} />
          </DropdownMenuTrigger>
          <DropdownMenuContent className="-translate-x-8 -translate-y-2">
            <DropdownMenuLabel
              className="flex flex-row gap-x-3 items-center cursor-pointer hover:bg-gray-100"
              onClick={handleOpenForm}
            >
              <Pencil size={14} /> Edit
            </DropdownMenuLabel>
            <DropdownMenuLabel
              className="flex flex-row gap-x-3 items-center cursor-pointer hover:bg-gray-100"
              onClick={handleDeleteSavingRecord}
            >
              <Trash size={14} /> Delete
            </DropdownMenuLabel>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </>
  );
};

export default SavingRecordCard;
