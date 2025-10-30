// Local storage manager for mock data persistence
import type { Customer, Vehicle, Budget, Order } from "./types"

const STORAGE_KEYS = {
  CUSTOMERS: "oficina_customers",
  VEHICLES: "oficina_vehicles",
  BUDGETS: "oficina_budgets",
  ORDERS: "oficina_orders",
}

// Initialize storage with mock data if empty
export function initializeStorage() {
  if (typeof window === "undefined") return

  // Intentionally do not seed localStorage with static/mock data.
  // The app should fetch data from the server via the API or persist user data explicitly.
}

// Customers
export function getCustomers(): Customer[] {
  if (typeof window === "undefined") return []
  const data = localStorage.getItem(STORAGE_KEYS.CUSTOMERS)
  return data ? JSON.parse(data) : []
}

export function saveCustomer(customer: Customer) {
  const customers = getCustomers()
  const index = customers.findIndex((c) => c.id === customer.id)
  if (index >= 0) {
    customers[index] = customer
  } else {
    customers.push(customer)
  }
  localStorage.setItem(STORAGE_KEYS.CUSTOMERS, JSON.stringify(customers))
}

export function deleteCustomer(id: string) {
  const customers = getCustomers().filter((c) => c.id !== id)
  localStorage.setItem(STORAGE_KEYS.CUSTOMERS, JSON.stringify(customers))
}

// Vehicles
export function getVehicles(): Vehicle[] {
  if (typeof window === "undefined") return []
  const data = localStorage.getItem(STORAGE_KEYS.VEHICLES)
  return data ? JSON.parse(data) : []
}

export function saveVehicle(vehicle: Vehicle) {
  const vehicles = getVehicles()
  const index = vehicles.findIndex((v) => v.id === vehicle.id)
  if (index >= 0) {
    vehicles[index] = vehicle
  } else {
    vehicles.push(vehicle)
  }
  localStorage.setItem(STORAGE_KEYS.VEHICLES, JSON.stringify(vehicles))
}

export function deleteVehicle(id: string) {
  const vehicles = getVehicles().filter((v) => v.id !== id)
  localStorage.setItem(STORAGE_KEYS.VEHICLES, JSON.stringify(vehicles))
}

// Budgets
export function getBudgets(): Budget[] {
  if (typeof window === "undefined") return []
  const data = localStorage.getItem(STORAGE_KEYS.BUDGETS)
  if (!data) return []
  const budgets = JSON.parse(data)
  // Convert date strings back to Date objects
  return budgets.map((b: any) => ({
    ...b,
    date: new Date(b.date),
  }))
}

export function saveBudget(budget: Budget) {
  const budgets = getBudgets()
  const index = budgets.findIndex((b) => b.id === budget.id)
  if (index >= 0) {
    budgets[index] = budget
  } else {
    budgets.push(budget)
  }
  localStorage.setItem(STORAGE_KEYS.BUDGETS, JSON.stringify(budgets))
}

export function deleteBudget(id: string) {
  const budgets = getBudgets().filter((b) => b.id !== id)
  localStorage.setItem(STORAGE_KEYS.BUDGETS, JSON.stringify(budgets))
}

// Orders
export function getOrders(): Order[] {
  if (typeof window === "undefined") return []
  const data = localStorage.getItem(STORAGE_KEYS.ORDERS)
  if (!data) return []
  const orders = JSON.parse(data)
  // Convert date strings back to Date objects
  const parsed = orders.map((o: any) => ({
    ...o,
    startDate: o.startDate ? new Date(o.startDate) : undefined,
    estimatedEndDate: o.estimatedEndDate ? new Date(o.estimatedEndDate) : undefined,
    // some records may use different field names (completedDate / actualEndDate)
    actualEndDate: o.actualEndDate ? new Date(o.actualEndDate) : (o.completedDate ? new Date(o.completedDate) : undefined),
    createdAt: o.createdAt ? new Date(o.createdAt) : undefined,
    updatedAt: o.updatedAt ? new Date(o.updatedAt) : undefined,
  }))

  // Return newest orders first (createdAt desc). If createdAt missing, keep original order.
  return parsed.sort((a: any, b: any) => {
    if (a.createdAt && b.createdAt) return b.createdAt.getTime() - a.createdAt.getTime()
    if (a.createdAt && !b.createdAt) return -1
    if (!a.createdAt && b.createdAt) return 1
    return 0
  })
}

export function saveOrder(order: Order) {
  const orders = getOrders()
  const index = orders.findIndex((o) => o.id === order.id)
  if (index >= 0) {
    orders[index] = order
  } else {
    // Insert new orders at the beginning so they appear first in lists that don't sort
    // (getOrders also enforces sorting by createdAt).
    orders.unshift(order)
  }
  localStorage.setItem(STORAGE_KEYS.ORDERS, JSON.stringify(orders))
}

export function deleteOrder(id: string) {
  const orders = getOrders().filter((o) => o.id !== id)
  localStorage.setItem(STORAGE_KEYS.ORDERS, JSON.stringify(orders))
}
