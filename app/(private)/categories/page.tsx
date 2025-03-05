import CategoryClientPage from "@/features/categories/components/category-page-client";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Categories",
};

const CategoriesPage = async () => {
  return <CategoryClientPage />;
};

export default CategoriesPage;
