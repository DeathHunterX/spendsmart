import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

import { TableHeadSelect } from "./TableHeadSelect";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";

type Props = {
  headers?: string[];
  body: string[][];
  selectedColumns: Record<string, string | null>;
  onTableHeadSelectChange: (columnIndex: number, value: string | null) => void;
};

const CSVImportedTable = ({
  headers,
  body,
  selectedColumns,
  onTableHeadSelectChange,
}: Props) => {
  return (
    <div className="rounded-md border overflow-auto">
      <ScrollArea className="relative h-[70vh] rounded border">
        <Table className="w-lvw">
          <TableHeader className="bg-muted sticky top-0">
            <TableRow>
              {headers?.map((_item, index) => (
                <TableHead key={index} style={{ width: "50vw" }}>
                  <TableHeadSelect
                    columnIndex={index}
                    selectedColumns={selectedColumns}
                    onChange={onTableHeadSelectChange}
                  />
                </TableHead>
              ))}
            </TableRow>
          </TableHeader>
          <TableBody className="h-[70vh] overflow-auto">
            {body.map((row: string[], index) => (
              <TableRow key={index}>
                {row.map((cell, index) => (
                  <TableCell key={index}>{cell}</TableCell>
                ))}
              </TableRow>
            ))}
          </TableBody>
        </Table>
        <ScrollBar orientation="vertical" />
        <ScrollBar orientation="horizontal" />
      </ScrollArea>
    </div>
  );
};

export default CSVImportedTable;
