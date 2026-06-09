import { z } from "zod";

export const MarkdownPreviewSchema = z.object({
  value: z.string(),
});

export type MarkdownPreviewForm = z.infer<typeof MarkdownPreviewSchema>;

export const MarkdownPreviewTabSchema = z.object({
  content: z.string(),
  id: z.string(),
  title: z.string(),
  updatedAt: z.number(),
});

export const MarkdownPreviewStateSchema = z.object({
  activeTabId: z.string(),
  previewVisible: z.boolean(),
  syncScroll: z.boolean(),
  tabs: z.array(MarkdownPreviewTabSchema).min(1),
});

export type MarkdownPreviewTab = z.infer<typeof MarkdownPreviewTabSchema>;
export type MarkdownPreviewState = z.infer<typeof MarkdownPreviewStateSchema>;
