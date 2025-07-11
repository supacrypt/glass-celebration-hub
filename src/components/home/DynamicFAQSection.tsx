import React, { useState, useEffect } from 'react';
import { getAllFAQs } from '@/lib/api/faq';
import { supabaseAdmin } from '@/integrations/supabase/client';

// Define a type for the FAQ object for better type safety
interface FAQ {
  id: string;
  question: string;
  answer: string;
}

// A simple, styled component for each FAQ item in the grid
const FAQCard: React.FC<{ title: string; content: string }> = ({ title, content }) => (
  <div className="glass-secondary p-4 sm:p-5 h-full flex flex-col">
    <h3 className="font-bold text-wedding-navy text-base sm:text-lg mb-2">
      {title}
    </h3>
    <p className="text-muted-foreground text-sm leading-relaxed">
      {content}
    </p>
  </div>
);

const DynamicFAQSection: React.FC = () => {
  const [faqs, setFaqs] = useState<FAQ[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadRandomFAQs = async () => {
      try {
        console.log('DynamicFAQSection: Loading FAQs...');
        
        // Try the admin client first since regular client might have RLS issues
        const { data: allFaqs, error } = await supabaseAdmin
          .from('faq_items')
          .select('id, question, answer')
          .eq('is_active', true);
        
        if (error) {
          console.error('DynamicFAQSection: Supabase error:', error);
          throw error;
        }
        
        console.log('DynamicFAQSection: Received FAQs:', allFaqs);
        if (allFaqs && allFaqs.length > 0) {
          // Shuffle the array and take the first 4
          const shuffled = [...allFaqs].sort(() => 0.5 - Math.random());
          const selectedFaqs = shuffled.slice(0, 4);
          console.log('DynamicFAQSection: Selected FAQs:', selectedFaqs);
          setFaqs(selectedFaqs);
        } else {
          console.log('DynamicFAQSection: No FAQs received or empty array');
        }
      } catch (error) {
        console.error('DynamicFAQSection: Error loading FAQs:', error);
      } finally {
        setLoading(false);
      }
    };
    loadRandomFAQs();
  }, []);

  // Skeleton loader for when FAQs are being fetched
  if (loading) {
    return (
      <div className="mb-6 sm:mb-8 lg:mb-10 animate-fade-up">
        <div className="h-8 bg-gray-300/20 rounded-md w-72 mx-auto mb-8 animate-pulse"></div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-w-4xl mx-auto">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="h-32 bg-gray-300/20 rounded-lg animate-pulse"></div>
          ))}
        </div>
      </div>
    );
  }

  // Do not render the section if there are no FAQs to show
  if (faqs.length === 0) {
    console.log('DynamicFAQSection: No FAQs to display, rendering nothing');
    return (
      <div className="mb-6 sm:mb-8 lg:mb-10 animate-fade-up">
        <div className="text-center p-4 bg-red-100 border border-red-300 rounded">
          <h3 className="text-red-800 font-semibold">FAQ Debug</h3>
          <p className="text-red-600">No FAQs loaded. Check console for errors.</p>
          <p className="text-red-600 text-sm">Loading: {loading ? 'true' : 'false'}</p>
          <p className="text-red-600 text-sm">FAQ count: {faqs.length}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="mb-6 sm:mb-8 lg:mb-10 animate-fade-up">
      <h2 className="responsive-heading-lg font-semibold text-wedding-navy text-center mb-6 sm:mb-8">
        Frequently Asked Questions
      </h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-w-4xl mx-auto">
        {faqs.map((faq) => (
          <FAQCard
            key={faq.id}
            title={faq.question}
            content={faq.answer}
          />
        ))}
      </div>
      
      <div className="text-center mt-6 sm:mt-8">
        <a 
          href="/faq" 
          className="glass-button inline-flex items-center gap-2 hover:scale-105 transition-transform duration-200"
        >
          <span className="font-medium">View All FAQs</span>
          <span>→</span>
        </a>
      </div>
    </div>
  );
};

export default DynamicFAQSection;