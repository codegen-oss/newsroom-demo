import { useState, useEffect } from 'react';
import { FiX, FiFilter, FiCheck } from 'react-icons/fi';
import Card from './Card';
import Button from './Button';

interface FilterOption {
  id: string;
  label: string;
  value: string;
}

interface FilterGroup {
  id: string;
  title: string;
  type: 'radio' | 'checkbox';
  options: FilterOption[];
}

interface FilterPanelProps {
  groups: FilterGroup[];
  selectedFilters: Record<string, string | string[]>;
  onChange: (groupId: string, value: string | string[]) => void;
  onClear: () => void;
  className?: string;
  mobileView?: boolean;
}

export default function FilterPanel({
  groups,
  selectedFilters,
  onChange,
  onClear,
  className = '',
  mobileView = false,
}: FilterPanelProps) {
  const [isOpen, setIsOpen] = useState(!mobileView);
  const [activeFiltersCount, setActiveFiltersCount] = useState(0);

  // Calculate active filters count
  useEffect(() => {
    let count = 0;
    Object.entries(selectedFilters).forEach(([key, value]) => {
      if (Array.isArray(value)) {
        count += value.length;
      } else if (value) {
        count += 1;
      }
    });
    setActiveFiltersCount(count);
  }, [selectedFilters]);

  const togglePanel = () => {
    setIsOpen(!isOpen);
  };

  const handleRadioChange = (groupId: string, value: string) => {
    onChange(groupId, value);
  };

  const handleCheckboxChange = (groupId: string, value: string) => {
    const currentValues = (selectedFilters[groupId] || []) as string[];
    let newValues: string[];

    if (currentValues.includes(value)) {
      newValues = currentValues.filter(v => v !== value);
    } else {
      newValues = [...currentValues, value];
    }

    onChange(groupId, newValues);
  };

  const renderFilterGroup = (group: FilterGroup) => {
    const { id, title, type, options } = group;
    const selectedValue = selectedFilters[id];

    return (
      <div key={id} className="mb-6">
        <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
          {title}
        </h3>
        <div className="space-y-2">
          {options.map((option) => {
            if (type === 'radio') {
              return (
                <div key={option.id} className="flex items-center">
                  <input
                    type="radio"
                    id={`${id}-${option.id}`}
                    name={id}
                    value={option.value}
                    checked={selectedValue === option.value}
                    onChange={() => handleRadioChange(id, option.value)}
                    className="h-4 w-4 text-primary focus:ring-primary border-gray-300 dark:border-gray-700"
                  />
                  <label
                    htmlFor={`${id}-${option.id}`}
                    className="ml-2 text-sm text-gray-700 dark:text-gray-300"
                  >
                    {option.label}
                  </label>
                </div>
              );
            } else {
              const isChecked = Array.isArray(selectedValue) && selectedValue.includes(option.value);
              return (
                <div key={option.id} className="flex items-center">
                  <input
                    type="checkbox"
                    id={`${id}-${option.id}`}
                    value={option.value}
                    checked={isChecked}
                    onChange={() => handleCheckboxChange(id, option.value)}
                    className="h-4 w-4 text-primary focus:ring-primary border-gray-300 dark:border-gray-700 rounded"
                  />
                  <label
                    htmlFor={`${id}-${option.id}`}
                    className="ml-2 text-sm text-gray-700 dark:text-gray-300"
                  >
                    {option.label}
                  </label>
                </div>
              );
            }
          })}
        </div>
      </div>
    );
  };

  // Mobile toggle button
  const renderMobileToggle = () => {
    if (!mobileView) return null;

    return (
      <Button
        onClick={togglePanel}
        variant="outline"
        className="w-full flex items-center justify-center mb-4"
      >
        <FiFilter className="mr-2" />
        {isOpen ? 'Hide Filters' : `Show Filters ${activeFiltersCount > 0 ? `(${activeFiltersCount})` : ''}`}
      </Button>
    );
  };

  // Selected filters badges
  const renderSelectedFiltersBadges = () => {
    const badges: JSX.Element[] = [];

    groups.forEach(group => {
      const selectedValue = selectedFilters[group.id];
      
      if (group.type === 'radio' && selectedValue) {
        const option = group.options.find(opt => opt.value === selectedValue);
        if (option) {
          badges.push(
            <span 
              key={`${group.id}-${selectedValue}`} 
              className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-primary-light/20 text-primary mr-2 mb-2"
            >
              {option.label}
              <button
                onClick={() => onChange(group.id, '')}
                className="ml-1 text-primary hover:text-primary-dark"
                aria-label={`Remove ${option.label} filter`}
              >
                <FiX size={14} />
              </button>
            </span>
          );
        }
      } else if (group.type === 'checkbox' && Array.isArray(selectedValue) && selectedValue.length > 0) {
        selectedValue.forEach(value => {
          const option = group.options.find(opt => opt.value === value);
          if (option) {
            badges.push(
              <span 
                key={`${group.id}-${value}`} 
                className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-primary-light/20 text-primary mr-2 mb-2"
              >
                {option.label}
                <button
                  onClick={() => handleCheckboxChange(group.id, value)}
                  className="ml-1 text-primary hover:text-primary-dark"
                  aria-label={`Remove ${option.label} filter`}
                >
                  <FiX size={14} />
                </button>
              </span>
            );
          }
        });
      }
    });

    if (badges.length === 0) return null;

    return (
      <div className="mb-4">
        <div className="flex items-center mb-2">
          <span className="text-sm text-gray-600 dark:text-gray-400 mr-2">
            Active filters:
          </span>
          <button
            onClick={onClear}
            className="text-xs text-primary hover:text-primary-dark"
          >
            Clear all
          </button>
        </div>
        <div className="flex flex-wrap">
          {badges}
        </div>
      </div>
    );
  };

  return (
    <div className={className}>
      {renderMobileToggle()}
      
      {isOpen && (
        <Card variant="bordered" className="sticky top-20">
          <div className="p-4">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
                Filters
              </h2>
              {activeFiltersCount > 0 && (
                <button
                  onClick={onClear}
                  className="text-sm text-primary hover:text-primary-dark flex items-center"
                >
                  <FiX size={14} className="mr-1" />
                  Clear All
                </button>
              )}
            </div>
            
            {renderSelectedFiltersBadges()}
            
            {groups.map(renderFilterGroup)}
            
            {activeFiltersCount > 0 && (
              <div className="mt-4">
                <Button 
                  onClick={onClear} 
                  variant="outline" 
                  size="sm" 
                  className="w-full"
                >
                  Reset Filters
                </Button>
              </div>
            )}
          </div>
        </Card>
      )}
    </div>
  );
}

