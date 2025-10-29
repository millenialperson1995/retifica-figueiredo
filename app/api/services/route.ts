import { NextRequest } from 'next/server';
import { connectToDatabase } from '../../../lib/mongodb';
import { StandardServiceModel } from '../../../lib/models/StandardService';
import { authenticateAPIRequest } from '../../../lib/auth';

// Swagger documentation for standard services endpoint
/**
 * @swagger
 * tags:
 *   name: StandardServices
 *   description: Standard services management
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

    // Swagger documentation for GET standard services
    /**
     * @swagger
     * /api/services:
     *   get:
     *     summary: Get all standard services
     *     tags: [StandardServices]
     *     security:
     *       - bearerAuth: []
     *     responses:
     *       200:
     *         description: List of standard services
     *         content:
     *           application/json:
     *             schema:
     *               type: array
     *               items:
     *                 type: object
     *                 properties:
     *                   id:
     *                     type: string
     *                     description: Service ID
     *                   name:
     *                     type: string
     *                     description: Service name
     *                   description:
     *                     type: string
     *                     description: Service description
     *                   duration:
     *                     type: number
     *                     description: Service duration in hours
     *                   category:
     *                     type: string
     *                     description: Service category
     *                   basePrice:
     *                     type: number
     *                     description: Base price
     *                   isActive:
     *                     type: boolean
     *                     description: Whether the service is active
     *                   createdAt:
     *                     type: string
     *                     description: Creation date
     *                   updatedAt:
     *                     type: string
     *                     description: Update date
     */

    // Filter standard services by authenticated user ID
    const services = await StandardServiceModel.find({ userId: auth.userId });
    return new Response(JSON.stringify(services), {
      status: 200,
      headers: {
        'Content-Type': 'application/json',
      },
    });
  } catch (error) {
    console.error('Error fetching standard services:', error);
    return new Response(JSON.stringify({ error: 'Error fetching standard services' }), {
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

    // Swagger documentation for POST standard services
    /**
     * @swagger
     * /api/services:
     *   post:
     *     summary: Create a new standard service
     *     tags: [StandardServices]
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
     *                 description: Service name
     *                 example: "Retífica de Motor Completa"
     *               description:
     *                 type: string
     *                 description: Service description
     *                 example: "Retífica completa do motor com balanceamento e calibração"
     *               duration:
     *                 type: number
     *                 description: Service duration in hours
     *                 example: 40
     *               category:
     *                 type: string
     *                 description: Service category
     *                 example: "Motor"
     *               basePrice:
     *                 type: number
     *                 description: Base price
     *                 example: 2500
     *               isActive:
     *                 type: boolean
     *                 description: Whether the service is active
     *                 example: true
     *     responses:
     *       201:
     *         description: Standard service created successfully
     *         content:
     *           application/json:
     *             schema:
     *               type: object
     *               properties:
     *                 id:
     *                   type: string
     *                   description: Service ID
     *                 name:
     *                   type: string
     *                   description: Service name
     *                 description:
     *                   type: string
     *                   description: Service description
     *                 duration:
     *                   type: number
     *                   description: Service duration in hours
     *                 category:
     *                   type: string
     *                   description: Service category
     *                 basePrice:
     *                   type: number
     *                   description: Base price
     *                 isActive:
     *                   type: boolean
     *                   description: Whether the service is active
     *                 createdAt:
     *                   type: string
     *                   description: Creation date
     *                 updatedAt:
     *                   type: string
     *                   description: Update date
     */

    const body = await req.json();
    const service = new StandardServiceModel({
      ...body,
      userId: auth.userId, // Associar o serviço padrão ao usuário autenticado
    });
    const savedService = await service.save();

    return new Response(JSON.stringify(savedService), {
      status: 201,
      headers: {
        'Content-Type': 'application/json',
      },
    });
  } catch (error) {
    console.error('Error creating standard service:', error);
    return new Response(JSON.stringify({ error: 'Error creating standard service' }), {
      status: 500,
      headers: {
        'Content-Type': 'application/json',
      },
    });
  }
}