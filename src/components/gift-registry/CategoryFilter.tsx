import React from 'react';
import GlassCard from '@/components/GlassCard';

interface Category {
  id: string;
  label: string;
  icon: string;
}

interface CategoryFilterProps {
  categories: Category[];
  activeFilter: string;
  onFilterChange: (filter: string) => void;
}

const CategoryFilter: React.FC<CategoryFilterProps> = ({ 
  categories, 
  activeFilter, 
  onFilterChange 
}) => {
  return (
    <GlassCard className="mb-8 p-4 animate-fade-up" style={{ animationDelay: '0.4s' }}>
      <div className="flex flex-wrap gap-2 justify-center">
        {categories.map((category) => (
          <button
            key={category.id}
            onClick={() => onFilterChange(category.id)}
            className={`flex items-center gap-2 px-4 py-2 rounded-glass text-sm font-medium transition-all ${
              activeFilter === category.id
                ? 'bg-wedding-navy text-white scale-105'
                : 'bg-secondary/30 text-muted-foreground hover:bg-secondary/50'
            }`}
          >
            <span>{category.icon}</span>
            {category.label}
          </button>
        ))}
      </div>
    </GlassCard>
  );
};

export default CategoryFilter;