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
  userId: string // ID do usuário proprietário
  createdAt: Date
}

export interface Vehicle {
  id: string
  customerId: string
  plate: string
  brand: string
  model: string
  year: number
  color: string
  engineNumber?: string
  chassisNumber?: string
  notes?: string
  userId: string // ID do usuário proprietário
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
}

export interface InventoryItem {
  _id: string
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
}

export interface Order {
  id: string
  budgetId: string
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
}
