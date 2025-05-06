import { AccessTier } from '@/types/article';
import { useUser } from '@/contexts/UserContext';
import Link from 'next/link';

interface AccessRestrictionProps {
  requiredTier: AccessTier;
  children: React.ReactNode;
}

const AccessRestriction = ({ requiredTier, children }: AccessRestrictionProps) => {
  const { user, canAccessContent } = useUser();
  
  if (canAccessContent(requiredTier)) {
    return <>{children}</>;
  }
  
  return (
    <div className="bg-gray-50 border border-gray-200 rounded-lg p-6 my-6 text-center">
      <h3 className="text-xl font-semibold text-gray-800 mb-2">
        {requiredTier === 'premium' ? 'Premium' : 'Exclusive'} Content
      </h3>
      
      <p className="text-gray-600 mb-4">
        This content is available only to {requiredTier === 'premium' ? 'Premium' : 'Exclusive'} subscribers.
      </p>
      
      {user ? (
        <div>
          <p className="text-gray-700 mb-4">
            Your current access level: <span className="font-medium">{user.accessTier.charAt(0).toUpperCase() + user.accessTier.slice(1)}</span>
          </p>
          <Link
            href="/upgrade"
            className="inline-block bg-blue-600 text-white font-medium px-5 py-2 rounded-lg hover:bg-blue-700 transition"
          >
            Upgrade Your Subscription
          </Link>
        </div>
      ) : (
        <div>
          <p className="text-gray-700 mb-4">
            Please log in to access this content.
          </p>
          <div className="space-x-4">
            <Link
              href="/login"
              className="inline-block bg-blue-600 text-white font-medium px-5 py-2 rounded-lg hover:bg-blue-700 transition"
            >
              Log In
            </Link>
            <Link
              href="/signup"
              className="inline-block bg-gray-200 text-gray-800 font-medium px-5 py-2 rounded-lg hover:bg-gray-300 transition"
            >
              Sign Up
            </Link>
          </div>
        </div>
      )}
    </div>
  );
};

export default AccessRestriction;

