import { z } from "zod";
import { DEFAULT_PROMPT } from "@/lib/sse/constants";

export const promptSchema = z.string().trim().min(1).max(500);

const streamPromptSearchSchema = z.object({
  prompt: promptSchema.optional(),
});

export function parsePrompt(searchParams: URLSearchParams): string {
  const parsed = streamPromptSearchSchema.safeParse({
    prompt: searchParams.get("prompt") ?? undefined,
  });

  if (!parsed.success) {
    return DEFAULT_PROMPT;
  }

  return parsed.data.prompt ?? DEFAULT_PROMPT;
}
