'use client';

import React, { useState, useEffect } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';

interface PaymentMethod {
  type: string;
  cardNumber: string;
  expiryDate: string;
  cvv: string;
  name: string;
}

export default function CheckoutPage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  
  const planId = searchParams.get('plan');
  const interval = searchParams.get('interval');
  
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>({
    type: 'credit_card',
    cardNumber: '',
    expiryDate: '',
    cvv: '',
    name: '',
  });
  
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  // Get plan details based on planId and interval
  const getPlanDetails = () => {
    // In a real app, this would fetch from API
    const plans = {
      free: {
        name: 'Free',
        price: { monthly: 0, yearly: 0 },
      },
      individual: {
        name: 'Individual',
        price: { monthly: 9.99, yearly: 99 },
      },
      organization: {
        name: 'Organization',
        price: { monthly: 49.99, yearly: 499 },
      },
    };
    
    const plan = plans[planId as keyof typeof plans];
    if (!plan) return null;
    
    return {
      name: plan.name,
      price: plan.price[interval as keyof typeof plan.price] || 0,
      interval: interval,
    };
  };
  
  const planDetails = getPlanDetails();
  
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setPaymentMethod((prev) => ({ ...prev, [name]: value }));
  };
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsProcessing(true);
    setError(null);
    
    try {
      // In a real app, this would call the API to process the payment
      // and create the subscription
      
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1500));
      
      // Redirect to success page
      router.push('/subscription/success');
    } catch (err) {
      setError('Payment processing failed. Please try again.');
      setIsProcessing(false);
    }
  };
  
  // Redirect if plan not found
  useEffect(() => {
    if (!planDetails) {
      router.push('/subscription');
    }
  }, [planDetails, router]);
  
  if (!planDetails) {
    return <div className="container mx-auto p-8">Loading...</div>;
  }
  
  return (
    <div className="container mx-auto p-8">
      <div className="max-w-2xl mx-auto">
        <h1 className="text-3xl font-bold mb-8">Complete Your Subscription</h1>
        
        <div className="bg-gray-50 p-6 rounded-lg mb-8">
          <h2 className="text-xl font-semibold mb-4">Order Summary</h2>
          <div className="flex justify-between mb-2">
            <span>Plan:</span>
            <span>{planDetails.name}</span>
          </div>
          <div className="flex justify-between mb-2">
            <span>Billing:</span>
            <span>{interval === 'monthly' ? 'Monthly' : 'Yearly'}</span>
          </div>
          <div className="flex justify-between mb-2">
            <span>Price:</span>
            <span>${planDetails.price}/{interval === 'monthly' ? 'month' : 'year'}</span>
          </div>
          <div className="border-t border-gray-200 my-4"></div>
          <div className="flex justify-between font-bold">
            <span>Total:</span>
            <span>${planDetails.price}</span>
          </div>
        </div>
        
        {planDetails.price > 0 ? (
          <form onSubmit={handleSubmit} className="space-y-6">
            <h2 className="text-xl font-semibold mb-4">Payment Information</h2>
            
            {error && (
              <div className="bg-red-50 text-red-700 p-4 rounded-lg mb-4">
                {error}
              </div>
            )}
            
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                Cardholder Name
              </label>
              <input
                type="text"
                id="name"
                name="name"
                value={paymentMethod.name}
                onChange={handleInputChange}
                required
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-primary focus:border-primary"
                placeholder="John Doe"
              />
            </div>
            
            <div>
              <label htmlFor="cardNumber" className="block text-sm font-medium text-gray-700 mb-1">
                Card Number
              </label>
              <input
                type="text"
                id="cardNumber"
                name="cardNumber"
                value={paymentMethod.cardNumber}
                onChange={handleInputChange}
                required
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-primary focus:border-primary"
                placeholder="1234 5678 9012 3456"
              />
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label htmlFor="expiryDate" className="block text-sm font-medium text-gray-700 mb-1">
                  Expiry Date
                </label>
                <input
                  type="text"
                  id="expiryDate"
                  name="expiryDate"
                  value={paymentMethod.expiryDate}
                  onChange={handleInputChange}
                  required
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-primary focus:border-primary"
                  placeholder="MM/YY"
                />
              </div>
              <div>
                <label htmlFor="cvv" className="block text-sm font-medium text-gray-700 mb-1">
                  CVV
                </label>
                <input
                  type="text"
                  id="cvv"
                  name="cvv"
                  value={paymentMethod.cvv}
                  onChange={handleInputChange}
                  required
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-primary focus:border-primary"
                  placeholder="123"
                />
              </div>
            </div>
            
            <div className="pt-4">
              <button
                type="submit"
                disabled={isProcessing}
                className="w-full bg-primary hover:bg-primary-dark text-white font-medium py-3 px-4 rounded-lg transition-colors disabled:bg-gray-400"
              >
                {isProcessing ? 'Processing...' : `Subscribe - $${planDetails.price}`}
              </button>
            </div>
            
            <p className="text-sm text-gray-500 mt-4">
              By subscribing, you agree to our Terms of Service and Privacy Policy.
              Your subscription will automatically renew at the end of your billing period.
            </p>
          </form>
        ) : (
          <div className="space-y-6">
            <p className="text-lg">
              The Free plan doesn't require payment information. Click below to activate your account.
            </p>
            <button
              onClick={() => router.push('/subscription/success')}
              className="w-full bg-primary hover:bg-primary-dark text-white font-medium py-3 px-4 rounded-lg transition-colors"
            >
              Activate Free Plan
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

