'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAppSelector } from '../../hooks/reduxHooks';
import Card from '../../components/ui/Card';
import Button from '../../components/ui/Button';
import { FiCheck, FiX, FiCreditCard, FiAlertCircle } from 'react-icons/fi';

const subscriptionPlans = [
  {
    id: 'free',
    name: 'Free',
    price: 0,
    features: [
      'Access to basic articles',
      'Limited to 5 articles per day',
      'No premium content',
      'Web access only',
    ],
    notIncluded: [
      'Premium content access',
      'Unlimited article views',
      'Ad-free experience',
      'Mobile app access',
    ],
  },
  {
    id: 'basic',
    name: 'Basic',
    price: 4.99,
    features: [
      'Access to most articles',
      'Limited to 20 articles per day',
      'Some premium content',
      'Web and mobile access',
      'Email newsletter',
    ],
    notIncluded: [
      'All premium content',
      'Unlimited article views',
      'Ad-free experience',
    ],
  },
  {
    id: 'premium',
    name: 'Premium',
    price: 9.99,
    features: [
      'Unlimited article access',
      'All premium content',
      'Ad-free experience',
      'Web and mobile access',
      'Email newsletter',
      'Exclusive webinars',
      'Early access to new features',
    ],
    notIncluded: [],
  },
];

export default function SubscriptionPage() {
  const router = useRouter();
  const { isAuthenticated, user } = useAppSelector((state) => state.auth);
  const [selectedPlan, setSelectedPlan] = useState<string | null>(null);
  const [showPaymentForm, setShowPaymentForm] = useState(false);

  // Set initial selected plan based on user subscription
  useEffect(() => {
    if (user?.subscription) {
      setSelectedPlan(user.subscription);
    }
  }, [user]);

  // Redirect if not authenticated
  useEffect(() => {
    if (!isAuthenticated) {
      router.push('/auth/login');
    }
  }, [isAuthenticated, router]);

  const handleSelectPlan = (planId: string) => {
    setSelectedPlan(planId);
  };

  const handleSubscribe = () => {
    if (!selectedPlan || selectedPlan === user?.subscription) return;
    setShowPaymentForm(true);
  };

  const handlePaymentSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // In a real app, this would process the payment
    // For now, we'll just show a success message and redirect
    alert('Subscription updated successfully!');
    setShowPaymentForm(false);
    router.push('/dashboard');
  };

  if (!isAuthenticated) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded w-1/4 mb-6"></div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="h-96 bg-gray-200 dark:bg-gray-700 rounded"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="text-center mb-12">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
          Subscription Plans
        </h1>
        <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
          Choose the plan that works best for you and get access to premium content.
        </p>
      </div>

      {/* Subscription Plans */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
        {subscriptionPlans.map((plan) => {
          const isCurrentPlan = user?.subscription === plan.id;
          const isSelected = selectedPlan === plan.id;
          
          return (
            <Card
              key={plan.id}
              variant={isSelected ? 'elevated' : 'bordered'}
              className={`relative ${
                isSelected
                  ? 'border-2 border-primary shadow-lg'
                  : ''
              } transition-all duration-200`}
            >
              {isCurrentPlan && (
                <div className="absolute top-0 right-0 bg-primary text-white text-xs px-3 py-1 rounded-bl-lg">
                  Current Plan
                </div>
              )}
              <div className="p-6">
                <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
                  {plan.name}
                </h2>
                <div className="mb-6">
                  <span className="text-3xl font-bold text-gray-900 dark:text-white">
                    ${plan.price}
                  </span>
                  <span className="text-gray-500 dark:text-gray-400">/month</span>
                </div>
                
                <div className="mb-6">
                  <h3 className="font-medium text-gray-900 dark:text-white mb-3">
                    Includes:
                  </h3>
                  <ul className="space-y-2">
                    {plan.features.map((feature, index) => (
                      <li key={index} className="flex items-start">
                        <FiCheck className="text-green-500 mt-1 mr-2 flex-shrink-0" />
                        <span className="text-gray-600 dark:text-gray-300">{feature}</span>
                      </li>
                    ))}
                  </ul>
                </div>
                
                {plan.notIncluded.length > 0 && (
                  <div className="mb-6">
                    <h3 className="font-medium text-gray-900 dark:text-white mb-3">
                      Not included:
                    </h3>
                    <ul className="space-y-2">
                      {plan.notIncluded.map((feature, index) => (
                        <li key={index} className="flex items-start">
                          <FiX className="text-red-500 mt-1 mr-2 flex-shrink-0" />
                          <span className="text-gray-500 dark:text-gray-400">{feature}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
                
                <Button
                  variant={isSelected ? 'primary' : 'outline'}
                  fullWidth
                  onClick={() => handleSelectPlan(plan.id)}
                  disabled={isCurrentPlan}
                >
                  {isCurrentPlan
                    ? 'Current Plan'
                    : isSelected
                    ? 'Selected'
                    : 'Select Plan'}
                </Button>
              </div>
            </Card>
          );
        })}
      </div>

      {/* Action Button */}
      <div className="text-center">
        <Button
          onClick={handleSubscribe}
          disabled={!selectedPlan || selectedPlan === user?.subscription}
          size="lg"
        >
          {selectedPlan === user?.subscription
            ? 'Current Plan Selected'
            : 'Continue to Payment'}
        </Button>
      </div>

      {/* Payment Form Modal */}
      {showPaymentForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <Card variant="elevated" className="max-w-md w-full">
            <div className="p-6">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-bold text-gray-900 dark:text-white">
                  Payment Details
                </h2>
                <button
                  onClick={() => setShowPaymentForm(false)}
                  className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
                >
                  <FiX size={24} />
                </button>
              </div>
              
              <form onSubmit={handlePaymentSubmit}>
                <div className="space-y-4 mb-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Card Number
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <FiCreditCard className="text-gray-400" />
                      </div>
                      <input
                        type="text"
                        placeholder="1234 5678 9012 3456"
                        className="pl-10 w-full border border-gray-300 dark:border-gray-700 rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-primary bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100"
                        required
                      />
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                        Expiry Date
                      </label>
                      <input
                        type="text"
                        placeholder="MM/YY"
                        className="w-full border border-gray-300 dark:border-gray-700 rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-primary bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                        CVC
                      </label>
                      <input
                        type="text"
                        placeholder="123"
                        className="w-full border border-gray-300 dark:border-gray-700 rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-primary bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100"
                        required
                      />
                    </div>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Name on Card
                    </label>
                    <input
                      type="text"
                      placeholder="John Doe"
                      className="w-full border border-gray-300 dark:border-gray-700 rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-primary bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100"
                      required
                    />
                  </div>
                </div>
                
                <div className="bg-gray-50 dark:bg-gray-800 p-4 rounded-md mb-6">
                  <div className="flex justify-between mb-2">
                    <span className="text-gray-600 dark:text-gray-300">
                      {subscriptionPlans.find(p => p.id === selectedPlan)?.name} Plan
                    </span>
                    <span className="text-gray-900 dark:text-white font-medium">
                      ${subscriptionPlans.find(p => p.id === selectedPlan)?.price}/month
                    </span>
                  </div>
                  <div className="border-t border-gray-200 dark:border-gray-700 pt-2 mt-2">
                    <div className="flex justify-between font-medium">
                      <span className="text-gray-900 dark:text-white">Total</span>
                      <span className="text-gray-900 dark:text-white">
                        ${subscriptionPlans.find(p => p.id === selectedPlan)?.price}/month
                      </span>
                    </div>
                  </div>
                </div>
                
                <Button type="submit" fullWidth>
                  Subscribe Now
                </Button>
              </form>
            </div>
          </Card>
        </div>
      )}
    </div>
  );
}

