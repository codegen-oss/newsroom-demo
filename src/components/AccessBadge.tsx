import { AccessTier } from '@/types/article';

interface AccessBadgeProps {
  tier: AccessTier;
}

const AccessBadge = ({ tier }: AccessBadgeProps) => {
  const getBadgeStyles = () => {
    switch (tier) {
      case 'free':
        return 'bg-green-100 text-green-800';
      case 'premium':
        return 'bg-purple-100 text-purple-800';
      case 'exclusive':
        return 'bg-amber-100 text-amber-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getBadgeStyles()}`}>
      {tier.charAt(0).toUpperCase() + tier.slice(1)}
    </span>
  );
};

export default AccessBadge;

