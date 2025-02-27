import { TriangleAlert } from "lucide-react";

import { cn } from "@/lib/utils";
import { useFormModal } from "@/hooks/use-form-modal";

type Props = {
  id: string;
  category: string | null;
  categoryId: string | null;
};

export const CategoryColumn = ({ id, category, categoryId }: Props) => {
  const { onOpen, setType, setTable } = useFormModal();

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
        !category && "text-rose-500"
      )}
    >
      {!category && <TriangleAlert className="mr-2 size-4 shrink-0" />}
      {category || "Uncategorized"}
    </div>
  );
};
