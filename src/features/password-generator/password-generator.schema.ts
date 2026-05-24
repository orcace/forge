import { z } from "zod";

export const PasswordGeneratorSchema = z.object({
  value: z.string(),
});

export type PasswordGeneratorForm = z.infer<typeof PasswordGeneratorSchema>;
