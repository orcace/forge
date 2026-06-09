import { z } from "zod";

export const MarkdownPreviewSchema = z.object({
  value: z.string(),
});

export type MarkdownPreviewForm = z.infer<typeof MarkdownPreviewSchema>;
