import { NextRequest } from 'next/server';

export async function GET(req: NextRequest) {
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000';
  
  const endpoints = {
    'API Documentation': `${baseUrl}/api/docs`,
    'API Specification (JSON)': `${baseUrl}/api/docs/swagger-json`,
    'Customers': {
      'GET': `${baseUrl}/api/customers`,
      'POST': `${baseUrl}/api/customers`
    },
    'Vehicles': {
      'GET': `${baseUrl}/api/vehicles`,
      'POST': `${baseUrl}/api/vehicles`
    },
    'Inventory': {
      'GET': `${baseUrl}/api/inventory`,
      'POST': `${baseUrl}/api/inventory`
    },
    'Budgets': {
      'GET': `${baseUrl}/api/budgets`,
      'POST': `${baseUrl}/api/budgets`
    },
    'Orders': {
      'GET': `${baseUrl}/api/orders`,
      'POST': `${baseUrl}/api/orders`
    },
    'Services': {
      'GET': `${baseUrl}/api/services`,
      'POST': `${baseUrl}/api/services`
    }
  };
  
  return new Response(JSON.stringify(endpoints, null, 2), {
    status: 200,
    headers: {
      'Content-Type': 'application/json',
    },
  });
}