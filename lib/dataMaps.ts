// lib/dataMaps.ts
// Utilitários para criação de mapas de dados para otimização de buscas

export const createCustomerMap = (customers: any[]) => {
  if (!customers || !Array.isArray(customers)) {
    return new Map();
  }
  return new Map(customers.map(customer => [customer.id, customer]));
};

export const createVehicleMap = (vehicles: any[]) => {
  if (!vehicles || !Array.isArray(vehicles)) {
    return new Map();
  }
  return new Map(vehicles.map(vehicle => [vehicle.id, vehicle]));
};

export const createInventoryMap = (inventoryItems: any[]) => {
  if (!inventoryItems || !Array.isArray(inventoryItems)) {
    return new Map();
  }
  return new Map(inventoryItems.map(item => [item.id, item]));
};

export const createServiceMap = (services: any[]) => {
  if (!services || !Array.isArray(services)) {
    return new Map();
  }
  return new Map(services.map(service => [service.id, service]));
};