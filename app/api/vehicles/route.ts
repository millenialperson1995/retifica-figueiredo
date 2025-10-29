import { NextRequest } from 'next/server';
import { connectToDatabase } from '../../../lib/mongodb';
import { VehicleModel } from '../../../lib/models/Vehicle';
import { authenticateAPIRequest } from '../../../lib/auth';

// Swagger documentation for vehicles endpoint
/**
 * @swagger
 * tags:
 *   name: Vehicles
 *   description: Vehicle management
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

    // Swagger documentation for GET vehicles
    /**
     * @swagger
     * /api/vehicles:
     *   get:
     *     summary: Get all vehicles
     *     tags: [Vehicles]
     *     security:
     *       - bearerAuth: []
     *     responses:
     *       200:
     *         description: List of vehicles
     *         content:
     *           application/json:
     *             schema:
     *               type: array
     *               items:
     *                 type: object
     *                 properties:
     *                   id:
     *                     type: string
     *                     description: Vehicle ID
     *                   customerId:
     *                     type: string
     *                     description: Customer ID
     *                   plate:
     *                     type: string
     *                     description: Vehicle plate
     *                   brand:
     *                     type: string
     *                     description: Vehicle brand
     *                   model:
     *                     type: string
     *                     description: Vehicle model
     *                   year:
     *                     type: number
     *                     description: Vehicle year
     *                   color:
     *                     type: string
     *                     description: Vehicle color
     *                   engineNumber:
     *                     type: string
     *                     description: Engine number
     *                   chassisNumber:
     *                     type: string
     *                     description: Chassis number
     *                   notes:
     *                     type: string
     *                     description: Vehicle notes
     */

    // Filter vehicles by authenticated user ID
    const vehicles = await VehicleModel.find({ userId: auth.userId });
    return new Response(JSON.stringify(vehicles), {
      status: 200,
      headers: {
        'Content-Type': 'application/json',
      },
    });
  } catch (error) {
    console.error('Error fetching vehicles:', error);
    return new Response(JSON.stringify({ error: 'Error fetching vehicles' }), {
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

    // Swagger documentation for POST vehicles
    /**
     * @swagger
     * /api/vehicles:
     *   post:
     *     summary: Create a new vehicle
     *     tags: [Vehicles]
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
     *               plate:
     *                 type: string
     *                 description: Vehicle plate
     *                 example: "ABC-1234"
     *               brand:
     *                 type: string
     *                 description: Vehicle brand
     *                 example: "Volkswagen"
     *               model:
     *                 type: string
     *                 description: Vehicle model
     *                 example: "Gol"
     *               year:
     *                 type: number
     *                 description: Vehicle year
     *                 example: 2018
     *               color:
     *                 type: string
     *                 description: Vehicle color
     *                 example: "Prata"
     *               engineNumber:
     *                 type: string
     *                 description: Engine number
     *                 example: "ABC123456"
     *               chassisNumber:
     *                 type: string
     *                 description: Chassis number
     *                 example: "9BWZZZ377VT004251"
     *               notes:
     *                 type: string
     *                 description: Vehicle notes
     *                 example: "Veículo com modificações no motor"
     *     responses:
     *       201:
     *         description: Vehicle created successfully
     *         content:
     *           application/json:
     *             schema:
     *               type: object
     *               properties:
     *                 id:
     *                   type: string
     *                   description: Vehicle ID
     *                 customerId:
     *                   type: string
     *                   description: Customer ID
     *                 plate:
     *                   type: string
     *                   description: Vehicle plate
     *                 brand:
     *                   type: string
     *                   description: Vehicle brand
     *                 model:
     *                   type: string
     *                   description: Vehicle model
     *                 year:
     *                   type: number
     *                   description: Vehicle year
     *                 color:
     *                   type: string
     *                   description: Vehicle color
     *                 engineNumber:
     *                   type: string
     *                   description: Engine number
     *                 chassisNumber:
     *                   type: string
     *                   description: Chassis number
     *                 notes:
     *                   type: string
     *                   description: Vehicle notes
     */

    const body = await req.json();
    const vehicle = new VehicleModel({
      ...body,
      userId: auth.userId, // Associar o veículo ao usuário autenticado
    });
    const savedVehicle = await vehicle.save();

    return new Response(JSON.stringify(savedVehicle), {
      status: 201,
      headers: {
        'Content-Type': 'application/json',
      },
    });
  } catch (error) {
    console.error('Error creating vehicle:', error);
    return new Response(JSON.stringify({ error: 'Error creating vehicle' }), {
      status: 500,
      headers: {
        'Content-Type': 'application/json',
      },
    });
  }
}