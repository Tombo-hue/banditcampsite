import { NextResponse } from 'next/server';
import Stripe from 'stripe';

// Initialize Stripe with your secret key
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2025-03-31.basil',
});

export async function POST(request: Request) {
  try {
    const { amount, customerInfo, orderSummary } = await request.json();

    if (!amount || amount <= 0) {
      return NextResponse.json(
        { error: 'Invalid amount' },
        { status: 400 }
      );
    }

    if (!customerInfo || !orderSummary) {
      return NextResponse.json(
        { error: 'Missing order information' },
        { status: 400 }
      );
    }

    // Validate required customer information fields
    const requiredFields = [
      'firstName', 'lastName', 'email', 'phone', 'street', 
      'city', 'postalCode', 'country', 'shippingMethod'
    ];
    
    const missingFields = requiredFields.filter(field => !customerInfo[field]);
    
    if (missingFields.length > 0) {
      return NextResponse.json(
        { error: `Missing required customer information: ${missingFields.join(', ')}` },
        { status: 400 }
      );
    }

    // Validate billing address if shipping method is not pickup
    if (customerInfo.shippingMethod !== 'pickup') {
      const requiredBillingFields = ['street', 'city', 'postalCode', 'country'];
      const missingBillingFields = requiredBillingFields.filter(field => !customerInfo.billingAddress?.[field]);
      
      if (missingBillingFields.length > 0) {
        return NextResponse.json(
          { error: `Missing required billing information: ${missingBillingFields.join(', ')}` },
          { status: 400 }
        );
      }
    }

    const paymentIntent = await stripe.paymentIntents.create({
      amount: Math.round(amount * 100), // Convert to pence/cents
      currency: 'gbp',
      payment_method_types: ['card'],
      metadata: {
        customerInfo: JSON.stringify({
          firstName: customerInfo.firstName,
          lastName: customerInfo.lastName,
          email: customerInfo.email,
          phone: customerInfo.phone,
          street: customerInfo.street,
          city: customerInfo.city,
          postalCode: customerInfo.postalCode,
          country: customerInfo.country || 'United Kingdom',
          shippingMethod: customerInfo.shippingMethod,
          billingAddress: customerInfo.billingAddress,
          notes: customerInfo.notes || ''
        }),
        orderSummary: JSON.stringify({
          productType: orderSummary.productType,
          config: orderSummary.config,
          total: amount,
          shippingCost: orderSummary.shippingCost || 0
        })
      }
    });

    return NextResponse.json({
      clientSecret: paymentIntent.client_secret,
    });
  } catch (error) {
    console.error('Error creating payment intent:', error);
    
    // Log the full error details
    if (error instanceof Stripe.errors.StripeError) {
      console.error('Stripe error details:', {
        type: error.type,
        message: error.message,
        code: error.code,
        decline_code: error.decline_code,
        param: error.param,
        headers: error.headers,
        requestId: error.requestId,
        statusCode: error.statusCode
      });
      
      return NextResponse.json(
        { error: `Stripe error: ${error.message} (${error.type})` },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { error: 'Failed to process payment. Please ensure your Stripe keys are correctly configured.' },
      { status: 500 }
    );
  }
} 