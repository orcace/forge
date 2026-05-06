import { z } from "zod";

export const Base64Schema = z.object({
  value: z.string(),
});

export type Base64Form = z.infer<typeof Base64Schema>;
