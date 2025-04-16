import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { OrderItem } from '@prisma/client';

export async function GET(
  request: Request,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const params = await context.params;
    const orderId = parseInt(params.id);

    if (isNaN(orderId)) {
      return NextResponse.json(
        { error: 'Invalid order ID' },
        { status: 400 }
      );
    }

    const order = await prisma.order.findUnique({
      where: {
        id: orderId,
      },
      include: {
        items: true,
        customer: true,
        shippingAddress: {
          select: {
            street: true,
            city: true,
            state: true,
            postalCode: true,
            country: true,
          }
        },
      },
    });

    if (!order) {
      return NextResponse.json(
        { error: 'Order not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      id: order.id,
      orderNumber: order.orderNumber,
      status: order.status,
      total: order.total,
      customer: {
        name: `${order.customer.firstName} ${order.customer.lastName}`,
        email: order.customer.email,
      },
      shippingAddress: order.shippingAddress,
      items: order.items.map((item: OrderItem) => ({
        quantity: item.quantity,
        price: item.price,
        productType: item.productType,
        config: item.config
      }))
    });
  } catch (error) {
    console.error('Error fetching order:', error);
    return NextResponse.json(
      { error: 'Failed to fetch order details' },
      { status: 500 }
    );
  }
} 