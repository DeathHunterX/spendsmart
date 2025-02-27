import { SearchParams } from "@/types/global";
import TransactionClientPage from "@/app/(private)/transactions/transactionClient";

const TransactionsPage = async ({ searchParams }: SearchParams) => {
  const { fromDate, toDate, walletId } = await searchParams;

  return <TransactionClientPage />;
};

export default TransactionsPage;
