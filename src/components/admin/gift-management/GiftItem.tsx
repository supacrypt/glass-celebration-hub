import React from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Edit, Trash2, ExternalLink, DollarSign } from 'lucide-react';
import type { GiftItem } from './types';
import { priorities } from './types';

interface GiftItemProps {
  gift: GiftItem;
  onEdit: (gift: GiftItem) => void;
  onDelete: (giftId: string) => void;
}

const GiftItem: React.FC<GiftItemProps> = ({ gift, onEdit, onDelete }) => {
  const priorityInfo = priorities.find(p => p.value === gift.priority);
  
  return (
    <Card className={`${gift.is_purchased ? 'opacity-60' : ''}`}>
      {gift.image_url && (
        <div className="w-full h-40 overflow-hidden rounded-t-lg">
          <img 
            src={gift.image_url} 
            alt={gift.title} 
            className="w-full h-full object-cover"
          />
        </div>
      )}
      
      <CardHeader className="pb-3">
        <div className="flex justify-between items-start">
          <CardTitle className="text-lg line-clamp-2">
            {gift.title}
          </CardTitle>
          <div className="flex space-x-1">
            <Button
              size="sm"
              variant="ghost"
              onClick={() => onEdit(gift)}
            >
              <Edit className="w-4 h-4" />
            </Button>
            <Button
              size="sm"
              variant="ghost"
              onClick={() => onDelete(gift.id)}
            >
              <Trash2 className="w-4 h-4" />
            </Button>
          </div>
        </div>
        
        <div className="flex flex-wrap gap-2">
          <Badge variant="secondary" className="text-xs">
            {gift.category}
          </Badge>
          {priorityInfo && (
            <Badge className={`${priorityInfo.color} text-xs`}>
              {priorityInfo.label}
            </Badge>
          )}
          {gift.is_purchased && (
            <Badge className="bg-green-100 text-green-800 text-xs">
              Purchased
            </Badge>
          )}
        </div>
      </CardHeader>
      
      <CardContent className="space-y-3">
        {gift.description && (
          <p className="text-sm text-muted-foreground line-clamp-3">
            {gift.description}
          </p>
        )}
        
        <div className="flex justify-between items-center">
          {gift.price && (
            <div className="flex items-center">
              <DollarSign className="w-4 h-4 mr-1" />
              <span className="font-semibold">${gift.price.toFixed(2)}</span>
            </div>
          )}
          
          {gift.store_url && (
            <Button
              size="sm"
              variant="outline"
              onClick={() => window.open(gift.store_url!, '_blank')}
            >
              <ExternalLink className="w-4 h-4 mr-1" />
              Store
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default GiftItem;