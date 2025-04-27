"use client";

import {
  ColumnDef,
  flexRender,
  getCoreRowModel,
  useReactTable,
} from "@tanstack/react-table";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

import { Transaction } from "@/types/global";
import { cn } from "@/lib/utils";
import { FileSearch, TriangleAlert } from "lucide-react";
import Link from "next/link";

export const columns: ColumnDef<Transaction>[] = [
  {
    accessorKey: "category",
    header: "Category",
    cell: ({ row }) => {
      const category = row.original.category;

      return (
        <div
          className={cn(
            "flex items-center",
            (!category || category === "") && "text-rose-500"
          )}
        >
          {!category && <TriangleAlert className="mr-2 size-4 shrink-0" />}
          {category || "Uncategorized"}
        </div>
      );
    },
  },
  {
    accessorKey: "date",
    header: "Date",
    cell: ({ row }) => {
      const dateValue = row.getValue("date") as string | Date;
      const formattedDate =
        dateValue instanceof Date
          ? dateValue.toLocaleDateString()
          : new Date(dateValue).toLocaleDateString("default", {
              timeZone: "UTC",
              year: "numeric",
              month: "2-digit",
              day: "2-digit",
            }); // Ensure the value is formatted as a string

      return <div className="capitalize">{formattedDate}</div>;
    },
  },
  {
    accessorKey: "notes",
    header: "Description",
  },
  {
    accessorKey: "payee",
    header: "Sent to",
  },
  {
    accessorKey: "amount",
    header: "Amount",
    cell: ({ row }) => {
      const amount = row.original.amount as number;
      return (
        <div
          className={
            typeof amount === "number" && amount > 0
              ? "text-emerald-500"
              : "text-rose-500"
          }
        >
          {typeof amount === "number" && amount > 0 ? `+${amount}` : amount}
        </div>
      );
    },
  },
];

export const SimpleTable = ({ data }: { data: Transaction[] }) => {
  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
  });

  return (
    <Card className="drop-shadow-sm h-full">
      <CardHeader className="flex space-y-2 lg:space-y-0 lg:flex-row lg:items-center justify-between">
        <CardTitle className="text-lg line-clamp-1">
          Transaction History
        </CardTitle>
        <Link href="/transactions" className="underline text-sm text-blue-500">
          See all
        </Link>
      </CardHeader>
      <CardContent>
        <div className="w-full">
          <Table>
            <TableHeader className="font-bold">
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
                  <TableCell colSpan={columns.length} className="h-[18.8rem]">
                    <div className="flex flex-col gap-y-4 items-center justify-center w-full">
                      <FileSearch className="size-6 text-muted-foreground" />
                      <p className="text-muted-foreground text-sm">
                        No data for this period
                      </p>
                    </div>
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  );
};
