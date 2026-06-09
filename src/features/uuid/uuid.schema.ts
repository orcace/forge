import { z } from "zod";

export const UuidSchema = z.object({
  value: z.string(),
});

export type UuidForm = z.infer<typeof UuidSchema>;
