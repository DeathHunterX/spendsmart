import WalletClientPage from "@/features/wallets/components/wallet-page-client";

import { getWalletData } from "@/lib/actions/wallet.action";
import { Wallet } from "@/types/global";

const WalletPage = async () => {
  const res = await getWalletData({});
  const wallets: Wallet[] = Array.isArray(res.data)
    ? res.data
    : res.data
      ? [res.data]
      : [];

  return <WalletClientPage data={wallets} />;
};

export default WalletPage;
