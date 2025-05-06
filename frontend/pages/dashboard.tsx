import { NextPage } from 'next';
import { useAuth } from '../contexts/AuthContext';
import { withAuth } from '../utils/auth';

const Dashboard: NextPage = () => {
  const { user } = useAuth();

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">Dashboard</h1>
      
      <div className="bg-white shadow rounded-lg p-6">
        <h2 className="text-xl font-semibold mb-4">Welcome, {user?.name}!</h2>
        <p className="text-gray-600 mb-6">
          This is your personalized dashboard where you can manage your news preferences,
          saved articles, and account settings.
        </p>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <div className="bg-blue-50 p-6 rounded-lg">
            <h3 className="text-lg font-medium text-blue-800 mb-2">Your Feed</h3>
            <p className="text-blue-600 mb-4">
              Customize your news feed based on your interests.
            </p>
            <button className="text-blue-700 font-medium hover:text-blue-800">
              Manage Preferences →
            </button>
          </div>
          
          <div className="bg-green-50 p-6 rounded-lg">
            <h3 className="text-lg font-medium text-green-800 mb-2">Saved Articles</h3>
            <p className="text-green-600 mb-4">
              Access your bookmarked articles for later reading.
            </p>
            <button className="text-green-700 font-medium hover:text-green-800">
              View Saved Articles →
            </button>
          </div>
          
          <div className="bg-purple-50 p-6 rounded-lg">
            <h3 className="text-lg font-medium text-purple-800 mb-2">Account Settings</h3>
            <p className="text-purple-600 mb-4">
              Update your profile and notification preferences.
            </p>
            <button className="text-purple-700 font-medium hover:text-purple-800">
              Manage Account →
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default withAuth(Dashboard);

