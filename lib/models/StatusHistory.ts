import { Schema, model, models } from 'mongoose';

export interface IStatusHistory {
  entityId: string; // ID da entidade (order ou budget)
  entityType: 'order' | 'budget'; // Tipo da entidade
  fromStatus: string;
  toStatus: string;
  userId: string; // ID do usuário que fez a alteração
  timestamp: Date;
  notes?: string; // Notas opcionais sobre a mudança
}

const statusHistorySchema = new Schema<IStatusHistory>({
  entityId: { type: String, required: true, index: true },
  entityType: { type: String, required: true, enum: ['order', 'budget'], index: true },
  fromStatus: { type: String, required: true },
  toStatus: { type: String, required: true },
  userId: { type: String, required: true },
  timestamp: { type: Date, default: Date.now },
  notes: String,
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

export const StatusHistoryModel = models.StatusHistory || model<IStatusHistory>('StatusHistory', statusHistorySchema);