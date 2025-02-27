"use client";

import { Category } from "@/types/global";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";

import { toast } from "@/hooks/use-toast";
import { DataTable } from "./table/data-table";
import { columns } from "./table/columns";
import { deleteCategoryBulk } from "@/lib/actions/category.action";
import { useFormModal } from "@/hooks/use-form-modal";

const CategoryClientPage = ({ data }: { data: Category[] }) => {
  const { onOpen, setType, setTable } = useFormModal();
  const handleCreateCategory = () => {
    setType("create");
    setTable("category");
    onOpen();
  };
  // TODO: Add skeleton component for this page
  return (
    <div className="max-w-screen-2xl mx-auto pb-10">
      <div className="flex lg:flex-row justify-between lg:items-center">
        <h3 className="font-bold text-xl line-clamp-1 py-2">Category page</h3>
        <div className="">
          <Button size="sm" onClick={handleCreateCategory}>
            <Plus className="w-4 h-4" />
            Add new
          </Button>
        </div>
      </div>
      <div className="">
        <DataTable
          data={data}
          columns={columns}
          filterKey="name"
          onDelete={async (row) => {
            const ids = row.map((r) => r.original.id);
            // TODO: add delete category bulk
            const result = await deleteCategoryBulk({ ids });

            if (result.success === true) {
              toast({
                title: "Delete category successfully ",
              });
            }
          }}
          disabled={false}
        />
      </div>
    </div>
  );
};

export default CategoryClientPage;
