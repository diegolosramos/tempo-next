"use client";

import { useConnection, useDisconnect } from "wagmi";
import { Button } from "@/components/ui/button";
import { WalletOptions } from "@/components/wagmi/wallet-options";

export function ConnectWallet() {
  const { isConnected } = useConnection();
  const disconnect = useDisconnect();

  if (isConnected === true) {
    return (
      <Button onClick={() => disconnect.mutate()} type="button">
        Disconnect wallet
      </Button>
    );
  }

  return <WalletOptions />;
}
