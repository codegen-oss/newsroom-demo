'use client';

import { useState } from 'react';

interface UserSettings {
  theme: 'light' | 'dark' | 'system';
  notifications: boolean;
  emailFrequency: 'daily' | 'weekly' | 'none';
}

interface UserSettingsPanelProps {
  initialSettings: UserSettings;
  onSave: (settings: UserSettings) => void;
}

export default function UserSettingsPanel({
  initialSettings,
  onSave
}: UserSettingsPanelProps) {
  const [settings, setSettings] = useState<UserSettings>(initialSettings);
  const [isSaving, setIsSaving] = useState(false);

  const handleThemeChange = (theme: 'light' | 'dark' | 'system') => {
    setSettings({ ...settings, theme });
  };

  const handleNotificationsChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSettings({ ...settings, notifications: e.target.checked });
  };

  const handleEmailFrequencyChange = (frequency: 'daily' | 'weekly' | 'none') => {
    setSettings({ ...settings, emailFrequency: frequency });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    
    try {
      await onSave(settings);
      // Success notification could be added here
    } catch (error) {
      // Error handling could be added here
      console.error('Failed to save settings:', error);
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
      <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-6">User Settings</h2>
      
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Theme Settings */}
        <div>
          <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-3">Appearance</h3>
          <div className="grid grid-cols-3 gap-3">
            <button
              type="button"
              onClick={() => handleThemeChange('light')}
              className={`flex flex-col items-center justify-center p-3 rounded-lg border ${
                settings.theme === 'light'
                  ? 'border-primary bg-primary bg-opacity-10'
                  : 'border-gray-200 dark:border-gray-700'
              }`}
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 mb-2 text-gray-700 dark:text-gray-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
              </svg>
              <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Light</span>
            </button>
            
            <button
              type="button"
              onClick={() => handleThemeChange('dark')}
              className={`flex flex-col items-center justify-center p-3 rounded-lg border ${
                settings.theme === 'dark'
                  ? 'border-primary bg-primary bg-opacity-10'
                  : 'border-gray-200 dark:border-gray-700'
              }`}
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 mb-2 text-gray-700 dark:text-gray-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
              </svg>
              <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Dark</span>
            </button>
            
            <button
              type="button"
              onClick={() => handleThemeChange('system')}
              className={`flex flex-col items-center justify-center p-3 rounded-lg border ${
                settings.theme === 'system'
                  ? 'border-primary bg-primary bg-opacity-10'
                  : 'border-gray-200 dark:border-gray-700'
              }`}
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 mb-2 text-gray-700 dark:text-gray-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
              </svg>
              <span className="text-sm font-medium text-gray-700 dark:text-gray-300">System</span>
            </button>
          </div>
        </div>
        
        {/* Notification Settings */}
        <div>
          <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-3">Notifications</h3>
          <div className="flex items-center justify-between">
            <span className="text-sm text-gray-700 dark:text-gray-300">Enable browser notifications</span>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={settings.notifications}
                onChange={handleNotificationsChange}
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary-300 dark:peer-focus:ring-primary-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-primary"></div>
            </label>
          </div>
        </div>
        
        {/* Email Frequency Settings */}
        <div>
          <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-3">Email Digest</h3>
          <div className="space-y-2">
            <div className="flex items-center">
              <input
                id="email-daily"
                type="radio"
                name="email-frequency"
                checked={settings.emailFrequency === 'daily'}
                onChange={() => handleEmailFrequencyChange('daily')}
                className="h-4 w-4 text-primary focus:ring-primary border-gray-300 dark:border-gray-600"
              />
              <label htmlFor="email-daily" className="ml-2 text-sm text-gray-700 dark:text-gray-300">
                Daily digest
              </label>
            </div>
            
            <div className="flex items-center">
              <input
                id="email-weekly"
                type="radio"
                name="email-frequency"
                checked={settings.emailFrequency === 'weekly'}
                onChange={() => handleEmailFrequencyChange('weekly')}
                className="h-4 w-4 text-primary focus:ring-primary border-gray-300 dark:border-gray-600"
              />
              <label htmlFor="email-weekly" className="ml-2 text-sm text-gray-700 dark:text-gray-300">
                Weekly digest
              </label>
            </div>
            
            <div className="flex items-center">
              <input
                id="email-none"
                type="radio"
                name="email-frequency"
                checked={settings.emailFrequency === 'none'}
                onChange={() => handleEmailFrequencyChange('none')}
                className="h-4 w-4 text-primary focus:ring-primary border-gray-300 dark:border-gray-600"
              />
              <label htmlFor="email-none" className="ml-2 text-sm text-gray-700 dark:text-gray-300">
                No emails
              </label>
            </div>
          </div>
        </div>
        
        <div className="pt-4 border-t border-gray-200 dark:border-gray-700">
          <button
            type="submit"
            disabled={isSaving}
            className="w-full py-2 px-4 bg-primary text-white rounded-md hover:bg-primary-dark focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            {isSaving ? 'Saving...' : 'Save Settings'}
          </button>
        </div>
      </form>
    </div>
  );
}

