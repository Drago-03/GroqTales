import { NextResponse } from 'next/server';
// Make this file a module
export {};
/**
 * Handles POST requests to the notification API route, returning a static response indicating that notification processing is skipped.
 *
 * Always responds with a success message for build compatibility. If an error occurs, responds with an error message and a 500 status code.
 */
export async function POST(req: Request) {
  try {
    // Temporarily return a static response to bypass notification logic
    return NextResponse.json(
      {
        success: true,
        message: 'Notification process skipped for build compatibility',
      },
      { status: 200 }
    );
  } catch (error) {
    console.error('Error in notification route:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to process notification' },
      { status: 500 }
    );
  }
}
