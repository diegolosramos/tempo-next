import { headers } from "next/headers";
import { cookieToInitialState } from "wagmi";
import { Wireframe, WireframeNav } from "@/components/wireframe";
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
      <WireframeNav
        className="border-slate-200 border-b bg-background/80 backdrop-blur"
        position="top"
      >
        <div className="mx-auto flex h-full w-full max-w-5xl items-center px-4 sm:px-6">
          <div className="font-bold tracking-wide">Tempo Examples</div>
        </div>
      </WireframeNav>

      <main className="mx-auto w-full max-w-6xl px-4 py-6 sm:px-6">
        <Providers initialState={initialState}>{children}</Providers>
      </main>
    </Wireframe>
  );
}
