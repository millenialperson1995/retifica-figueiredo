export interface Customer {
  id: string
  name: string
  email: string
  phone: string
  cpfCnpj: string
  address: string
  city: string
  state: string
  zipCode: string
  referencia?: string // Ponto de referência opcional
  userId: string // ID do usuário proprietário
  createdAt: Date
  updatedAt: Date
  updatedBy?: string // ID do usuário que fez a última atualização
  version?: number; // Campo para controle de concorrência otimista
}

export interface Vehicle {
  id: string
  customerId: string
  plate: string
  brand: string
  model: string
  year: number
  engine: string // Motor do veículo
  cylinder: string // Cilindro do veículo
  chassisNumber: string // Número do chassi
  userId: string // ID do usuário proprietário
  createdAt: Date
  updatedAt: Date
  updatedBy?: string // ID do usuário que fez a última atualização
  version?: number; // Campo para controle de concorrência otimista
}

export interface ServiceItem {
  id: string
  description: string
  quantity: number
  unitPrice: number
  total: number
}

export interface StandardService {
  id: string
  name: string
  description: string
  duration?: number // Duração estimada em horas
  category?: string
  basePrice: number
  isActive: boolean
  userId: string // ID do usuário proprietário
  createdAt: Date
  updatedAt: Date
  updatedBy?: string // ID do usuário que fez a última atualização
  version?: number; // Campo para controle de concorrência otimista
}

export interface PartItem {
  id: string
  description: string
  partNumber?: string
  quantity: number
  unitPrice: number
  total: number
  inventoryId?: string
}

export interface Budget {
  id: string
  customerId: string
  vehicleId: string
  date: Date
  status: "pending" | "approved" | "rejected"
  userId: string // ID do usuário proprietário
  services: ServiceItem[]
  parts: PartItem[]
  subtotal: number
  discount: number
  total: number
  notes?: string
  createdAt: Date
  updatedAt: Date
  updatedBy?: string // ID do usuário que fez a última atualização
}

export interface InventoryItem {
  id: string
  name: string
  description: string
  category: string
  sku: string
  quantity: number
  minQuantity: number
  unitPrice: number
  supplier?: string
  notes?: string
  userId: string // ID do usuário proprietário
  createdAt: Date
  updatedAt: Date
  updatedBy?: string // ID do usuário que fez a última atualização
  version?: number; // Campo para controle de concorrência otimista
}

export interface Order {
  id: string
  budgetId?: string // Opcional, pois nem toda OS vem de um orçamento
  customerId: string
  vehicleId: string
  startDate: Date
  estimatedEndDate: Date
  actualEndDate?: Date
  status: "pending" | "in-progress" | "completed" | "cancelled"
  userId: string // ID do usuário proprietário
  services: ServiceItem[]
  parts: PartItem[]
  total: number
  notes?: string
  mechanicNotes?: string
  createdAt: Date
  updatedAt: Date
  updatedBy?: string // ID do usuário que fez a última atualização
}

export interface IStatusHistory {
  id: string;
  entityId: string; // ID da entidade (order ou budget)
  entityType: 'order' | 'budget'; // Tipo da entidade
  fromStatus: string;
  toStatus: string;
  userId: string; // ID do usuário que fez a alteração
  timestamp: Date;
  notes?: string; // Notas opcionais sobre a mudança
}
