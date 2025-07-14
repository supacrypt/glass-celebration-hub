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
          <p className="responsive-text-base text-glass-blue font-medium">Dapper / Cocktail</p>
        </div>
      </div>
      
      <div className="space-y-3">
        <p className="responsive-text-base text-muted-foreground">
          We'd love to see our friends and family get dressed up with us!
        </p>
        
        <div className="space-y-2">
          <p className="responsive-text-sm text-muted-foreground">
            <span className="font-medium text-wedding-navy">Ladies:</span> Classy dress, pantsuit or jumpsuit
          </p>
          <p className="responsive-text-sm text-muted-foreground">
            <span className="font-medium text-wedding-navy">Gentlemen:</span> Suits, dress chinos, button up shirt and optional tie. We love a pocket kerchief!
          </p>
        </div>
        
        <div className="mt-4 p-3 bg-wedding-gold/10 rounded-lg border border-wedding-gold/20">
          <p className="responsive-text-sm text-wedding-navy/80">
            <span className="font-medium">Dress to impress</span> but keep it comfortable for dancing!
          </p>
        </div>
      </div>
    </div>
  );
};

export default DressCodeCard;