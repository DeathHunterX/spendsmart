import React from "react";

import { columns } from "@/components/shared/tables/Transactions/columns";
import { DataTable } from "@/components/shared/tables/Transactions/data-table";
import { data } from "@/data/TransactionData";

const TransactionsPage = () => {
  return (
    <div className="container mx-auto h-full py-0">
      <DataTable columns={columns} data={data} />
    </div>
  );
};

export default TransactionsPage;
