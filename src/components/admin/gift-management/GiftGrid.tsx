import React from 'react';
import GiftItemComponent from './GiftItem';
import type { GiftItem } from './types';

interface GiftGridProps {
  gifts: GiftItem[];
  onEdit: (gift: GiftItem) => void;
  onDelete: (giftId: string) => void;
}

const GiftGrid: React.FC<GiftGridProps> = ({ gifts, onEdit, onDelete }) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {gifts.map((gift) => (
        <GiftItemComponent
          key={gift.id}
          gift={gift}
          onEdit={onEdit}
          onDelete={onDelete}
        />
      ))}
    </div>
  );
};

export default GiftGrid;