import { createEnv } from "@t3-oss/env-nextjs";
import z from "zod/v4";

export const env = createEnv({
  server: {
    SERVER_WALLET_PRIVATE_KEY: z.string(),
    MPP_SECRET_KEY: z.string().default("mppx-demo-sse-secret"),
  },
  client: {},
  runtimeEnv: {
    MPP_SECRET_KEY: process.env.MPP_SECRET_KEY,
    SERVER_WALLET_PRIVATE_KEY: process.env.SERVER_WALLET_PRIVATE_KEY,
  },
  emptyStringAsUndefined: true,
});
