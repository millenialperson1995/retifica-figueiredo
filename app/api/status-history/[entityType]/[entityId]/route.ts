import { NextRequest } from 'next/server';
import { connectToDatabase } from '../../../../../lib/mongodb';
import { StatusHistoryModel } from '../../../../../lib/models/StatusHistory';
import { authenticateAPIRequest } from '../../../../../lib/auth';

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ entityType: 'order' | 'budget', entityId: string }> }
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

  try {
    await connectToDatabase();

    const resolvedParams = await params;
    const { entityType, entityId } = resolvedParams;

    // Verify entity type is valid
    if (entityType !== 'order' && entityType !== 'budget') {
      return new Response(JSON.stringify({ error: 'Invalid entity type. Must be "order" or "budget".' }), {
        status: 400,
        headers: {
          'Content-Type': 'application/json',
        },
      });
    }

    // Fetch status history for the specific entity
    const statusHistory = await StatusHistoryModel.find({
      entityId,
      entityType,
      userId: auth.userId
    }).sort({ timestamp: 1 }); // Chronological order

    return new Response(JSON.stringify(statusHistory), {
      status: 200,
      headers: {
        'Content-Type': 'application/json',
      },
    });
  } catch (error) {
    console.error('Error fetching status history:', error);
    return new Response(JSON.stringify({ error: 'Error fetching status history' }), {
      status: 500,
      headers: {
        'Content-Type': 'application/json',
      },
    });
  }
}