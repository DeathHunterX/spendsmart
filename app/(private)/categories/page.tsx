import CategoryClientPage from "./CategoryClient";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Categories",
};

const CategoriesPage = async () => {
  return <CategoryClientPage />;
};

export default CategoriesPage;
