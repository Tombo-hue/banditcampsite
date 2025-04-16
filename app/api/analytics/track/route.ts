import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { startOfDay, startOfWeek, endOfWeek } from 'date-fns';
import crypto from 'crypto';

export async function POST(request: Request) {
  try {
    const { path, userAgent, referer, ipAddress } = await request.json();
    const today = startOfDay(new Date());
    const currentWeekStart = startOfWeek(today, { weekStartsOn: 1 }); // Start week on Monday

    // Create a unique visitor ID by hashing IP and User Agent
    const visitorId = crypto
      .createHash('sha256')
      .update(`${ipAddress}-${userAgent}`)
      .digest('hex');

    // Create page view record
    await prisma.pageView.create({
      data: {
        path,
        userAgent,
        referer,
        ipAddress,
      },
    });

    // Check if this is a new visitor for this week
    const existingVisitor = await prisma.uniqueVisitor.findUnique({
      where: {
        visitorId_weekStart: {
          visitorId,
          weekStart: currentWeekStart,
        },
      },
    });

    const isNewVisitor = !existingVisitor;

    if (isNewVisitor) {
      // Create new unique visitor record for this week
      await prisma.uniqueVisitor.create({
        data: {
          visitorId,
          weekStart: currentWeekStart,
        },
      });
    }

    // Update analytics for today
    await prisma.analytics.upsert({
      where: {
        date: today,
      },
      create: {
        date: today,
        pageViews: 1,
        uniqueVisitors: isNewVisitor ? 1 : 0,
        totalOrders: 0,
        revenue: 0,
      },
      update: {
        pageViews: {
          increment: 1,
        },
        uniqueVisitors: {
          increment: isNewVisitor ? 1 : 0,
        },
      },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error tracking analytics:', error);
    return NextResponse.json(
      { error: 'Failed to track analytics' },
      { status: 500 }
    );
  }
} 