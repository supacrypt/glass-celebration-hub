import React from 'react';
import GlassCard from '@/components/GlassCard';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Heart, ExternalLink, DollarSign, Star } from 'lucide-react';

interface GiftItem {
  id: string;
  title: string;
  description: string | null;
  price: number | null;
  image_url: string | null;
  store_url: string | null;
  category: string;
  priority: number;
  is_purchased: boolean;
  purchased_by: string | null;
  purchased_at: string | null;
  created_at: string;
}

interface GiftCardProps {
  gift: GiftItem;
  index: number;
  isPurchased: boolean;
  onMarkAsPurchased: (giftId: string) => void;
}

const GiftCard: React.FC<GiftCardProps> = ({ 
  gift, 
  index, 
  isPurchased, 
  onMarkAsPurchased 
}) => {
  const priorityLabels = {
    1: { label: 'High Priority', color: 'bg-red-100 text-red-800' },
    2: { label: 'Medium Priority', color: 'bg-yellow-100 text-yellow-800' },
    3: { label: 'Low Priority', color: 'bg-green-100 text-green-800' },
  };

  return (
    <GlassCard
      className={`p-6 animate-fade-up glass-card ${isPurchased ? 'opacity-60' : ''}`}
      style={{ animationDelay: `${0.5 + (index * 0.1)}s` }}
    >
      <div className="flex items-start justify-between mb-4">
        <div className="flex-1">
          <h3 className={`font-semibold text-wedding-navy mb-2 text-lg ${isPurchased ? 'line-through' : ''}`}>
            {gift.title}
          </h3>
          {gift.description && (
            <p className="text-muted-foreground text-sm mb-3 leading-relaxed">
              {gift.description}
            </p>
          )}
        </div>
        
        {!isPurchased && (
          <div className="flex flex-col items-end gap-2 ml-4">
            <Badge className={priorityLabels[gift.priority as keyof typeof priorityLabels].color}>
              <Star className="w-3 h-3 mr-1" />
              {priorityLabels[gift.priority as keyof typeof priorityLabels].label}
            </Badge>
          </div>
        )}
      </div>

      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          {gift.price && (
            <span className={`text-xl font-semibold ${
              isPurchased 
                ? 'text-muted-foreground line-through' 
                : 'text-wedding-navy'
            }`}>
              ${gift.price.toFixed(2)}
            </span>
          )}
          {gift.store_url && !isPurchased && (
            <Button
              variant="outline"
              size="sm"
              onClick={() => window.open(gift.store_url!, '_blank')}
              className="flex items-center gap-2"
            >
              <ExternalLink className="w-4 h-4" />
              View Store
            </Button>
          )}
        </div>
        
        {isPurchased ? (
          <Badge className="bg-green-100 text-green-800">
            <Heart className="w-3 h-3 mr-1 fill-current" />
            Purchased
          </Badge>
        ) : (
          <Button
            onClick={() => onMarkAsPurchased(gift.id)}
            className="bg-wedding-navy hover:bg-wedding-navy-light"
          >
            <Heart className="w-4 h-4 mr-2" />
            I'll Get This
          </Button>
        )}
      </div>
    </GlassCard>
  );
};

export default GiftCard;