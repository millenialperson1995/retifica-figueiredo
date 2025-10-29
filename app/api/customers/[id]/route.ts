import { NextRequest, NextResponse } from 'next/server';
import { connectToDatabase } from '../../../../lib/mongodb';
import { CustomerModel } from '../../../../lib/models/Customer';
import { authenticateAPIRequest } from '../../../../lib/auth';

export const dynamic = 'force-dynamic';

export async function GET(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const auth = authenticateAPIRequest(req);
  if (!auth.authenticated) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    await connectToDatabase();
    const { id } = await params;

    // Mongoose expects an ObjectId, so we search by _id
    const customer = await CustomerModel.findOne({ _id: id, userId: auth.userId });

    if (!customer) {
      return NextResponse.json({ error: 'Customer not found or does not belong to this user' }, { status: 404 });
    }

    return NextResponse.json(customer);
  } catch (error) {
    console.error('Error fetching customer:', error);
    // Handle cases where the provided ID is not a valid MongoDB ObjectId format
    if (error instanceof Error && error.name === 'CastError') {
      return NextResponse.json({ error: 'Invalid customer ID format' }, { status: 400 });
    }
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}