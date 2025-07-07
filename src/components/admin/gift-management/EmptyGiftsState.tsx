import React from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Plus, Package } from 'lucide-react';

interface EmptyGiftsStateProps {
  onAddFirst: () => void;
}

const EmptyGiftsState: React.FC<EmptyGiftsStateProps> = ({ onAddFirst }) => {
  return (
    <Card className="p-8 text-center">
      <Package className="w-12 h-12 mx-auto mb-4 text-muted-foreground" />
      <h3 className="text-lg font-semibold mb-2">No gifts yet</h3>
      <p className="text-muted-foreground mb-4">
        Start building your gift registry by adding items.
      </p>
      <Button onClick={onAddFirst} className="bg-wedding-navy hover:bg-wedding-navy-light">
        <Plus className="w-4 h-4 mr-2" />
        Add First Gift
      </Button>
    </Card>
  );
};

export default EmptyGiftsState;