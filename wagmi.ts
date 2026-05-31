import { cookieStorage, createConfig, createStorage, http } from "wagmi";
import { tempoTestnet } from "wagmi/chains";
import { injected } from "wagmi/connectors";

const chains = [tempoTestnet] as const;

const config = createConfig({
  chains,
  connectors: [injected()],
  storage: createStorage({
    storage: cookieStorage,
  }),
  ssr: true,
  transports: {
    [tempoTestnet.id]: http(),
  },
});

export function getConfig() {
  return config;
}
