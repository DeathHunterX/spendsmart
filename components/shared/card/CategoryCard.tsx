import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { useDeleteCategory } from "@/hooks/api/useCategory";
import { useConfirm } from "@/hooks/use-confirm";
import { formModalStore } from "@/stores";
import { cn } from "@/lib/utils";

import { Category } from "@/types/global";
import { AlignJustify, Pencil, Trash2 } from "lucide-react";
import Image from "next/image";
import NotFoundImg from "@/public/images/NotFound.png";

interface CategoryCardProps {
  title: string;
  data: Category[];
}

export const CategoryCard = ({ title, data }: CategoryCardProps) => {
  const { setType, onOpen, setTable } = formModalStore();
  const deleteCategoryMutation = useDeleteCategory();

  const [ConfirmationDialog, confirm] = useConfirm(
    "Are you sure?",
    "You are about to delete this transaction."
  );

  const handleEditCategory = (id: string) => {
    setType("update");
    setTable("category");
    onOpen(id);
  };

  const handleDeleteCategory = async (id: string) => {
    const ok = await confirm();
    if (ok) {
      deleteCategoryMutation.mutate(id);
    }
  };

  return (
    <>
      <ConfirmationDialog />
      <Card className="w-full">
        <CardHeader className="py-4">
          <CardTitle className="text-lg line-clamp-1">{title}</CardTitle>
          <CardDescription className="hidden"></CardDescription>
        </CardHeader>
        <CardContent className="pb-4">
          {data.length > 0 ? (
            <ul>
              {data.map((item, idx) => (
                <li key={item.id}>
                  <div
                    className={cn(
                      "flex flex-row items-center justify-between py-1",
                      idx > 0 && "border-t-2"
                    )}
                  >
                    <div className="flex flex-row gap-x-6">
                      <div className="">
                        {/* // TODO: Add draggable category */}
                        <AlignJustify />
                      </div>
                      <div className="flex flex-row items-center">
                        {item?.icon}
                        {"  "} {item?.name}
                      </div>
                    </div>

                    <div className="">
                      <Button
                        variant="ghost"
                        onClick={() => handleEditCategory(item?.id)}
                      >
                        <Pencil />
                      </Button>
                      <Button
                        variant="ghost"
                        onClick={() => handleDeleteCategory(item?.id)}
                      >
                        <Trash2 />
                      </Button>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          ) : (
            <div className="flex flex-col justify-center items-center w-full h-fit pb-8">
              <Image
                width="150"
                height="150"
                src={NotFoundImg}
                alt="NotFound"
              />
              <div className="">
                <h3 className="text-lg">No categories found.</h3>
                <small>
                  Please add{" "}
                  {(() => {
                    const wordBeforeCategories = title
                      .split(" Categories")[0]
                      .toLowerCase();
                    const article = ["a", "e", "i", "o", "u"].includes(
                      wordBeforeCategories.charAt(0)
                    )
                      ? "an"
                      : "a";
                    return `${article} ${wordBeforeCategories}`;
                  })()}{" "}
                  to start organizing your transactions.
                </small>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </>
  );
};

export const CategoryCardLoading = () => {
  return (
    <Card className="w-full">
      <CardHeader className="py-4">
        <CardTitle className="text-lg">
          <Skeleton className="w-12 h-7" />
        </CardTitle>
        <CardDescription className="hidden"></CardDescription>
      </CardHeader>
      <CardContent className="pb-4">
        <ul>
          {[1, 2, 3].map((item, idx) => (
            <li key={idx}>
              <Skeleton className="w-full h-12" />
            </li>
          ))}
        </ul>
      </CardContent>
    </Card>
  );
};
