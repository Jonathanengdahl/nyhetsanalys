import { z } from "zod";

/** What Jonathan can do with a page from the analysis job. No database access, so it can be tested. */

export type PageStatus = "draft" | "published" | "withdrawn" | "failed" | "retry";

export const pageDecision = z.object({
  id: z.coerce.number().int().positive(),
  decision: z.enum(["publish", "withdraw", "retry"]),
});

/** Which decisions a page in each state allows. A page with problems can never be published. */
export function allowedDecisions(page: { status: PageStatus; problems: string[]; data: unknown }): ("publish" | "withdraw" | "retry")[] {
  const publishable = page.data !== null && page.problems.length === 0;
  switch (page.status) {
    case "draft":
      return publishable ? ["publish", "retry"] : ["retry"];
    case "published":
      return ["withdraw"];
    case "withdrawn":
      return publishable ? ["publish", "retry"] : ["retry"];
    case "failed":
      return ["retry"];
    default:
      return [];
  }
}
