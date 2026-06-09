import { z } from "zod";

export const HtmlPreviewSchema = z.object({
  value: z.string(),
});

export type HtmlPreviewForm = z.infer<typeof HtmlPreviewSchema>;

export const HtmlPreviewStateSchema = z.object({
  autoUpdate: z.boolean(),
  html: z.string(),
  previewHtml: z.string(),
});

export type HtmlPreviewState = z.infer<typeof HtmlPreviewStateSchema>;
