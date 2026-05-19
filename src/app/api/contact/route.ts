import { NextResponse } from 'next/server';
import { sendContactEmail } from '@/lib/mail';
import type { ContactFormData } from '@/types/store';

export async function POST(request: Request) {
  try {
    const { name, email, message } = (await request.json()) as ContactFormData;

    if (!name || !email || !message) {
      return NextResponse.json({ error: 'All fields are required' }, { status: 400 });
    }

    await sendContactEmail({ name, email, message });

    return NextResponse.json({ success: true, message: 'Message sent successfully' });
  } catch (error) {
    console.error('Contact API Error:', error);
    return NextResponse.json({ error: 'Failed to send message' }, { status: 500 });
  }
}
