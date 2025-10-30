import { Schema, model, models } from 'mongoose';
import { Vehicle } from '../types';

const vehicleSchema = new Schema<Vehicle & { userId: string }>({
  customerId: { type: String, required: true, ref: 'Customer' },
  plate: { type: String, required: true, unique: true },
  brand: { type: String, required: true },
  model: { type: String, required: true },
  year: { type: Number, required: true },
  engine: { type: String, required: true }, // Motor do veículo
  cylinder: { type: String, required: true }, // Cilindro do veículo
  chassisNumber: { type: String, required: true }, // Número do chassi
  userId: { type: String, required: true }, // ID do usuário proprietário
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

export const VehicleModel = models.Vehicle || model<Vehicle & { userId: string }>('Vehicle', vehicleSchema);