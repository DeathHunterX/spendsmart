"use client";
import { useState } from "react";
import {
  ColumnDef,
  ColumnFiltersState,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  Row,
  SortingState,
  useReactTable,
  VisibilityState,
} from "@tanstack/react-table";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTrigger,
} from "@/components/ui/dialog";

import { DatePickerWithRange } from "../../../../../components/shared/DateRange";
import { SlidersHorizontal, Trash } from "lucide-react";

import { useConfirm } from "@/hooks/use-confirm";
import { DialogDescription, DialogTitle } from "@radix-ui/react-dialog";
import { DataTablePagination } from "@/components/shared/table/TablePagination";

interface DataTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[];
  data: TData[];
  filterKey: string;
  onDelete: (rows: Row<TData>[]) => void;
  disabled?: boolean;
}

export function DataTable<TData, TValue>({
  columns,
  data,
  filterKey,
  onDelete,
  disabled,
}: DataTableProps<TData, TValue>) {
  const [sorting, setSorting] = useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({});
  const [rowSelection, setRowSelection] = useState({});

  const [ConfirmationDialog, confirm] = useConfirm(
    "Are you sure?",
    "You are about to perform a bulk delete"
  );

  const table = useReactTable({
    data,
    columns,
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    onColumnVisibilityChange: setColumnVisibility,
    onRowSelectionChange: setRowSelection,
    state: {
      sorting,
      columnFilters,
      columnVisibility,
      rowSelection,
    },
  });

  return (
    <div className="w-full">
      <ConfirmationDialog />

      <div className="flex items-center py-4">
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
              value={
                (table.getColumn(filterKey)?.getFilterValue() as string) ?? ""
              }
              onChange={(event) =>
                table.getColumn(filterKey)?.setFilterValue(event.target.value)
              }
              className="max-w-sm mr-4"
            />
            {table.getFilteredRowModel().rows.length > 0 && (
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
      </div>

      <div className="rounded-md border">
        <Table className="overflow-x-auto">
          <TableHeader className="w-1/12">
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => {
                  return (
                    <TableHead key={header.id}>
                      {header.isPlaceholder
                        ? null
                        : flexRender(
                            header.column.columnDef.header,
                            header.getContext()
                          )}
                    </TableHead>
                  );
                })}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow
                  key={row.id}
                  data-state={row.getIsSelected() && "selected"}
                >
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id}>
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext()
                      )}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell
                  colSpan={columns.length}
                  className="h-24 text-center"
                >
                  No results.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
      <div className="pt-2">
        <DataTablePagination table={table} />
      </div>
    </div>
  );
}
