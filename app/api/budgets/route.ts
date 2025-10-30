import { NextRequest } from 'next/server';
import { connectToDatabase } from '../../../lib/mongodb';
import { BudgetModel } from '../../../lib/models/Budget';
import { authenticateAPIRequest } from '../../../lib/auth';

// Swagger documentation for budgets endpoint
/**
 * @swagger
 * tags:
 *   name: Budgets
 *   description: Budget management
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

    // Swagger documentation for GET budgets
    /**
     * @swagger
     * /api/budgets:
     *   get:
     *     summary: Get all budgets
     *     tags: [Budgets]
     *     security:
     *       - bearerAuth: []
     *     responses:
     *       200:
     *         description: List of budgets
     *         content:
     *           application/json:
     *             schema:
     *               type: array
     *               items:
     *                 type: object
     *                 properties:
     *                   id:
     *                     type: string
     *                     description: Budget ID
     *                   customerId:
     *                     type: string
     *                     description: Customer ID
     *                   vehicleId:
     *                     type: string
     *                     description: Vehicle ID
     *                   date:
     *                     type: string
     *                     description: Budget date
     *                   status:
     *                     type: string
     *                     description: Budget status
     *                     enum: [pending, approved, rejected]
     *                   services:
     *                     type: array
     *                     items:
     *                       type: object
     *                       properties:
     *                         id:
     *                           type: string
     *                           description: Service ID
     *                         description:
     *                           type: string
     *                           description: Service description
     *                         quantity:
     *                           type: number
     *                           description: Service quantity
     *                         unitPrice:
     *                           type: number
     *                           description: Service unit price
     *                         total:
     *                           type: number
     *                           description: Service total
     *                   parts:
     *                     type: array
     *                     items:
     *                       type: object
     *                       properties:
     *                         id:
     *                           type: string
     *                           description: Part ID
     *                         description:
     *                           type: string
     *                           description: Part description
     *                         partNumber:
     *                           type: string
     *                           description: Part number
     *                         quantity:
     *                           type: number
     *                           description: Part quantity
     *                         unitPrice:
     *                           type: number
     *                           description: Part unit price
     *                         total:
     *                           type: number
     *                           description: Part total
     *                         inventoryId:
     *                           type: string
     *                           description: Inventory ID
     *                   subtotal:
     *                     type: number
     *                     description: Subtotal amount
     *                   discount:
     *                     type: number
     *                     description: Discount amount
     *                   total:
     *                     type: number
     *                     description: Total amount
     *                   notes:
     *                     type: string
     *                     description: Additional notes
     */

    // Filter budgets by authenticated user ID
    const budgets = await BudgetModel.find({ userId: auth.userId });
    return new Response(JSON.stringify(budgets), {
      status: 200,
      headers: {
        'Content-Type': 'application/json',
      },
    });
  } catch (error) {
    console.error('Error fetching budgets:', error);
    return new Response(JSON.stringify({ error: 'Error fetching budgets' }), {
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

    // Swagger documentation for POST budgets
    /**
     * @swagger
     * /api/budgets:
     *   post:
     *     summary: Create a new budget
     *     tags: [Budgets]
     *     security:
     *       - bearerAuth: []
     *     requestBody:
     *       required: true
     *       content:
     *         application/json:
     *           schema:
     *             type: object
     *             properties:
     *               customerId:
     *                 type: string
     *                 description: Customer ID
     *                 example: "1"
     *               vehicleId:
     *                 type: string
     *                 description: Vehicle ID
     *                 example: "1"
     *               date:
     *                 type: string
     *                 description: Budget date
     *                 format: date
     *                 example: "2024-03-15T00:00:00.000Z"
     *               status:
     *                 type: string
     *                 description: Budget status
     *                 enum: [pending, approved, rejected]
     *                 example: "pending"
     *               services:
     *                 type: array
     *                 items:
     *                   type: object
     *                   properties:
     *                     id:
     *                       type: string
     *                       description: Service ID
     *                       example: "s1"
     *                     description:
     *                       type: string
     *                       description: Service description
     *                       example: "Retífica de motor completa"
     *                     quantity:
     *                       type: number
     *                       description: Service quantity
     *                       example: 1
     *                     unitPrice:
     *                       type: number
     *                       description: Service unit price
     *                       example: 2500
     *                     total:
     *                       type: number
     *                       description: Service total
     *                       example: 2500
     *               parts:
     *                 type: array
     *                 items:
     *                   type: object
     *                   properties:
     *                     id:
     *                       type: string
     *                       description: Part ID
     *                       example: "p1"
     *                     description:
     *                       type: string
     *                       description: Part description
     *                       example: "Jogo de juntas do motor"
     *                     partNumber:
     *                       type: string
     *                       description: Part number
     *                       example: "JG-001"
     *                     quantity:
     *                       type: number
     *                       description: Part quantity
     *                       example: 1
     *                     unitPrice:
     *                       type: number
     *                       description: Part unit price
     *                       example: 350
     *                     total:
     *                       type: number
     *                       description: Part total
     *                       example: 350
     *                     inventoryId:
     *                       type: string
     *                       description: Inventory ID
     *                       example: "1"
     *               subtotal:
     *                 type: number
     *                 description: Subtotal amount
     *                 example: 3180
     *               discount:
     *                 type: number
     *                 description: Discount amount
     *                 example: 0
     *               total:
     *                 type: number
     *                 description: Total amount
     *                 example: 3180
     *               notes:
     *                 type: string
     *                 description: Additional notes
     *                 example: "Cliente solicitou urgência"
     *     responses:
     *       201:
     *         description: Budget created successfully
     *         content:
     *           application/json:
     *             schema:
     *               type: object
     *               properties:
     *                 id:
     *                   type: string
     *                   description: Budget ID
     *                 customerId:
     *                   type: string
     *                   description: Customer ID
     *                 vehicleId:
     *                   type: string
     *                   description: Vehicle ID
     *                 date:
     *                   type: string
     *                   description: Budget date
     *                 status:
     *                   type: string
     *                   description: Budget status
     *                   enum: [pending, approved, rejected]
     *                 services:
     *                   type: array
     *                   items:
     *                     type: object
     *                     properties:
     *                       id:
     *                         type: string
     *                         description: Service ID
     *                       description:
     *                         type: string
     *                         description: Service description
     *                       quantity:
     *                         type: number
     *                         description: Service quantity
     *                       unitPrice:
     *                         type: number
     *                         description: Service unit price
     *                       total:
     *                         type: number
     *                         description: Service total
     *                 parts:
     *                   type: array
     *                   items:
     *                     type: object
     *                     properties:
     *                       id:
     *                         type: string
     *                         description: Part ID
     *                       description:
     *                         type: string
     *                         description: Part description
     *                       partNumber:
     *                         type: string
     *                         description: Part number
     *                       quantity:
     *                         type: number
     *                         description: Part quantity
     *                       unitPrice:
     *                         type: number
     *                         description: Part unit price
     *                       total:
     *                         type: number
     *                         description: Part total
     *                       inventoryId:
     *                         type: string
     *                         description: Inventory ID
     *                 subtotal:
     *                   type: number
     *                   description: Subtotal amount
     *                 discount:
     *                   type: number
     *                   description: Discount amount
     *                 total:
     *                   type: number
     *                   description: Total amount
     *                 notes:
     *                   type: string
     *                   description: Additional notes
     */

    const body = await req.json();
    const budget = new BudgetModel({
      ...body,
      userId: auth.userId, // Associar o orçamento ao usuário autenticado
    });
    const savedBudget = await budget.save();

    return new Response(JSON.stringify(savedBudget), {
      status: 201,
      headers: {
        'Content-Type': 'application/json',
      },
    });
  } catch (error: any) {
    console.error('Error creating budget:', error);
    
    // Tratamento detalhado de erros
    let errorMessage = 'Erro ao criar orçamento';
    let statusCode = 500;

    if (error.name === 'ValidationError') {
      // Erro de validação do Mongoose
      statusCode = 400;
      const validationErrors = Object.values(error.errors).map((err: any) => err.message);
      errorMessage = `Erro de validação: ${validationErrors.join(', ')}`;
    } else if (error.code === 11000) {
      // Erro de duplicidade
      statusCode = 409;
      errorMessage = 'Já existe um orçamento com essas informações';
    } else if (error.message) {
      errorMessage = error.message;
    }

    return new Response(JSON.stringify({ error: errorMessage }), {
      status: statusCode,
      headers: {
        'Content-Type': 'application/json',
      },
    });
  }
}