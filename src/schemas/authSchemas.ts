import { z } from 'zod';

export const loginSchema = z.object({
  email: z
    .string({ required_error: 'Email obrigatório' })
    .min(1, 'Email obrigatório')
    .email('Email inválido'),

  password: z
    .string({ required_error: 'Senha obrigatória' })
    .min(1, 'Senha não pode ser vazia'),
});

export type LoginInput = z.infer<typeof loginSchema>;