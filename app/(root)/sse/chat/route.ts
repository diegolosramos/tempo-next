import { Mppx, Store, tempo } from "mppx/server";
import type { NextRequest } from "next/server";
import { createClient, http } from "viem";
import { type Address, privateKeyToAccount } from "viem/accounts";
import { Chain } from "viem/tempo";
import { env } from "@/env";
import { PRICE_PER_TOKEN, TEMPO_TESTNET_PATH_USD } from "@/lib/sse/constants";
import { parsePrompt } from "@/lib/sse/schemas";

export const dynamic = "force-dynamic";

const account = privateKeyToAccount(env.SERVER_WALLET_PRIVATE_KEY as Address);

const client = createClient({
  account,
  chain: Chain.testnet,
  pollingInterval: 1_000,
  transport: http(),
});

const store = Store.memory();

const mppx = Mppx.create({
  methods: [
    tempo.session({
      account,
      currency: TEMPO_TESTNET_PATH_USD,
      feePayer: true,
      getClient: () => client,
      store,
      sse: true,
      testnet: true,
    }),
  ],
  secretKey: env.MPP_SECRET_KEY,
});

async function* generateTokens(prompt: string): AsyncGenerator<string> {
  const words = [
    "The",
    " question",
    " you",
    " asked",
    ' -- "',
    prompt,
    '" --',
    " has",
    " a",
    " practical",
    " answer:",
    "\n",
    "SSE",
    " streaming",
    " with",
    " incremental",
    " voucher",
    " top-ups",
    " works",
    " well",
    " for",
    " metered",
    " output.",
  ];

  for (const word of words) {
    yield word;
    await new Promise((resolve) => setTimeout(resolve, 40));
  }
}

async function handleSessionRequest(request: NextRequest): Promise<Response> {
  const prompt = parsePrompt(new URL(request.url).searchParams);

  const result = await mppx.session({
    amount: PRICE_PER_TOKEN,
    unitType: "token",
  })(request);

  if (result.status === 402) {
    return result.challenge;
  }

  return result.withReceipt(async function* (stream) {
    for await (const token of generateTokens(prompt)) {
      try {
        await stream.charge();
      } catch {
        break;
      }
      yield token;
    }
  });
}

export async function GET(request: NextRequest): Promise<Response> {
  return handleSessionRequest(request);
}

export async function POST(request: NextRequest): Promise<Response> {
  return handleSessionRequest(request);
}
