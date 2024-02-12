import { z } from "zod";

export const InscriptionCommandValidation = z.object({
  email: z
    .string({ required_error: "Veuillez renseigner un email valide." })
    .email({ message: "Veuillez renseigner un email valide." }),
  checked: z.literal(true, {
    errorMap: () => ({
      message: "Veuillez accepter les conditions.",
    }),
  }),
});

export type InscriptionCommand = z.infer<typeof InscriptionCommandValidation>;
