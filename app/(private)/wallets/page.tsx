import WalletClientPage from "@/features/wallets/components/wallet-page-client";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Wallets",
};

const WalletPage = async () => {
  return <WalletClientPage />;
};

export default WalletPage;
