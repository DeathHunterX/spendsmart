import { FileSearch, Loader2 } from "lucide-react";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Circle } from "rc-progress";
import { Skeleton } from "@/components/ui/skeleton";
import { formatPercentage } from "@/lib/utils";

type Props = {
  data?: {
    name: string;
    value: number;
    goals: number;
  }[];
};

export const SavingGoalProgressive = ({ data = [] }: Props) => {
  return (
    <Card className="drop-shadow-sm h-full">
      <CardHeader className="flex space-y-2 lg:space-y-0 lg:flex-row lg:items-center justify-between">
        <CardTitle className="text-lg line-clamp-1">Saving Goals</CardTitle>
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
          <div className="grid grid-cols-2 gap-8">
            {data.map((item, idx) => {
              const colors = ["#ff6b81", "#51cf66", "#4dabf7", "#fbc531"];

              return (
                <div key={idx} className="relative">
                  <div className="flex flex-row justify-center items-center px-3">
                    <Circle
                      percent={(item.value / item.goals) * 100}
                      trailWidth={7}
                      strokeWidth={7}
                      strokeLinecap="square"
                      strokeColor={colors[idx % colors.length]}
                      className="size-24"
                    />
                    <span
                      className={`text-xl font-medium absolute ms-2 text-[${colors[idx % colors.length]}]`}
                    >
                      {formatPercentage((item.value / item.goals) * 100, {
                        minimumFractionDigits: 2,
                      })}
                    </span>
                  </div>
                  <div className="flex flex-row justify-center items-center my-2">
                    <p className="font-medium">{item.name}</p>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export const SavingGoalProgressiveLoading = () => {
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
