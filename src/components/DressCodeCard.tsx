import React from 'react';
import GlassCard from '@/components/GlassCard';
import { Shirt } from 'lucide-react';

const DressCodeCard: React.FC = () => {
  return (
    <GlassCard className="p-6">
      <div className="flex items-center gap-3 mb-4">
        <div className="w-12 h-12 rounded-full bg-purple-100 flex items-center justify-center">
          <Shirt className="w-6 h-6 text-purple-600" />
        </div>
        <div>
          <h2 className="text-xl font-semibold text-wedding-navy">Dress Code</h2>
          <p className="text-sm text-purple-600 font-medium">Dapper/Cocktail</p>
        </div>
      </div>
      
      <div className="grid md:grid-cols-2 gap-6">
        <div>
          <h3 className="font-medium text-wedding-navy mb-3">For Him</h3>
          <ul className="text-sm text-muted-foreground space-y-1">
            <li>• Suits</li>
            <li>• Dress chinos</li>
            <li>• Button up shirt and optional tie</li>
            <li>• We love a pocket kerchief!</li>
          </ul>
        </div>
        <div>
          <h3 className="font-medium text-wedding-navy mb-3">For Her</h3>
          <ul className="text-sm text-muted-foreground space-y-1">
            <li>• Classy dress</li>
            <li>• Pantsuit</li>
            <li>• Jumpsuit</li>
          </ul>
        </div>
      </div>
    </GlassCard>
  );
};

export default DressCodeCard;