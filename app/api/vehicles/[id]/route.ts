import { NextRequest } from 'next/server';
import { connectToDatabase } from '../../../../lib/mongodb';
import { VehicleModel } from '../../../../lib/models/Vehicle';
import { authenticateAPIRequest } from '../../../../lib/auth';

// Swagger documentation for individual vehicle endpoint
/**
 * @swagger
 * tags:
 *   name: Vehicles
 *   description: Vehicle management
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

  // Swagger documentation for GET vehicle by ID
  /**
   * @swagger
   * /api/vehicles/{id}:
   *   get:
   *     summary: Get a vehicle by ID
   *     tags: [Vehicles]
   *     security:
   *       - bearerAuth: []
   *     parameters:
   *       - in: path
   *         name: id
   *         schema:
   *           type: string
   *         required: true
   *         description: Vehicle ID
   *     responses:
   *       200:
   *         description: Vehicle found
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
   *       401:
   *         description: Unauthorized
   *       404:
   *         description: Vehicle not found
   *       500:
   *         description: Server error
   */

  try {
    await connectToDatabase();

    const resolvedParams = await params;
    const { id } = resolvedParams;
    
    // Find vehicle by ID and authenticated user ID
    const vehicle = await VehicleModel.findOne({ _id: id, userId: auth.userId });
    
    if (!vehicle) {
      return new Response(JSON.stringify({ error: 'Vehicle not found' }), {
        status: 404,
        headers: {
          'Content-Type': 'application/json',
        },
      });
    }

    return new Response(JSON.stringify(vehicle), {
      status: 200,
      headers: {
        'Content-Type': 'application/json',
      },
    });
  } catch (error) {
    console.error('Error fetching vehicle:', error);
    return new Response(JSON.stringify({ error: 'Error fetching vehicle' }), {
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

  // Swagger documentation for PUT vehicle by ID
  /**
   * @swagger
   * /api/vehicles/{id}:
   *   put:
   *     summary: Update a vehicle by ID
   *     tags: [Vehicles]
   *     security:
   *       - bearerAuth: []
   *     parameters:
   *       - in: path
   *         name: id
   *         schema:
   *           type: string
   *         required: true
   *         description: Vehicle ID
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
   *       200:
   *         description: Vehicle updated successfully
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
   *       401:
   *         description: Unauthorized
   *       404:
   *         description: Vehicle not found
   *       500:
   *         description: Server error
   */

  try {
    await connectToDatabase();

    const resolvedParams = await params;
    const { id } = resolvedParams;
    const body = await req.json();
    
    // Update vehicle by ID and authenticated user ID
    const updatedVehicle = await VehicleModel.findOneAndUpdate(
      { _id: id, userId: auth.userId },
      { ...body },
      { new: true } // Return updated document
    );
    
    if (!updatedVehicle) {
      return new Response(JSON.stringify({ error: 'Vehicle not found' }), {
        status: 404,
        headers: {
          'Content-Type': 'application/json',
        },
      });
    }

    return new Response(JSON.stringify(updatedVehicle), {
      status: 200,
      headers: {
        'Content-Type': 'application/json',
      },
    });
  } catch (error) {
    console.error('Error updating vehicle:', error);
    return new Response(JSON.stringify({ error: 'Error updating vehicle' }), {
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

  // Swagger documentation for DELETE vehicle by ID
  /**
   * @swagger
   * /api/vehicles/{id}:
   *   delete:
   *     summary: Delete a vehicle by ID
   *     tags: [Vehicles]
   *     security:
   *       - bearerAuth: []
   *     parameters:
   *       - in: path
   *         name: id
   *         schema:
   *           type: string
   *         required: true
   *         description: Vehicle ID
   *     responses:
   *       200:
   *         description: Vehicle deleted successfully
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
   *         description: Vehicle not found
   *       500:
   *         description: Server error
   */

  try {
    await connectToDatabase();

    const resolvedParams = await params;
    const { id } = resolvedParams;
    
    // Delete vehicle by ID and authenticated user ID
    const deletedVehicle = await VehicleModel.findOneAndDelete({ _id: id, userId: auth.userId });
    
    if (!deletedVehicle) {
      return new Response(JSON.stringify({ error: 'Vehicle not found' }), {
        status: 404,
        headers: {
          'Content-Type': 'application/json',
        },
      });
    }

    return new Response(JSON.stringify({ message: 'Vehicle deleted successfully' }), {
      status: 200,
      headers: {
        'Content-Type': 'application/json',
      },
    });
  } catch (error) {
    console.error('Error deleting vehicle:', error);
    return new Response(JSON.stringify({ error: 'Error deleting vehicle' }), {
      status: 500,
      headers: {
        'Content-Type': 'application/json',
      },
    });
  }
}