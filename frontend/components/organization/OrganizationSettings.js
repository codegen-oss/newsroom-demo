import { useState } from 'react';

export default function OrganizationSettings({ organization, isAdmin }) {
  const [formData, setFormData] = useState({
    name: organization.name,
  });
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setMessage({ type: '', text: '' });
    
    try {
      // In a real app, this would update the organization via the API
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      setMessage({
        type: 'success',
        text: 'Organization settings updated successfully',
      });
    } catch (error) {
      setMessage({
        type: 'error',
        text: error.message || 'Failed to update settings. Please try again.',
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Format renewal date
  const renewalDate = new Date(organization.subscription.renewalDate).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  return (
    <div>
      {message.text && (
        <div 
          className={`p-4 mb-6 rounded-md ${
            message.type === 'success' ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-700'
          }`}
        >
          {message.text}
        </div>
      )}
      
      <div className="mb-8">
        <h3 className="text-lg font-medium mb-4">Organization Information</h3>
        
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label htmlFor="name" className="label">
              Organization Name
            </label>
            <input
              id="name"
              name="name"
              type="text"
              className="input"
              value={formData.name}
              onChange={handleChange}
              disabled={!isAdmin}
              required
            />
          </div>
          
          {isAdmin && (
            <button
              type="submit"
              className="btn btn-primary"
              disabled={isLoading}
            >
              {isLoading ? 'Saving...' : 'Save Changes'}
            </button>
          )}
        </form>
      </div>
      
      <div className="mb-8">
        <h3 className="text-lg font-medium mb-4">Subscription Details</h3>
        
        <div className="bg-gray-50 rounded-lg p-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <p className="text-sm text-gray-500">Plan</p>
              <p className="font-medium">Organization</p>
            </div>
            
            <div>
              <p className="text-sm text-gray-500">Seats</p>
              <p className="font-medium">
                {organization.subscription.usedSeats} used of {organization.subscription.seats} total
              </p>
            </div>
            
            <div>
              <p className="text-sm text-gray-500">Renewal Date</p>
              <p className="font-medium">{renewalDate}</p>
            </div>
            
            <div>
              <p className="text-sm text-gray-500">Billing Cycle</p>
              <p className="font-medium">Monthly</p>
            </div>
          </div>
          
          {isAdmin && (
            <div className="mt-4 pt-4 border-t border-gray-200">
              <button className="btn btn-outline text-sm">
                Manage Billing
              </button>
            </div>
          )}
        </div>
      </div>
      
      {isAdmin && (
        <div>
          <h3 className="text-lg font-medium mb-4">Danger Zone</h3>
          
          <div className="border border-red-200 rounded-lg p-4">
            <h4 className="font-medium text-red-600 mb-2">Delete Organization</h4>
            <p className="text-sm text-gray-600 mb-4">
              Once you delete an organization, there is no going back. Please be certain.
            </p>
            <button className="btn bg-red-600 hover:bg-red-700 text-white text-sm">
              Delete Organization
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

