import { getAuth } from '@clerk/nextjs/server';
import { NextRequest } from 'next/server';

// Helper function to authenticate API requests
export function authenticateAPIRequest(req: NextRequest): { authenticated: boolean; userId?: string } {
  try {
    // Using Clerk's getAuth function to authenticate the request
    const { userId } = getAuth(req);
    
    if (!userId) {
      return { authenticated: false };
    }
    
    return { authenticated: true, userId };
  } catch (error) {
    console.error('Authentication error:', error);
    return { authenticated: false };
  }
}