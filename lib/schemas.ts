import { z } from 'zod';

// Schema for a single service in an order/budget
const serviceSchema = z.object({
  description: z.string().min(1, 'A descrição do serviço é obrigatória.'),
  quantity: z.number().min(0.1, 'A quantidade deve ser maior que zero.'),
  unitPrice: z.number().min(0, 'O preço unitário não pode ser negativo.'),
  total: z.number().min(0, 'O total do serviço não pode ser negativo.'),
});

// Schema for a single part in an order/budget
const partSchema = z.object({
  description: z.string().min(1, 'A descrição da peça é obrigatória.'),
  partNumber: z.string().optional(),
  quantity: z.number().min(1, 'A quantidade deve ser de pelo menos 1.'),
  unitPrice: z.number().min(0, 'O preço unitário não pode ser negativo.'),
  total: z.number().min(0, 'O total da peça não pode ser negativo.'),
  inventoryId: z.string().optional(), // ID do item no inventário
});

// Schema for creating a new Order
export const createOrderSchema = z.object({
  customerId: z.string().min(1, 'O cliente é obrigatório.'),
  vehicleId: z.string().min(1, 'O veículo é obrigatório.'),
  estimatedEndDate: z.string().refine((date) => !isNaN(Date.parse(date)), {
    message: 'A data estimada de término é obrigatória e deve ser uma data válida.',
  }),
  status: z.enum(['pending', 'in-progress', 'completed', 'cancelled']).default('pending'),
  services: z.array(serviceSchema).min(1, 'A ordem de serviço deve ter pelo menos um serviço.'),
  parts: z.array(partSchema).optional(),
  total: z.number().min(0, 'O valor total não pode ser negativo.'),
  notes: z.string().optional(),
  mechanicNotes: z.string().optional(),
  budgetId: z.string().optional(), // Opcional, nem toda OS vem de um orçamento
});

// Type alias for the create order schema
export type CreateOrderPayload = z.infer<typeof createOrderSchema>;
