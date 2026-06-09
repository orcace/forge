import { z } from "zod";

export const UrlEncoderSchema = z.object({
  value: z.string(),
});

export type UrlEncoderForm = z.infer<typeof UrlEncoderSchema>;
