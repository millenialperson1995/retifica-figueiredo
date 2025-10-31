import { NextRequest } from 'next/server';
import { connectToDatabase } from '../../../lib/mongodb';
import { CustomerModel } from '../../../lib/models/Customer';
import { authenticateAPIRequest } from '../../../lib/auth';

// Swagger documentation for customers endpoint
/**
 * @swagger
 * tags:
 *   name: Customers
 *   description: Customer management
 */

export async function GET(req: NextRequest) {
  // Authenticate the request
  const auth = authenticateAPIRequest(req);
  if (!auth.authenticated) {
    return new Response(JSON.stringify({ error: 'Unauthorized' }), {
      status: 401,
      headers: {
        'Content-Type': 'application/json',
      },
    });
  }

  try {
    await connectToDatabase();

    // Swagger documentation for GET customers
    /**
     * @swagger
     * /api/customers:
     *   get:
     *     summary: Get all customers
     *     tags: [Customers]
     *     security:
     *       - bearerAuth: []
     *     responses:
     *       200:
     *         description: List of customers
     *         content:
     *           application/json:
     *             schema:
     *               type: array
     *               items:
     *                 type: object
     *                 properties:
     *                   id:
     *                     type: string
     *                     description: Customer ID
     *                   name:
     *                     type: string
     *                     description: Customer name
     *                   email:
     *                     type: string
     *                     description: Customer email
     *                   phone:
     *                     type: string
     *                     description: Customer phone
     *                   cpfCnpj:
     *                     type: string
     *                     description: Customer CPF or CNPJ
     *                   address:
     *                     type: string
     *                     description: Customer address
     *                   city:
     *                     type: string
     *                     description: Customer city
     *                   state:
     *                     type: string
     *                     description: Customer state
     *                   zipCode:
     *                     type: string
     *                     description: Customer zip code
     *                   referencia:
     *                     type: string
     *                     description: Customer reference point (optional)
     *                   createdAt:
     *                     type: string
     *                     description: Customer creation date
     */

    // Obter parâmetros de paginação
    const url = new URL(req.url);
    const page = parseInt(url.searchParams.get('page') || '1');
    const limit = parseInt(url.searchParams.get('limit') || '10');
    const skip = (page - 1) * limit;

    // Buscar dados paginados
    const customers = await CustomerModel
      .find({ userId: auth.userId })
      .skip(skip)
      .limit(limit);

    // Contar total para paginação
    const total = await CustomerModel.countDocuments({ userId: auth.userId });

    return new Response(
      JSON.stringify({ 
        data: customers,
        pagination: { 
          page, 
          limit, 
          total, 
          pages: Math.ceil(total / limit) 
        } 
      }), {
        status: 200,
        headers: { 'Content-Type': 'application/json' },
      }
    );
  } catch (error) {
    console.error('Error fetching customers:', error);
    return new Response(JSON.stringify({ error: 'Error fetching customers' }), {
      status: 500,
      headers: {
        'Content-Type': 'application/json',
      },
    });
  }
}

export async function POST(req: NextRequest) {
  // Authenticate the request
  const auth = authenticateAPIRequest(req);
  if (!auth.authenticated) {
    return new Response(JSON.stringify({ error: 'Unauthorized' }), {
      status: 401,
      headers: {
        'Content-Type': 'application/json',
      },
    });
  }

  try {
    await connectToDatabase();

    // Swagger documentation for POST customers
    /**
     * @swagger
     * /api/customers:
     *   post:
     *     summary: Create a new customer
     *     tags: [Customers]
     *     security:
     *       - bearerAuth: []
     *     requestBody:
     *       required: true
     *       content:
     *         application/json:
     *           schema:
     *             type: object
     *             properties:
     *               name:
     *                 type: string
     *                 description: Customer name
     *                 example: João Silva
     *               email:
     *                 type: string
     *                 description: Customer email
     *                 example: joao.silva@email.com
     *               phone:
     *                 type: string
     *                 description: Customer phone
     *                 example: "(11) 98765-4321"
     *               cpfCnpj:
     *                 type: string
     *                 description: Customer CPF or CNPJ
     *                 example: "123.456.789-00"
     *               address:
     *                 type: string
     *                 description: Customer address
     *                 example: "Rua das Flores, 123"
     *               city:
     *                 type: string
     *                 description: Customer city
     *                 example: São Paulo
     *               state:
     *                 type: string
     *                 description: Customer state
     *                 example: SP
     *               zipCode:
     *                 type: string
     *                 description: Customer zip code
     *                 example: "01234-567"
     *               referencia:
     *                 type: string
     *                 description: Customer reference point (optional)
     *                 example: "Próximo à padaria do João"
     *     responses:
     *       201:
     *         description: Customer created successfully
     *         content:
     *           application/json:
     *             schema:
     *               type: object
     *               properties:
     *                 id:
     *                   type: string
     *                   description: Customer ID
     *                 name:
     *                   type: string
     *                   description: Customer name
     *                 email:
     *                   type: string
     *                   description: Customer email
     *                 phone:
     *                   type: string
     *                   description: Customer phone
     *                 cpfCnpj:
     *                   type: string
     *                   description: Customer CPF or CNPJ
     *                 address:
     *                   type: string
     *                   description: Customer address
     *                 city:
     *                   type: string
     *                   description: Customer city
     *                 state:
     *                   type: string
     *                   description: Customer state
     *                 zipCode:
     *                   type: string
     *                   description: Customer zip code
     *                 referencia:
     *                   type: string
     *                   description: Customer reference point (optional)
     *                 createdAt:
     *                   type: string
     *                   description: Customer creation date
     */

    const body = await req.json();
    
    // Add the authenticated user ID to the customer record
    const customer = new CustomerModel({
      ...body,
      userId: auth.userId, // Associar o cliente ao usuário autenticado
      updatedBy: auth.userId, // Registrar quem criou/atualizou
    });
    const savedCustomer = await customer.save();

    return new Response(JSON.stringify(savedCustomer), {
      status: 201,
      headers: {
        'Content-Type': 'application/json',
      },
    });
  } catch (error) {
    console.error('Error creating customer:', error);
    return new Response(JSON.stringify({ error: 'Error creating customer' }), {
      status: 500,
      headers: {
        'Content-Type': 'application/json',
      },
    });
  }
}