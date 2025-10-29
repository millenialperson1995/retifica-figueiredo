import { NextRequest, NextResponse } from 'next/server';
import { connectToDatabase } from '../../../../lib/mongodb';
import { VehicleModel } from '../../../../lib/models/Vehicle';
import { authenticateAPIRequest } from '../../../../lib/auth';

export async function GET(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = await params;
  const { id } = resolvedParams;
  
  const auth = authenticateAPIRequest(req);
  if (!auth.authenticated) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    await connectToDatabase();

    // Mongoose expects an ObjectId, so we search by _id
    const vehicle = await VehicleModel.findOne({ _id: id, userId: auth.userId });

    if (!vehicle) {
      return NextResponse.json({ error: 'Vehicle not found or does not belong to this user' }, { status: 404 });
    }

    return NextResponse.json(vehicle);
  } catch (error) {
    console.error('Error fetching vehicle:', error);
    // Handle cases where the provided ID is not a valid MongoDB ObjectId format
    if (error instanceof Error && error.name === 'CastError') {
      return NextResponse.json({ error: 'Invalid vehicle ID format' }, { status: 400 });
    }
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function PUT(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = await params;
  const { id } = resolvedParams;
  
  const auth = authenticateAPIRequest(req);
  if (!auth.authenticated) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    await connectToDatabase();

    const body = await req.json();
    const updatedVehicle = await VehicleModel.findOneAndUpdate(
      { _id: id, userId: auth.userId },
      { ...body },
      { new: true, runValidators: true }
    );

    if (!updatedVehicle) {
      return NextResponse.json({ error: 'Vehicle not found or does not belong to this user' }, { status: 404 });
    }

    return NextResponse.json(updatedVehicle);
  } catch (error) {
    console.error('Error updating vehicle:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = await params;
  const { id } = resolvedParams;
  
  const auth = authenticateAPIRequest(req);
  if (!auth.authenticated) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    await connectToDatabase();

    const deletedVehicle = await VehicleModel.findOneAndDelete({ _id: id, userId: auth.userId });

    if (!deletedVehicle) {
      return NextResponse.json({ error: 'Vehicle not found or does not belong to this user' }, { status: 404 });
    }

    return NextResponse.json({ message: 'Vehicle deleted successfully' });
  } catch (error) {
    console.error('Error deleting vehicle:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}