import React from 'react';

const tiers = [
  {
    id: 'free',
    name: 'Free',
    description: 'Basic access to news articles',
    features: [
      'Access to free articles',
      'Basic news feed',
      'Limited article views per day',
    ],
  },
  {
    id: 'individual',
    name: 'Individual',
    description: 'Premium access for individuals',
    features: [
      'All Free features',
      'Unlimited article views',
      'Premium content access',
      'Personalized news feed',
      'No advertisements',
    ],
  },
  {
    id: 'organization',
    name: 'Organization',
    description: 'Enterprise solution for teams',
    features: [
      'All Individual features',
      'Team management',
      'Shared reading lists',
      'Analytics dashboard',
      'API access',
      'Priority support',
    ],
  },
];

const SubscriptionTierSelector = ({ selectedTier, onChange }) => {
  return (
    <div className="mb-6">
      <h3 className="text-lg font-medium mb-4">Subscription Tier</h3>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {tiers.map((tier) => (
          <div 
            key={tier.id}
            className={`border rounded-lg p-4 cursor-pointer transition-all ${
              selectedTier === tier.id 
                ? 'border-blue-500 bg-blue-50 shadow-md' 
                : 'border-gray-200 hover:border-blue-300'
            }`}
            onClick={() => onChange(tier.id)}
          >
            <div className="flex items-center mb-2">
              <input
                type="radio"
                id={`tier-${tier.id}`}
                name="subscription-tier"
                checked={selectedTier === tier.id}
                onChange={() => onChange(tier.id)}
                className="mr-2"
              />
              <label 
                htmlFor={`tier-${tier.id}`}
                className="text-lg font-medium"
              >
                {tier.name}
              </label>
            </div>
            
            <p className="text-gray-600 mb-3">{tier.description}</p>
            
            <ul className="text-sm">
              {tier.features.map((feature, index) => (
                <li key={index} className="flex items-start mb-1">
                  <svg className="h-5 w-5 text-green-500 mr-1 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  {feature}
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </div>
  );
};

export default SubscriptionTierSelector;

