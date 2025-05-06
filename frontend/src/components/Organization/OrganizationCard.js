import React from 'react';

const OrganizationCard = ({ organization, isActive, onClick, onEdit, onDelete, isAdmin }) => {
  return (
    <div 
      className={`border rounded-lg overflow-hidden transition-all ${
        isActive 
          ? 'border-blue-500 bg-blue-50 shadow-md' 
          : 'border-gray-200 hover:border-blue-300'
      }`}
    >
      <div 
        className="p-4 cursor-pointer"
        onClick={onClick}
      >
        <div className="flex justify-between items-start">
          <h3 className="text-lg font-semibold">{organization.name}</h3>
          {isActive && (
            <span className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded-full">
              Active
            </span>
          )}
        </div>
        
        <p className="text-gray-600 mt-1 mb-3">
          {organization.description || 'No description provided'}
        </p>
        
        <div className="text-sm text-gray-500">
          <div className="flex justify-between">
            <span>Subscription:</span>
            <span className="font-medium text-gray-700">
              {organization.subscription.tier.charAt(0).toUpperCase() + organization.subscription.tier.slice(1)}
            </span>
          </div>
          <div className="flex justify-between">
            <span>Seats:</span>
            <span className="font-medium text-gray-700">{organization.subscription.seats}</span>
          </div>
          <div className="flex justify-between">
            <span>Billing:</span>
            <span className="font-medium text-gray-700">
              {organization.subscription.billing_cycle.charAt(0).toUpperCase() + organization.subscription.billing_cycle.slice(1)}
            </span>
          </div>
        </div>
      </div>
      
      {isAdmin && (
        <div className="bg-gray-50 px-4 py-3 border-t border-gray-200 flex justify-end space-x-2">
          <button
            onClick={(e) => {
              e.stopPropagation();
              onEdit();
            }}
            className="px-3 py-1 bg-blue-600 text-white text-sm rounded hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            Edit
          </button>
          <button
            onClick={(e) => {
              e.stopPropagation();
              onDelete();
            }}
            className="px-3 py-1 bg-red-600 text-white text-sm rounded hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500"
          >
            Delete
          </button>
        </div>
      )}
    </div>
  );
};

export default OrganizationCard;

