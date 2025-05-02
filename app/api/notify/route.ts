import { NextResponse } from 'next/server';
import { sendFrameNotification } from '../../../lib/notification-client';

// Make this file a module
export {};

// API route handler for sending notifications
export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { fid, notification } = body;
    
    // Explicitly pass arguments separately to match function signature
    const result = await sendFrameNotification(fid, notification.title, notification.body);
    
    return NextResponse.json(result);
  } catch (error) {
    console.error('Error sending notification:', error);
    return NextResponse.json({ success: false, error: 'Failed to send notification' }, { status: 500 });
  }
} 