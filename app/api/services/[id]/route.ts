import { NextRequest } from 'next/server';
import { connectToDatabase } from '../../../../lib/mongodb';
import { StandardServiceModel } from '../../../../lib/models/StandardService';
import { authenticateAPIRequest } from '../../../../lib/auth';

// Swagger documentation for individual standard service endpoint
/**
 * @swagger
 * tags:
 *   name: StandardServices
 *   description: Standard services management
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

  // Swagger documentation for GET standard service by ID
  /**
   * @swagger
   * /api/services/{id}:
   *   get:
   *     summary: Get a standard service by ID
   *     tags: [StandardServices]
   *     security:
   *       - bearerAuth: []
   *     parameters:
   *       - in: path
   *         name: id
   *         schema:
   *           type: string
   *         required: true
   *         description: Service ID
   *     responses:
   *       200:
   *         description: Standard service found
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
   *       401:
   *         description: Unauthorized
   *       404:
   *         description: Standard service not found
   *       500:
   *         description: Server error
   */

  try {
    await connectToDatabase();

    const resolvedParams = await params;
    const { id } = resolvedParams;
    
    // Find standard service by ID and authenticated user ID
    const service = await StandardServiceModel.findOne({ _id: id, userId: auth.userId });
    
    if (!service) {
      return new Response(JSON.stringify({ error: 'Standard service not found' }), {
        status: 404,
        headers: {
          'Content-Type': 'application/json',
        },
      });
    }

    return new Response(JSON.stringify(service), {
      status: 200,
      headers: {
        'Content-Type': 'application/json',
      },
    });
  } catch (error) {
    console.error('Error fetching standard service:', error);
    return new Response(JSON.stringify({ error: 'Error fetching standard service' }), {
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

  // Swagger documentation for PUT standard service by ID
  /**
   * @swagger
   * /api/services/{id}:
   *   put:
   *     summary: Update a standard service by ID
   *     tags: [StandardServices]
   *     security:
   *       - bearerAuth: []
   *     parameters:
   *       - in: path
   *         name: id
   *         schema:
   *           type: string
   *         required: true
   *         description: Service ID
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
   *       200:
   *         description: Standard service updated successfully
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
   *       401:
   *         description: Unauthorized
   *       404:
   *         description: Standard service not found
   *       500:
   *         description: Server error
   */

  try {
    await connectToDatabase();

    const resolvedParams = await params;
    const { id } = resolvedParams;
    const body = await req.json();
    
    // Update standard service by ID and authenticated user ID
    const updatedService = await StandardServiceModel.findOneAndUpdate(
      { _id: id, userId: auth.userId },
      { ...body },
      { new: true } // Return updated document
    );
    
    if (!updatedService) {
      return new Response(JSON.stringify({ error: 'Standard service not found' }), {
        status: 404,
        headers: {
          'Content-Type': 'application/json',
        },
      });
    }

    return new Response(JSON.stringify(updatedService), {
      status: 200,
      headers: {
        'Content-Type': 'application/json',
      },
    });
  } catch (error) {
    console.error('Error updating standard service:', error);
    return new Response(JSON.stringify({ error: 'Error updating standard service' }), {
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

  // Swagger documentation for DELETE standard service by ID
  /**
   * @swagger
   * /api/services/{id}:
   *   delete:
   *     summary: Delete a standard service by ID
   *     tags: [StandardServices]
   *     security:
   *       - bearerAuth: []
   *     parameters:
   *       - in: path
   *         name: id
   *         schema:
   *           type: string
   *         required: true
   *         description: Service ID
   *     responses:
   *       200:
   *         description: Standard service deleted successfully
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
   *         description: Standard service not found
   *       500:
   *         description: Server error
   */

  try {
    await connectToDatabase();

    const resolvedParams = await params;
    const { id } = resolvedParams;
    
    // Delete standard service by ID and authenticated user ID
    const deletedService = await StandardServiceModel.findOneAndDelete({ _id: id, userId: auth.userId });
    
    if (!deletedService) {
      return new Response(JSON.stringify({ error: 'Standard service not found' }), {
        status: 404,
        headers: {
          'Content-Type': 'application/json',
        },
      });
    }

    return new Response(JSON.stringify({ message: 'Standard service deleted successfully' }), {
      status: 200,
      headers: {
        'Content-Type': 'application/json',
      },
    });
  } catch (error) {
    console.error('Error deleting standard service:', error);
    return new Response(JSON.stringify({ error: 'Error deleting standard service' }), {
      status: 500,
      headers: {
        'Content-Type': 'application/json',
      },
    });
  }
}