import { NextResponse } from 'next/server';
import { sendFrameNotification } from '../../../lib/notification-client';

// Make this file a module
export {};

// API route handler for sending notifications
export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { fid, title, body: notificationBody } = body;
    // Pass notification parameters as separate arguments
    const result = await sendFrameNotification({ 
      fid,
      title,
      body: notificationBody 
    });
    
    return NextResponse.json(result);
  } catch (error) {
    console.error('Error sending notification:', error);
    return NextResponse.json({ success: false, error: 'Failed to send notification' }, { status: 500 });
  }
} 