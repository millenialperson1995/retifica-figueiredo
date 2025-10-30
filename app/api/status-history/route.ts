import { NextRequest } from 'next/server';
import { connectToDatabase } from '../../../lib/mongodb';
import { StatusHistoryModel } from '../../../lib/models/StatusHistory';
import { authenticateAPIRequest } from '../../../lib/auth';

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

    // Parse query parameters
    const url = new URL(req.url);
    const entityId = url.searchParams.get('entityId');
    const entityType = url.searchParams.get('entityType') as 'order' | 'budget' | null;
    const page = parseInt(url.searchParams.get('page') || '1');
    const limit = parseInt(url.searchParams.get('limit') || '10');
    
    // Build query
    const query: any = { userId: auth.userId };
    if (entityId) query.entityId = entityId;
    if (entityType) query.entityType = entityType;

    // Calculate pagination
    const skip = (page - 1) * limit;

    // Fetch status history with pagination
    const statusHistory = await StatusHistoryModel.find(query)
      .sort({ timestamp: -1 }) // Most recent first
      .skip(skip)
      .limit(limit);

    // Get total count for pagination info
    const totalCount = await StatusHistoryModel.countDocuments(query);
    const totalPages = Math.ceil(totalCount / limit);

    return new Response(JSON.stringify({
      data: statusHistory,
      pagination: {
        page,
        limit,
        totalCount,
        totalPages,
        hasMore: page < totalPages
      }
    }), {
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