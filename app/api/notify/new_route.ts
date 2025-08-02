// Commented out due to missing module
// import { sendFrameNotification } from "@/lib/notification-client";
import { NextResponse } from 'next/server';

/**
 * Handles HTTP POST requests for notification data.
 *
 * Attempts to parse the request body as JSON and logs the received notification data. Returns a JSON response indicating that notification functionality is currently disabled. If parsing fails or an error occurs, responds with a 400 status code and an error message.
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
