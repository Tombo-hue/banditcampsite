import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { emailService } from '@/lib/email/service';

export async function POST(request: Request) {
  try {
    const { name, email, subject, message } = await request.json();

    // Validate required fields
    if (!name || !email || !subject || !message) {
      return NextResponse.json(
        { error: 'Name, email, subject, and message are required' },
        { status: 400 }
      );
    }

    // Create the support ticket
    const ticket = await prisma.supportTicket.create({
      data: {
        name,
        email,
        subject,
        message,
        status: 'OPEN',
      },
    });

    // Send confirmation email
    await emailService.sendContactFormConfirmation(email, {
      name,
      email,
      subject,
      message,
    });

    return NextResponse.json({ success: true, ticket });
  } catch (error) {
    console.error('Error processing contact form:', error);
    return NextResponse.json(
      { error: 'Failed to process contact form' },
      { status: 500 }
    );
  }
} 