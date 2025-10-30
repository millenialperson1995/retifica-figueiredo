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
    
    // Update budget by ID and authenticated user ID
    const updatedBudget = await BudgetModel.findOneAndUpdate(
      { _id: id, userId: auth.userId },
      { ...body },
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
        // Process each part in the budget
        for (const part of updatedBudget.parts) {
          if (part.inventoryId) {
            // Find the inventory item
            const inventoryItem = await InventoryItemModel.findOne({ 
              _id: part.inventoryId, 
              userId: auth.userId 
            });
            
            if (inventoryItem) {
              // Check if there's enough quantity in stock
              if (inventoryItem.quantity < part.quantity) {
                return new Response(JSON.stringify({ 
                  error: `Quantidade insuficiente em estoque para o item '${inventoryItem.name}'. Estoque disponível: ${inventoryItem.quantity}, solicitado: ${part.quantity}` 
                }), {
                  status: 400,
                  headers: {
                    'Content-Type': 'application/json',
                  },
                });
              }
              
              // Deduct the quantity from inventory
              inventoryItem.quantity -= part.quantity;
              await inventoryItem.save();
            }
          }
        }
      } catch (inventoryError) {
        console.error('Error updating inventory:', inventoryError);
        // Rollback budget update if inventory update fails?
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