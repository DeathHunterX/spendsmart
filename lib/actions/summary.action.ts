"use server";

import { db } from "@/db/drizzle";
import { eq, and, gte, lte, desc, sql, sum, lt } from "drizzle-orm";
import { transactions, categories, wallets } from "@/db/schemas";

import action from "../handlers/action";
import { FilteredSearchParamsSchema } from "../validation";

import { ActionResponse, ErrorResponse } from "@/types/global";
import handleError from "../handlers/error";

import { differenceInDays, parse, subDays } from "date-fns";

import { calculatePercentageChange, fillMissingDays } from "../utils";

export const getSummaryData = async (
  params: FilteredSearchParams
): Promise<ActionResponse<any>> => {
  const validationResult = await action({
    params,
    schema: FilteredSearchParamsSchema,
    authorize: true,
  });

  if (validationResult instanceof Error) {
    return handleError(validationResult) as ErrorResponse;
  }
  const { fromDate, toDate, walletId } = validationResult.params!;

  const userId = validationResult.session?.user?.id!;

  const defaultTo = new Date();
  const defaultFrom = subDays(defaultTo, 30);

  const startDate = fromDate
    ? parse(fromDate, "yyyy-MM-dd", new Date())
    : defaultFrom;
  const endDate = toDate ? parse(toDate, "yyyy-MM-dd", new Date()) : defaultTo;

  const periodLength = differenceInDays(endDate, startDate) + 1;
  const lastPeriodStart = subDays(startDate, periodLength);
  const lastPeriodEnd = subDays(endDate, periodLength);

  async function fetchFinancialData(
    userId: string,
    startDate: Date,
    endDate: Date
  ) {
    return await db
      .select({
        income:
          sql`SUM(CASE WHEN ${transactions.amount} >= 0 THEN ${transactions.amount} ELSE 0 END)`.mapWith(
            Number
          ),
        expense:
          sql`SUM(CASE WHEN ${transactions.amount} < 0 THEN ${transactions.amount} ELSE 0 END)`.mapWith(
            Number
          ),
        remaining: sum(transactions.amount).mapWith(Number),
      })
      .from(transactions)
      .innerJoin(wallets, eq(transactions.walletId, wallets.id))
      .where(
        and(
          walletId ? eq(transactions.walletId, walletId) : undefined,
          eq(wallets.userId, userId),
          gte(transactions.date, startDate),
          lte(transactions.date, endDate)
        )
      );
  }

  const [currentPeriod] = await fetchFinancialData(userId, startDate, endDate);
  const [lastPeriod] = await fetchFinancialData(
    userId,
    lastPeriodStart,
    lastPeriodEnd
  );

  const incomeChange = calculatePercentageChange(
    currentPeriod.income,
    lastPeriod.income
  );
  const expenseChange = calculatePercentageChange(
    currentPeriod.expense,
    lastPeriod.expense
  );

  const remainingChange = calculatePercentageChange(
    currentPeriod.remaining,
    lastPeriod.remaining
  );

  const category = await db
    .select({
      name: categories.name,
      value: sql`SUM(ABS(${transactions.amount}))`.mapWith(Number),
    })
    .from(transactions)
    .innerJoin(wallets, eq(transactions.walletId, wallets.id))
    .innerJoin(categories, eq(transactions.categoryId, categories.id))
    .where(
      and(
        walletId ? eq(transactions.walletId, walletId) : undefined,
        eq(wallets.userId, userId),
        lt(transactions.amount, 0),
        gte(transactions.date, startDate),
        lte(transactions.date, endDate)
      )
    )
    .groupBy(categories.name)
    .orderBy(desc(sql`SUM(ABS(${transactions.amount}))`));

  const topCategories = category.slice(0, 3);
  const otherCategories = category.slice(3);
  const otherSum = otherCategories.reduce(
    (sum, current) => sum + current.value,
    0
  );
  const finalCategories = topCategories;
  if (otherCategories.length > 0) {
    finalCategories.push({ name: "Other", value: otherSum });
  }

  const activeDays = await db
    .select({
      date: transactions.date,
      income:
        sql`SUM(CASE WHEN ${transactions.amount} >= 0 THEN ${transactions.amount} ELSE 0 END)`.mapWith(
          Number
        ),
      expense:
        sql`SUM(CASE WHEN ${transactions.amount} < 0 THEN ABS(${transactions.amount}) ELSE 0 END)`.mapWith(
          Number
        ),
    })
    .from(transactions)
    .innerJoin(wallets, eq(transactions.walletId, wallets.id))
    .where(
      and(
        walletId ? eq(transactions.walletId, walletId) : undefined,
        eq(wallets.userId, userId),
        gte(transactions.date, startDate),
        lte(transactions.date, endDate)
      )
    )
    .groupBy(transactions.date)
    .orderBy(transactions.date);

  const days = fillMissingDays(activeDays, startDate, endDate);

  const data = {
    remainingAmount: currentPeriod.remaining,
    remainingChange,
    incomeAmount: currentPeriod.income,
    incomeChange,
    expenseAmount: currentPeriod.expense,
    expenseChange,
    categories: finalCategories,
    days,
  };

  return { success: true, data: JSON.parse(JSON.stringify(data)) };
};
