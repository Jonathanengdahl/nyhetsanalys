import { aiPricesUsd, usdToSek } from "@/config/ai";

export type TokenUsage = {
  input_tokens: number;
  output_tokens: number;
  cache_read_input_tokens?: number | null;
  cache_creation_input_tokens?: number | null;
};

/** Cost of one API call in kronor, from the token counts the API reports. */
export function costSek(model: keyof typeof aiPricesUsd, usage: TokenUsage): number {
  const price = aiPricesUsd[model];
  const usd =
    (usage.input_tokens * price.input +
      usage.output_tokens * price.output +
      (usage.cache_read_input_tokens ?? 0) * price.cacheRead +
      (usage.cache_creation_input_tokens ?? 0) * price.cacheWrite) /
    1_000_000;
  return usd * usdToSek;
}
