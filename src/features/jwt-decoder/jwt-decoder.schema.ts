import { z } from "zod";

export const JwtDecoderSchema = z.object({
  value: z.string(),
});

export type JwtDecoderForm = z.infer<typeof JwtDecoderSchema>;
