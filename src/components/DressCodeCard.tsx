import React from 'react';
import { Shirt } from 'lucide-react';

const DressCodeCard: React.FC = () => {
  

  return (
    <div className="glass-card responsive-card-padding">
      <div className="flex items-center gap-3 mb-4">
        <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-glass-blue/20 flex items-center justify-center ring-2 ring-glass-border">
          <Shirt className="w-5 h-5 sm:w-6 sm:h-6 text-glass-blue" />
        </div>
        <div>
          <h2 className="responsive-heading-lg font-semibold text-wedding-navy">Attire</h2>
          <p className="responsive-text-base text-glass-blue font-medium">Cocktail / Formal</p>
        </div>
      </div>
      
      <p className="responsive-text-base text-muted-foreground">
        We'd love to see our friends and family get dressed up with us! The dress code is cocktail attire. Ladies can wear cocktail dresses, and the gentlemen can wear a suit and tie or a sports coat. No jeans please!
      </p>
    </div>
  );
};

export default DressCodeCard;