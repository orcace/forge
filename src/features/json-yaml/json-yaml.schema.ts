import { z } from "zod";

export const JsonYamlSchema = z.object({
  value: z.string(),
});

export type JsonYamlForm = z.infer<typeof JsonYamlSchema>;
