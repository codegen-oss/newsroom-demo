import React, { useState } from 'react';

const InterestSelector = ({ title, items, selectedItems, onAdd, onRemove }) => {
  const [newItem, setNewItem] = useState('');

  const handleAdd = () => {
    if (newItem.trim() && !selectedItems.includes(newItem.trim())) {
      onAdd(newItem.trim());
      setNewItem('');
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      handleAdd();
    }
  };

  return (
    <div className="mb-6">
      <h3 className="text-lg font-medium mb-2">{title}</h3>
      
      <div className="flex flex-wrap gap-2 mb-3">
        {selectedItems.map((item) => (
          <div 
            key={item} 
            className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full flex items-center"
          >
            <span>{item}</span>
            <button 
              onClick={() => onRemove(item)}
              className="ml-2 text-blue-600 hover:text-blue-800"
            >
              &times;
            </button>
          </div>
        ))}
        
        {selectedItems.length === 0 && (
          <p className="text-gray-500 italic">No {title.toLowerCase()} selected</p>
        )}
      </div>
      
      <div className="flex">
        <input
          type="text"
          value={newItem}
          onChange={(e) => setNewItem(e.target.value)}
          onKeyPress={handleKeyPress}
          placeholder={`Add new ${title.toLowerCase().slice(0, -1)}...`}
          className="flex-grow px-3 py-2 border border-gray-300 rounded-l-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <button
          onClick={handleAdd}
          className="bg-blue-600 text-white px-4 py-2 rounded-r-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          Add
        </button>
      </div>
    </div>
  );
};

export default InterestSelector;

