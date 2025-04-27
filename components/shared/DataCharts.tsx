"use client";

import { useGetSummary } from "@/hooks/api/useSummary";
import React from "react";
import { DataChart, DataChartLoading } from "./chart/chart";
import { SpendingPie, SpendingPieLoading } from "./chart/SpendingPie";
import { SavingGoalProgressive } from "./SavingGoalProgressive";
import { BudgetProgressive } from "./BudgetsProgressive";
import { SimpleTable } from "./table/SimpleTable";

const DataCharts = () => {
  const { data, isLoading } = useGetSummary();

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 lg:grid-cols-6 gap-8">
        <div className="col-span-1 lg:col-span-3 xl:col-span-4">
          <DataChartLoading />
        </div>
        <div className="col-span-1 lg:col-span-3 xl:col-span-2">
          <SpendingPieLoading />
        </div>
      </div>
    );
  }
  return (
    <div className="grid grid-cols-1 lg:grid-cols-6 gap-8">
      <div className="col-span-1 lg:col-span-3 xl:col-span-4">
        <DataChart data={data?.days} />
      </div>
      {/* <div className="col-span-1 lg:col-span-3 xl:col-span-2">
        <SpendingPie data={data?.categories} />
      </div> */}
      <div className="col-span-1 lg:col-span-3 xl:col-span-2">
        <BudgetProgressive
          data={[
            { name: "Groceries", value: 750, goals: 1000 },
            { name: "Transportation", value: 250, goals: 1000 },
            { name: "Pets", value: 500, goals: 1000 },
            { name: "Education", value: 450, goals: 1000 },
            { name: "Clothes", value: 350, goals: 1000 },
            { name: "Food & Drinks", value: 450, goals: 1000 },
            { name: "Food & Drinks", value: 450, goals: 1000 },
            { name: "Food & Drinks", value: 450, goals: 1000 },
            { name: "Food & Drinks", value: 450, goals: 1000 },
            { name: "Food & Drinks", value: 450, goals: 1000 },
          ]}
        />
      </div>

      <div className="col-span-1 lg:col-span-6 xl:col-span-4">
        <SimpleTable data={data?.transactionHistory} />
      </div>
      <div className="col-span-1 lg:col-span-3 xl:col-span-2">
        <SavingGoalProgressive
          data={
            data?.top4SavingGoals && data?.top4SavingGoals?.length > 0
              ? data?.top4SavingGoals?.map((item: any) => ({
                  ...item,
                  value: item.savedAmount,
                  goals: item.targetAmount,
                }))
              : []
          }
        />
      </div>
    </div>
  );
};

export default DataCharts;
