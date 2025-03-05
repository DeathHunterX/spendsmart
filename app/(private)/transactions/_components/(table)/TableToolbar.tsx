import { Row, Table } from "@tanstack/react-table";

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTrigger,
} from "@/components/ui/dialog";

import { DatePickerWithRange } from "@/components/shared/DateRange";
import { SlidersHorizontal, Trash } from "lucide-react";
import { DialogDescription, DialogTitle } from "@radix-ui/react-dialog";

interface DataTableToolbarProps<TData> {
  table: Table<TData>;
  filterKey: string;
  onDelete: (rows: Row<TData>[]) => void;
  disabled?: boolean;
}

const TableToolbar = <TData, TValue>({
  table,
  filterKey,
  onDelete,
  disabled,
}: DataTableToolbarProps<TData>) => {
  return (
    <div className="flex flex-row w-full justify-between">
      <div className="flex flex-row items-center">
        <DatePickerWithRange />
        <Dialog>
          <DialogTrigger className="inline-flex size-10 items-center justify-center rounded-full border border-gray-300 bg-white text-black hover:bg-white">
            <SlidersHorizontal size={16} />
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Filter</DialogTitle>

              <DialogDescription className="hidden"></DialogDescription>
            </DialogHeader>

            <Input
              placeholder="Search payee..."
              value={
                (table.getColumn("payee")?.getFilterValue() as string) ?? ""
              }
              onChange={(event) =>
                table.getColumn("payee")?.setFilterValue(event.target.value)
              }
              className="max-w-sm"
            />
          </DialogContent>
        </Dialog>
      </div>

      <div className="flex items-center py-4">
        <Input
          placeholder={`Filter ${filterKey}...`}
          value={(table.getColumn(filterKey)?.getFilterValue() as string) ?? ""}
          onChange={(event) =>
            table.getColumn(filterKey)?.setFilterValue(event.target.value)
          }
          className="max-w-sm mr-4 hidden lg:block"
        />
        {(table.getFilteredRowModel().rows.length > 0 ||
          (table.getColumn("payee")?.getFilterValue() as string)) && (
          <Button
            disabled={disabled}
            size="sm"
            variant="outline"
            className="ml-auto font-normal text-xs"
            onClick={async () => {
              const ok = await confirm();
              if (ok) {
                onDelete(table.getFilteredSelectedRowModel().rows);
                table.resetRowSelection();
              }
            }}
          >
            <Trash className="size-4" />
            Delete ({table.getFilteredSelectedRowModel().rows.length})
          </Button>
        )}
      </div>
    </div>
  );
};

export default TableToolbar;
