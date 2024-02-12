import { z } from "zod";

export const InscriptionCommandValidation = z.object({
  email: z
    .string({ required_error: "Veuillez renseigner un email valide." })
    .email({ message: "Veuillez renseigner un email valide." }),
});

export type InscriptionCommand = z.infer<typeof InscriptionCommandValidation>;
