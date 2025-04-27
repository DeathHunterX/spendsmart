import { FileSearch, Loader2 } from "lucide-react";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

import { Skeleton } from "@/components/ui/skeleton";

import { Line } from "rc-progress";

type Props = {
  data?: {
    name: string;
    value: number;
    goals: number;
  }[];
};

export const BudgetProgressive = ({ data = [] }: Props) => {
  return (
    <Card className="drop-shadow-sm h-full">
      <CardHeader className="flex space-y-2 lg:space-y-0 lg:flex-row lg:items-center justify-between">
        <CardTitle className="text-lg line-clamp-1">Monthly Budgets</CardTitle>
      </CardHeader>
      <CardContent>
        {data.length === 0 ? (
          <div className="flex flex-col gap-y-4 items-center justify-center h-[350px] w-full">
            <FileSearch className="size-6 text-muted-foreground" />
            <p className="text-muted-foreground text-sm">
              No data for this period
            </p>
          </div>
        ) : (
          <div className="flex flex-col gap-y-4 max-h-[22rem] overflow-y-auto pr-4">
            {data.map((item, idx) => {
              const colors = ["#ff6b81", "#51cf66", "#4dabf7", "#fbc531"];

              return (
                <div key={idx} className="relative">
                  <div className="mb-2 flex flex-row justify-between items-center">
                    <span className="text-base font-bold">{item.name}</span>
                    <div className="">
                      <small className="font-bold">
                        {(item.value / item.goals) * 100}
                      </small>{" "}
                      / <small>100</small>
                    </div>
                  </div>
                  <Line
                    percent={(item.value / item.goals) * 100}
                    trailWidth={3}
                    strokeWidth={3}
                    strokeLinecap="square"
                    strokeColor={colors[idx % colors.length]}
                    className="rounded-full"
                  />
                </div>
              );
            })}
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export const BudgetProgressiveLoading = () => {
  return (
    <Card className="drop-shadow-sm">
      <CardHeader className="flex space-y-2 lg:space-y-0 lg:flex-row lg:items-center justify-between">
        <Skeleton className="h-8 w-48" />
        <Skeleton className="h-8 lg:w-[120px] w-full" />
      </CardHeader>
      <CardContent>
        <div className="h-[350px] w-full flex items-center justify-center">
          <Loader2 className="h-6 w-6 text-slate-300 animate-spin" />
        </div>
      </CardContent>
    </Card>
  );
};
