import { z } from "zod";

export const CaseConverterSchema = z.object({
  value: z.string(),
});

export type CaseConverterForm = z.infer<typeof CaseConverterSchema>;
