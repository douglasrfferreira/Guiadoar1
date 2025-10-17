import { z } from 'zod';

export type DonationCategory = "clothes" | "food" | "toys" | "electronics" | "furniture" | "books";

export interface DonationPoint {
  id: string;
  name: string;
  address: string;
  lat: number;
  lng: number;
  hours: string;
  acceptedItems: DonationCategory[];
  distance?: number;
}

export const SignUpSchema = z.object({
  name: z.string().min(2, { message: "O nome deve ter pelo menos 2 caracteres." }),
  email: z.string().email({ message: "Por favor, insira um e-mail válido." }),
  password: z.string().min(6, { message: "A senha deve ter pelo menos 6 caracteres." }),
});
export type SignUpForm = z.infer<typeof SignUpSchema>;

export const SignInSchema = z.object({
  email: z.string().email({ message: "Por favor, insira um e-mail válido." }),
  password: z.string().min(1, { message: "A senha é obrigatória." }),
});
export type SignInForm = z.infer<typeof SignInSchema>;
