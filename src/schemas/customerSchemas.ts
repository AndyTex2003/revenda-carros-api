import { z } from 'zod';

export const customerSchema = z.object({
  name: z.string({ required_error: 'Nome obrigatório' }).trim().min(1, 'Nome obrigatório'),
  cpf: z
    .string({ required_error: 'CPF obrigatório' })
    .trim()
    .min(1, 'CPF obrigatório')
    .regex(/^\d{11}$/, 'CPF inválido'),
  email: z
    .string({ required_error: 'Email obrigatório' })
    .trim()
    .min(1, 'Email obrigatório')
    .email('Email inválido'),
  phone: z.string({ required_error: 'Telefone obrigatório' }).trim().min(1, 'Telefone obrigatório'),
});

export type CustomerInput = z.infer<typeof customerSchema>;
