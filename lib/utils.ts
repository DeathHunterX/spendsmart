import { clsx, type ClassValue } from "clsx";
import { eachDayOfInterval, format, isSameDay, subDays } from "date-fns";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function convertAmountFromMiliUnits(amount: number) {
  return amount / 1000;
}

export function convertAmountToMiliunits(amount: number) {
  return Math.round(amount * 1000);
}

export function formatCurrency({
  value,
  fractionDigits = 0,
}: {
  value: number;
  fractionDigits?: number;
}) {
  return Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: fractionDigits,
  }).format(value);
}

export function calculatePercentageChange(previous: number, current: number) {
  if (previous === 0) {
    return previous === current ? 0 : 100;
  }

  return ((current - previous) / previous) * 100;
}

export function fillMissingDays(
  activeDays: {
    date: Date;
    income: number;
    expense: number;
  }[],
  startDate: Date,
  endDate: Date
) {
  if (activeDays.length === 0) {
    return [];
  }

  const allDays = eachDayOfInterval({
    start: startDate,
    end: endDate,
  });

  const transactionsByDay = allDays.map((day) => {
    const found = activeDays.find((d) => isSameDay(d.date, day));

    if (found) {
      return found;
    } else {
      return {
        date: day,
        income: 0,
        expense: 0,
      };
    }
  });

  return transactionsByDay;
}

type Period = {
  from: string | Date | undefined;
  to: string | Date | undefined;
};

export function formatDateRange(period?: Period) {
  const defaultTo = new Date();
  const defaultFrom = subDays(defaultTo, 30);

  if (!period?.from) {
    return `${format(defaultFrom, "LLL dd")} - ${format(defaultTo, "LLL dd, y")}`;
  }

  if (period.to) {
    return `${format(period.from, "LLL dd")} - ${format(period.to, "LLL dd, y")}`;
  }

  return format(period.from, "LLL dd, y");
}

export function formatPercentage(
  value: number,
  options: { addPrefix?: boolean; minimumFractionDigits?: number } = {
    addPrefix: false,
    minimumFractionDigits: 0,
  }
) {
  const result = new Intl.NumberFormat("en-US", {
    style: "percent",
    minimumFractionDigits: options.minimumFractionDigits,
  }).format(value / 100);

  if (options.addPrefix && value > 0) {
    return `+${result}`;
  }

  return result;
}

export function calculateSavingsPredictions(
  targetAmount: number,
  savedAmount: number,
  deadline: Date
) {
  const today = new Date();
  const timeRemaining =
    (new Date(deadline).getTime() - today.getTime()) / (1000 * 60 * 60 * 24); // Time remaining in days

  // Avoid division by zero or negative time
  const dailySavings =
    timeRemaining > 0 ? (targetAmount - savedAmount) / timeRemaining : 0;
  const weeklySavings = timeRemaining > 0 ? dailySavings * 7 : 0;
  const monthlySavings = timeRemaining > 0 ? dailySavings * 30 : 0;

  return {
    dailySavings: isFinite(dailySavings) ? dailySavings : 0,
    weeklySavings: isFinite(weeklySavings) ? weeklySavings : 0,
    monthlySavings: isFinite(monthlySavings) ? monthlySavings : 0,
  };
}
