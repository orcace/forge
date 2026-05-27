import { z } from "zod";

export const RegexTesterSchema = z.object({
  value: z.string(),
});

export type RegexTesterForm = z.infer<typeof RegexTesterSchema>;
