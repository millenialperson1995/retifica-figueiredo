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
  // Campos de auditoria
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
  updatedBy: { type: String }, // ID do usuário que fez a última atualização
  version: { type: Number, default: 0 } // Campo para controle de concorrência otimista
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

// Middleware para atualizar o campo updatedAt antes de salvar
vehicleSchema.pre('save', function(next) {
  this.updatedAt = new Date();
  // Incrementar versão em cada save
  if (this.isNew) {
    this.version = 0;
  } else {
    this.version = (this.version || 0) + 1;
  }
  next();
});

// Middleware para atualizar o campo updatedAt e version em operações de atualização
vehicleSchema.pre('findOneAndUpdate', async function(next) {
  const update = this.getUpdate();
  const filter = this.getFilter();
  const options = this.options;
  
  // Habilitar controle de versão, a menos que explicitamente desabilitado
  if (!options.skipVersionCheck) {
    // Adicionar verificação de versão ao filtro para garantir concorrência otimista
    const currentDoc = await this.model.findOne(filter);
    if (currentDoc) {
      // Adiciona verificação da versão atual para evitar overwrites concorrentes
      (filter as any).version = currentDoc.version;
      
      // Incrementar versão no update
      if (update) {
        (update as any).version = currentDoc.version + 1;
      }
    }
  }
  
  if (update) {
    (update as any).updatedAt = new Date();
  }
  next();
});

export const VehicleModel = models.Vehicle || model<Vehicle & { userId: string }>('Vehicle', vehicleSchema);