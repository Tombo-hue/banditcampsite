'use client';

import { useState } from 'react';
import { Elements, PaymentElement, useStripe, useElements } from '@stripe/react-stripe-js';
import { loadStripe } from '@stripe/stripe-js';
import { Button } from '@/components/ui/button';

const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!);

function PaymentForm({ orderTotal }: { orderTotal: number }) {
  const stripe = useStripe();
  const elements = useElements();
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!stripe || !elements) return;

    setIsProcessing(true);
    setError(null);

    const { error: submitError } = await stripe.confirmPayment({
      elements,
      confirmParams: {
        return_url: `${window.location.origin}/checkout/success`,
      },
    });

    if (submitError) {
      setError(submitError.message || 'An error occurred while processing your payment.');
      setIsProcessing(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <PaymentElement 
        options={{
          layout: 'tabs'
        }}
      />

      {error && (
        <div className="p-4 bg-red-900/30 border border-red-500/30 text-red-300 rounded-lg">
          {error}
        </div>
      )}

      <div className="pt-4">
        <Button
          type="submit"
          disabled={!stripe || isProcessing}
          className="w-full bg-blue-500 hover:bg-blue-600 text-white font-medium py-3 rounded-lg transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isProcessing ? (
            <div className="flex items-center justify-center">
              <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Processing...
            </div>
          ) : (
            `Pay £${orderTotal.toFixed(2)}`
          )}
        </Button>
      </div>
    </form>
  );
}

export default function PaymentFormWrapper({ clientSecret, orderTotal }: { clientSecret: string; orderTotal: number }) {
  return (
    <Elements 
      stripe={stripePromise} 
      options={{
        clientSecret,
        appearance: {
          theme: 'night',
          variables: {
            colorPrimary: '#3b82f6',
            colorBackground: '#0A0A0A',
            colorText: '#ffffff',
            colorDanger: '#ef4444',
            fontFamily: 'ui-sans-serif, system-ui, sans-serif',
            spacingUnit: '4px',
            borderRadius: '8px',
          },
          rules: {
            '.Tab': {
              backgroundColor: '#111111',
              border: '2px solid rgba(59, 130, 246, 0.2)',
              boxShadow: 'none',
            },
            '.Tab:hover': {
              backgroundColor: 'rgba(59, 130, 246, 0.1)',
              border: '2px solid rgba(59, 130, 246, 0.4)',
            },
            '.Tab--selected': {
              backgroundColor: 'rgba(59, 130, 246, 0.1)',
              border: '2px solid #3b82f6',
            },
            '.Label': {
              color: '#9ca3af',
            },
            '.Input': {
              backgroundColor: '#0A0A0A',
              border: '2px solid rgba(59, 130, 246, 0.2)',
              color: '#ffffff',
            },
            '.Input:focus': {
              border: '2px solid #3b82f6',
              boxShadow: '0 0 0 1px #3b82f6',
            },
            '.Input:hover': {
              border: '2px solid rgba(59, 130, 246, 0.4)',
            },
            '.Error': {
              color: '#ef4444',
            }
          }
        }
      }}
    >
      <PaymentForm orderTotal={orderTotal} />
    </Elements>
  );
} 