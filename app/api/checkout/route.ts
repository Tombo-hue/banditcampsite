import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { startOfDay } from 'date-fns';
import Stripe from 'stripe';
import { emailService } from '@/lib/email/service';
import { OrderItem, ProductType } from '@prisma/client';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2025-03-31.basil',
});

interface OrderItemInput {
  type: string;
  quantity: number;
  price: number;
  config: Record<string, any>;
}

export async function POST(request: Request) {
  try {
    const { paymentIntentId } = await request.json();

    if (!paymentIntentId) {
      return NextResponse.json(
        { error: 'Payment intent ID is required' },
        { status: 400 }
      );
    }

    // Retrieve the payment intent to get payment details
    const paymentIntent = await stripe.paymentIntents.retrieve(paymentIntentId);
    
    if (paymentIntent.status !== 'succeeded') {
      return NextResponse.json(
        { error: 'Payment not successful' },
        { status: 400 }
      );
    }

    // Get the customer details from the payment intent metadata
    const metadata = paymentIntent.metadata;
    if (!metadata?.customerInfo || !metadata?.orderSummary) {
      return NextResponse.json(
        { error: 'Missing order information' },
        { status: 400 }
      );
    }

    const customerInfo = JSON.parse(metadata.customerInfo);
    const orderSummary = JSON.parse(metadata.orderSummary);

    // Validate customer info based on shipping method
    if (customerInfo.shippingMethod === 'pickup') {
      if (!customerInfo.firstName || !customerInfo.lastName || !customerInfo.phone || !customerInfo.email) {
        return NextResponse.json(
          { error: 'Missing required pickup information (name, phone, and email are required)' },
          { status: 400 }
        );
      }
    } else {
      if (!customerInfo.firstName || !customerInfo.lastName || !customerInfo.email || 
          !customerInfo.phone || !customerInfo.street || !customerInfo.city || !customerInfo.postalCode) {
        return NextResponse.json(
          { error: 'Missing required customer information' },
          { status: 400 }
        );
      }
    }

    // Validate order data
    if (!orderSummary.productType || !orderSummary.config || typeof orderSummary.total !== 'number') {
      return NextResponse.json(
        { error: 'Invalid order data' },
        { status: 400 }
      );
    }

    // Create single item array from order summary
    const items: OrderItemInput[] = [{
      type: orderSummary.productType,
      quantity: 1,
      price: orderSummary.total,
      config: orderSummary.config
    }];

    // Use the totals from the order summary directly
    const subtotal = orderSummary.total - (orderSummary.shippingCost || 0);
    const tax = 0; // No VAT
    const shipping = orderSummary.shippingCost || 0;
    const total = orderSummary.total;

    // Generate a unique order number
    const orderNumber = `ORD-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
    const today = startOfDay(new Date());

    // Create customer if they don't exist
    let customer = await prisma.customer.findUnique({
      where: {
        email: customerInfo.email,
      },
    });

    if (!customer) {
      customer = await prisma.customer.create({
        data: {
          firstName: customerInfo.firstName,
          lastName: customerInfo.lastName,
          email: customerInfo.email,
          phone: customerInfo.phone,
        },
      });
    }

    // Create shipping address
    const shippingAddress = await prisma.address.create({
      data: {
        customerId: customer.id,
        type: 'shipping',
        street: customerInfo.street || 'Local Pickup',
        city: customerInfo.city || 'Chester',
        state: customerInfo.state || '',
        postalCode: customerInfo.postalCode || 'CH1',
        country: customerInfo.country || 'United Kingdom',
        isDefault: true,
      },
    });

    // Create the order
    const order = await prisma.order.create({
      data: {
        orderNumber,
        customerId: customer.id,
        addressId: shippingAddress.id,
        status: 'pending',
        subtotal,
        tax,
        shipping,
        total,
        items: {
          create: items.map(item => ({
            productType: item.type,
            quantity: item.quantity,
            price: item.price,
            config: item.config,
          })),
        },
      },
      include: {
        items: true,
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

    // Send order confirmation email
    await emailService.sendOrderConfirmation(customer.email, {
      orderNumber: order.orderNumber,
      customerName: `${customer.firstName} ${customer.lastName}`,
      items: order.items.map(item => ({
        name: item.productType,
        quantity: item.quantity,
        price: item.price,
        config: item.config as Record<string, any>,
      })),
      total: order.total,
      shippingAddress: {
        street: shippingAddress.street,
        city: shippingAddress.city,
        state: shippingAddress.state,
        postalCode: shippingAddress.postalCode,
        country: shippingAddress.country,
      },
      shippingMethod: customerInfo.shippingMethod,
    });

    return NextResponse.json({
      orderNumber: order.orderNumber,
      status: order.status,
      total: order.total,
      config: orderSummary.config,
      customerInfo: {
        name: `${customer.firstName} ${customer.lastName}`,
        email: customer.email,
        phone: customer.phone,
      }
    });

  } catch (error) {
    console.error('Error processing order:', error);
    return NextResponse.json(
      { error: 'Unable to process your order. Please try again or contact support.' },
      { status: 500 }
    );
  }
} 