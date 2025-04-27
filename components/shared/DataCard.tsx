import { ChevronRight, LucideIcon } from "lucide-react";
import { VariantProps, cva } from "class-variance-authority";

import { cn, formatCurrency, formatPercentage } from "@/lib/utils";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "../ui/card";

import CountUp from "react-countup";
import { Skeleton } from "../ui/skeleton";

type Icon = LucideIcon;

const boxVariant = cva("shrink-0 rounded-md p-2.5", {
  variants: {
    variant: {
      default: "bg-blue-500/20",
      success: "bg-emerald-500/20",
      danger: "bg-rose-500/20",
      warning: "bg-yellow-500/20",
    },
  },
  defaultVariants: {
    variant: "default",
  },
});

const iconColors = {
  default: "#3b82f6",
  success: "#22c55e",
  danger: "#f43f5e",
  warning: "#eab308",
};

type BoxVariants = VariantProps<typeof boxVariant>;

interface DataCardProps extends BoxVariants {
  title: string;
  value?: number;
  percentageChange?: number;
  icon: Icon;
  dateRange: string;
}

export const DataCard = ({
  title,
  value = 0,
  percentageChange,
  icon,
  variant,
  dateRange,
}: DataCardProps) => {
  const Icon = icon;
  return (
    <Card className="">
      <CardHeader className="flex flex-row items-center justify-between gap-x-4">
        <div className="space-y-1">
          <CardTitle className="text-base line-clamp-1">{title}</CardTitle>
          <CardDescription className="line-clamp-1">
            {dateRange}
          </CardDescription>
        </div>

        <div className={cn(boxVariant({ variant }))}>
          <Icon
            color={iconColors[variant || "default"]}
            strokeWidth={2}
            className=""
            size={20}
          />
        </div>
      </CardHeader>
      <CardContent className="flex flex-row justify-between items-end relative">
        <div className="">
          <h1 className="font-bold text-xl mb-1 line-clamp-1 break-all">
            <CountUp
              preserveValue
              start={0}
              end={value}
              decimals={2}
              decimalPlaces={2}
              formattingFn={(n) =>
                formatCurrency({ value: n, fractionDigits: 2 })
              }
            />
          </h1>
          {percentageChange && (
            <small
              className={cn(
                "text-muted-foreground line-clamp-1",
                percentageChange > 0 && "text-emerald-500",
                percentageChange < 0 && "text-rose-500"
              )}
            >
              {formatPercentage(percentageChange, { addPrefix: true })} from
              last period
            </small>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export const DataCardLoading = () => {
  return (
    <Card className="h-[192px]">
      <CardHeader className="flex flex-row items-center justify-between gap-x-4">
        <div className="space-y-1">
          <Skeleton className="h-6 w-24" />
          <Skeleton className="h-4 w-40" />
        </div>
        <Skeleton className="size-12" />
      </CardHeader>
      <CardContent>
        <Skeleton className="shrink-0 h-10 w-24 mb-2" />
        <Skeleton className="shrink-0 h-4 w-40" />
      </CardContent>
    </Card>
  );
};
