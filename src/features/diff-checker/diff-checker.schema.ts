import { z } from "zod";

export const DiffCheckerSchema = z.object({
  value: z.string(),
});

export type DiffCheckerForm = z.infer<typeof DiffCheckerSchema>;
