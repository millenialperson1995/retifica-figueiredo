import { Schema, model, models } from 'mongoose';
import { Vehicle } from '../types';

const vehicleSchema = new Schema<Vehicle & { userId: string }>({
  customerId: { type: String, required: true, ref: 'Customer' },
  plate: { type: String, required: true, unique: true },
  brand: { type: String, required: true },
  model: { type: String, required: true },
  year: { type: Number, required: true },
  color: { type: String, required: true },
  engineNumber: String,
  chassisNumber: String,
  notes: String,
  userId: { type: String, required: true }, // ID do usuário proprietário
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

export const VehicleModel = models.Vehicle || model<Vehicle & { userId: string }>('Vehicle', vehicleSchema);