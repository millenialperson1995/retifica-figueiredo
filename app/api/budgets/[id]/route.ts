import { NextRequest } from 'next/server';
import mongoose from 'mongoose';
import { connectToDatabase } from '../../../../lib/mongodb';
import { BudgetModel } from '../../../../lib/models/Budget';
import { InventoryItemModel } from '../../../../lib/models/InventoryItem';
import { authenticateAPIRequest } from '../../../../lib/auth';

// Swagger documentation for individual budget endpoint
/**
 * @swagger
 * tags:
 *   name: Budgets
 *   description: Budget management
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

  // Swagger documentation for GET budget by ID
  /**
   * @swagger
   * /api/budgets/{id}:
   *   get:
   *     summary: Get a budget by ID
   *     tags: [Budgets]
   *     security:
   *       - bearerAuth: []
   *     parameters:
   *       - in: path
   *         name: id
   *         schema:
   *           type: string
   *         required: true
   *         description: Budget ID
   *     responses:
   *       200:
   *         description: Budget found
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
   *       401:
   *         description: Unauthorized
   *       404:
   *         description: Budget not found
   *       500:
   *         description: Server error
   */

  try {
    await connectToDatabase();
    
    const resolvedParams = await params;
    const { id } = resolvedParams;

    // Validate ObjectId
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return new Response(JSON.stringify({ error: 'Invalid budget ID format' }), {
        status: 400,
        headers: {
          'Content-Type': 'application/json',
        },
      });
    }
    
    // Find budget by ID and authenticated user ID
    const budget = await BudgetModel.findOne({ _id: id, userId: auth.userId });
    
    if (!budget) {
      return new Response(JSON.stringify({ error: 'Budget not found' }), {
        status: 404,
        headers: {
          'Content-Type': 'application/json',
        },
      });
    }

    return new Response(JSON.stringify(budget), {
      status: 200,
      headers: {
        'Content-Type': 'application/json',
      },
    });
  } catch (error) {
    console.error('Error fetching budget:', error);
    return new Response(JSON.stringify({ error: 'Error fetching budget' }), {
      status: 500,
      headers: {
        'Content-Type': 'application/json',
      },
    });
  }
}

// Function to validate status transitions
function validateStatusTransition(entityType: 'order' | 'budget', fromStatus: string, toStatus: string): boolean {
  if (entityType === 'order') {
    const validTransitions: { [key: string]: string[] } = {
      'pending': ['in-progress', 'cancelled'],
      'in-progress': ['completed', 'cancelled'],
      'completed': [], // No transitions from completed
      'cancelled': []  // No transitions from cancelled
    };
    
    return validTransitions[fromStatus]?.includes(toStatus) || false;
  } else { // budget
    const validTransitions: { [key: string]: string[] } = {
      'pending': ['approved', 'rejected'],
      'approved': [], // No transitions from approved
      'rejected': []  // No transitions from rejected
    };
    
    return validTransitions[fromStatus]?.includes(toStatus) || false;
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

  // Swagger documentation for PUT budget by ID
  /**
   * @swagger
   * /api/budgets/{id}:
   *   put:
   *     summary: Update a budget by ID
   *     tags: [Budgets]
   *     security:
   *       - bearerAuth: []
   *     parameters:
   *       - in: path
   *         name: id
   *         schema:
   *           type: string
   *         required: true
   *         description: Budget ID
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
   *       200:
   *         description: Budget updated successfully
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
   *       401:
   *         description: Unauthorized
   *       404:
   *         description: Budget not found
   *       500:
   *         description: Server error
   */

  try {
    await connectToDatabase();

    const resolvedParams = await params;
    const { id } = resolvedParams;

    // Validate ObjectId
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return new Response(JSON.stringify({ error: 'Invalid budget ID format' }), {
        status: 400,
        headers: {
          'Content-Type': 'application/json',
        },
      });
    }

    const body = await req.json();
    
    // Find existing budget
    const existingBudget = await BudgetModel.findOne({ _id: id, userId: auth.userId });
    
    if (!existingBudget) {
      return new Response(JSON.stringify({ error: 'Budget not found' }), {
        status: 404,
        headers: {
          'Content-Type': 'application/json',
        },
      });
    }
    
    // Validate status transition
    if (body.status !== undefined) {
      const isValidTransition = validateStatusTransition('budget', existingBudget.status, body.status);
      if (!isValidTransition) {
        return new Response(JSON.stringify({ 
          error: `Invalid status transition: ${existingBudget.status} to ${body.status}.` 
        }), {
          status: 400,
          headers: {
            'Content-Type': 'application/json',
          },
        });
      }
    }
    
    // Update budget by ID and authenticated user ID, including who made the update
    const updatedBudget = await BudgetModel.findOneAndUpdate(
      { _id: id, userId: auth.userId },
      { ...body, updatedBy: auth.userId },
      { new: true } // Return updated document
    );
    
    if (!updatedBudget) {
      return new Response(JSON.stringify({ error: 'Budget not found' }), {
        status: 404,
        headers: {
          'Content-Type': 'application/json',
        },
      });
    }

    // If the budget status was changed to 'approved', deduct parts from inventory
    if (existingBudget.status !== 'approved' && updatedBudget.status === 'approved') {
      try {
        const session = await mongoose.startSession();
        await session.withTransaction(async () => {
          // Process each part in the budget
          for (const part of updatedBudget.parts) {
            if (part.inventoryId) {
              // Find the inventory item using findOneAndUpdate to ensure atomicity
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
        console.error('Error updating inventory:', inventoryError);
        // Rollback budget update by reverting the status
        await BudgetModel.findOneAndUpdate(
          { _id: id, userId: auth.userId },
          { status: existingBudget.status, updatedBy: auth.userId },
          { new: true }
        );
        
        return new Response(JSON.stringify({ 
          error: 'Error updating inventory. Budget status was not changed.' 
        }), {
          status: 500,
          headers: {
            'Content-Type': 'application/json',
          },
        });
      }
    }

    return new Response(JSON.stringify(updatedBudget), {
      status: 200,
      headers: {
        'Content-Type': 'application/json',
      },
    });
  } catch (error) {
    console.error('Error updating budget:', error);
    return new Response(JSON.stringify({ error: 'Error updating budget' }), {
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

  // Swagger documentation for DELETE budget by ID
  /**
   * @swagger
   * /api/budgets/{id}:
   *   delete:
   *     summary: Delete a budget by ID
   *     tags: [Budgets]
   *     security:
   *       - bearerAuth: []
   *     parameters:
   *       - in: path
   *         name: id
   *         schema:
   *           type: string
   *         required: true
   *         description: Budget ID
   *     responses:
   *       200:
   *         description: Budget deleted successfully
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
   *         description: Budget not found
   *       500:
   *         description: Server error
   */

  try {
    await connectToDatabase();

    const resolvedParams = await params;
    const { id } = resolvedParams;

    // Validate ObjectId
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return new Response(JSON.stringify({ error: 'Invalid budget ID format' }), {
        status: 400,
        headers: {
          'Content-Type': 'application/json',
        },
      });
    }
    
    // Delete budget by ID and authenticated user ID
    const deletedBudget = await BudgetModel.findOneAndDelete({ _id: id, userId: auth.userId });
    
    if (!deletedBudget) {
      return new Response(JSON.stringify({ error: 'Budget not found' }), {
        status: 404,
        headers: {
          'Content-Type': 'application/json',
        },
      });
    }

    return new Response(JSON.stringify({ message: 'Budget deleted successfully' }), {
      status: 200,
      headers: {
        'Content-Type': 'application/json',
      },
    });
  } catch (error) {
    console.error('Error deleting budget:', error);
    return new Response(JSON.stringify({ error: 'Error deleting budget' }), {
      status: 500,
      headers: {
        'Content-Type': 'application/json',
      },
    });
  }
}