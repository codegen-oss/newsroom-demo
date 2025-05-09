'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';

type PlanInterval = 'monthly' | 'yearly';

interface PlanFeature {
  name: string;
  included: boolean;
}

interface Plan {
  id: string;
  name: string;
  description: string;
  price: {
    monthly: number;
    yearly: number;
  };
  features: PlanFeature[];
  tier: 'free' | 'individual' | 'organization';
  popular?: boolean;
}

const plans: Plan[] = [
  {
    id: 'free',
    name: 'Free',
    description: 'Basic access to news content',
    price: {
      monthly: 0,
      yearly: 0,
    },
    tier: 'free',
    features: [
      { name: 'Limited articles (10 per day)', included: true },
      { name: 'Basic personalization', included: true },
      { name: 'Ad-supported experience', included: true },
      { name: 'Standard news updates', included: true },
      { name: 'Advanced personalization', included: false },
      { name: 'Ad-free experience', included: false },
      { name: 'Premium content access', included: false },
      { name: 'Early access to features', included: false },
      { name: 'Offline reading', included: false },
      { name: 'Newsletter subscriptions', included: false },
    ],
  },
  {
    id: 'individual',
    name: 'Individual',
    description: 'Enhanced experience for personal use',
    price: {
      monthly: 9.99,
      yearly: 99,
    },
    tier: 'individual',
    popular: true,
    features: [
      { name: 'Unlimited articles', included: true },
      { name: 'Advanced personalization', included: true },
      { name: 'Ad-free experience', included: true },
      { name: 'Premium content access', included: true },
      { name: 'Early access to features', included: true },
      { name: 'Offline reading', included: true },
      { name: 'Newsletter subscriptions', included: true },
      { name: 'Team sharing capabilities', included: false },
      { name: 'Collaborative workspaces', included: false },
      { name: 'Custom dashboards', included: false },
      { name: 'API access', included: false },
      { name: 'Usage analytics', included: false },
      { name: 'Dedicated support', included: false },
    ],
  },
  {
    id: 'organization',
    name: 'Organization',
    description: 'Complete solution for teams and businesses',
    price: {
      monthly: 49.99,
      yearly: 499,
    },
    tier: 'organization',
    features: [
      { name: 'All individual features', included: true },
      { name: 'Team sharing capabilities', included: true },
      { name: 'Collaborative workspaces', included: true },
      { name: 'Custom dashboards', included: true },
      { name: 'API access', included: true },
      { name: 'Usage analytics', included: true },
      { name: 'Dedicated support', included: true },
    ],
  },
];

export default function SubscriptionPlans() {
  const [interval, setInterval] = useState<PlanInterval>('monthly');
  const router = useRouter();

  const handleSubscribe = (planId: string) => {
    // In a real app, this would redirect to a checkout page or show a payment modal
    router.push(`/subscription/checkout?plan=${planId}&interval=${interval}`);
  };

  return (
    <div className="max-w-7xl mx-auto">
      {/* Interval Toggle */}
      <div className="flex justify-center mb-10">
        <div className="inline-flex items-center bg-gray-100 rounded-lg p-1">
          <button
            className={`px-4 py-2 rounded-md ${
              interval === 'monthly'
                ? 'bg-white shadow-sm text-primary'
                : 'text-gray-500'
            }`}
            onClick={() => setInterval('monthly')}
          >
            Monthly
          </button>
          <button
            className={`px-4 py-2 rounded-md ${
              interval === 'yearly'
                ? 'bg-white shadow-sm text-primary'
                : 'text-gray-500'
            }`}
            onClick={() => setInterval('yearly')}
          >
            Yearly
            <span className="ml-1 text-xs text-green-500 font-medium">
              Save 17%
            </span>
          </button>
        </div>
      </div>

      {/* Plans Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {plans.map((plan) => (
          <div
            key={plan.id}
            className={`rounded-xl border ${
              plan.popular
                ? 'border-secondary shadow-lg ring-2 ring-secondary'
                : 'border-gray-200'
            } p-6 relative flex flex-col`}
          >
            {plan.popular && (
              <div className="absolute top-0 right-0 bg-secondary text-white text-xs font-bold px-3 py-1 rounded-bl-lg rounded-tr-lg">
                POPULAR
              </div>
            )}
            <h3 className="text-xl font-bold mb-2">{plan.name}</h3>
            <p className="text-gray-500 mb-4">{plan.description}</p>
            <div className="mb-6">
              <span className="text-4xl font-bold">
                ${interval === 'monthly' ? plan.price.monthly : plan.price.yearly}
              </span>
              {plan.price.monthly > 0 && (
                <span className="text-gray-500">
                  /{interval === 'monthly' ? 'month' : 'year'}
                </span>
              )}
            </div>

            <ul className="mb-8 flex-grow">
              {plan.features.map((feature, index) => (
                <li
                  key={index}
                  className="flex items-start mb-3"
                >
                  <span className={`mr-2 mt-1 ${feature.included ? 'text-green-500' : 'text-gray-400'}`}>
                    {feature.included ? (
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                      </svg>
                    ) : (
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                      </svg>
                    )}
                  </span>
                  <span className={feature.included ? 'text-gray-800' : 'text-gray-400'}>
                    {feature.name}
                  </span>
                </li>
              ))}
            </ul>

            <button
              onClick={() => handleSubscribe(plan.id)}
              className={`w-full py-3 px-4 rounded-lg font-medium ${
                plan.popular
                  ? 'bg-secondary hover:bg-secondary-dark text-white'
                  : plan.tier === 'free'
                  ? 'bg-gray-200 hover:bg-gray-300 text-gray-800'
                  : 'bg-primary hover:bg-primary-dark text-white'
              } transition-colors`}
            >
              {plan.tier === 'free' ? 'Get Started' : 'Subscribe'}
            </button>
          </div>
        ))}
      </div>

      <div className="mt-12 text-center text-gray-500">
        <p>All plans include a 14-day free trial. No credit card required for free tier.</p>
        <p className="mt-2">
          Need a custom plan for your enterprise?{' '}
          <a href="/contact" className="text-primary hover:underline">
            Contact us
          </a>
        </p>
      </div>
    </div>
  );
}

