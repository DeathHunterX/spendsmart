import { TriangleAlert } from "lucide-react";

import { cn } from "@/lib/utils";
import { formModalStore } from "@/stores";

type Props = {
  id: string;
  category: string | null;
  categoryId: string | null;
};

export const CategoryColumn = ({ id, category, categoryId }: Props) => {
  const { onOpen, setType, setTable } = formModalStore();

  const onClick = () => {
    if (categoryId) {
      setType("update");
      setTable("category");
      onOpen(categoryId);
    } else {
      setType("update");
      setTable("transaction");
      onOpen(id);
    }
  };

  return (
    <div
      onClick={onClick}
      className={cn(
        "flex items-center cursor-pointer hover:underline",
        (!category || category === "") && "text-rose-500"
      )}
    >
      {!category && <TriangleAlert className="mr-2 size-4 shrink-0" />}
      {category || "Uncategorized"}
    </div>
  );
};
