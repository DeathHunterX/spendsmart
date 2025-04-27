import { useState } from "react";

import { Line, Circle } from "rc-progress";
import SavingRecordForm from "../forms/SavingRecordForm";

// Ui Component
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { DateRangePicker } from "@/components/custom-ui/DateRangePicker";

// Icons
import { EllipsisVertical, Minus, Pencil, Plus, Trash } from "lucide-react";

// Hooks
import { useGetSavingGoalById } from "@/hooks/api/useSavingGoal";

// Types
import { SavingGoal } from "@/types/global";

// Others
import {
  calculateSavingsPredictions,
  formatCurrency,
  formatPercentage,
} from "@/lib/utils";
import { differenceInDays, startOfMonth } from "date-fns";
import { MAX_DATE_RANGE_DAYS } from "@/constants";

import SavingRecordCard from "./SavingRecordCard";

import { toast } from "@/hooks/use-toast";
import { formModalStore, savingRecordModalStore } from "@/stores";

interface SavingGoalProgressiveCardProps {
  data: SavingGoal;
  lineColor: string;
  onAction: (id: string) => void;
}

export const SavingGoalProgressiveCard = ({
  data,
  lineColor,
  onAction,
}: SavingGoalProgressiveCardProps) => {
  return (
    <div
      className="border rounded-md bg-white w-full p-3 cursor-pointer"
      onClick={() => onAction(data?.id)}
    >
      <div className="flex flex-row gap-x-3">
        <div className="">
          {data?.coverType === "icon" && (
            <div className="text-4xl text-center rounded-full border size-16 flex flex-row justify-center items-center">
              <span>{data?.coverImg}</span>
            </div>
          )}
        </div>
        <div className="flex flex-col w-full gap-y-1">
          <div className="flex flex-row justify-between items-center">
            <h2 className="font-bold">{data?.name}</h2>
            <p className="text-sm">
              {formatCurrency({ value: data?.targetAmount })}
            </p>
          </div>
          <Line
            percent={(data?.savedAmount / data?.targetAmount) * 100}
            trailWidth={3}
            strokeWidth={3}
            strokeLinecap="square"
            strokeColor={lineColor || "#1d4ed8"}
            className="rounded-full"
          />
          <div className="flex flex-row justify-between">
            <small>{formatCurrency({ value: data?.savedAmount })}</small>
            <small>
              {formatCurrency({
                value: data?.targetAmount - data?.savedAmount,
              })}
            </small>
          </div>
        </div>
      </div>
    </div>
  );
};

export const DetailSavingGoalCard = ({
  id,
  onDelete,
}: {
  id: string;
  onDelete: (id: string) => void;
}) => {
  const { data, isLoading } = useGetSavingGoalById(id);

  const { onOpen, setType, setTable } = formModalStore();
  const { setFormType, setActionType, handleOpen } = savingRecordModalStore();

  const [dateRange, setDateRange] = useState<{ from: Date; to: Date }>({
    from: startOfMonth(new Date()),
    to: new Date(),
  });

  const { dailySavings, weeklySavings, monthlySavings } =
    calculateSavingsPredictions(
      data?.targetAmount || 1,
      data?.savedAmount || 0,
      data?.deadline || new Date()
    );

  const handleOpenSavingRecordForm = (type: "savings" | "withdrawals") => {
    setActionType(type);
    setFormType("create");
    handleOpen();
  };

  const handleEditSavingGoal = () => {
    setType("update");
    setTable("saving");
    onOpen(id);
  };

  const savingData = {
    savingsInfo: {
      groupName: "Savings",
      items: [
        {
          label: "Saved",
          value: data?.savedAmount,
        },
        {
          label: "Remaining",
          value: (data?.targetAmount ?? 1) - (data?.savedAmount ?? 0),
        },
        {
          label: "Goal",
          value: data?.targetAmount,
        },
      ],
    },
    deadline: {
      groupName: "Deadline",
      value: "2024-12-26",
    },
    savingsRates: {
      groupName: "Savings Rates",
      items: [
        {
          label: "Daily savings",
          value: dailySavings.toFixed(0),
        },
        {
          label: "Weekly savings",
          value: weeklySavings.toFixed(0),
        },
        {
          label: "Monthly savings",
          value: monthlySavings.toFixed(0),
        },
      ],
    },
  };

  if (isLoading) {
    return <div className="">Loading...</div>;
  }

  return (
    <>
      <SavingRecordForm savingGoalId={data?.id || ""} />

      <div className="p-3 border bg-white h-full rounded-md">
        <Tabs defaultValue="goal">
          <div className="flex flex-row justify-between">
            <TabsList className="w-80 rounded-full">
              <TabsTrigger className="w-full rounded-full" value="goal">
                Goal
              </TabsTrigger>
              <TabsTrigger className="w-full rounded-full" value="records">
                Records
              </TabsTrigger>
            </TabsList>
            <div className="flex flex-row gap-x-2 items-center">
              <DropdownMenu>
                <DropdownMenuTrigger className="p-3">
                  <EllipsisVertical size={18} />
                </DropdownMenuTrigger>
                <DropdownMenuContent className="-translate-x-8 -translate-y-2">
                  <DropdownMenuLabel
                    className="flex flex-row gap-x-3 items-center cursor-pointer hover:bg-gray-100"
                    onClick={handleEditSavingGoal}
                  >
                    <Pencil size={14} /> Edit
                  </DropdownMenuLabel>
                  <DropdownMenuLabel
                    className="flex flex-row gap-x-3 items-center cursor-pointer hover:bg-gray-100"
                    onClick={() => onDelete(id)}
                  >
                    <Trash size={14} /> Delete
                  </DropdownMenuLabel>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>

          <TabsContent value="goal">
            <div className="relative">
              <div className="flex flex-row justify-evenly items-center py-4">
                <TooltipProvider>
                  <Tooltip delayDuration={100}>
                    <TooltipTrigger
                      className="border-8 rounded-full p-3"
                      onClick={() => handleOpenSavingRecordForm("withdrawals")}
                    >
                      <Minus size={20} />
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>Withdrawal money</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>

                <Circle
                  percent={
                    ((data?.savedAmount ?? 0) / (data?.targetAmount ?? 1)) * 100
                  }
                  trailWidth={7}
                  strokeWidth={7}
                  strokeLinecap="square"
                  strokeColor={"#ff6b81"}
                  className="size-52"
                />
                <TooltipProvider>
                  <Tooltip delayDuration={100}>
                    <TooltipTrigger
                      className="border-8 rounded-full p-3"
                      onClick={() => handleOpenSavingRecordForm("savings")}
                    >
                      <Plus size={20} />
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>Add saving</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>

                <div className="absolute">
                  <div className="flex flex-col items-center gap-y-4">
                    {data?.coverType === "icon" && (
                      <div className="text-center rounded-full size-20 flex flex-row justify-center items-center">
                        <span className="text-6xl">{data?.coverImg}</span>
                      </div>
                    )}
                    <h3 className="font-bold">
                      {formatPercentage(
                        (data?.savedAmount ?? 0) / (data?.targetAmount ?? 1),
                        { minimumFractionDigits: 2 }
                      )}
                    </h3>
                  </div>
                </div>
              </div>

              <div className="relative border-t-2 p-3 w-full">
                <div className="absolute -top-3.5 bg-white text-center px-2.5">
                  <h3 className="font-light">
                    {savingData.savingsInfo.groupName}
                  </h3>
                </div>
                <div className="grid grid-cols-3">
                  {savingData.savingsInfo.items.map((item, idx) => (
                    <div className="text-center p-3" key={idx}>
                      <h4 className="font-bold text-lg">
                        {formatCurrency({ value: item.value || 0 })}
                      </h4>
                      <p className="font-light">{item.label}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="relative border-t-2 p-3 w-full">
              <div className="absolute -top-3.5 bg-white text-center px-2.5">
                <h3 className="font-light">
                  {savingData.deadline.groupName}: {savingData.deadline.value}
                </h3>
              </div>
              <div className="grid grid-cols-3">
                {savingData.savingsRates.items.map((item, idx) => (
                  <div className="text-center p-3" key={idx}>
                    <h4 className="font-bold text-lg">
                      {formatCurrency({ value: Number(item.value) })}
                    </h4>
                    <p className="font-light">{item.label}</p>
                  </div>
                ))}
              </div>
            </div>

            <div className="relative border-t-2 p-3 w-full">
              <div className="absolute -top-3.5 bg-white text-center px-2.5">
                <h3 className="font-light">Notes</h3>
              </div>
              <div className="pt-2">
                <p className="text-base">{data?.notes}</p>
              </div>
            </div>
          </TabsContent>
          <TabsContent value="records">
            <div className="px-6">
              <div className="flex flex-row gap-x-2 justify-between">
                <div className="">
                  <DateRangePicker
                    initialDateFrom={dateRange.from}
                    initialDateTo={dateRange.to}
                    showCompare={false}
                    onUpdate={(values) => {
                      const { from, to } = values.range;
                      // We update the date range only if both dates are set

                      if (!from || !to) return;
                      if (differenceInDays(to, from) > MAX_DATE_RANGE_DAYS) {
                        toast({
                          title: "Selection error",
                          description: `The selected date range is too big. Max allowed range is ${MAX_DATE_RANGE_DAYS} days!`,
                        });
                        return;
                      }

                      setDateRange({ from, to });
                    }}
                  />
                </div>
                <div className="">
                  <Select>
                    <SelectTrigger className="w-[180px]">
                      <SelectValue placeholder="Sort by..." />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="date-asc">Date (Newest)</SelectItem>
                      <SelectItem value="date-desc">Date (Oldest)</SelectItem>
                      <SelectItem value="amount-asc">
                        Amount (Low to High)
                      </SelectItem>
                      <SelectItem value="amount-desc">
                        Amount (High to Low)
                      </SelectItem>
                      <SelectItem value="savings">
                        Type (Savings First)
                      </SelectItem>
                      <SelectItem value="withdrawals">
                        Type (Withdrawals First)
                      </SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="py-3">
                <div className="overflow-y-auto flex flex-col gap-y-4 max-h-[59.5vh]">
                  {data?.records &&
                    data?.records?.length > 0 &&
                    data?.records?.map((record) => (
                      <SavingRecordCard data={record} key={record?.id} />
                    ))}
                </div>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </>
  );
};
