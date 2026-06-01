import { headers } from "next/headers";
import { cookieToInitialState } from "wagmi";
import { Navigation } from "@/components/navigation";
import { Wireframe } from "@/components/ui/wireframe";
import { Providers } from "@/providers/providers";
import { getConfig } from "@/wagmi";

export default async function BaseLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const initialState = cookieToInitialState(
    getConfig(),
    (await headers()).get("cookie"),
  );
  return (
    <Wireframe>
      <Navigation />

      <main className="mx-auto w-full max-w-6xl px-4 py-6 sm:px-6">
        <Providers initialState={initialState}>{children}</Providers>
      </main>
    </Wireframe>
  );
}
