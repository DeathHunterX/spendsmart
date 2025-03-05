"use client";

import { useGetSummary } from "@/hooks/api/useSummary";
import { formatDateRange } from "@/lib/utils";
import { PiggyBank, TrendingDown, TrendingUp } from "lucide-react";
import { useSearchParams } from "next/navigation";
import { DataCard, DataCardLoading } from "./DataCard";

const DataGrid = () => {
  const params = useSearchParams();
  const from = params.get("from") || undefined;
  const to = params.get("to") || undefined;

  const { data, isLoading } = useGetSummary();

  const dateRangeLabel = formatDateRange({
    from,
    to,
  });

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 pb-2 mb-4">
        <DataCardLoading />
        <DataCardLoading />
        <DataCardLoading />
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 pb-2 mb-4">
      <DataCard
        title="Income"
        value={data?.incomeAmount}
        percentageChange={data?.incomeChange}
        icon={TrendingUp}
        variant="default"
        dateRange={dateRangeLabel}
      />
      <DataCard
        title="Expense"
        value={data?.expenseAmount}
        percentageChange={data?.expenseChange}
        icon={TrendingDown}
        variant="default"
        dateRange={dateRangeLabel}
      />
      <DataCard
        title="Remaining"
        value={data?.remainingAmount}
        percentageChange={data?.remainingChange}
        icon={PiggyBank}
        variant="default"
        dateRange={dateRangeLabel}
      />
    </div>
  );
};

export default DataGrid;
