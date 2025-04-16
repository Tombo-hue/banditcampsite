'use client';

import { useState, useEffect, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { CheckoutProgress } from '../components/CheckoutProgress';
import { ShippingOptions, type ShippingMethod, calculateDistance } from '../components/ShippingOptions';
import PaymentFormWrapper from '../components/PaymentForm';
import { PRODUCT_PRICES } from '@/lib/constants/prices';

interface CustomerInfo {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  street: string;
  city: string;
  state: string;
  postalCode: string;
  country: string;
  notes: string;
}

interface OrderSummary {
  productType: string;
  config: any;
  total: number;
}

function CheckoutContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [orderSummary, setOrderSummary] = useState<OrderSummary | null>(null);
  const [step, setStep] = useState<'shipping' | 'billing' | 'payment'>('shipping');
  const [shippingMethod, setShippingMethod] = useState<ShippingMethod>('standard');
  const [postalCode, setPostalCode] = useState<string>('');
  const [customerInfo, setCustomerInfo] = useState<CustomerInfo>({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    street: '',
    city: '',
    state: '',
    postalCode: '',
    country: '',
    notes: '',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [clientSecret, setClientSecret] = useState<string | null>(null);
  const [shippingCost, setShippingCost] = useState<number>(0);

  useEffect(() => {
    // Get order details from URL parameters
    const productType = searchParams.get('product');
    const config = searchParams.get('config');
    const total = searchParams.get('total');

    if (!productType || !config || !total) {
      router.push('/');
      return;
    }

    try {
      setOrderSummary({
        productType,
        config: JSON.parse(decodeURIComponent(config)),
        total: parseFloat(total),
      });
    } catch (e) {
      console.error('Error parsing order details:', e);
      router.push('/');
    }
  }, [searchParams, router]);

  useEffect(() => {
    const fetchShippingCost = async () => {
      if (shippingMethod === 'pickup' || !postalCode) {
        setShippingCost(0);
        return;
      }
      
      try {
        const distance = await calculateDistance(postalCode);
        setShippingCost(Math.round(distance * 0.75));
      } catch (error) {
        console.error('Error calculating shipping cost:', error);
        setShippingCost(0);
      }
    };
    
    fetchShippingCost();
  }, [shippingMethod, postalCode]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setCustomerInfo(prev => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleShippingSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // For pickup, name, phone, and email are required
    if (shippingMethod === 'pickup') {
      if (!customerInfo.firstName || !customerInfo.lastName || !customerInfo.phone || !customerInfo.email) {
        setError('Please provide your name, phone number, and email for pickup');
        return;
      }
      // Set default values for pickup
      setCustomerInfo(prev => ({
        ...prev,
        street: 'Local Pickup',
        city: 'Chester',
        postalCode: 'CH1',
        country: 'United Kingdom'
      }));
    } else {
      // For shipping, validate all required fields
      if (!customerInfo.firstName || !customerInfo.lastName || !customerInfo.email || 
          !customerInfo.phone || !customerInfo.street || !customerInfo.city || 
          !postalCode) {
        setError('Please complete all required fields');
        return;
      }
    }
    
    setStep('billing');
    setError(null);
  };

  const handleBillingSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);

    // Get billing address fields
    const billingStreet = (e.target as HTMLFormElement).billingStreet.value;
    const billingCity = (e.target as HTMLFormElement).billingCity.value;
    const billingPostalCode = (e.target as HTMLFormElement).billingPostalCode.value;

    // Validate billing address
    if (!billingStreet || !billingCity || !billingPostalCode) {
      setError('Please complete all billing address fields');
      setIsSubmitting(false);
      return;
    }

    // Create billing address object
    const billingAddress = {
      street: billingStreet,
      city: billingCity,
      postalCode: billingPostalCode,
      country: 'United Kingdom'
    };

    // Calculate final total with distance-based shipping
    const finalTotal = (orderSummary?.total || 0) + (shippingMethod === 'pickup' ? 0 : shippingCost);

    // Prepare the data to send to the API
    const apiData = {
      amount: finalTotal,
      customerInfo: {
        firstName: customerInfo.firstName,
        lastName: customerInfo.lastName,
        email: customerInfo.email,
        phone: customerInfo.phone,
        street: customerInfo.street,
        city: customerInfo.city,
        postalCode: customerInfo.postalCode,
        country: 'United Kingdom',
        shippingMethod,
        billingAddress,
        notes: customerInfo.notes
      },
      orderSummary: {
        ...orderSummary,
        shippingCost: shippingMethod === 'pickup' ? 0 : shippingCost,
        total: finalTotal,
      },
    };

    // Log the data being sent to the API
    console.log('Sending data to API:', JSON.stringify(apiData, null, 2));

    // Create payment intent with both shipping and billing info
    fetch('/api/create-payment-intent', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(apiData),
    })
    .then(response => {
      if (!response.ok) {
        return response.json().then(data => {
          throw new Error(data.error || 'Failed to process request');
        });
      }
      return response.json();
    })
    .then(data => {
      if (data.error) {
        setError(data.error);
        return;
      }
      setClientSecret(data.clientSecret);
      setStep('payment');
    })
    .catch((error) => {
      console.error('API error:', error);
      setError(error.message || 'Failed to process request. Please try again.');
    })
    .finally(() => {
      setIsSubmitting(false);
    });
  };

  if (!orderSummary) {
    return (
      <div className="min-h-screen bg-[#0A0A0A] flex items-center justify-center">
        <div className="text-gray-300">Loading...</div>
      </div>
    );
  }

  const getShippingCost = () => {
    return shippingCost;
  };

  const calculateTotal = () => {
    if (!orderSummary) return 0;
    return orderSummary.total + getShippingCost();
  };

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

      <div className="container mx-auto px-4 py-8 relative z-10">
        <CheckoutProgress currentStep={step} />

        <div className="max-w-4xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
            {/* Main Content */}
            <div className="lg:col-span-3 space-y-8">
              {step === 'shipping' && (
                <form onSubmit={handleShippingSubmit} className="space-y-6">
                  <div className="space-y-4">
                    <h2 className="text-2xl font-bold text-white">Shipping Information</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="firstName">First Name</Label>
                        <Input
                          type="text"
                          id="firstName"
                          name="firstName"
                          value={customerInfo.firstName}
                          onChange={handleInputChange}
                          required
                          className="mt-2 bg-[#0A0A0A] border-blue-500/20 text-white placeholder-gray-500 focus:border-blue-500 focus:ring-blue-500"
                          placeholder="John"
                        />
                      </div>
                      <div>
                        <Label htmlFor="lastName">Last Name</Label>
                        <Input
                          type="text"
                          id="lastName"
                          name="lastName"
                          value={customerInfo.lastName}
                          onChange={handleInputChange}
                          required
                          className="mt-2 bg-[#0A0A0A] border-blue-500/20 text-white placeholder-gray-500 focus:border-blue-500 focus:ring-blue-500"
                          placeholder="Smith"
                        />
                      </div>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="email">Email</Label>
                        <Input
                          type="email"
                          id="email"
                          name="email"
                          value={customerInfo.email}
                          onChange={handleInputChange}
                          required
                          className="mt-2 bg-[#0A0A0A] border-blue-500/20 text-white placeholder-gray-500 focus:border-blue-500 focus:ring-blue-500"
                          placeholder="john.smith@example.com"
                        />
                      </div>
                      <div>
                        <Label htmlFor="phone">Phone</Label>
                        <Input
                          type="tel"
                          id="phone"
                          name="phone"
                          value={customerInfo.phone}
                          onChange={handleInputChange}
                          required
                          className="mt-2 bg-[#0A0A0A] border-blue-500/20 text-white placeholder-gray-500 focus:border-blue-500 focus:ring-blue-500"
                          placeholder="07123456789"
                        />
                      </div>
                    </div>
                    <div>
                      <Label htmlFor="address">Address</Label>
                      <Input
                        type="text"
                        id="address"
                        name="street"
                        value={customerInfo.street}
                        onChange={handleInputChange}
                        required
                        className="mt-2 bg-[#0A0A0A] border-blue-500/20 text-white placeholder-gray-500 focus:border-blue-500 focus:ring-blue-500"
                        placeholder="123 Main St"
                      />
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="city">City</Label>
                        <Input
                          type="text"
                          id="city"
                          name="city"
                          value={customerInfo.city}
                          onChange={handleInputChange}
                          required
                          className="mt-2 bg-[#0A0A0A] border-blue-500/20 text-white placeholder-gray-500 focus:border-blue-500 focus:ring-blue-500"
                          placeholder="London"
                        />
                      </div>
                      <div>
                        <Label htmlFor="postalCode">Full Post Code</Label>
                        <Input
                          type="text"
                          id="postalCode"
                          name="postalCode"
                          value={postalCode}
                          onChange={(e) => {
                            setPostalCode(e.target.value);
                            setCustomerInfo(prev => ({
                              ...prev,
                              postalCode: e.target.value
                            }));
                          }}
                          required
                          className="mt-2 bg-[#0A0A0A] border-blue-500/20 text-white placeholder-gray-500 focus:border-blue-500 focus:ring-blue-500"
                          placeholder="SW1A 1AA"
                        />
                      </div>
                    </div>
                  </div>
                  <div className="space-y-4">
                    <h2 className="text-2xl font-bold text-white">Shipping Method</h2>
                    <ShippingOptions
                      selected={shippingMethod}
                      onSelect={setShippingMethod}
                      postalCode={postalCode}
                    />
                  </div>
                  <Button type="submit" className="w-full">
                    Continue to Billing
                  </Button>
                </form>
              )}

              {step === 'billing' && (
                <form onSubmit={handleBillingSubmit}>
                  <Card className="p-8 bg-[#111111] border border-blue-500/20">
                    <h2 className="text-2xl font-semibold text-white mb-8">Billing Information</h2>
                    <div className="space-y-8">
                      <div>
                        <h3 className="text-xl font-semibold text-white mb-6">Billing Address</h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                          <div className="md:col-span-2">
                            <Label htmlFor="billingStreet" className="text-gray-300">Street Address</Label>
                            <Input
                              type="text"
                              id="billingStreet"
                              name="billingStreet"
                              required
                              className="mt-2 bg-[#0A0A0A] border-blue-500/20 text-white placeholder-gray-500 focus:border-blue-500 focus:ring-blue-500"
                              placeholder="123 Main St"
                            />
                          </div>
                          <div>
                            <Label htmlFor="billingCity" className="text-gray-300">City</Label>
                            <Input
                              type="text"
                              id="billingCity"
                              name="billingCity"
                              required
                              className="mt-2 bg-[#0A0A0A] border-blue-500/20 text-white placeholder-gray-500 focus:border-blue-500 focus:ring-blue-500"
                              placeholder="London"
                            />
                          </div>
                          <div>
                            <Label htmlFor="billingPostalCode" className="text-gray-300">Postal Code</Label>
                            <Input
                              type="text"
                              id="billingPostalCode"
                              name="billingPostalCode"
                              required
                              className="mt-2 bg-[#0A0A0A] border-blue-500/20 text-white placeholder-gray-500 focus:border-blue-500 focus:ring-blue-500"
                              placeholder="SW1A 1AA"
                            />
                          </div>
                        </div>
                      </div>

                      <div>
                        <Label htmlFor="notes" className="text-gray-300">Order Notes (Optional)</Label>
                        <textarea
                          id="notes"
                          name="notes"
                          value={customerInfo.notes}
                          onChange={handleInputChange}
                          rows={4}
                          className="mt-2 block w-full rounded-lg border border-blue-500/20 bg-[#0A0A0A] px-3 py-2 text-white placeholder-gray-500 focus:border-blue-500 focus:ring-blue-500 focus:outline-none resize-none"
                          placeholder="Any special instructions for your order?"
                        />
                      </div>
                    </div>

                    {error && (
                      <div className="mt-8 p-4 bg-red-900/30 border border-red-500/30 text-red-300 rounded-lg">
                        {error}
                      </div>
                    )}

                    <div className="mt-10 flex justify-between items-center pt-6 border-t border-blue-500/10">
                      <Button
                        type="button"
                        variant="outline"
                        size="lg"
                        onClick={() => setStep('shipping')}
                        className="bg-[#111111] border-2 border-blue-500/20 text-gray-300 hover:bg-blue-500/10 hover:border-blue-500 hover:text-white transition-all duration-200"
                      >
                        Back to Shipping
                      </Button>
                      <Button
                        type="submit"
                        size="lg"
                        disabled={isSubmitting}
                        className="bg-blue-500 hover:bg-blue-600 text-white transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        {isSubmitting ? 'Processing...' : 'Continue to Payment'}
                      </Button>
                    </div>
                  </Card>
                </form>
              )}

              {step === 'payment' && clientSecret && (
                <Card className="p-8 bg-[#111111] border border-blue-500/20">
                  <h2 className="text-2xl font-semibold text-white mb-6">Payment Details</h2>

                  {/* Stripe Elements wrapper */}
                  <div className="bg-[#0A0A0A] rounded-lg p-6 border border-blue-500/20">
                    <PaymentFormWrapper
                      clientSecret={clientSecret}
                      orderTotal={calculateTotal()}
                    />
                  </div>

                  {/* Stripe logo and security badges */}
                  <div className="mt-8 flex flex-col items-center space-y-4 pt-6 border-t border-blue-500/10">
                    <div className="flex items-center space-x-4">
                      <img src="https://insurance-edge.net/wp-content/uploads/2023/02/stripe-logo-.jpg" alt="Powered by Stripe" className="h-6 opacity-75" />
                      <span className="text-gray-500">|</span>
                      <div className="flex items-center space-x-2">
                        <svg className="w-4 h-4 text-green-500" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                        <span className="text-gray-400 text-sm">PCI Compliant</span>
                      </div>
                    </div>
                  </div>

                  <div className="mt-8 pt-6 border-t border-blue-500/10">
                    <Button
                      type="button"
                      variant="outline"
                      size="lg"
                      onClick={() => setStep('billing')}
                      className="w-full bg-[#111111] border-2 border-blue-500/20 text-gray-300 hover:bg-blue-500/10 hover:border-blue-500 hover:text-white transition-all duration-200"
                    >
                      Back to Billing
                    </Button>
                  </div>
                </Card>
              )}
            </div>

            {/* Order Summary Sidebar */}
            <div className="lg:col-span-2">
              <div className="sticky top-24">
                <Card className="p-8 bg-[#111111] border border-blue-500/20">
                  <h2 className="text-xl font-semibold text-white mb-6">Order Summary</h2>
                  <div className="space-y-6">
                    <div className="space-y-4">
                      <div>
                        <div className="flex justify-between items-center">
                          <span className="text-gray-300">Product:</span>
                          <span className="text-white font-medium">
                            {orderSummary.productType.replace(/-/g, ' ')}
                          </span>
                        </div>
                      </div>

                      <div className="space-y-3">
                        <span className="text-gray-400 text-sm">Configuration</span>
                        <div className="space-y-2">
                          {orderSummary.productType === 'nafl-bumper' && (
                            <>
                              <div className="flex justify-between items-center">
                                <span className="text-gray-300">Base Price:</span>
                                <span className="text-white font-medium">£{PRODUCT_PRICES['nafl-bumper'].basePrice.toFixed(2)}</span>
                              </div>
                              {orderSummary.config.finish && orderSummary.config.finish !== 'sanded' && (
                                <div className="flex justify-between items-center">
                                  <span className="text-gray-300">Finish ({orderSummary.config.finish}):</span>
                                  <span className="text-white font-medium">£{PRODUCT_PRICES['nafl-bumper'].extras[orderSummary.config.finish].toFixed(2)}</span>
                                </div>
                              )}
                            </>
                          )}
                          
                          {orderSummary.productType === 'reinforced-differentials' && (
                            <>
                              <div className="flex justify-between items-center">
                                <span className="text-gray-300">Base Price:</span>
                                <span className="text-white font-medium">£{PRODUCT_PRICES['reinforced-differentials'].basePrice.toFixed(2)}</span>
                              </div>
                              {orderSummary.config.diffType && (
                                <div className="flex justify-between items-center">
                                  <span className="text-gray-300">Differential Type:</span>
                                  <span className="text-white font-medium">
                                    {orderSummary.config.diffType === 'open' ? 'Open Diff' : 
                                     orderSummary.config.diffType === 'welded' ? 'Welded Diff' : 
                                     orderSummary.config.diffType === 'torsen' ? 'Torsen LSD' : 
                                     orderSummary.config.diffType === 'reinforcement-with-diff' ? 'Reinforcement with Diff' : 
                                     'Reinforcement Only'}
                                  </span>
                                </div>
                              )}
                              {orderSummary.config.diffSize && (
                                <div className="flex justify-between items-center">
                                  <span className="text-gray-300">Size:</span>
                                  <span className="text-white font-medium">{orderSummary.config.diffSize}L</span>
                                </div>
                              )}
                              {orderSummary.config.extras && (
                                <div className="space-y-2 mt-2">
                                  <span className="text-gray-400 text-sm">Extras:</span>
                                  {Object.entries(orderSummary.config.extras).map(([key, value]) => {
                                    if (value === true && PRODUCT_PRICES['reinforced-differentials'].extras[key]) {
                                      return (
                                        <div key={key} className="flex justify-between items-center">
                                          <span className="text-gray-300">{key.replace(/([A-Z])/g, ' $1').trim()}:</span>
                                          <span className="text-white font-medium">£{PRODUCT_PRICES['reinforced-differentials'].extras[key].toFixed(2)}</span>
                                        </div>
                                      );
                                    }
                                    return null;
                                  })}
                                </div>
                              )}
                            </>
                          )}
                        </div>
                      </div>
                    </div>

                    <div className="space-y-2 pt-4 border-t border-blue-500/10">
                      <div className="flex justify-between text-gray-300">
                        <span>Subtotal:</span>
                        <span className="font-medium text-white">£{orderSummary.total.toFixed(2)}</span>
                      </div>
                      <div className="flex justify-between text-gray-300">
                        <span>Shipping:</span>
                        <span className="font-medium text-white">
                          {shippingMethod === 'pickup' ? 'FREE' : `£${shippingCost.toFixed(2)}`}
                        </span>
                      </div>
                      <div className="pt-4 border-t border-blue-500/10">
                        <div className="flex justify-between text-lg font-semibold text-white">
                          <span>Total:</span>
                          <span>£{(orderSummary.total + (shippingMethod === 'pickup' ? 0 : shippingCost)).toFixed(2)}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </Card>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}

export default function CheckoutPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-[#0A0A0A] flex items-center justify-center">
        <div className="text-gray-300">Loading checkout...</div>
      </div>
    }>
      <CheckoutContent />
    </Suspense>
  );
} 