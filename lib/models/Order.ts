import { Schema, model, models } from 'mongoose';
import { Order } from '../types';
import { StatusHistoryModel } from './StatusHistory';

const orderSchema = new Schema<Order & { userId: string }>({
  budgetId: { type: String, required: false, ref: 'Budget' }, // Opcional pois nem toda OS vem de um orçamento
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
orderSchema.pre('save', function(next) {
  this.updatedAt = new Date();
  // Incrementar versão em cada save
  if (this.isNew) {
    this.version = 0;
  } else {
    this.version = (this.version || 0) + 1;
  }
  next();
});

// Middleware para atualizar o campo updatedAt e registrar histórico de status em operações de atualização
orderSchema.pre('findOneAndUpdate', async function(next) {
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
  
  if (update && (update as any).status !== undefined) {
    // Obter o documento atual antes da atualização para obter o status anterior
    const currentOrder = await this.model.findOne(filter);
    
    if (currentOrder && currentOrder.status !== (update as any).status) {
      // Registrar mudança de status no histórico
      await new StatusHistoryModel({
        entityId: currentOrder._id.toString(),
        entityType: 'order',
        fromStatus: currentOrder.status,
        toStatus: (update as any).status,
        userId: (update as any).updatedBy || currentOrder.userId, // Usar updatedBy se disponível, senão userId
        notes: 'Status changed via API'
      }).save();
    }
  }
  
  if (update) {
    (update as any).updatedAt = new Date();
  }
  next();
});

// Adicionar índices para melhorar performance de consultas
orderSchema.index({ userId: 1, createdAt: -1 }); // Para ordenação por usuário e data
orderSchema.index({ userId: 1, status: 1 }); // Para filtragem por usuário e status

export const OrderModel = models.Order || model<Order & { userId: string }>('Order', orderSchema);