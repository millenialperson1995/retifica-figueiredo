import { Schema, model, models } from 'mongoose';
import { InventoryItem } from '../types';

const inventoryItemSchema = new Schema<InventoryItem & { userId: string }>({
  name: { type: String, required: true },
  description: String,
  category: { type: String, required: true },
  sku: { type: String, required: true, unique: true },
  quantity: { type: Number, required: true },
  minQuantity: { type: Number, required: true },
  unitPrice: { type: Number, required: true },
  supplier: String,
  notes: String,
  userId: { type: String, required: true }, // ID do usuário proprietário
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
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

export const InventoryItemModel = models.InventoryItem || model<InventoryItem & { userId: string }>('InventoryItem', inventoryItemSchema);