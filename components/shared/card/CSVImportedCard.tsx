import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { DialogClose, DialogDescription } from "@radix-ui/react-dialog";
import { useRef, useState } from "react";
import CSVImportedTable from "../table/CSVImportedTable";
import { convertAmountToMiliunits } from "@/lib/utils";
import { format, parse, isValid } from "date-fns";
import { CreatableSelect } from "@/components/custom-ui/creatable-select";
import { useCreateWallet, useGetWallets } from "@/hooks/api/useWallet";
// import { ActionResponse } from "@/types/global";

interface SelectedColumnsState {
  [key: string]: string | null;
}

type CSVImportedCardProps = {
  data: string[][];
  variant: "LIST" | "IMPORT";
  onCancel: () => void;
  onSubmit: (data: any, walletId: string) => void;
};

const dateFormat = "yyyy-MM-dd HH:mm:ss";
const outputFormat = "yyyy-MM-dd";

const requireOptions = ["amount", "date", "payee"];

const CSVImportedCard = ({
  data,
  variant,
  onCancel,
  onSubmit,
}: CSVImportedCardProps) => {
  const [selectedColumns, setSelectedColumns] = useState<SelectedColumnsState>(
    {}
  );
  const selectValue = useRef<string>();

  const headers = data[0];
  const body = data.slice(1);

  const walletQuery = useGetWallets();
  const walletMutation = useCreateWallet();
  const onCreateAccount = (name: string) =>
    walletMutation.mutate({ name, initialBalance: "0" });

  const accountOptions = (walletQuery.data ?? []).map((account) => ({
    label: account.name,
    value: account.id,
  }));

  const onTableHeadSelectChange = (
    columnIndex: number,
    value: string | null
  ) => {
    setSelectedColumns((prev) => {
      const newSelectedColumns = { ...prev };

      for (const key in newSelectedColumns) {
        if (newSelectedColumns[key] === value) {
          newSelectedColumns[key] = null;
        }
      }

      if (value === "skip") {
        value = null;
      }

      newSelectedColumns[`column_${columnIndex}`] = value;
      return newSelectedColumns;
    });
  };

  const progress = Object.values(selectedColumns).filter(Boolean).length;

  const handleContinue = () => {
    const getColumnIndex = (column: string) => {
      return column.split("_")[1];
    };

    const mappedData = {
      headers: headers.map((_header, index) => {
        const columnIndex = getColumnIndex(`column_${index}`);
        return selectedColumns[`column_${columnIndex}`] || null;
      }),

      body: body
        .map((row) => {
          const transformedRow = row.map((cell, index) => {
            const columnIndex = getColumnIndex(`column_${index}`);
            return selectedColumns[`column_${columnIndex}`] ? cell : null;
          });
          return transformedRow.every((item) => item === null)
            ? []
            : transformedRow;
        })
        .filter((row) => row.length > 0),
    };

    const arrayOfData = mappedData.body.map((row) => {
      return row.reduce((acc: any, cell, index) => {
        const header = mappedData.headers[index];
        if (header !== null) {
          acc[header] = cell;
        }

        return acc;
      }, {});
    });

    const formattedData = arrayOfData.map((item) => {
      let parsedDate = parse(item.date, dateFormat, new Date());

      if (!isValid(parsedDate)) {
        // Try parsing with outputFormat if the dateFormat failed
        parsedDate = parse(item.date, outputFormat, new Date());
      }

      if (isValid(parsedDate)) {
        // Convert parsed date to UTC ignoring timezone
        const utcDate = new Date(
          Date.UTC(
            parsedDate.getFullYear(),
            parsedDate.getMonth(),
            parsedDate.getDate(),
            0,
            0,
            0
          )
        );

        return {
          ...item,
          amount: convertAmountToMiliunits(parseFloat(item.amount)),
          date: utcDate,
          dateFormat, // Format date as yyyy-MM-dd HH:mm:ss
        };
      }
    });

    console.log({ arrayOfData, formattedData });
    onSubmit(formattedData, selectValue.current ?? "");
  };

  return (
    <Dialog open={variant === "IMPORT"} onOpenChange={onCancel}>
      <DialogContent
        className="max-w-7xl"
        aria-describedby="csv-import-description"
      >
        <DialogHeader>
          <div className="flex flex-col text-left items-center md:items-baseline w-full">
            <DialogTitle>Import Transaction</DialogTitle>
            <CreatableSelect
              className="block md:hidden w-full pt-2.5"
              placeholder="Select an account"
              options={accountOptions}
              onCreate={onCreateAccount}
              onChange={(value) => (selectValue.current = value)}
              disabled={walletQuery.isLoading || walletMutation.isPending}
            />
          </div>
          <DialogDescription></DialogDescription>
        </DialogHeader>
        <CSVImportedTable
          headers={headers}
          body={body}
          selectedColumns={selectedColumns}
          onTableHeadSelectChange={onTableHeadSelectChange}
        />

        <div className="flex flex-row justify-between items-center">
          <div className="hidden md:flex flex-row items-center gap-x-4">
            <h5>Table: </h5>
            <CreatableSelect
              className="w-[20vw]"
              placeholder="Select an account"
              options={accountOptions}
              onCreate={onCreateAccount}
              onChange={(value) => (selectValue.current = value)}
              disabled={walletQuery.isLoading || walletMutation.isPending}
              menuPlacement="top"
            />
          </div>
          <DialogFooter className="gap-y-2 w-full">
            <DialogClose asChild>
              <Button size="sm" variant="outline" onClick={onCancel}>
                Cancel
              </Button>
            </DialogClose>
            <Button
              size="sm"
              className=""
              disabled={progress < requireOptions.length}
              onClick={handleContinue}
            >
              Continue ({progress} / {requireOptions.length})
            </Button>
          </DialogFooter>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default CSVImportedCard;
