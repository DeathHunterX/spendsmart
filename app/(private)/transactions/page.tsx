import { SearchParams } from "@/types/global";
import TransactionClientPage from "./transactionClient";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Transactions",
};

const TransactionsPage = async ({ searchParams }: SearchParams) => {
  const { fromDate, toDate, walletId } = await searchParams;

  return <TransactionClientPage />;
};

export default TransactionsPage;
