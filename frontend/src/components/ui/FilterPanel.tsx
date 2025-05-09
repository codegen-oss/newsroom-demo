'use client';

import { useState } from 'react';
import { FiChevronDown, FiChevronUp, FiX } from 'react-icons/fi';

interface FilterOption {
  id: string;
  label: string;
}

interface FilterGroupProps {
  title: string;
  options: FilterOption[];
  selectedOption: string;
  onChange: (optionId: string) => void;
  expanded?: boolean;
  toggleExpanded?: () => void;
  multiSelect?: boolean;
}

interface FilterPanelProps {
  filters: {
    [key: string]: {
      title: string;
      options: FilterOption[];
      expanded?: boolean;
      multiSelect?: boolean;
    };
  };
  selectedFilters: {
    [key: string]: string | string[];
  };
  onFilterChange: (filterKey: string, value: string | string[]) => void;
  onClearFilters: () => void;
}

// Individual filter group component
const FilterGroup = ({
  title,
  options,
  selectedOption,
  onChange,
  expanded = true,
  toggleExpanded,
  multiSelect = false,
}: FilterGroupProps) => {
  return (
    <div className="mb-4">
      <button
        onClick={toggleExpanded}
        className="flex items-center justify-between w-full text-left font-medium mb-2"
        aria-expanded={expanded}
      >
        <span>{title}</span>
        {toggleExpanded && (expanded ? <FiChevronUp /> : <FiChevronDown />)}
      </button>
      
      {expanded && (
        <div className="space-y-2 pl-2">
          {options.map((option) => (
            <label key={option.id} className="flex items-center">
              <input
                type={multiSelect ? "checkbox" : "radio"}
                name={title.toLowerCase().replace(/\s+/g, '-')}
                className={`h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 ${multiSelect ? 'rounded' : 'rounded-full'}`}
                checked={
                  multiSelect
                    ? Array.isArray(selectedOption) && selectedOption.includes(option.id)
                    : selectedOption === option.id
                }
                onChange={() => onChange(option.id)}
              />
              <span className="ml-2 text-sm text-gray-700 dark:text-gray-300">{option.label}</span>
            </label>
          ))}
        </div>
      )}
    </div>
  );
};

// Main filter panel component
export default function FilterPanel({
  filters,
  selectedFilters,
  onFilterChange,
  onClearFilters,
}: FilterPanelProps) {
  const [expandedSections, setExpandedSections] = useState<Record<string, boolean>>(
    Object.keys(filters).reduce((acc, key) => {
      acc[key] = filters[key].expanded !== undefined ? filters[key].expanded : true;
      return acc;
    }, {} as Record<string, boolean>)
  );

  // Toggle expanded state for a filter section
  const toggleSection = (section: string) => {
    setExpandedSections({
      ...expandedSections,
      [section]: !expandedSections[section],
    });
  };

  // Handle filter change
  const handleFilterChange = (filterKey: string, optionId: string) => {
    const isMultiSelect = filters[filterKey].multiSelect;
    
    if (isMultiSelect) {
      // For multi-select filters
      const currentValues = Array.isArray(selectedFilters[filterKey]) 
        ? [...selectedFilters[filterKey] as string[]] 
        : [];
      
      const newValues = currentValues.includes(optionId)
        ? currentValues.filter(id => id !== optionId)
        : [...currentValues, optionId];
      
      onFilterChange(filterKey, newValues);
    } else {
      // For single-select filters
      onFilterChange(filterKey, optionId);
    }
  };

  // Count active filters
  const countActiveFilters = () => {
    return Object.entries(selectedFilters).reduce((count, [key, value]) => {
      if (Array.isArray(value)) {
        return count + value.length;
      }
      
      // Check if the value is not the default "all" option
      const defaultOption = filters[key]?.options.find(option => 
        option.id.toLowerCase().includes('all')
      );
      
      if (defaultOption && value !== defaultOption.id) {
        return count + 1;
      }
      
      return count;
    }, 0);
  };

  const activeFilterCount = countActiveFilters();

  return (
    <div className="glass-card">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-lg font-semibold">
          Filters
          {activeFilterCount > 0 && (
            <span className="ml-2 px-2 py-0.5 text-xs bg-primary-100 dark:bg-primary-900 text-primary-800 dark:text-primary-200 rounded-full">
              {activeFilterCount}
            </span>
          )}
        </h2>
        {activeFilterCount > 0 && (
          <button
            onClick={onClearFilters}
            className="text-sm text-primary-600 dark:text-primary-400 hover:underline flex items-center"
          >
            <FiX className="mr-1" />
            Clear All
          </button>
        )}
      </div>
      
      <div className="divide-y divide-gray-200 dark:divide-gray-700">
        {Object.entries(filters).map(([key, filter]) => (
          <div key={key} className="py-4 first:pt-0 last:pb-0">
            <FilterGroup
              title={filter.title}
              options={filter.options}
              selectedOption={selectedFilters[key] || (filter.multiSelect ? [] : filter.options[0].id)}
              onChange={(optionId) => handleFilterChange(key, optionId)}
              expanded={expandedSections[key]}
              toggleExpanded={() => toggleSection(key)}
              multiSelect={filter.multiSelect}
            />
          </div>
        ))}
      </div>
    </div>
  );
}

