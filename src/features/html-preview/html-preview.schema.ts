import { z } from "zod";

export const HtmlPreviewSchema = z.object({
  value: z.string(),
});

export type HtmlPreviewForm = z.infer<typeof HtmlPreviewSchema>;
