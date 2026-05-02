import { z } from "zod";

export const JsonToolsSchema = z.object({
  value: z.string(),
});

export type JsonToolsForm = z.infer<typeof JsonToolsSchema>;
