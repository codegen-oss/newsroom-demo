'use client';

import React, { useState } from 'react';
import Link from 'next/link';

interface Subscription {
  plan: {
    id: string;
    name: string;
    tier: 'free' | 'individual' | 'organization';
    interval: 'monthly' | 'yearly';
    price: number;
  };
  status: 'active' | 'canceled' | 'expired' | 'trial';
  startDate: string;
  endDate: string;
  autoRenew: boolean;
  paymentMethod?: {
    type: string;
    last4: string;
    expiryDate: string;
  };
}

export default function SubscriptionManagementPage() {
  // In a real app, this would be fetched from the API
  const [subscription, setSubscription] = useState<Subscription>({
    plan: {
      id: 'individual-monthly',
      name: 'Individual',
      tier: 'individual',
      interval: 'monthly',
      price: 9.99,
    },
    status: 'active',
    startDate: '2023-01-01',
    endDate: '2023-02-01',
    autoRenew: true,
    paymentMethod: {
      type: 'credit_card',
      last4: '4242',
      expiryDate: '12/25',
    },
  });
  
  const [showCancelModal, setShowCancelModal] = useState(false);
  const [showChangeModal, setShowChangeModal] = useState(false);
  const [processing, setProcessing] = useState(false);
  
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };
  
  const handleCancelSubscription = async () => {
    setProcessing(true);
    
    // In a real app, this would call the API to cancel the subscription
    await new Promise((resolve) => setTimeout(resolve, 1000));
    
    setSubscription((prev) => ({
      ...prev,
      status: 'canceled',
      autoRenew: false,
    }));
    
    setProcessing(false);
    setShowCancelModal(false);
  };
  
  const handleToggleAutoRenew = async () => {
    setProcessing(true);
    
    // In a real app, this would call the API to toggle auto-renew
    await new Promise((resolve) => setTimeout(resolve, 1000));
    
    setSubscription((prev) => ({
      ...prev,
      autoRenew: !prev.autoRenew,
    }));
    
    setProcessing(false);
  };
  
  const handleChangePlan = async (newPlanId: string) => {
    setProcessing(true);
    
    // In a real app, this would call the API to change the plan
    await new Promise((resolve) => setTimeout(resolve, 1000));
    
    // Update with new plan details
    const newPlan = {
      id: newPlanId,
      name: newPlanId.includes('individual') ? 'Individual' : 'Organization',
      tier: newPlanId.includes('individual') ? 'individual' as const : 'organization' as const,
      interval: newPlanId.includes('monthly') ? 'monthly' as const : 'yearly' as const,
      price: newPlanId.includes('individual')
        ? newPlanId.includes('monthly')
          ? 9.99
          : 99
        : newPlanId.includes('monthly')
          ? 49.99
          : 499,
    };
    
    setSubscription((prev) => ({
      ...prev,
      plan: newPlan,
    }));
    
    setProcessing(false);
    setShowChangeModal(false);
  };
  
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Subscription Management</h1>
      
      <div className="bg-white shadow rounded-lg overflow-hidden mb-8">
        <div className="p-6 border-b border-gray-200">
          <h2 className="text-xl font-semibold mb-4">Current Subscription</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <div className="mb-4">
                <span className="text-gray-500 block">Plan</span>
                <span className="text-lg font-medium">{subscription.plan.name} ({subscription.plan.interval})</span>
              </div>
              
              <div className="mb-4">
                <span className="text-gray-500 block">Status</span>
                <span className="inline-flex items-center">
                  <span className={`w-2 h-2 rounded-full mr-2 ${
                    subscription.status === 'active' ? 'bg-green-500' :
                    subscription.status === 'trial' ? 'bg-blue-500' :
                    'bg-red-500'
                  }`}></span>
                  <span className="capitalize">{subscription.status}</span>
                </span>
              </div>
              
              <div className="mb-4">
                <span className="text-gray-500 block">Price</span>
                <span className="text-lg font-medium">
                  ${subscription.plan.price}/{subscription.plan.interval === 'monthly' ? 'month' : 'year'}
                </span>
              </div>
            </div>
            
            <div>
              <div className="mb-4">
                <span className="text-gray-500 block">Start Date</span>
                <span>{formatDate(subscription.startDate)}</span>
              </div>
              
              <div className="mb-4">
                <span className="text-gray-500 block">
                  {subscription.autoRenew ? 'Next Billing Date' : 'Expiration Date'}
                </span>
                <span>{formatDate(subscription.endDate)}</span>
              </div>
              
              <div className="mb-4">
                <span className="text-gray-500 block">Auto-Renew</span>
                <span>{subscription.autoRenew ? 'Enabled' : 'Disabled'}</span>
              </div>
            </div>
          </div>
        </div>
        
        {subscription.paymentMethod && (
          <div className="p-6 border-b border-gray-200">
            <h2 className="text-xl font-semibold mb-4">Payment Method</h2>
            
            <div className="flex items-center">
              <div className="bg-gray-100 p-2 rounded mr-4">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
                </svg>
              </div>
              <div>
                <div className="font-medium">Credit Card ending in {subscription.paymentMethod.last4}</div>
                <div className="text-gray-500 text-sm">Expires {subscription.paymentMethod.expiryDate}</div>
              </div>
              <div className="ml-auto">
                <button className="text-primary hover:text-primary-dark text-sm font-medium">
                  Update
                </button>
              </div>
            </div>
          </div>
        )}
        
        <div className="p-6">
          <h2 className="text-xl font-semibold mb-4">Subscription Actions</h2>
          
          <div className="flex flex-wrap gap-4">
            <button
              onClick={() => setShowChangeModal(true)}
              disabled={subscription.status === 'canceled'}
              className="bg-primary hover:bg-primary-dark text-white px-4 py-2 rounded-lg disabled:bg-gray-300 disabled:cursor-not-allowed"
            >
              Change Plan
            </button>
            
            <button
              onClick={handleToggleAutoRenew}
              disabled={subscription.status === 'canceled' || processing}
              className="bg-gray-200 hover:bg-gray-300 text-gray-800 px-4 py-2 rounded-lg disabled:bg-gray-100 disabled:text-gray-400 disabled:cursor-not-allowed"
            >
              {processing ? 'Processing...' : subscription.autoRenew ? 'Disable Auto-Renew' : 'Enable Auto-Renew'}
            </button>
            
            {subscription.status !== 'canceled' && (
              <button
                onClick={() => setShowCancelModal(true)}
                disabled={processing}
                className="bg-red-100 hover:bg-red-200 text-red-700 px-4 py-2 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Cancel Subscription
              </button>
            )}
          </div>
        </div>
      </div>
      
      <div className="bg-white shadow rounded-lg overflow-hidden">
        <div className="p-6 border-b border-gray-200">
          <h2 className="text-xl font-semibold mb-4">Billing History</h2>
          
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Date
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Description
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Amount
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Receipt
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                <tr>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    Jan 1, 2023
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    Individual Monthly Subscription
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    $9.99
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm">
                    <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                      Paid
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-primary hover:text-primary-dark">
                    <a href="#">View</a>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
      
      {/* Cancel Subscription Modal */}
      {showCancelModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg max-w-md w-full p-6">
            <h3 className="text-xl font-bold mb-4">Cancel Subscription</h3>
            <p className="mb-6">
              Are you sure you want to cancel your subscription? You'll lose access to premium features at the end of your current billing period.
            </p>
            <div className="flex justify-end gap-4">
              <button
                onClick={() => setShowCancelModal(false)}
                className="px-4 py-2 bg-gray-200 hover:bg-gray-300 rounded-lg"
              >
                Keep Subscription
              </button>
              <button
                onClick={handleCancelSubscription}
                disabled={processing}
                className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg disabled:opacity-50"
              >
                {processing ? 'Processing...' : 'Cancel Subscription'}
              </button>
            </div>
          </div>
        </div>
      )}
      
      {/* Change Plan Modal */}
      {showChangeModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg max-w-2xl w-full p-6">
            <h3 className="text-xl font-bold mb-4">Change Subscription Plan</h3>
            <p className="mb-6">
              Select a new plan below. Your billing will be adjusted accordingly.
            </p>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
              <div
                className={`border rounded-lg p-4 cursor-pointer ${
                  subscription.plan.id === 'individual-monthly' ? 'border-primary bg-primary-light bg-opacity-10' : 'hover:border-gray-400'
                }`}
                onClick={() => handleChangePlan('individual-monthly')}
              >
                <h4 className="font-medium">Individual Monthly</h4>
                <p className="text-gray-500 text-sm mb-2">All individual features</p>
                <p className="font-bold">$9.99/month</p>
              </div>
              
              <div
                className={`border rounded-lg p-4 cursor-pointer ${
                  subscription.plan.id === 'individual-yearly' ? 'border-primary bg-primary-light bg-opacity-10' : 'hover:border-gray-400'
                }`}
                onClick={() => handleChangePlan('individual-yearly')}
              >
                <h4 className="font-medium">Individual Yearly</h4>
                <p className="text-gray-500 text-sm mb-2">All individual features</p>
                <p className="font-bold">$99/year <span className="text-green-500 text-xs">Save 17%</span></p>
              </div>
              
              <div
                className={`border rounded-lg p-4 cursor-pointer ${
                  subscription.plan.id === 'organization-monthly' ? 'border-primary bg-primary-light bg-opacity-10' : 'hover:border-gray-400'
                }`}
                onClick={() => handleChangePlan('organization-monthly')}
              >
                <h4 className="font-medium">Organization Monthly</h4>
                <p className="text-gray-500 text-sm mb-2">All features + team capabilities</p>
                <p className="font-bold">$49.99/month</p>
              </div>
              
              <div
                className={`border rounded-lg p-4 cursor-pointer ${
                  subscription.plan.id === 'organization-yearly' ? 'border-primary bg-primary-light bg-opacity-10' : 'hover:border-gray-400'
                }`}
                onClick={() => handleChangePlan('organization-yearly')}
              >
                <h4 className="font-medium">Organization Yearly</h4>
                <p className="text-gray-500 text-sm mb-2">All features + team capabilities</p>
                <p className="font-bold">$499/year <span className="text-green-500 text-xs">Save 17%</span></p>
              </div>
            </div>
            
            <div className="flex justify-end gap-4">
              <button
                onClick={() => setShowChangeModal(false)}
                className="px-4 py-2 bg-gray-200 hover:bg-gray-300 rounded-lg"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

