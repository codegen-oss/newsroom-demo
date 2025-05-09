import React from 'react';
import SubscriptionPlans from '@/components/subscription/SubscriptionPlans';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Subscription Plans - News Room',
  description: 'Choose a subscription plan that fits your needs',
};

export default function SubscriptionPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8 text-center">Choose Your Subscription Plan</h1>
      <p className="text-lg mb-8 text-center max-w-3xl mx-auto">
        Get access to premium content, advanced features, and more with our subscription plans.
        Choose the plan that best fits your needs and start enjoying the benefits today.
      </p>
      
      <SubscriptionPlans />
    </div>
  );
}

