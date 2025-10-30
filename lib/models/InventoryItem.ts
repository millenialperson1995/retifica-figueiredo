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
inventoryItemSchema.pre('save', function(next) {
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
inventoryItemSchema.pre('findOneAndUpdate', async function(next) {
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

export const InventoryItemModel = models.InventoryItem || model<InventoryItem & { userId: string }>('InventoryItem', inventoryItemSchema);