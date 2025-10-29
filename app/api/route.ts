import { NextRequest } from 'next/server';

export async function GET(req: NextRequest) {
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000';
  
  const endpoints = {
    'API Documentation': `${baseUrl}/api/docs`,
    'API Specification (JSON)': `${baseUrl}/api/docs/swagger-json`,
    'Customers': {
      'GET (all)': `${baseUrl}/api/customers`,
      'POST': `${baseUrl}/api/customers`,
      'GET (by ID)': `${baseUrl}/api/customers/{id}`,
      'PUT (by ID)': `${baseUrl}/api/customers/{id}`,
      'DELETE (by ID)': `${baseUrl}/api/customers/{id}`
    },
    'Vehicles': {
      'GET (all)': `${baseUrl}/api/vehicles`,
      'POST': `${baseUrl}/api/vehicles`,
      'GET (by ID)': `${baseUrl}/api/vehicles/{id}`,
      'PUT (by ID)': `${baseUrl}/api/vehicles/{id}`,
      'DELETE (by ID)': `${baseUrl}/api/vehicles/{id}`
    },
    'Inventory': {
      'GET (all)': `${baseUrl}/api/inventory`,
      'POST': `${baseUrl}/api/inventory`,
      'GET (by ID)': `${baseUrl}/api/inventory/{id}`,
      'PUT (by ID)': `${baseUrl}/api/inventory/{id}`,
      'DELETE (by ID)': `${baseUrl}/api/inventory/{id}`
    },
    'Budgets': {
      'GET (all)': `${baseUrl}/api/budgets`,
      'POST': `${baseUrl}/api/budgets`,
      'GET (by ID)': `${baseUrl}/api/budgets/{id}`,
      'PUT (by ID)': `${baseUrl}/api/budgets/{id}`,
      'DELETE (by ID)': `${baseUrl}/api/budgets/{id}`
    },
    'Orders': {
      'GET (all)': `${baseUrl}/api/orders`,
      'POST': `${baseUrl}/api/orders`,
      'GET (by ID)': `${baseUrl}/api/orders/{id}`,
      'PUT (by ID)': `${baseUrl}/api/orders/{id}`,
      'DELETE (by ID)': `${baseUrl}/api/orders/{id}`
    },
    'Services': {
      'GET (all)': `${baseUrl}/api/services`,
      'POST': `${baseUrl}/api/services`,
      'GET (by ID)': `${baseUrl}/api/services/{id}`,
      'PUT (by ID)': `${baseUrl}/api/services/{id}`,
      'DELETE (by ID)': `${baseUrl}/api/services/{id}`
    }
  };
  
  return new Response(JSON.stringify(endpoints, null, 2), {
    status: 200,
    headers: {
      'Content-Type': 'application/json',
    },
  });
}