import React, { useState } from 'react';
import { useContentBlocks } from '@/hooks/useContentBlocks';
import { ChevronDown, ChevronRight } from 'lucide-react';
import GlassCard from '@/components/GlassCard';

interface FAQItemProps {
  title: string;
  content: string;
  isOpen: boolean;
  onClick: () => void;
}

const FAQItem: React.FC<FAQItemProps> = ({ title, content, isOpen, onClick }) => (
  <div className="glass-card overflow-hidden">
    <button
      onClick={onClick}
      className="w-full p-4 sm:p-5 text-left flex items-center justify-between hover:bg-white/5 transition-colors"
    >
      <h3 className="font-semibold text-wedding-navy text-sm sm:text-base pr-4">
        {title}
      </h3>
      {isOpen ? (
        <ChevronDown className="w-4 h-4 text-wedding-gold flex-shrink-0" />
      ) : (
        <ChevronRight className="w-4 h-4 text-wedding-gold flex-shrink-0" />
      )}
    </button>
    
    {isOpen && (
      <div className="px-4 pb-4 sm:px-5 sm:pb-5 animate-fade-in">
        <div className="border-t border-white/20 pt-3 sm:pt-4">
          <p className="text-muted-foreground text-xs sm:text-sm leading-relaxed">
            {content}
          </p>
        </div>
      </div>
    )}
  </div>
);

const DynamicFAQSection: React.FC = () => {
  const { getBlocksBySection, loading, error } = useContentBlocks();
  const [openItems, setOpenItems] = useState<Set<string>>(new Set());

  const faqBlocks = getBlocksBySection('faq');

  const toggleItem = (id: string) => {
    setOpenItems(prev => {
      const newSet = new Set(prev);
      if (newSet.has(id)) {
        newSet.delete(id);
      } else {
        newSet.add(id);
      }
      return newSet;
    });
  };

  if (loading) {
    return (
      <div className="mb-6 sm:mb-8 lg:mb-10 animate-fade-up">
        <div className="text-center mb-4 sm:mb-6">
          <div className="h-8 bg-gray-200 rounded w-64 mx-auto mb-2 animate-pulse"></div>
          <div className="h-4 bg-gray-200 rounded w-48 mx-auto animate-pulse"></div>
        </div>
        <div className="space-y-3 sm:space-y-4 max-w-3xl mx-auto">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="h-16 bg-gray-200 rounded animate-pulse"></div>
          ))}
        </div>
      </div>
    );
  }

  if (error || faqBlocks.length === 0) {
    return null; // Hide section if no FAQ items or error
  }

  return (
    <div className="mb-6 sm:mb-8 lg:mb-10 animate-fade-up">
      <div className="text-center mb-4 sm:mb-6">
        <h2 className="text-xl sm:text-2xl font-semibold text-wedding-navy mb-2">
          ❓ Frequently Asked Questions
        </h2>
        <p className="text-sm text-muted-foreground">
          Everything you need to know for the big day
        </p>
      </div>
      
      <div className="space-y-3 sm:space-y-4 max-w-3xl mx-auto">
        {faqBlocks.map((block) => (
          <FAQItem
            key={block.id}
            title={block.title}
            content={block.content}
            isOpen={openItems.has(block.id)}
            onClick={() => toggleItem(block.id)}
          />
        ))}
      </div>
      
      <div className="text-center mt-4 sm:mt-6">
        <a 
          href="/faq" 
          className="inline-flex items-center gap-2 glass-card px-4 py-2 hover:scale-105 transition-transform duration-200"
        >
          <span className="text-sm font-medium text-wedding-navy">View All FAQs</span>
          <span className="text-lg">→</span>
        </a>
      </div>
    </div>
  );
};

export default DynamicFAQSection;