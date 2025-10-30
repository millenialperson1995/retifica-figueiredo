import { NextRequest } from 'next/server';
import { connectToDatabase } from '../../../lib/mongodb';
import { InventoryItemModel } from '../../../lib/models/InventoryItem';
import { authenticateAPIRequest } from '../../../lib/auth';

// Swagger documentation for inventory endpoint
/**
 * @swagger
 * tags:
 *   name: Inventory
 *   description: Inventory management
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

    // Swagger documentation for GET inventory
    /**
     * @swagger
     * /api/inventory:
     *   get:
     *     summary: Get all inventory items
     *     tags: [Inventory]
     *     security:
     *       - bearerAuth: []
     *     responses:
     *       200:
     *         description: List of inventory items
     *         content:
     *           application/json:
     *             schema:
     *               type: array
     *               items:
     *                 type: object
     *                 properties:
     *                   id:
     *                     type: string
     *                     description: Inventory item ID
     *                   name:
     *                     type: string
     *                     description: Item name
     *                   description:
     *                     type: string
     *                     description: Item description
     *                   category:
     *                     type: string
     *                     description: Item category
     *                   sku:
     *                     type: string
     *                     description: Item SKU
     *                   quantity:
     *                     type: number
     *                     description: Item quantity
     *                   minQuantity:
     *                     type: number
     *                     description: Minimum quantity
     *                   unitPrice:
     *                     type: number
     *                     description: Unit price
     *                   supplier:
     *                     type: string
     *                     description: Supplier name
     *                   notes:
     *                     type: string
     *                     description: Additional notes
     *                   createdAt:
     *                     type: string
     *                     description: Creation date
     *                   updatedAt:
     *                     type: string
     *                     description: Update date
     */

    // Filter inventory items by authenticated user ID
    const inventoryItems = await InventoryItemModel.find({ userId: auth.userId });
    return new Response(JSON.stringify(inventoryItems), {
      status: 200,
      headers: {
        'Content-Type': 'application/json',
      },
    });
  } catch (error) {
    console.error('Error fetching inventory items:', error);
    return new Response(JSON.stringify({ error: 'Error fetching inventory items' }), {
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

    // Swagger documentation for POST inventory
    /**
     * @swagger
     * /api/inventory:
     *   post:
     *     summary: Create a new inventory item
     *     tags: [Inventory]
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
     *       201:
     *         description: Inventory item created successfully
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
     */

    const body = await req.json();
    const inventoryItem = new InventoryItemModel({
      ...body,
      userId: auth.userId, // Associar o item de inventário ao usuário autenticado
      updatedBy: auth.userId, // Registrar quem criou/atualizou
    });
    const savedInventoryItem = await inventoryItem.save();

    return new Response(JSON.stringify(savedInventoryItem), {
      status: 201,
      headers: {
        'Content-Type': 'application/json',
      },
    });
  } catch (error) {
    console.error('Error creating inventory item:', error);
    return new Response(JSON.stringify({ error: 'Error creating inventory item' }), {
      status: 500,
      headers: {
        'Content-Type': 'application/json',
      },
    });
  }
}