import { z } from "zod";

export const HashGeneratorSchema = z.object({
  value: z.string(),
});

export type HashGeneratorForm = z.infer<typeof HashGeneratorSchema>;
