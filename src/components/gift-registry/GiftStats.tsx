import React from 'react';
import GlassCard from '@/components/GlassCard';
import { Gift, Heart, DollarSign } from 'lucide-react';

interface GiftStatsProps {
  totalGifts: number;
  purchasedGifts: number;
  availableGifts: number;
}

const GiftStats: React.FC<GiftStatsProps> = ({ 
  totalGifts, 
  purchasedGifts, 
  availableGifts 
}) => {
  return (
    <div className="grid grid-cols-3 gap-3 mb-8">
      <GlassCard 
        className="p-4 text-center animate-fade-up" 
        style={{ animationDelay: '0.1s' }}
        variant="secondary"
      >
        <Gift className="w-6 h-6 mx-auto mb-2 text-glass-blue" />
        <div className="text-lg font-light text-wedding-navy">{totalGifts}</div>
        <div className="text-xs text-muted-foreground">Total Items</div>
      </GlassCard>
      
      <GlassCard 
        className="p-4 text-center animate-fade-up" 
        style={{ animationDelay: '0.2s' }}
        variant="secondary"
      >
        <Heart className="w-6 h-6 mx-auto mb-2 text-glass-pink" />
        <div className="text-lg font-light text-wedding-navy">{purchasedGifts}</div>
        <div className="text-xs text-muted-foreground">Purchased</div>
      </GlassCard>
      
      <GlassCard 
        className="p-4 text-center animate-fade-up" 
        style={{ animationDelay: '0.3s' }}
        variant="secondary"
      >
        <DollarSign className="w-6 h-6 mx-auto mb-2 text-glass-green" />
        <div className="text-lg font-light text-wedding-navy">{availableGifts}</div>
        <div className="text-xs text-muted-foreground">Available</div>
      </GlassCard>
    </div>
  );
};

export default GiftStats;