"use client";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";

import { formModalStore } from "@/stores";
import {
  useDeleteBulkCategory,
  useGetCategories,
} from "@/hooks/api/useCategory";
import {
  CategoryCard,
  CategoryCardLoading,
} from "@/components/shared/card/CategoryCard";
import { Skeleton } from "@/components/ui/skeleton";

const CategoryClientPage = () => {
  const { onOpen, setType, setTable } = formModalStore();

  const { data, isLoading } = useGetCategories();
  const deleteBulkCategoryMutation = useDeleteBulkCategory();

  const handleCreateCategory = () => {
    setType("create");
    setTable("category");
    onOpen();
  };

  if (isLoading) {
    // TODO: Add skeleton component for this page
    return (
      <div className="max-w-screen-2xl mx-auto pb-10">
        <div className="flex lg:flex-row justify-between lg:items-center items-center">
          <h3 className="font-bold text-xl line-clamp-1 py-2">Categories</h3>

          <Skeleton className="w-28 h-9" />
        </div>
        <div className="flex lg:flex-row flex-col gap-8 w-full mt-2">
          <CategoryCardLoading />
          <CategoryCardLoading />
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-screen-2xl mx-auto pb-10">
      <div className="flex lg:flex-row justify-between lg:items-center items-center">
        <h3 className="font-bold text-xl line-clamp-1 py-2">Categories</h3>
        <div className="">
          <Button size="sm" onClick={handleCreateCategory}>
            <Plus className="w-4 h-4" />
            Add new
          </Button>
        </div>
      </div>
      <div className="flex lg:flex-row flex-col gap-8 w-full mt-4">
        {/* //TODO: Add delete bulk categories */}
        <CategoryCard
          title="Income Categories"
          data={data?.filter((item) => item?.categoryType === "income") || []}
        />
        <CategoryCard
          title="Expense Categories"
          data={data?.filter((item) => item?.categoryType === "expense") || []}
        />
      </div>
    </div>
  );
};

export default CategoryClientPage;
