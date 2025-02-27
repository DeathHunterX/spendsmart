import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Edit, MoreHorizontal, Trash } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useConfirm } from "@/hooks/use-confirm";
import { useFormModal } from "@/hooks/use-form-modal";
import { useDeleteWallet } from "@/hooks/api/useWallet";

interface Props {
  id: string;
}

const Actions = ({ id }: Props) => {
  const { setType, onOpen, setTable } = useFormModal();
  const deleteWalletMutation = useDeleteWallet(id);

  const [ConfirmationDialog, confirm] = useConfirm(
    "Are you sure?",
    "You are about to delete this transaction."
  );

  const handleEditWallet = () => {
    setType("update");
    setTable("wallet");
    onOpen(id);
  };

  const handleDeleteWallet = async () => {
    const ok = await confirm();
    if (ok) {
      deleteWalletMutation.mutate(undefined);
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
          <DropdownMenuItem disabled={false} onClick={() => handleEditWallet()}>
            <Edit className="size-4 mr-2" />
            Edit
          </DropdownMenuItem>

          <DropdownMenuItem
            disabled={false}
            onClick={() => handleDeleteWallet()}
          >
            <Trash className="size-4 mr-2" /> Delete
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </>
  );
};

export default Actions;
