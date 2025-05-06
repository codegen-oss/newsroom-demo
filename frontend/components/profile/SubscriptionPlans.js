import { useState } from 'react';
import { useAuth } from '../../contexts/AuthContext';

export default function SubscriptionPlans() {
  const { user, updateSubscription } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });
  
  const currentTier = user?.subscriptionTier || 'free';

  const plans = [
    {
      id: 'free',
      name: 'Free',
      price: '$0',
      period: 'forever',
      features: [
        'Access to basic news articles',
        'Limited to 5 articles per day',
        'Basic categories',
      ],
      cta: 'Current Plan',
      disabled: currentTier === 'free',
    },
    {
      id: 'individual',
      name: 'Premium',
      price: '$9.99',
      period: 'per month',
      features: [
        'Unlimited article access',
        'Premium content',
        'Advanced filtering',
        'No advertisements',
      ],
      cta: currentTier === 'individual' ? 'Current Plan' : 'Upgrade',
      disabled: currentTier === 'individual',
      recommended: true,
    },
    {
      id: 'organization',
      name: 'Organization',
      price: '$49.99',
      period: 'per month',
      features: [
        'All Premium features',
        'Organization-exclusive content',
        'Team management',
        'API access',
        'Custom news feeds',
      ],
      cta: currentTier === 'organization' ? 'Current Plan' : 'Upgrade',
      disabled: currentTier === 'organization',
    },
  ];

  const handleUpgrade = async (planId) => {
    setIsLoading(true);
    setMessage({ type: '', text: '' });
    
    try {
      // In a real app, this would integrate with a payment processor
      await updateSubscription(planId);
      
      setMessage({
        type: 'success',
        text: `Successfully upgraded to ${planId} plan!`,
      });
    } catch (error) {
      setMessage({
        type: 'error',
        text: error.message || 'Failed to update subscription. Please try again.',
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="card">
      <h2 className="text-2xl font-bold mb-6">Subscription Plans</h2>
      
      {message.text && (
        <div 
          className={`p-4 mb-6 rounded-md ${
            message.type === 'success' ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-700'
          }`}
        >
          {message.text}
        </div>
      )}
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {plans.map((plan) => (
          <div 
            key={plan.id} 
            className={`border rounded-lg p-6 ${
              plan.recommended 
                ? 'border-primary-500 ring-2 ring-primary-200' 
                : 'border-gray-200'
            }`}
          >
            {plan.recommended && (
              <div className="bg-primary-500 text-white text-xs font-bold uppercase tracking-wider py-1 px-2 rounded-full inline-block mb-4">
                Recommended
              </div>
            )}
            
            <h3 className="text-xl font-bold mb-2">{plan.name}</h3>
            
            <div className="mb-4">
              <span className="text-3xl font-bold">{plan.price}</span>
              <span className="text-gray-500 ml-1">{plan.period}</span>
            </div>
            
            <ul className="space-y-2 mb-6">
              {plan.features.map((feature, index) => (
                <li key={index} className="flex items-start">
                  <svg 
                    className="w-5 h-5 text-green-500 mr-2 flex-shrink-0" 
                    fill="none" 
                    stroke="currentColor" 
                    viewBox="0 0 24 24" 
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path 
                      strokeLinecap="round" 
                      strokeLinejoin="round" 
                      strokeWidth={2} 
                      d="M5 13l4 4L19 7" 
                    />
                  </svg>
                  <span>{feature}</span>
                </li>
              ))}
            </ul>
            
            <button
              onClick={() => handleUpgrade(plan.id)}
              disabled={plan.disabled || isLoading}
              className={`w-full py-2 px-4 rounded-md font-medium ${
                plan.disabled
                  ? 'bg-gray-100 text-gray-500 cursor-not-allowed'
                  : plan.recommended
                  ? 'bg-primary-600 text-white hover:bg-primary-700'
                  : 'bg-white border border-gray-300 text-gray-700 hover:bg-gray-50'
              }`}
            >
              {plan.cta}
            </button>
          </div>
        ))}
      </div>
      
      <div className="mt-8 text-sm text-gray-500">
        <p>* This is a demo application. No actual charges will be processed.</p>
      </div>
    </div>
  );
}

