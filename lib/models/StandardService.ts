import { Schema, model, models } from 'mongoose';
import { StandardService } from '../types';

const standardServiceSchema = new Schema<StandardService & { userId: string }>({
  name: { type: String, required: true },
  description: { type: String, required: true },
  duration: Number,
  category: String,
  basePrice: { type: Number, required: true },
  isActive: { type: Boolean, default: true },
  userId: { type: String, required: true }, // ID do usuário proprietário
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
});

export const StandardServiceModel = models.StandardService || model<StandardService & { userId: string }>('StandardService', standardServiceSchema);