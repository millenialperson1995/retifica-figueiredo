import { NextRequest } from 'next/server';
import { connectToDatabase } from '../../../../lib/mongodb';
import { InventoryItemModel } from '../../../../lib/models/InventoryItem';
import { authenticateAPIRequest } from '../../../../lib/auth';

// Swagger documentation for individual inventory endpoint
/**
 * @swagger
 * tags:
 *   name: Inventory
 *   description: Inventory management
 */

export async function GET(
  req: NextRequest,
  { params }: { params: { id: string } }
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

  // Swagger documentation for GET inventory item by ID
  /**
   * @swagger
   * /api/inventory/{id}:
   *   get:
   *     summary: Get an inventory item by ID
   *     tags: [Inventory]
   *     security:
   *       - bearerAuth: []
   *     parameters:
   *       - in: path
   *         name: id
   *         schema:
   *           type: string
   *         required: true
   *         description: Inventory item ID
   *     responses:
   *       200:
   *         description: Inventory item found
   *         content:
   *           application/json:
   *             schema:
   *               type: object
   *               properties:
   *                 id:
   *                   type: string
   *                   description: Inventory item ID
   *                 name:
   *                   type: string
   *                   description: Item name
   *                 description:
   *                   type: string
   *                   description: Item description
   *                 category:
   *                   type: string
   *                   description: Item category
   *                 sku:
   *                   type: string
   *                   description: Item SKU
   *                 quantity:
   *                   type: number
   *                   description: Item quantity
   *                 minQuantity:
   *                   type: number
   *                   description: Minimum quantity
   *                 unitPrice:
   *                   type: number
   *                   description: Unit price
   *                 supplier:
   *                   type: string
   *                   description: Supplier name
   *                 notes:
   *                   type: string
   *                   description: Additional notes
   *                 createdAt:
   *                   type: string
   *                   description: Creation date
   *                 updatedAt:
   *                   type: string
   *                   description: Update date
   *       401:
   *         description: Unauthorized
   *       404:
   *         description: Inventory item not found
   *       500:
   *         description: Server error
   */

  try {
    await connectToDatabase();

    const resolvedParams = await params;
    const { id } = resolvedParams;
    
    // Find inventory item by ID and authenticated user ID
    const inventoryItem = await InventoryItemModel.findOne({ _id: id, userId: auth.userId });
    
    if (!inventoryItem) {
      return new Response(JSON.stringify({ error: 'Inventory item not found' }), {
        status: 404,
        headers: {
          'Content-Type': 'application/json',
        },
      });
    }

    return new Response(JSON.stringify(inventoryItem), {
      status: 200,
      headers: {
        'Content-Type': 'application/json',
      },
    });
  } catch (error) {
    console.error('Error fetching inventory item:', error);
    return new Response(JSON.stringify({ error: 'Error fetching inventory item' }), {
      status: 500,
      headers: {
        'Content-Type': 'application/json',
      },
    });
  }
}

export async function PUT(
  req: NextRequest,
  { params }: { params: { id: string } }
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

  // Swagger documentation for PUT inventory item by ID
  /**
   * @swagger
   * /api/inventory/{id}:
   *   put:
   *     summary: Update an inventory item by ID
   *     tags: [Inventory]
   *     security:
   *       - bearerAuth: []
   *     parameters:
   *       - in: path
   *         name: id
   *         schema:
   *           type: string
   *         required: true
   *         description: Inventory item ID
   *     requestBody:
   *       required: true
   *       content:
   *         application/json:
   *           schema:
   *             type: object
   *             properties:
   *               name:
   *                 type: string
   *                 description: Item name
   *                 example: "Jogo de juntas do motor"
   *               description:
   *                 type: string
   *                 description: Item description
   *                 example: "Jogo completo de juntas para motor a gasolina"
   *               category:
   *                 type: string
   *                 description: Item category
   *                 example: "Juntas"
   *               sku:
   *                 type: string
   *                 description: Item SKU
   *                 example: "JG-001"
   *               quantity:
   *                 type: number
   *                 description: Item quantity
   *                 example: 5
   *               minQuantity:
   *                 type: number
   *                 description: Minimum quantity
   *                 example: 2
   *               unitPrice:
   *                 type: number
   *                 description: Unit price
   *                 example: 350
   *               supplier:
   *                 type: string
   *                 description: Supplier name
   *                 example: "Autopecas SA"
   *               notes:
   *                 type: string
   *                 description: Additional notes
   *                 example: "Compatível com motores 1.0 e 1.6"
   *     responses:
   *       200:
   *         description: Inventory item updated successfully
   *         content:
   *           application/json:
   *             schema:
   *               type: object
   *               properties:
   *                 id:
   *                   type: string
   *                   description: Inventory item ID
   *                 name:
   *                   type: string
   *                   description: Item name
   *                 description:
   *                   type: string
   *                   description: Item description
   *                 category:
   *                   type: string
   *                   description: Item category
   *                 sku:
   *                   type: string
   *                   description: Item SKU
   *                 quantity:
   *                   type: number
   *                   description: Item quantity
   *                 minQuantity:
   *                   type: number
   *                   description: Minimum quantity
   *                 unitPrice:
   *                   type: number
   *                   description: Unit price
   *                 supplier:
   *                   type: string
   *                   description: Supplier name
   *                 notes:
   *                   type: string
   *                   description: Additional notes
   *                 createdAt:
   *                   type: string
   *                   description: Creation date
   *                 updatedAt:
   *                   type: string
   *                   description: Update date
   *       401:
   *         description: Unauthorized
   *       404:
   *         description: Inventory item not found
   *       500:
   *         description: Server error
   */

  try {
    await connectToDatabase();

    const resolvedParams = await params;
    const { id } = resolvedParams;
    const body = await req.json();
    
    // Update inventory item by ID and authenticated user ID
    const updatedInventoryItem = await InventoryItemModel.findOneAndUpdate(
      { _id: id, userId: auth.userId },
      { ...body },
      { new: true } // Return updated document
    );
    
    if (!updatedInventoryItem) {
      return new Response(JSON.stringify({ error: 'Inventory item not found' }), {
        status: 404,
        headers: {
          'Content-Type': 'application/json',
        },
      });
    }

    return new Response(JSON.stringify(updatedInventoryItem), {
      status: 200,
      headers: {
        'Content-Type': 'application/json',
      },
    });
  } catch (error) {
    console.error('Error updating inventory item:', error);
    return new Response(JSON.stringify({ error: 'Error updating inventory item' }), {
      status: 500,
      headers: {
        'Content-Type': 'application/json',
      },
    });
  }
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: { id: string } }
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

  // Swagger documentation for DELETE inventory item by ID
  /**
   * @swagger
   * /api/inventory/{id}:
   *   delete:
   *     summary: Delete an inventory item by ID
   *     tags: [Inventory]
   *     security:
   *       - bearerAuth: []
   *     parameters:
   *       - in: path
   *         name: id
   *         schema:
   *           type: string
   *         required: true
   *         description: Inventory item ID
   *     responses:
   *       200:
   *         description: Inventory item deleted successfully
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
   *         description: Inventory item not found
   *       500:
   *         description: Server error
   */

  try {
    await connectToDatabase();

    const resolvedParams = await params;
    const { id } = resolvedParams;
    
    // Delete inventory item by ID and authenticated user ID
    const deletedInventoryItem = await InventoryItemModel.findOneAndDelete({ _id: id, userId: auth.userId });
    
    if (!deletedInventoryItem) {
      return new Response(JSON.stringify({ error: 'Inventory item not found' }), {
        status: 404,
        headers: {
          'Content-Type': 'application/json',
        },
      });
    }

    return new Response(JSON.stringify({ message: 'Inventory item deleted successfully' }), {
      status: 200,
      headers: {
        'Content-Type': 'application/json',
      },
    });
  } catch (error) {
    console.error('Error deleting inventory item:', error);
    return new Response(JSON.stringify({ error: 'Error deleting inventory item' }), {
      status: 500,
      headers: {
        'Content-Type': 'application/json',
      },
    });
  }
}