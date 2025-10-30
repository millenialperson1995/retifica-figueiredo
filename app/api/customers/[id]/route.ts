import { NextRequest } from 'next/server';
import { connectToDatabase } from '../../../../lib/mongodb';
import { CustomerModel } from '../../../../lib/models/Customer';
import { authenticateAPIRequest } from '../../../../lib/auth';

// Swagger documentation for individual customer endpoint
/**
 * @swagger
 * tags:
 *   name: Customers
 *   description: Customer management
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

  // Swagger documentation for GET customer by ID
  /**
   * @swagger
   * /api/customers/{id}:
   *   get:
   *     summary: Get a customer by ID
   *     tags: [Customers]
   *     security:
   *       - bearerAuth: []
   *     parameters:
   *       - in: path
   *         name: id
   *         schema:
   *           type: string
   *         required: true
   *         description: Customer ID
   *     responses:
   *       200:
   *         description: Customer found
   *         content:
   *           application/json:
   *             schema:
   *               type: object
   *               properties:
   *                 id:
   *                   type: string
   *                   description: Customer ID
   *                 name:
   *                   type: string
   *                   description: Customer name
   *                 email:
   *                   type: string
   *                   description: Customer email
   *                 phone:
   *                   type: string
   *                   description: Customer phone
   *                 cpfCnpj:
   *                   type: string
   *                   description: Customer CPF or CNPJ
   *                 address:
   *                   type: string
   *                   description: Customer address
   *                 city:
   *                   type: string
   *                   description: Customer city
   *                 state:
   *                   type: string
   *                   description: Customer state
   *                 zipCode:
   *                   type: string
   *                   description: Customer zip code
   *                 createdAt:
   *                   type: string
   *                   description: Customer creation date
   *       401:
   *         description: Unauthorized
   *       404:
   *         description: Customer not found
   *       500:
   *         description: Server error
   */

  try {
    await connectToDatabase();

    const resolvedParams = await params;
    const { id } = resolvedParams;
    
    // Find customer by ID and authenticated user ID
    const customer = await CustomerModel.findOne({ _id: id, userId: auth.userId });
    
    if (!customer) {
      return new Response(JSON.stringify({ error: 'Customer not found' }), {
        status: 404,
        headers: {
          'Content-Type': 'application/json',
        },
      });
    }

    return new Response(JSON.stringify(customer), {
      status: 200,
      headers: {
        'Content-Type': 'application/json',
      },
    });
  } catch (error) {
    console.error('Error fetching customer:', error);
    return new Response(JSON.stringify({ error: 'Error fetching customer' }), {
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

  // Swagger documentation for PUT customer by ID
  /**
   * @swagger
   * /api/customers/{id}:
   *   put:
   *     summary: Update a customer by ID
   *     tags: [Customers]
   *     security:
   *       - bearerAuth: []
   *     parameters:
   *       - in: path
   *         name: id
   *         schema:
   *           type: string
   *         required: true
   *         description: Customer ID
   *     requestBody:
   *       required: true
   *       content:
   *         application/json:
   *           schema:
   *             type: object
   *             properties:
   *               name:
   *                 type: string
   *                 description: Customer name
   *                 example: João Silva
   *               email:
   *                 type: string
   *                 description: Customer email
   *                 example: joao.silva@email.com
   *               phone:
   *                 type: string
   *                 description: Customer phone
   *                 example: "(11) 98765-4321"
   *               cpfCnpj:
   *                 type: string
   *                 description: Customer CPF or CNPJ
   *                 example: "123.456.789-00"
   *               address:
   *                 type: string
   *                 description: Customer address
   *                 example: "Rua das Flores, 123"
   *               city:
   *                 type: string
   *                 description: Customer city
   *                 example: São Paulo
   *               state:
   *                 type: string
   *                 description: Customer state
   *                 example: SP
   *               zipCode:
   *                 type: string
   *                 description: Customer zip code
   *                 example: "01234-567"
   *     responses:
   *       200:
   *         description: Customer updated successfully
   *         content:
   *           application/json:
   *             schema:
   *               type: object
   *               properties:
   *                 id:
   *                   type: string
   *                   description: Customer ID
   *                 name:
   *                   type: string
   *                   description: Customer name
   *                 email:
   *                   type: string
   *                   description: Customer email
   *                 phone:
   *                   type: string
   *                   description: Customer phone
   *                 cpfCnpj:
   *                   type: string
   *                   description: Customer CPF or CNPJ
   *                 address:
   *                   type: string
   *                   description: Customer address
   *                 city:
   *                   type: string
   *                   description: Customer city
   *                 state:
   *                   type: string
   *                   description: Customer state
   *                 zipCode:
   *                   type: string
   *                   description: Customer zip code
   *                 createdAt:
   *                   type: string
   *                   description: Customer creation date
   *       401:
   *         description: Unauthorized
   *       404:
   *         description: Customer not found
   *       500:
   *         description: Server error
   */

  try {
    await connectToDatabase();

    const resolvedParams = await params;
    const { id } = resolvedParams;
    const body = await req.json();
    
    // Update customer by ID and authenticated user ID, including who made the update
    const updatedCustomer = await CustomerModel.findOneAndUpdate(
      { _id: id, userId: auth.userId },
      { ...body, updatedBy: auth.userId },
      { new: true } // Return updated document
    );
    
    if (!updatedCustomer) {
      return new Response(JSON.stringify({ error: 'Customer not found' }), {
        status: 404,
        headers: {
          'Content-Type': 'application/json',
        },
      });
    }

    return new Response(JSON.stringify(updatedCustomer), {
      status: 200,
      headers: {
        'Content-Type': 'application/json',
      },
    });
  } catch (error) {
    console.error('Error updating customer:', error);
    return new Response(JSON.stringify({ error: 'Error updating customer' }), {
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

  // Swagger documentation for DELETE customer by ID
  /**
   * @swagger
   * /api/customers/{id}:
   *   delete:
   *     summary: Delete a customer by ID
   *     tags: [Customers]
   *     security:
   *       - bearerAuth: []
   *     parameters:
   *       - in: path
   *         name: id
   *         schema:
   *           type: string
   *         required: true
   *         description: Customer ID
   *     responses:
   *       200:
   *         description: Customer deleted successfully
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
   *         description: Customer not found
   *       500:
   *         description: Server error
   */

  try {
    await connectToDatabase();

    const resolvedParams = await params;
    const { id } = resolvedParams;
    
    // Delete customer by ID and authenticated user ID
    const deletedCustomer = await CustomerModel.findOneAndDelete({ _id: id, userId: auth.userId });
    
    if (!deletedCustomer) {
      return new Response(JSON.stringify({ error: 'Customer not found' }), {
        status: 404,
        headers: {
          'Content-Type': 'application/json',
        },
      });
    }

    return new Response(JSON.stringify({ message: 'Customer deleted successfully' }), {
      status: 200,
      headers: {
        'Content-Type': 'application/json',
      },
    });
  } catch (error) {
    console.error('Error deleting customer:', error);
    return new Response(JSON.stringify({ error: 'Error deleting customer' }), {
      status: 500,
      headers: {
        'Content-Type': 'application/json',
      },
    });
  }
}