import { Table } from "@tanstack/react-table";

type DataTableToolbarProps<TData> = {
  table: Table<TData>;
};

const DataTableToolbar = <TData,>({ table }: DataTableToolbarProps<TData>) => {
  return <div>DataTableToolbar</div>; // Corrected the text
};

export default DataTableToolbar;
