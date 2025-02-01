import CategoryClientPage from "@/features/categories/components/category-page-client";
import { getCategoryData } from "@/lib/actions/category.action";
import { Category } from "@/types/global";

const CategoriesPage = async () => {
  const res = await getCategoryData({});
  const categories: Category[] = Array.isArray(res.data)
    ? res.data
    : res.data
      ? [res.data]
      : [];

  return <CategoryClientPage data={categories} />;
};

export default CategoriesPage;
