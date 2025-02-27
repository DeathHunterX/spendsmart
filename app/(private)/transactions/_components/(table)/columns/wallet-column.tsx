import { useFormModal } from "@/hooks/use-form-modal";

type Props = {
  wallet: string | null;
  walletId: string;
};

export const WalletColumn = ({ wallet, walletId }: Props) => {
  const { onOpen, setType, setTable } = useFormModal();

  const onClick = () => {
    setType("update");
    setTable("wallet");
    onOpen(walletId);
  };

  return (
    <div
      onClick={onClick}
      className="flex items-center cursor-pointer hover:underline"
    >
      {wallet}
    </div>
  );
};
