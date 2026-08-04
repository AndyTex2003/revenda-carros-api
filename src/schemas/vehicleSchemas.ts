import { z } from 'zod';

const currentYear = new Date().getFullYear();

export const vehicleSchema = z.object({
  brand: z.string({ required_error: 'Marca obrigatória' }).min(1, 'Marca obrigatória'),
  model: z.string({ required_error: 'Modelo obrigatório' }).min(1, 'Modelo obrigatório'),
  year: z
    .number({ required_error: 'Ano obrigatório' })
    .int('Ano inválido')
    .gte(1886, 'Ano inválido')
    .lte(currentYear + 1, 'Ano inválido'),
  color: z.string({ required_error: 'Cor obrigatória' }).min(1, 'Cor obrigatória'),
  mileage: z
    .number({ required_error: 'Quilometragem obrigatória' })
    .int('Quilometragem inválida')
    .min(0, 'Quilometragem não pode ser negativa'),
  price: z.number({ required_error: 'Preço obrigatório' }).positive('Preço deve ser positivo'),
  plate: z.string({ required_error: 'Placa obrigatória' }).min(1, 'Placa obrigatória'),
  status: z.string({ required_error: 'Status obrigatório' }).min(1, 'Status obrigatório'),
});

export type VehicleInput = z.infer<typeof vehicleSchema>;
