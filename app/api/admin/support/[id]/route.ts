import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function PATCH(
  req: Request,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const params = await context.params;
    const id = parseInt(params.id);
    const { status } = await req.json();

    // Validate status
    if (!['OPEN', 'IN_PROGRESS', 'RESOLVED'].includes(status)) {
      return NextResponse.json(
        { error: 'Invalid status. Must be one of: OPEN, IN_PROGRESS, RESOLVED' },
        { status: 400 }
      );
    }

    const message = await prisma.supportTicket.update({
      where: { id },
      data: { status },
    });

    return NextResponse.json(message);
  } catch (error) {
    console.error('Error updating support message:', error);
    return NextResponse.json(
      { error: 'Failed to update support message' },
      { status: 500 }
    );
  }
} 