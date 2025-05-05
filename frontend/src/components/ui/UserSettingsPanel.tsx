import { useState, useEffect } from 'react';
import { FiSettings, FiSun, FiMoon, FiSave, FiCheck, FiAlertCircle } from 'react-icons/fi';
import Card from './Card';
import Button from './Button';
import { UserPreferences } from '../../types';

interface CategoryOption {
  id: string;
  name: string;
}

interface UserSettingsPanelProps {
  preferences: UserPreferences;
  categories: CategoryOption[];
  onSave: (preferences: UserPreferences) => Promise<void>;
  className?: string;
}

export default function UserSettingsPanel({
  preferences,
  categories,
  onSave,
  className = '',
}: UserSettingsPanelProps) {
  const [selectedCategories, setSelectedCategories] = useState<string[]>(preferences.categories || []);
  const [darkMode, setDarkMode] = useState(preferences.darkMode || false);
  const [emailNotifications, setEmailNotifications] = useState(preferences.emailNotifications || false);
  const [isLoading, setIsLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  // Update state when preferences prop changes
  useEffect(() => {
    setSelectedCategories(preferences.categories || []);
    setDarkMode(preferences.darkMode || false);
    setEmailNotifications(preferences.emailNotifications || false);
  }, [preferences]);

  const handleCategoryToggle = (category: string) => {
    setSelectedCategories((prev) =>
      prev.includes(category)
        ? prev.filter((c) => c !== category)
        : [...prev, category]
    );
  };

  const handleSavePreferences = async () => {
    setIsLoading(true);
    setSuccessMessage('');
    setErrorMessage('');

    try {
      const updatedPreferences: UserPreferences = {
        categories: selectedCategories,
        darkMode,
        emailNotifications,
      };
      
      await onSave(updatedPreferences);
      
      setSuccessMessage('Preferences updated successfully');
      setTimeout(() => setSuccessMessage(''), 3000);
    } catch (error) {
      setErrorMessage('Failed to update preferences. Please try again.');
      setTimeout(() => setErrorMessage(''), 5000);
    } finally {
      setIsLoading(false);
    }
  };

  const hasChanges = () => {
    const originalCategories = preferences.categories || [];
    const categoriesChanged = 
      selectedCategories.length !== originalCategories.length || 
      selectedCategories.some(c => !originalCategories.includes(c));
    
    return categoriesChanged || 
      darkMode !== preferences.darkMode || 
      emailNotifications !== preferences.emailNotifications;
  };

  return (
    <Card variant="bordered" className={`${className}`}>
      <div className="p-6">
        <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-6 flex items-center">
          <FiSettings className="mr-2" />
          User Preferences
        </h2>

        {/* Success Message */}
        {successMessage && (
          <div className="mb-6 p-3 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-md flex items-start">
            <FiCheck className="text-green-500 mt-0.5 mr-2 flex-shrink-0" />
            <p className="text-sm text-green-600 dark:text-green-400">{successMessage}</p>
          </div>
        )}

        {/* Error Message */}
        {errorMessage && (
          <div className="mb-6 p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-md flex items-start">
            <FiAlertCircle className="text-red-500 mt-0.5 mr-2 flex-shrink-0" />
            <p className="text-sm text-red-600 dark:text-red-400">{errorMessage}</p>
          </div>
        )}

        <div className="space-y-8">
          {/* Categories */}
          <div>
            <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-3">
              Preferred Categories
            </h3>
            <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
              Select categories you're interested in to personalize your news feed.
            </p>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
              {categories.map((category) => (
                <div key={category.id} className="flex items-center">
                  <input
                    type="checkbox"
                    id={`category-${category.id}`}
                    checked={selectedCategories.includes(category.name)}
                    onChange={() => handleCategoryToggle(category.name)}
                    className="h-4 w-4 text-primary focus:ring-primary border-gray-300 dark:border-gray-700 rounded"
                  />
                  <label
                    htmlFor={`category-${category.id}`}
                    className="ml-2 text-sm text-gray-700 dark:text-gray-300"
                  >
                    {category.name}
                  </label>
                </div>
              ))}
            </div>
          </div>

          {/* Display Settings */}
          <div>
            <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-3">
              Display Settings
            </h3>
            <div className="flex items-center">
              <input
                type="checkbox"
                id="darkMode"
                checked={darkMode}
                onChange={() => setDarkMode(!darkMode)}
                className="h-4 w-4 text-primary focus:ring-primary border-gray-300 dark:border-gray-700 rounded"
              />
              <label
                htmlFor="darkMode"
                className="ml-2 text-sm text-gray-700 dark:text-gray-300 flex items-center"
              >
                {darkMode ? (
                  <>
                    <FiMoon className="mr-1" size={16} />
                    Enable dark mode by default
                  </>
                ) : (
                  <>
                    <FiSun className="mr-1" size={16} />
                    Enable light mode by default
                  </>
                )}
              </label>
            </div>
          </div>

          {/* Notification Settings */}
          <div>
            <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-3">
              Notification Settings
            </h3>
            <div className="flex items-center">
              <input
                type="checkbox"
                id="emailNotifications"
                checked={emailNotifications}
                onChange={() => setEmailNotifications(!emailNotifications)}
                className="h-4 w-4 text-primary focus:ring-primary border-gray-300 dark:border-gray-700 rounded"
              />
              <label
                htmlFor="emailNotifications"
                className="ml-2 text-sm text-gray-700 dark:text-gray-300"
              >
                Receive email notifications for new articles in your preferred categories
              </label>
            </div>
          </div>

          <div className="flex justify-end">
            <Button
              onClick={handleSavePreferences}
              isLoading={isLoading}
              disabled={!hasChanges()}
              className="flex items-center"
            >
              <FiSave className="mr-2" />
              Save Preferences
            </Button>
          </div>
        </div>
      </div>
    </Card>
  );
}

