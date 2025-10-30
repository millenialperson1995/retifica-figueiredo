import { Schema, model, models } from 'mongoose';
import { Budget } from '../types';
import { StatusHistoryModel } from './StatusHistory';

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
budgetSchema.pre('save', function(next) {
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
budgetSchema.pre('findOneAndUpdate', async function(next) {
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
    const currentBudget = await this.model.findOne(filter);
    
    if (currentBudget && currentBudget.status !== (update as any).status) {
      // Registrar mudança de status no histórico
      await new StatusHistoryModel({
        entityId: currentBudget._id.toString(),
        entityType: 'budget',
        fromStatus: currentBudget.status,
        toStatus: (update as any).status,
        userId: (update as any).updatedBy || currentBudget.userId, // Usar updatedBy se disponível, senão userId
        notes: 'Status changed via API'
      }).save();
    }
  }
  
  if (update) {
    (update as any).updatedAt = new Date();
  }
  next();
});

export const BudgetModel = models.Budget || model<Budget & { userId: string }>('Budget', budgetSchema);