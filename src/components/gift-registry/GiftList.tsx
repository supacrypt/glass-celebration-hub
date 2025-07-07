import React from 'react';
import GlassCard from '@/components/GlassCard';
import GiftCard from './GiftCard';
import { Gift } from 'lucide-react';

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

interface GiftListProps {
  gifts: GiftItem[];
  title: string;
  emptyMessage?: string;
  isPurchasedList?: boolean;
  onMarkAsPurchased: (giftId: string) => void;
}

const GiftList: React.FC<GiftListProps> = ({ 
  gifts, 
  title, 
  emptyMessage,
  isPurchasedList = false,
  onMarkAsPurchased 
}) => {
  if (gifts.length === 0 && emptyMessage) {
    return (
      <GlassCard className="p-8 text-center" variant="secondary">
        <Gift className="w-12 h-12 mx-auto mb-4 text-muted-foreground" />
        <p className="text-muted-foreground">{emptyMessage}</p>
      </GlassCard>
    );
  }

  if (gifts.length === 0) {
    return null;
  }

  return (
    <div className={isPurchasedList ? '' : 'mb-12'}>
      <h2 className="text-xl font-semibold text-wedding-navy mb-6 text-center">
        {title}
      </h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
        {gifts.map((gift, index) => (
          <GiftCard
            key={gift.id}
            gift={gift}
            index={index}
            isPurchased={isPurchasedList}
            onMarkAsPurchased={onMarkAsPurchased}
          />
        ))}
      </div>
    </div>
  );
};

export default GiftList;