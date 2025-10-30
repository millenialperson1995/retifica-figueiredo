import { NextRequest } from 'next/server';
import mongoose from 'mongoose';
import { connectToDatabase } from '../../../../lib/mongodb';
import { OrderModel } from '../../../../lib/models/Order';
import { InventoryItemModel } from '../../../../lib/models/InventoryItem';
import { authenticateAPIRequest } from '../../../../lib/auth';

// Swagger documentation for individual order endpoint
/**
 * @swagger
 * tags:
 *   name: Orders
 *   description: Order management
 */

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
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

  // Swagger documentation for GET order by ID
  /**
   * @swagger
   * /api/orders/{id}:
   *   get:
   *     summary: Get an order by ID
   *     tags: [Orders]
   *     security:
   *       - bearerAuth: []
   *     parameters:
   *       - in: path
   *         name: id
   *         schema:
   *           type: string
   *         required: true
   *         description: Order ID
   *     responses:
   *       200:
   *         description: Order found
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
   *       401:
   *         description: Unauthorized
   *       404:
   *         description: Order not found
   *       500:
   *         description: Server error
   */

  try {
    await connectToDatabase();

    const resolvedParams = await params;
    const { id } = resolvedParams;
    
    // Find order by ID and authenticated user ID
    const order = await OrderModel.findOne({ _id: id, userId: auth.userId });
    
    if (!order) {
      return new Response(JSON.stringify({ error: 'Order not found' }), {
        status: 404,
        headers: {
          'Content-Type': 'application/json',
        },
      });
    }

    return new Response(JSON.stringify(order), {
      status: 200,
      headers: {
        'Content-Type': 'application/json',
      },
    });
  } catch (error) {
    console.error('Error fetching order:', error);
    return new Response(JSON.stringify({ error: 'Error fetching order' }), {
      status: 500,
      headers: {
        'Content-Type': 'application/json',
      },
    });
  }
}

export async function PUT(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
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

  // Swagger documentation for PUT order by ID
  /**
   * @swagger
   * /api/orders/{id}:
   *   put:
   *     summary: Update an order by ID
   *     tags: [Orders]
   *     security:
   *       - bearerAuth: []
   *     parameters:
   *       - in: path
   *         name: id
   *         schema:
   *           type: string
   *         required: true
   *         description: Order ID
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
   *       200:
   *         description: Order updated successfully
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
   *       401:
   *         description: Unauthorized
   *       404:
   *         description: Order not found
   *       500:
   *         description: Server error
   */

  try {
    await connectToDatabase();

    const resolvedParams = await params;
    const { id } = resolvedParams;
    const body = await req.json();
    
    // Check if the order is completed before allowing updates
    const existingOrder = await OrderModel.findOne({ _id: id, userId: auth.userId });
    
    if (!existingOrder) {
      return new Response(JSON.stringify({ error: 'Order not found' }), {
        status: 404,
        headers: {
          'Content-Type': 'application/json',
        },
      });
    }
    
    // Prevent modification of completed orders
    if (existingOrder.status === 'completed') {
      return new Response(JSON.stringify({ 
        error: 'Cannot modify a completed order. Completed orders are locked to maintain historical integrity.' 
      }), {
        status: 400,
        headers: {
          'Content-Type': 'application/json',
        },
      });
    }
    
    // Before updating, check if parts are being added/modified for direct orders
    // We should prevent modification of inventory parts after initial creation if it's a direct order
    const isDirectOrder = !existingOrder.budgetId || existingOrder.budgetId === "none";
    const partsChanged = JSON.stringify(existingOrder.parts) !== JSON.stringify(body.parts);
    
    if (isDirectOrder && partsChanged && existingOrder.parts && existingOrder.parts.length > 0) {
      // This would require complex inventory management to handle adding/removing parts after creation
      // For now, prevent this to maintain data integrity
      return new Response(JSON.stringify({ 
        error: 'Cannot modify parts in a direct order after creation. Create a new order instead.' 
      }), {
        status: 400,
        headers: {
          'Content-Type': 'application/json',
        },
      });
    }
    
    // Update order by ID and authenticated user ID
    const updatedOrder = await OrderModel.findOneAndUpdate(
      { _id: id, userId: auth.userId },
      { ...body },
      { new: true } // Return updated document
    );
    
    if (!updatedOrder) {
      return new Response(JSON.stringify({ error: 'Order not found' }), {
        status: 404,
        headers: {
          'Content-Type': 'application/json',
        },
      });
    }

    return new Response(JSON.stringify(updatedOrder), {
      status: 200,
      headers: {
        'Content-Type': 'application/json',
      },
    });
  } catch (error) {
    console.error('Error updating order:', error);
    return new Response(JSON.stringify({ error: 'Error updating order' }), {
      status: 500,
      headers: {
        'Content-Type': 'application/json',
      },
    });
  }
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
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

  // Swagger documentation for DELETE order by ID
  /**
   * @swagger
   * /api/orders/{id}:
   *   delete:
   *     summary: Delete an order by ID
   *     tags: [Orders]
   *     security:
   *       - bearerAuth: []
   *     parameters:
   *       - in: path
   *         name: id
   *         schema:
   *           type: string
   *         required: true
   *         description: Order ID
   *     responses:
   *       200:
   *         description: Order deleted successfully
   *         content:
   *           application/json:
   *             schema:
   *               type: object
   *               properties:
   *                 message:
   *                   type: string
   *                   description: Success message
   *       401:
   *         description: Unauthorized
   *       404:
   *         description: Order not found
   *       500:
   *         description: Server error
   */

  try {
    await connectToDatabase();

    const resolvedParams = await params;
    const { id } = resolvedParams;
    
    // Delete order by ID and authenticated user ID
    const deletedOrder = await OrderModel.findOneAndDelete({ _id: id, userId: auth.userId });
    
    if (!deletedOrder) {
      return new Response(JSON.stringify({ error: 'Order not found' }), {
        status: 404,
        headers: {
          'Content-Type': 'application/json',
        },
      });
    }

    return new Response(JSON.stringify({ message: 'Order deleted successfully' }), {
      status: 200,
      headers: {
        'Content-Type': 'application/json',
      },
    });
  } catch (error) {
    console.error('Error deleting order:', error);
    return new Response(JSON.stringify({ error: 'Error deleting order' }), {
      status: 500,
      headers: {
        'Content-Type': 'application/json',
      },
    });
  }
}