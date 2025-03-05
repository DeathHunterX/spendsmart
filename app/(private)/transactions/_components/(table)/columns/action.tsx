import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Edit, Eye, MoreHorizontal, Trash } from "lucide-react";
import { Button } from "@/components/ui/button";

import { useConfirm } from "@/hooks/use-confirm";

import { useDeleteTransaction } from "@/hooks/api/useTransaction";
import { useFormModal } from "@/hooks/use-form-modal";

interface Props {
  id: string;
}

const Actions = ({ id }: Props) => {
  const { setType, onOpen, setTable } = useFormModal();
  const deleteTransactionMutation = useDeleteTransaction(id);

  const [ConfirmationDialog, confirm] = useConfirm(
    "Are you sure?",
    "You are about to delete this transaction."
  );
  const handleEditTransaction = () => {
    setType("update");
    setTable("transaction");
    onOpen(id);
  };

  const handleDeleteTransaction = async () => {
    const ok = await confirm();
    if (ok) {
      deleteTransactionMutation.mutate(undefined);
    }
  };

  return (
    <>
      <ConfirmationDialog />
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" className="size-8 p-0">
            <span className="sr-only">Open menu</span>
            <MoreHorizontal />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuItem>
            <Eye className="size-4 mr-2" />
            More detail
          </DropdownMenuItem>
          <DropdownMenuItem
            disabled={false}
            onClick={() => handleEditTransaction()}
          >
            <Edit className="size-4 mr-2" />
            Edit
          </DropdownMenuItem>

          <DropdownMenuItem
            disabled={false}
            onClick={() => handleDeleteTransaction()}
          >
            <Trash className="size-4 mr-2" /> Delete
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </>
  );
};

export default Actions;
