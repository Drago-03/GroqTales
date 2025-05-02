import { NextResponse } from 'next/server';
import { sendFrameNotification } from '../../../lib/notification-client';

// Make this file a module
export {};

// API route handler for sending notifications
export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { fid, notification } = body;
    
    // Explicitly pass arguments as an object with fid, title, body, and notificationDetails
    const result = await sendFrameNotification({
      fid: fid,
      title: notification.title,
      body: notification.body,
      notificationDetails: notification.notificationDetails
    });
    
    if (!result.success) {
      return NextResponse.json(
        { error: result.error || 'Failed to send notification' },
        { status: 500 }
      );
    }
    
    return NextResponse.json({ success: true }, { status: 200 });
  } catch (error) {
    console.error('Error sending notification:', error);
    return NextResponse.json({ success: false, error: 'Failed to send notification' }, { status: 500 });
  }
} 