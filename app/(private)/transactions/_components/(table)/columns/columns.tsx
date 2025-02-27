"use client";

import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";

import { Transaction } from "@/types/global";
import { ColumnDef } from "@tanstack/react-table";
import { ArrowUpDown } from "lucide-react";
import Actions from "./action";
import { cn, formatCurrency } from "@/lib/utils";

import { CategoryColumn } from "./category-column";
import { WalletColumn } from "./wallet-column";

// This type is used to define the shape of our data.
// You can use a Zod schema here if you want.

// date, amount, sent to, note, type, category

export const columns: ColumnDef<Transaction>[] = [
  {
    id: "select",
    header: ({ table }) => (
      <Checkbox
        checked={
          table.getIsAllPageRowsSelected() ||
          (table.getIsSomePageRowsSelected() && "indeterminate")
        }
        onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
        aria-label="Select all"
      />
    ),
    cell: ({ row }) => (
      <Checkbox
        checked={row.getIsSelected()}
        onCheckedChange={(value) => row.toggleSelected(!!value)}
        aria-label="Select row"
      />
    ),
    enableSorting: false,
    enableHiding: false,
  },
  {
    accessorKey: "date",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Date
          <ArrowUpDown />
        </Button>
      );
    },
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
    accessorKey: "category",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Category
          <ArrowUpDown />
        </Button>
      );
    },
    cell: ({ row }) => {
      return (
        <CategoryColumn
          id={row.original.id}
          category={row.original.category || null}
          categoryId={row.original.categoryId || null}
        />
      );
    },
  },
  {
    accessorKey: "payee",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Sent to
          <ArrowUpDown />
        </Button>
      );
    },
    cell: ({ row }) => (
      <div className="capitalize">{row.getValue("payee")}</div>
    ),
  },

  {
    accessorKey: "type",
    header: "Type",
    cell: ({ row }) => {
      const amount = parseFloat(row.getValue("amount"));
      const identityType = amount > 0 ? "Income" : "Expense";
      return (
        <div
          className={cn(
            "capitalize rounded-lg text-center p-2",
            identityType === "Income" && "bg-green-500 text-white-100",
            identityType === "Expense" && "bg-red-500 text-white-100"
          )}
        >
          {identityType}
        </div>
      );
    },
  },
  {
    accessorKey: "amount",
    header: ({ column }) => {
      return (
        <div className="flex justify-end">
          <Button
            className=""
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          >
            Amount
            <ArrowUpDown />
          </Button>
        </div>
      );
    },
    cell: ({ row }) => {
      const formattedCurrency = formatCurrency(
        parseFloat(row.getValue("amount"))
      );

      return (
        <div className="font-medium text-right px-4">{formattedCurrency}</div>
      );
    },
  },

  // ? Optional: Add a wallet column with edit name
  {
    accessorKey: "wallet",
    header: ({ column }) => {
      return (
        <div className="flex justify-center">
          <Button
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          >
            Wallet
            <ArrowUpDown />
          </Button>
        </div>
      );
    },
    cell: ({ row }) => {
      return (
        <WalletColumn
          wallet={row.original.wallet || null}
          walletId={row.original.walletId}
        />
      );
    },
  },
  {
    accessorKey: "notes",
    header: "Description",
  },

  {
    id: "actions",
    enableHiding: false,
    cell: ({ row }) => <Actions id={row.original.id} />,
  },
];
