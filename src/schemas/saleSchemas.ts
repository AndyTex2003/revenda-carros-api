import { z } from 'zod';

export const saleSchema = z.object({
  customerId: z
    .string({ required_error: 'Cliente obrigatório' })
    .trim()
    .min(1, 'Cliente obrigatório'),

  vehicleId: z
    .string({ required_error: 'Veículo obrigatório' })
    .trim()
    .min(1, 'Veículo obrigatório'),

  salePrice: z
    .number({
      required_error: 'Valor da venda obrigatório',
      invalid_type_error: 'Valor da venda inválido',
    })
    .positive('Valor da venda deve ser maior que zero'),
});

export const updateSaleSchema = z.object({
  salePrice: z
    .number({
      required_error: 'Valor da venda obrigatório',
      invalid_type_error: 'Valor da venda inválido',
    })
    .positive('Valor da venda deve ser maior que zero'),
});

export type SaleInput = z.infer<typeof saleSchema>;
export type UpdateSaleInput = z.infer<typeof updateSaleSchema>;