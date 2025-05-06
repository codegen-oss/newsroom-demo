import React, { useState, useEffect } from 'react';

const OrganizationForm = ({ organization, onSubmit, buttonText = 'Save' }) => {
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    subscription: {
      tier: 'enterprise',
      seats: 5,
      billing_cycle: 'monthly',
      price: 99.99,
    },
  });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (organization) {
      setFormData({
        name: organization.name || '',
        description: organization.description || '',
        subscription: organization.subscription || {
          tier: 'enterprise',
          seats: 5,
          billing_cycle: 'monthly',
          price: 99.99,
        },
      });
    }
  }, [organization]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubscriptionChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      subscription: {
        ...prev.subscription,
        [name]: name === 'seats' || name === 'price' ? Number(value) : value,
      },
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      await onSubmit(formData);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label htmlFor="name" className="block text-gray-700 font-medium mb-1">
          Organization Name
        </label>
        <input
          type="text"
          id="name"
          name="name"
          value={formData.name}
          onChange={handleChange}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          required
        />
      </div>
      
      <div>
        <label htmlFor="description" className="block text-gray-700 font-medium mb-1">
          Description
        </label>
        <textarea
          id="description"
          name="description"
          value={formData.description}
          onChange={handleChange}
          rows="3"
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>
      
      <div className="bg-gray-50 p-4 rounded-md">
        <h4 className="text-lg font-medium mb-3">Subscription Details</h4>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label htmlFor="tier" className="block text-gray-700 font-medium mb-1">
              Tier
            </label>
            <select
              id="tier"
              name="tier"
              value={formData.subscription.tier}
              onChange={handleSubscriptionChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="basic">Basic</option>
              <option value="standard">Standard</option>
              <option value="enterprise">Enterprise</option>
            </select>
          </div>
          
          <div>
            <label htmlFor="seats" className="block text-gray-700 font-medium mb-1">
              Number of Seats
            </label>
            <input
              type="number"
              id="seats"
              name="seats"
              min="1"
              value={formData.subscription.seats}
              onChange={handleSubscriptionChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>
          
          <div>
            <label htmlFor="billing_cycle" className="block text-gray-700 font-medium mb-1">
              Billing Cycle
            </label>
            <select
              id="billing_cycle"
              name="billing_cycle"
              value={formData.subscription.billing_cycle}
              onChange={handleSubscriptionChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="monthly">Monthly</option>
              <option value="annual">Annual</option>
            </select>
          </div>
          
          <div>
            <label htmlFor="price" className="block text-gray-700 font-medium mb-1">
              Price
            </label>
            <input
              type="number"
              id="price"
              name="price"
              min="0"
              step="0.01"
              value={formData.subscription.price}
              onChange={handleSubscriptionChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>
        </div>
      </div>
      
      <button
        type="submit"
        disabled={loading}
        className={`w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 ${
          loading ? 'opacity-70 cursor-not-allowed' : ''
        }`}
      >
        {loading ? 'Saving...' : buttonText}
      </button>
    </form>
  );
};

export default OrganizationForm;

