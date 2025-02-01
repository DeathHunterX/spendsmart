"use client";
import React, { useEffect, useState } from "react";

// Hooks
import { useOpenCategory } from "../hooks/use-open-category";

import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";

import {
  addCategory,
  editCategory,
  getCategoryById,
} from "@/lib/actions/category.action";
import { Category } from "@/types/global";
import { CreateCategorySchema } from "@/lib/validation";
import CategoryForm from "./category-form";

const NewCategorySheet = () => {
  const { isOpen, onClose, type, id } = useOpenCategory();

  const [categoryData, setCategoryData] = useState<Category>();

  useEffect(() => {
    // Fetch category data if in edit mode and id is available
    const fetchCategoryData = async () => {
      if (type === "EDIT" && id) {
        const res = await getCategoryById({ id });
        setCategoryData(res.data);
      }
    };
    fetchCategoryData();
  }, [type, id]);

  const handleSubmit = async (data: any) => {
    if (type === "EDIT" && id) {
      const response = await editCategory({ ...data, categoryId: id });
      return response;
    } else {
      const response = await addCategory(data);
      return response;
    }
  };

  return (
    <Sheet open={isOpen} onOpenChange={onClose}>
      <SheetContent side="right" className="overflow-y-auto w-full lg:max-w-md">
        <SheetHeader>
          <SheetTitle>
            {type === "EDIT" ? "Edit Category" : "New Category"}
          </SheetTitle>
          <SheetDescription>
            {type === "EDIT"
              ? "Make changes to your category here. Click save when you're done."
              : "Add your category here."}
          </SheetDescription>
        </SheetHeader>
        <CategoryForm
          formType={type}
          schema={CreateCategorySchema}
          defaultValues={
            type === "EDIT"
              ? {
                  name: categoryData?.name ?? "",
                  description: categoryData?.description ?? "",
                }
              : { name: "", description: "" }
          }
          onSubmit={handleSubmit}
        />
      </SheetContent>
    </Sheet>
  );
};

export default NewCategorySheet;
