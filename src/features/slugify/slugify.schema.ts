import { z } from "zod";

export const SlugifySchema = z.object({
  value: z.string(),
});

export type SlugifyForm = z.infer<typeof SlugifySchema>;
