import { Schema, model, models } from 'mongoose';
import { Customer } from '../types';

const customerSchema = new Schema<Customer & { userId: string }>({
  name: { type: String, required: true },
  email: { type: String, required: true },
  phone: { type: String, required: true },
  cpfCnpj: { type: String, required: true },
  address: { type: String, required: true },
  city: { type: String, required: true },
  state: { type: String, required: true },
  zipCode: { type: String, required: true },
  userId: { type: String, required: true }, // ID do usuário proprietário
  createdAt: { type: Date, default: Date.now },
}, {
  toJSON: {
    virtuals: true,
    transform: function(doc, ret) {
      ret.id = ret._id.toString();
      delete ret._id;
      delete ret.__v;
    }
  },
  toObject: { virtuals: true }
});

export const CustomerModel = models.Customer || model<Customer & { userId: string }>('Customer', customerSchema);