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
  user: z.string().optional(),
  experience: z.string().optional(),
  objectives: z.array(z.string()).optional(),
  subjects: z.array(z.string()).optional(),
});

export type InscriptionCommand = z.infer<typeof InscriptionCommandValidation>;
