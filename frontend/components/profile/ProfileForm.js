import { useState, useEffect } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { useUserPreferences } from '../../contexts/UserPreferencesContext';

export default function ProfileForm() {
  const { user, updateUserProfile } = useAuth();
  const { preferences, updatePreferences } = useUserPreferences();
  
  const [formData, setFormData] = useState({
    displayName: '',
    email: '',
  });
  
  const [preferencesData, setPreferencesData] = useState({
    categories: [],
    regions: [],
    topics: [],
  });
  
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });

  // Available options
  const categoryOptions = ['Geopolitics', 'Economy', 'Technology'];
  const regionOptions = ['North America', 'Europe', 'Asia', 'Middle East', 'Africa'];
  const topicOptions = ['Climate Change', 'Artificial Intelligence', 'Cryptocurrency', 'International Trade', 'Elections', 'Cybersecurity'];

  useEffect(() => {
    if (user) {
      setFormData({
        displayName: user.displayName || '',
        email: user.email || '',
      });
    }
    
    if (preferences) {
      setPreferencesData({
        categories: preferences.categories || [],
        regions: preferences.regions || [],
        topics: preferences.favoriteTopics || [],
      });
    }
  }, [user, preferences]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleCheckboxChange = (e, category) => {
    const { name, checked } = e.target;
    
    setPreferencesData((prev) => {
      const currentValues = [...prev[name]];
      
      if (checked) {
        return { ...prev, [name]: [...currentValues, category] };
      } else {
        return { ...prev, [name]: currentValues.filter(item => item !== category) };
      }
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setMessage({ type: '', text: '' });
    
    try {
      // Update user profile
      await updateUserProfile({
        displayName: formData.displayName,
      });
      
      // Update preferences
      await updatePreferences({
        categories: preferencesData.categories,
        regions: preferencesData.regions,
        favoriteTopics: preferencesData.topics,
      });
      
      setMessage({
        type: 'success',
        text: 'Profile updated successfully!',
      });
    } catch (error) {
      setMessage({
        type: 'error',
        text: error.message || 'Failed to update profile. Please try again.',
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="card">
      <h2 className="text-2xl font-bold mb-6">Profile Settings</h2>
      
      {message.text && (
        <div 
          className={`p-4 mb-6 rounded-md ${
            message.type === 'success' ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-700'
          }`}
        >
          {message.text}
        </div>
      )}
      
      <form onSubmit={handleSubmit}>
        <div className="space-y-6">
          <div>
            <h3 className="text-lg font-medium mb-4">Personal Information</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label htmlFor="displayName" className="label">
                  Display Name
                </label>
                <input
                  id="displayName"
                  name="displayName"
                  type="text"
                  className="input"
                  value={formData.displayName}
                  onChange={handleChange}
                  required
                />
              </div>
              
              <div>
                <label htmlFor="email" className="label">
                  Email
                </label>
                <input
                  id="email"
                  name="email"
                  type="email"
                  className="input"
                  value={formData.email}
                  disabled
                />
                <p className="text-xs text-gray-500 mt-1">
                  Email cannot be changed
                </p>
              </div>
            </div>
          </div>
          
          <div>
            <h3 className="text-lg font-medium mb-4">News Preferences</h3>
            
            <div className="space-y-4">
              <div>
                <label className="label">Categories of Interest</label>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                  {categoryOptions.map((category) => (
                    <label key={category} className="flex items-center space-x-2">
                      <input
                        type="checkbox"
                        name="categories"
                        checked={preferencesData.categories.includes(category)}
                        onChange={(e) => handleCheckboxChange(e, category)}
                        className="rounded text-primary-600 focus:ring-primary-500"
                      />
                      <span>{category}</span>
                    </label>
                  ))}
                </div>
              </div>
              
              <div>
                <label className="label">Regions of Interest</label>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                  {regionOptions.map((region) => (
                    <label key={region} className="flex items-center space-x-2">
                      <input
                        type="checkbox"
                        name="regions"
                        checked={preferencesData.regions.includes(region)}
                        onChange={(e) => handleCheckboxChange(e, region)}
                        className="rounded text-primary-600 focus:ring-primary-500"
                      />
                      <span>{region}</span>
                    </label>
                  ))}
                </div>
              </div>
              
              <div>
                <label className="label">Topics of Interest</label>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                  {topicOptions.map((topic) => (
                    <label key={topic} className="flex items-center space-x-2">
                      <input
                        type="checkbox"
                        name="topics"
                        checked={preferencesData.topics.includes(topic)}
                        onChange={(e) => handleCheckboxChange(e, topic)}
                        className="rounded text-primary-600 focus:ring-primary-500"
                      />
                      <span>{topic}</span>
                    </label>
                  ))}
                </div>
              </div>
            </div>
          </div>
          
          <div className="pt-4">
            <button
              type="submit"
              className="btn btn-primary"
              disabled={isLoading}
            >
              {isLoading ? 'Saving...' : 'Save Changes'}
            </button>
          </div>
        </div>
      </form>
    </div>
  );
}

