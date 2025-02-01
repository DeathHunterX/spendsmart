import React from "react";
import { useOpenWallet } from "../../hooks/use-open-wallet";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Edit, MoreHorizontal, Trash } from "lucide-react";
import { Button } from "@/components/ui/button";
import { deleteWallet } from "@/lib/actions/wallet.action";
import { toast } from "@/hooks/use-toast";
import { useConfirm } from "@/hooks/use-confirm";

interface Props {
  id: string;
}

const Actions = ({ id }: Props) => {
  const { setType, onOpen } = useOpenWallet();
  const [ConfirmationDialog, confirm] = useConfirm(
    "Are you sure?",
    "You are about to delete this transaction."
  );
  const handleEditWallet = () => {
    setType("EDIT");
    onOpen(id);
  };

  const handleDeleteWallet = async () => {
    const ok = await confirm();
    if (ok) {
      const result = await deleteWallet({ walletId: id });
      if (result?.success) {
        toast({
          title: "Delete wallet successfully ",
        });
      }
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
