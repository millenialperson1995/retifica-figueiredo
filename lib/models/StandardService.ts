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
}, {
  toJSON: {
    virtuals: true,
    transform: function(doc, ret) {
      ret.id = ret._id.toString();
      // cast to any to avoid TypeScript errors when deleting properties
      delete (ret as any)._id;
      delete (ret as any).__v;
    }
  }
});

export const StandardServiceModel = models.StandardService || model<StandardService & { userId: string }>('StandardService', standardServiceSchema);