import { NextRequest } from 'next/server';
import mongoose from 'mongoose';
import { connectToDatabase } from '../../../lib/mongodb';
import { OrderModel } from '../../../lib/models/Order';
import { InventoryItemModel } from '../../../lib/models/InventoryItem';
import { authenticateAPIRequest } from '../../../lib/auth';
import { createOrderSchema } from '../../../lib/schemas';

// Swagger documentation for orders endpoint
/**
 * @swagger
 * tags:
 *   name: Orders
 *   description: Order management
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

    // Swagger documentation for GET orders
    /**
     * @swagger
     * /api/orders:
     *   get:
     *     summary: Get all orders
     *     tags: [Orders]
     *     security:
     *       - bearerAuth: []
     *     parameters:
     *       - in: query
     *         name: page
     *         schema:
     *           type: integer
     *         description: Page number for pagination
     *       - in: query
     *         name: limit
     *         schema:
     *           type: integer
     *         description: Number of items per page
     *     responses:
     *       200:
     *         description: List of orders
     *         content:
     *           application/json:
     *             schema:
     *               type: object
     *               properties:
     *                 data:
     *                   type: array
     *                   items:
     *                     type: object
     *                     properties:
     *                       id:
     *                         type: string
     *                         description: Order ID
     *                       budgetId:
     *                         type: string
     *                         description: Budget ID
     *                       customerId:
     *                         type: string
     *                         description: Customer ID
     *                       vehicleId:
     *                         type: string
     *                         description: Vehicle ID
     *                       startDate:
     *                         type: string
     *                         description: Start date
     *                       estimatedEndDate:
     *                         type: string
     *                         description: Estimated end date
     *                       actualEndDate:
     *                         type: string
     *                         description: Actual end date
     *                       status:
     *                         type: string
     *                         description: Order status
     *                         enum: [pending, in-progress, completed, cancelled]
     *                       services:
     *                         type: array
     *                         items:
     *                           type: object
     *                           properties:
     *                             id:
     *                               type: string
     *                               description: Service ID
     *                             description:
     *                               type: string
     *                               description: Service description
     *                             quantity:
     *                               type: number
     *                               description: Service quantity
     *                             unitPrice:
     *                               type: number
     *                               description: Service unit price
     *                             total:
     *                               type: number
     *                               description: Service total
     *                       parts:
     *                         type: array
     *                         items:
     *                           type: object
     *                           properties:
     *                             id:
     *                               type: string
     *                               description: Part ID
     *                             description:
     *                               type: string
     *                               description: Part description
     *                             partNumber:
     *                               type: string
     *                               description: Part number
     *                             quantity:
     *                               type: number
     *                               description: Part quantity
     *                             unitPrice:
     *                               type: number
     *                               description: Part unit price
     *                             total:
     *                               type: number
     *                               description: Part total
     *                             inventoryId:
     *                               type: string
     *                               description: Inventory ID
     *                       total:
     *                         type: number
     *                         description: Total amount
     *                       notes:
     *                         type: string
     *                         description: Additional notes
     *                       mechanicNotes:
     *                         type: string
     *                         description: Mechanic notes
     *                 pagination:
     *                   type: object
     *                   properties:
     *                     page:
     *                       type: integer
     *                       description: Current page
     *                     limit:
     *                       type: integer
     *                       description: Limit per page
     *                     total:
     *                       type: integer
     *                       description: Total items
     *                     pages:
     *                       type: integer
     *                       description: Total pages
     */

    // Obter parâmetros de paginação
    const url = new URL(req.url);
    const page = parseInt(url.searchParams.get('page') || '1');
    const limit = parseInt(url.searchParams.get('limit') || '10');
    const skip = (page - 1) * limit;

    // Buscar dados paginados
    const orders = await OrderModel
      .find({ userId: auth.userId })
      .sort({ createdAt: -1, startDate: -1 })
      .skip(skip)
      .limit(limit);

    // Contar total para paginação
    const total = await OrderModel.countDocuments({ userId: auth.userId });

    return new Response(
      JSON.stringify({ 
        data: orders,
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
    console.error('Error fetching orders:', error);
    return new Response(JSON.stringify({ error: 'Error fetching orders' }), {
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

    // Swagger documentation for POST orders
    /**
     * @swagger
     * /api/orders:
     *   post:
     *     summary: Create a new order
     *     tags: [Orders]
     *     security:
     *       - bearerAuth: []
     *     requestBody:
     *       required: true
     *       content:
     *         application/json:
     *           schema:
     *             type: object
     *             properties:
     *               budgetId:
     *                 type: string
     *                 description: Budget ID
     *                 example: "1"
     *               customerId:
     *                 type: string
     *                 description: Customer ID
     *                 example: "1"
     *               vehicleId:
     *                 type: string
     *                 description: Vehicle ID
     *                 example: "1"
     *               startDate:
     *                 type: string
     *                 description: Start date
     *                 format: date
     *                 example: "2024-03-21T00:00:00.000Z"
     *               estimatedEndDate:
     *                 type: string
     *                 description: Estimated end date
     *                 format: date
     *                 example: "2024-03-25T00:00:00.000Z"
     *               actualEndDate:
     *                 type: string
     *                 description: Actual end date
     *                 format: date
     *                 example: "2024-03-24T00:00:00.000Z"
     *               status:
     *                 type: string
     *                 description: Order status
     *                 enum: [pending, in-progress, completed, cancelled]
     *                 example: "in-progress"
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
     *               total:
     *                 type: number
     *                 description: Total amount
     *                 example: 3180
     *               notes:
     *                 type: string
     *                 description: Additional notes
     *                 example: "Cliente solicitou urgência"
     *               mechanicNotes:
     *                 type: string
     *                 description: Mechanic notes
     *                 example: "Motor apresentava trinca, foi soldado"
     *     responses:
     *       201:
     *         description: Order created successfully
     *         content:
     *           application/json:
     *             schema:
     *               type: object
     *               properties:
     *                 id:
     *                   type: string
     *                   description: Order ID
     *                 budgetId:
     *                   type: string
     *                   description: Budget ID
     *                 customerId:
     *                   type: string
     *                   description: Customer ID
     *                 vehicleId:
     *                   type: string
     *                   description: Vehicle ID
     *                 startDate:
     *                   type: string
     *                   description: Start date
     *                 estimatedEndDate:
     *                   type: string
     *                   description: Estimated end date
     *                 actualEndDate:
     *                   type: string
     *                   description: Actual end date
     *                 status:
     *                   type: string
     *                   description: Order status
     *                   enum: [pending, in-progress, completed, cancelled]
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
     *                 total:
     *                   type: number
     *                   description: Total amount
     *                 notes:
     *                   type: string
     *                   description: Additional notes
     *                 mechanicNotes:
     *                   type: string
     *                   description: Mechanic notes
     */

    const body = await req.json();

    // Validate the request body
    const validation = createOrderSchema.safeParse(body);
    if (!validation.success) {
      return new Response(JSON.stringify({ error: 'Invalid input', details: validation.error.flatten() }), {
        status: 400,
        headers: {
          'Content-Type': 'application/json',
        },
      });
    }

    const validatedData = validation.data;

    const order = new OrderModel({
      ...validatedData,
      userId: auth.userId, // Associar a ordem de serviço ao usuário autenticado
      updatedBy: auth.userId, // Registrar quem criou/atualizou
    });
    const savedOrder = await order.save();

    // If the order does not come from an approved budget and has parts with inventory, deduct from inventory
    // This handles the case where an order is created directly without going through the budget approval process
    if ((!body.budgetId || body.budgetId === "none") && savedOrder.parts && savedOrder.parts.length > 0) {
      try {
        const session = await mongoose.startSession();
        await session.withTransaction(async () => {
          for (const part of savedOrder.parts) {
            if (part.inventoryId) {
              // Find and update the inventory item atomically
              const inventoryItem = await InventoryItemModel.findOneAndUpdate(
                { 
                  _id: part.inventoryId, 
                  userId: auth.userId,
                  quantity: { $gte: part.quantity } // Ensure there's enough quantity
                },
                { 
                  $inc: { quantity: -part.quantity }, // Atomically decrease quantity
                  $set: { updatedBy: auth.userId } // Register who updated
                },
                { 
                  session, // Use the same session for the transaction
                  new: true // Return updated document
                }
              );
              
              if (!inventoryItem) {
                // If we couldn't update the inventory item (insufficient stock), throw error to abort transaction
                throw new Error(`Quantidade insuficiente em estoque para o item com ID ${part.inventoryId}.`);
              }
            }
          }
        });
      } catch (inventoryError) {
        console.error('Error updating inventory after direct order creation:', inventoryError);
        // Rollback order creation if inventory update fails
        await OrderModel.findByIdAndDelete(savedOrder._id);
        return new Response(JSON.stringify({ 
          error: 'Error updating inventory. Order was not created.' 
        }), {
          status: 500,
          headers: {
            'Content-Type': 'application/json',
          },
        });
      }
    }

    return new Response(JSON.stringify(savedOrder), {
      status: 201,
      headers: {
        'Content-Type': 'application/json',
      },
    });
  } catch (error) {
    console.error('Error creating order:', error);
    return new Response(JSON.stringify({ error: 'Error creating order' }), {
      status: 500,
      headers: {
        'Content-Type': 'application/json',
      },
    });
  }
}