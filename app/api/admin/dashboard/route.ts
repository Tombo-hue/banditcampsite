import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { startOfDay, subDays, startOfWeek, endOfWeek } from 'date-fns';
import { Analytics, Prisma } from '@prisma/client';

export async function GET() {
  try {
    const today = startOfDay(new Date());
    const currentWeekStart = startOfWeek(today, { weekStartsOn: 1 });
    const last7Days = subDays(today, 7);

    // Get today's analytics
    const todayStats = await prisma.analytics.findFirst({
      where: {
        date: {
          gte: today,
        },
      },
    });

    // Get current week's unique visitors
    const weeklyUniqueVisitors = await prisma.uniqueVisitor.count({
      where: {
        weekStart: currentWeekStart,
      },
    });

    // Get overall stats
    const [totalCustomers, totalOrders, totalRevenue] = await Promise.all([
      prisma.customer.count(),
      prisma.order.count(),
      prisma.order.aggregate({
        _sum: {
          total: true,
        },
      }),
    ]);

    // Calculate average order value
    const averageOrderValue = totalOrders > 0
      ? (totalRevenue._sum.total || 0) / totalOrders
      : 0;

    // Get last 7 days analytics
    const analyticsData = await prisma.analytics.findMany({
      where: {
        date: {
          gte: last7Days,
        },
      },
      orderBy: {
        date: 'asc',
      },
    });

    // Get weekly unique visitors for the past 7 weeks
    const past7WeeksVisitors = await Promise.all(
      Array.from({ length: 7 }).map(async (_, index) => {
        const weekStart = startOfWeek(subDays(today, index * 7), { weekStartsOn: 1 });
        const weekEnd = endOfWeek(weekStart, { weekStartsOn: 1 });
        
        return prisma.uniqueVisitor.count({
          where: {
            weekStart,
          },
        });
      })
    );

    // Get top products by orders
    const topProducts = await prisma.orderItem.groupBy({
      by: ['productType'],
      _sum: {
        quantity: true,
      },
      orderBy: {
        _sum: {
          quantity: 'desc',
        },
      },
      take: 5,
    });

    // Format the response
    const response = {
      today: {
        pageViews: todayStats?.pageViews || 0,
        uniqueVisitors: weeklyUniqueVisitors,
        totalOrders: todayStats?.totalOrders || 0,
        revenue: todayStats?.revenue || 0,
      },
      overall: {
        totalCustomers,
        totalOrders,
        totalRevenue: totalRevenue._sum.total || 0,
        averageOrderValue,
      },
      analytics: {
        dates: analyticsData.map((data: Analytics) => data.date.toISOString().split('T')[0]),
        pageViews: analyticsData.map((data: Analytics) => data.pageViews),
        uniqueVisitors: past7WeeksVisitors.reverse(),
        revenue: analyticsData.map((data: Analytics) => data.revenue),
      },
      topProducts: topProducts.map(item => ({
        productType: item.productType,
        orders: item._sum.quantity || 0,
      })),
    };

    return NextResponse.json(response);
  } catch (error) {
    console.error('Error fetching dashboard stats:', error);
    return NextResponse.json(
      { error: 'Failed to fetch dashboard stats' },
      { status: 500 }
    );
  }
} 