"use client";

import { tempo } from "mppx/client";
import { useState } from "react";
import { useConnection, useConnectorClient } from "wagmi";
import { tempoTestnet } from "wagmi/chains";
import { Button } from "@/components/ui/button";
import { ConnectWallet } from "@/components/wagmi/connect-wallet";
import {
  DEFAULT_PROMPT,
  MAX_DEPOSIT,
  PRICE_PER_TOKEN,
} from "@/lib/sse/constants";
import { promptSchema } from "@/lib/sse/schemas";

export function SseDemo() {
  const [prompt, setPrompt] = useState(DEFAULT_PROMPT);
  const [output, setOutput] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [status, setStatus] = useState("Idle");
  const [isStreaming, setIsStreaming] = useState(false);
  const [tokenCount, setTokenCount] = useState(0);

  const { address, chainId, isConnected } = useConnection();
  const { data: walletClient } = useConnectorClient();

  const is402FlowError = (caught: unknown): boolean => {
    if (!(caught instanceof Error)) {
      return false;
    }

    return (
      caught.message.includes("402") ||
      caught.message.includes("Response has no body")
    );
  };

  const streamWith402Retry = async (
    session: ReturnType<typeof tempo.session>,
    url: string,
  ) => {
    try {
      return await session.sse(url);
    } catch (caught) {
      if (!is402FlowError(caught)) {
        throw caught;
      }

      setStatus("Received 402 challenge, opening channel...");
      await session.open();
      setStatus("Retrying stream with voucher...");
      return session.sse(url);
    }
  };

  const onStart = async () => {
    setError(null);

    const parsedPrompt = promptSchema.safeParse(prompt);
    if (!parsedPrompt.success) {
      setError("Prompt must be between 1 and 500 characters.");
      return;
    }

    if (!isConnected || !address || !walletClient) {
      setError("Connect your wallet first.");
      return;
    }

    if (chainId !== tempoTestnet.id) {
      setError("Switch your wallet to Tempo Testnet.");
      return;
    }

    setIsStreaming(true);
    setStatus("Opening payment session...");
    setOutput("");
    setTokenCount(0);

    const session = tempo.session({
      account: address,
      getClient: async () => walletClient,
      maxDeposit: MAX_DEPOSIT,
    });

    try {
      const stream = await streamWith402Retry(
        session,
        `/sse/chat?prompt=${encodeURIComponent(parsedPrompt.data)}`,
      );

      setStatus("Streaming paid tokens...");

      for await (const token of stream) {
        setOutput((current) => current + token);
        setTokenCount((current) => current + 1);
      }

      setStatus("Settling channel...");
      await session.close();
      setStatus("Done");
    } catch (caughtError) {
      setStatus("Failed");
      setError(
        caughtError instanceof Error
          ? caughtError.message
          : "Streaming failed.",
      );
    } finally {
      setIsStreaming(false);
    }
  };

  return (
    <section className="space-y-4">
      <h1 className="font-semibold text-xl">SSE Session (mppx + Next.js)</h1>

      <div className="rounded-md border p-4">
        <ConnectWallet />
      </div>

      <div className="space-y-2">
        <label className="block font-medium text-sm" htmlFor="prompt">
          Prompt
        </label>
        <textarea
          className="min-h-24 w-full rounded-md border p-3 text-sm"
          id="prompt"
          onChange={(event) => setPrompt(event.target.value)}
          value={prompt}
        />
      </div>

      <div className="flex items-center gap-3">
        <Button disabled={isStreaming} onClick={onStart} type="button">
          {isStreaming ? "Streaming..." : "Start paid stream"}
        </Button>
        <span className="text-muted-foreground text-sm">{status}</span>
      </div>

      <p className="text-muted-foreground text-sm">
        Price per token: {PRICE_PER_TOKEN} pathUSD. Max session deposit:{" "}
        {MAX_DEPOSIT} pathUSD.
      </p>

      {error ? <p className="text-red-500 text-sm">{error}</p> : null}

      <div className="space-y-1 rounded-md border p-3">
        <p className="font-medium text-sm">Tokens streamed: {tokenCount}</p>
        <pre className="whitespace-pre-wrap text-sm">
          {output || "No output yet."}
        </pre>
      </div>
    </section>
  );
}
