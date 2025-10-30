import { Schema, model, models } from 'mongoose';
import { Budget } from '../types';

const budgetSchema = new Schema<Budget & { userId: string }>({
  customerId: { type: String, required: true, ref: 'Customer' },
  vehicleId: { type: String, required: true, ref: 'Vehicle' },
  date: { type: Date, default: Date.now },
  status: { 
    type: String, 
    enum: ['pending', 'approved', 'rejected'], 
    required: true,
    default: 'pending' 
  },
  userId: { type: String, required: true }, // ID do usuário proprietário
  services: [{
    id: String,
    description: { type: String, required: true },
    quantity: { type: Number, required: true },
    unitPrice: { type: Number, required: true },
    total: { type: Number, required: true },
  }],
  parts: [{
    id: String,
    description: { type: String, required: true },
    partNumber: String,
    quantity: { type: Number, required: true },
    unitPrice: { type: Number, required: true },
    total: { type: Number, required: true },
    inventoryId: String,
  }],
  subtotal: { type: Number, required: true },
  discount: { type: Number, default: 0 },
  total: { type: Number, required: true },
  notes: String,
}, {
  toJSON: {
    virtuals: true,
    transform: function(doc, ret) {
  ret.id = ret._id.toString();
  delete (ret as any)._id;
  delete (ret as any).__v;
    }
  }
});

export const BudgetModel = models.Budget || model<Budget & { userId: string }>('Budget', budgetSchema);