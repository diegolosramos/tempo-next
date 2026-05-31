"use client";

import React from "react";
import { type Connector, useConnect, useConnectors } from "wagmi";
import { Button } from "@/components/ui/button";

export function WalletOptions() {
  const connect = useConnect();
  const connectors = useConnectors();

  return (
    <div>
      <div className="mb-2">Connect wallet</div>
      <div className="flex gap-2">
        {connectors.map((connector) => (
          <WalletOption
            connector={connector}
            key={connector.uid}
            onClick={() => connect.mutate({ connector })}
          />
        ))}
      </div>
    </div>
  );
}

function WalletOption({
  connector,
  onClick,
}: {
  connector: Connector;
  onClick: () => void;
}) {
  const [ready, setReady] = React.useState(false);

  React.useEffect(() => {
    (async () => {
      const provider = await connector.getProvider();
      setReady(!!provider);
    })();
  }, [connector]);

  return (
    <Button disabled={!ready} onClick={onClick} type="button">
      {connector.name}
    </Button>
  );
}
