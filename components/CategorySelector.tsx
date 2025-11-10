
import React from 'react';
import type { MockupCategory } from '../types';

interface CategorySelectorProps {
  categories: MockupCategory[];
  selectedCategory: string;
  onSelectCategory: (categoryId: string) => void;
}

const CategorySelector: React.FC<CategorySelectorProps> = ({ categories, selectedCategory, onSelectCategory }) => {
  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-2 xl:grid-cols-3 gap-3">
      {categories.map((category) => (
        <button
          key={category.id}
          onClick={() => onSelectCategory(category.id)}
          className={`flex flex-col items-center justify-center text-center p-3 rounded-lg border transition-all duration-200 aspect-square ${
            selectedCategory === category.id
              ? 'bg-indigo-600 text-white border-indigo-600 shadow-md scale-105'
              : 'bg-white text-gray-600 border-gray-200 hover:border-indigo-400 hover:text-indigo-600 hover:shadow-sm'
          }`}
        >
          <category.icon className="h-6 w-6 mb-1.5" />
          <span className="text-xs font-medium">{category.name}</span>
        </button>
      ))}
    </div>
  );
};

export default CategorySelector;
