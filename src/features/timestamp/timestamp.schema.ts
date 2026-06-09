import { z } from "zod";

export const TimestampSchema = z.object({
  value: z.string(),
});

export type TimestampForm = z.infer<typeof TimestampSchema>;
