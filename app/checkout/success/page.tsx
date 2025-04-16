'use client';

import { useEffect, useState, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { CheckCircle } from 'lucide-react';

interface OrderDetails {
  orderNumber: string;
  status: string;
  total: number;
  config?: Record<string, any>;
}

function CheckoutSuccessContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [orderDetails, setOrderDetails] = useState<OrderDetails | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const payment_intent = searchParams.get('payment_intent');
    const payment_intent_client_secret = searchParams.get('payment_intent_client_secret');
    const redirect_status = searchParams.get('redirect_status');

    if (!payment_intent || !payment_intent_client_secret || redirect_status !== 'succeeded') {
      router.push('/');
      return;
    }

    const createOrder = async () => {
      try {
        const response = await fetch('/api/checkout', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            paymentIntentId: payment_intent,
          }),
        });

        if (!response.ok) {
          throw new Error('Failed to create order');
        }

        const data = await response.json();
        setOrderDetails(data);
      } catch (err) {
        setError('Failed to process order. Please contact support.');
      } finally {
        setIsLoading(false);
      }
    };

    createOrder();
  }, [searchParams, router]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#0A0A0A] flex items-center justify-center">
        <div className="text-gray-300">Processing your order...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-[#0A0A0A] flex items-center justify-center">
        <div className="text-red-400">{error}</div>
      </div>
    );
  }

  return (
    <main className="min-h-screen bg-[#0A0A0A] relative overflow-hidden">
      {/* Background grid pattern */}
      <div className="absolute inset-0 opacity-5 pointer-events-none">
        <div className="absolute inset-0" style={{
          backgroundImage: `linear-gradient(to right, #2563EB 1px, transparent 1px),
                          linear-gradient(to bottom, #2563EB 1px, transparent 1px)`,
          backgroundSize: '40px 40px'
        }} />
      </div>

      <div className="container mx-auto px-4 py-16 relative z-10 mt-20">
        <div className="max-w-2xl mx-auto text-center">
          <div className="mb-8">
            <div className="mx-auto w-16 h-16 rounded-full bg-blue-500/20 flex items-center justify-center">
              <CheckCircle className="w-10 h-10 text-blue-500" />
            </div>
          </div>

          <h1 className="text-4xl font-bold text-white mb-4">Order Confirmed!</h1>
          <p className="text-gray-300 text-lg mb-8">
            Thank you for your order. We'll be in touch shortly with further details.
          </p>

          {orderDetails && (
            <Card className="mb-8 bg-[#111111] border border-blue-500/20">
              <div className="p-6">
                <div className="space-y-4">
                  <div className="flex justify-between text-gray-300">
                    <span>Order Number:</span>
                    <span className="font-mono text-white">{orderDetails.orderNumber}</span>
                  </div>
                  {orderDetails.config && (
                    <div className="flex justify-between text-gray-300">
                      <span>Configuration:</span>
                      <div className="text-right">
                        {Object.entries(orderDetails.config).map(([key, value]) => {
                          if (key === 'extras') {
                            const extras = Object.entries(value as Record<string, boolean>)
                              .filter(([_, enabled]) => enabled)
                              .map(([name]) => name);
                            return (
                              <div key={key} className="capitalize">
                                Extras: {extras.length > 0 ? extras.join(', ') : 'None'}
                              </div>
                            );
                          }
                          return (
                            <div key={key} className="capitalize text-white">
                              {key.replace(/([A-Z])/g, ' $1').trim()}: {String(value)}
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  )}
                  <div className="flex justify-between text-gray-300">
                    <span>Status:</span>
                    <span className="capitalize text-white">{orderDetails.status}</span>
                  </div>
                  <div className="flex justify-between text-white font-semibold text-xl pt-4 border-t border-blue-500/10">
                    <span>Total:</span>
                    <span>£{orderDetails.total.toFixed(2)}</span>
                  </div>
                </div>
              </div>
            </Card>
          )}

          <div className="space-y-6">
            <p className="text-gray-300">
              We'll send you an email with your order details and next steps.
            </p>
            <div className="flex justify-center space-x-4">
              <Button asChild variant="default" className="bg-blue-500 hover:bg-blue-600 text-white">
                <Link href="/">
                  Return to Home
                </Link>
              </Button>
              <Button asChild variant="outline" className="bg-[#111111] border-2 border-blue-500/20 text-gray-300 hover:bg-blue-500/10 hover:border-blue-500 hover:text-white transition-all duration-200">
                <Link href="/contact">
                  Contact Support
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}

export default function CheckoutSuccessPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-[#0A0A0A] flex items-center justify-center">
        <div className="text-gray-300">Loading...</div>
      </div>
    }>
      <CheckoutSuccessContent />
    </Suspense>
  );
} 
