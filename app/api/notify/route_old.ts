// Commented out due to missing module
// import { sendFrameNotification } from "@/lib/notification-client";
import { NextResponse } from 'next/server';

/**
 * Handles HTTP POST requests for notification data.
 *
 * Parses the incoming request body as JSON, logs the notification data, and returns a response indicating that notification functionality is disabled. Responds with a 400 status code and error message if the request body is invalid.
 */
export async function POST(request: Request) {
  try {
    const notificationData = await request.json();

    // Placeholder response since the notification client call needs to be fixed
    console.log('Notification request received:', notificationData);
    return NextResponse.json({
      success: true,
      message: 'Notification functionality is currently disabled.',
    });
  } catch (error) {
    console.error('Error processing notification request:', error);
    return NextResponse.json(
      { error: 'Invalid request data' },
      { status: 400 }
    );
  }
}
