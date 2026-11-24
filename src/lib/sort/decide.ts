import { z } from "zod";

/*
 * Jonathan's decisions on a candidate topic. Approved and rejected topics
 * keep their status when the sorting measures heat again (see nextStatus).
 * "Reopen" hands the topic back to the sorting, which sets hot or watching
 * from the heat at its next run.
 */

export const decisionInput = z.object({
  id: z.coerce.number().int().positive(),
  decision: z.enum(["approve", "reject", "reopen"]),
});

export type Decision = z.infer<typeof decisionInput>["decision"];

export function statusAfter(decision: Decision, heatIsHot: boolean): "approved" | "rejected" | "hot" | "watching" {
  if (decision === "approve") return "approved";
  if (decision === "reject") return "rejected";
  return heatIsHot ? "hot" : "watching";
}
