import { z } from "zod";

export const InscriptionCommandValidation = z.object({
  email: z.string().email(),
});

export type InscriptionCommand = z.infer<typeof InscriptionCommandValidation>;
