import type { Customer, Vehicle, Budget, Order, InventoryItem } from "./types"

export const mockCustomers: Customer[] = [
  {
    id: "1",
    name: "João Silva",
    email: "joao.silva@email.com",
    phone: "(11) 98765-4321",
    cpfCnpj: "123.456.789-00",
    address: "Rua das Flores, 123",
    city: "São Paulo",
    state: "SP",
    zipCode: "01234-567",
    createdAt: new Date("2024-01-15"),
  },
  {
    id: "2",
    name: "Maria Santos",
    email: "maria.santos@email.com",
    phone: "(11) 91234-5678",
    cpfCnpj: "987.654.321-00",
    address: "Av. Paulista, 1000",
    city: "São Paulo",
    state: "SP",
    zipCode: "01310-100",
    createdAt: new Date("2024-02-20"),
  },
  {
    id: "3",
    name: "Pedro Oliveira",
    email: "pedro.oliveira@email.com",
    phone: "(11) 99876-5432",
    cpfCnpj: "456.789.123-00",
    address: "Rua Augusta, 500",
    city: "São Paulo",
    state: "SP",
    zipCode: "01305-000",
    createdAt: new Date("2024-03-10"),
  },
]

export const mockVehicles: Vehicle[] = [
  {
    id: "1",
    customerId: "1",
    plate: "ABC-1234",
    brand: "Volkswagen",
    model: "Gol",
    year: 2018,
    color: "Prata",
    engineNumber: "ABC123456",
    chassisNumber: "9BWZZZ377VT004251",
  },
  {
    id: "2",
    customerId: "1",
    plate: "DEF-5678",
    brand: "Fiat",
    model: "Uno",
    year: 2015,
    color: "Branco",
    engineNumber: "DEF789012",
    chassisNumber: "9BD15844VF1234567",
  },
  {
    id: "3",
    customerId: "2",
    plate: "GHI-9012",
    brand: "Chevrolet",
    model: "Onix",
    year: 2020,
    color: "Preto",
    engineNumber: "GHI345678",
    chassisNumber: "9BGKS69J0LG123456",
  },
  {
    id: "4",
    customerId: "3",
    plate: "JKL-3456",
    brand: "Honda",
    model: "Civic",
    year: 2019,
    color: "Azul",
    engineNumber: "JKL901234",
    chassisNumber: "19XFC2F59KE012345",
  },
]

export const mockBudgets: Budget[] = [
  {
    id: "1",
    customerId: "1",
    vehicleId: "1",
    date: new Date("2024-03-15"),
    status: "pending",
    services: [
      {
        id: "s1",
        description: "Retífica de motor completa",
        quantity: 1,
        unitPrice: 2500,
        total: 2500,
      },
      {
        id: "s2",
        description: "Troca de óleo e filtros",
        quantity: 1,
        unitPrice: 150,
        total: 150,
      },
    ],
    parts: [
      {
        id: "p1",
        description: "Jogo de juntas do motor",
        partNumber: "JG-001",
        quantity: 1,
        unitPrice: 350,
        total: 350,
      },
      {
        id: "p2",
        description: "Óleo 5W30",
        partNumber: "OL-5W30",
        quantity: 4,
        unitPrice: 45,
        total: 180,
      },
    ],
    subtotal: 3180,
    discount: 0,
    total: 3180,
    notes: "Cliente solicitou urgência",
  },
  {
    id: "2",
    customerId: "2",
    vehicleId: "3",
    date: new Date("2024-03-20"),
    status: "approved",
    services: [
      {
        id: "s3",
        description: "Retífica de cabeçote",
        quantity: 1,
        unitPrice: 800,
        total: 800,
      },
    ],
    parts: [
      {
        id: "p3",
        description: "Junta do cabeçote",
        partNumber: "JC-002",
        quantity: 1,
        unitPrice: 120,
        total: 120,
      },
    ],
    subtotal: 920,
    discount: 50,
    total: 870,
    notes: "Desconto de fidelidade aplicado",
  },
]

export const mockOrders: Order[] = [
  {
    id: "1",
    budgetId: "2",
    customerId: "2",
    vehicleId: "3",
    startDate: new Date("2024-03-21"),
    estimatedEndDate: new Date("2024-03-25"),
    status: "in-progress",
    services: [
      {
        id: "s3",
        description: "Retífica de cabeçote",
        quantity: 1,
        unitPrice: 800,
        total: 800,
      },
    ],
    parts: [
      {
        id: "p3",
        description: "Junta do cabeçote",
        partNumber: "JC-002",
        quantity: 1,
        unitPrice: 120,
        total: 120,
      },
    ],
    total: 870,
    mechanicNotes: "Cabeçote apresentava trinca pequena, foi soldado",
  },
]

// Helper functions
export function getCustomerById(id: string): Customer | undefined {
  return mockCustomers.find((c) => c.id === id)
}

export function getVehicleById(id: string): Vehicle | undefined {
  return mockVehicles.find((v) => v.id === id)
}

export function getVehiclesByCustomerId(customerId: string): Vehicle[] {
  return mockVehicles.filter((v) => v.customerId === customerId)
}

export function getBudgetById(id: string): Budget | undefined {
  return mockBudgets.find((b) => b.id === id)
}

export function getOrderById(id: string): Order | undefined {
  return mockOrders.find((o) => o.id === id)
}

export const mockInventory: InventoryItem[] = [
  {
    id: "1",
    name: "Jogo de juntas do motor",
    description: "Jogo completo de juntas para motor a gasolina",
    category: "Juntas",
    sku: "JG-001",
    quantity: 5,
    minQuantity: 2,
    unitPrice: 350,
    supplier: "Autopecas SA",
    notes: "Compatível com motores 1.0 e 1.6",
    createdAt: new Date("2024-01-10"),
    updatedAt: new Date("2024-03-15"),
  },
  {
    id: "2",
    name: "Junta do cabeçote",
    description: "Junta do cabeçote para motor 1.6",
    category: "Juntas",
    sku: "JC-002",
    quantity: 10,
    minQuantity: 3,
    unitPrice: 120,
    supplier: "Autopecas SA",
    notes: "Material de alta qualidade",
    createdAt: new Date("2024-01-15"),
    updatedAt: new Date("2024-03-20"),
  },
  {
    id: "3",
    name: "Óleo 5W30",
    description: "Óleo lubrificante semi-sintético 5W30",
    category: "Lubrificantes",
    sku: "OL-5W30",
    quantity: 20,
    minQuantity: 5,
    unitPrice: 45,
    supplier: "Lubrificantes Ltda",
    notes: "Indicado para motores a gasolina",
    createdAt: new Date("2024-02-01"),
    updatedAt: new Date("2024-03-22"),
  },
  {
    id: "4",
    name: "Filtro de óleo",
    description: "Filtro de óleo para motor",
    category: "Filtros",
    sku: "FO-001",
    quantity: 15,
    minQuantity: 5,
    unitPrice: 25,
    supplier: "Autopecas SA",
    notes: "Compatível com diversos modelos",
    createdAt: new Date("2024-02-10"),
    updatedAt: new Date("2024-03-25"),
  },
  {
    id: "5",
    name: "Pastilha de freio dianteira",
    description: "Pastilha de freio dianteira para veículos leves",
    category: "Freios",
    sku: "PF-001",
    quantity: 8,
    minQuantity: 3,
    unitPrice: 85,
    supplier: "Freios Ltda",
    notes: "Garantia de 1 ano",
    createdAt: new Date("2024-03-01"),
    updatedAt: new Date("2024-03-28"),
  },
]

// Helper functions for inventory
export function getInventoryById(id: string): InventoryItem | undefined {
  return mockInventory.find((i) => i.id === id)
}

export function getInventoryBySku(sku: string): InventoryItem | undefined {
  return mockInventory.find((i) => i.sku === sku)
}

export function getInventoryByCategory(category: string): InventoryItem[] {
  return mockInventory.filter((i) => i.category === category)
}
