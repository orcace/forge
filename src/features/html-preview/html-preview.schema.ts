import { z } from "zod";

export const HtmlPreviewSchema = z.object({
  value: z.string(),
});

export type HtmlPreviewForm = z.infer<typeof HtmlPreviewSchema>;

export const HtmlPreviewStateSchema = z.object({
  autoUpdate: z.boolean(),
  html: z.string(),
  indentSize: z.number().int().min(1).max(10).optional(),
  lineWrap: z.boolean().optional(),
  previewHtml: z.string(),
});

export type HtmlPreviewState = Omit<
  z.infer<typeof HtmlPreviewStateSchema>,
  "indentSize" | "lineWrap"
> & {
  indentSize: number;
  lineWrap: boolean;
};
