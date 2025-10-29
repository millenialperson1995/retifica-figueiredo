import { Schema, model, models } from 'mongoose';
import { Order } from '../types';

const orderSchema = new Schema<Order & { userId: string }>({
  budgetId: { type: String, required: true, ref: 'Budget' },
  customerId: { type: String, required: true, ref: 'Customer' },
  vehicleId: { type: String, required: true, ref: 'Vehicle' },
  startDate: { type: Date, default: Date.now },
  estimatedEndDate: { type: Date, required: true },
  actualEndDate: Date,
  status: { 
    type: String, 
    enum: ['pending', 'in-progress', 'completed', 'cancelled'], 
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
  total: { type: Number, required: true },
  notes: String,
  mechanicNotes: String,
}, {
  toJSON: {
    virtuals: true,
    transform: function(doc, ret) {
      ret.id = ret._id.toString();
      delete ret._id;
      delete ret.__v;
    }
  }
});

export const OrderModel = models.Order || model<Order & { userId: string }>('Order', orderSchema);