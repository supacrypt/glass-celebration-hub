import React, { useState, useEffect } from 'react';
import GlassCard from '@/components/GlassCard';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Gift, Heart, ExternalLink, DollarSign, Star } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { useToast } from '@/hooks/use-toast';

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

const GiftRegistry: React.FC = () => {
  const [gifts, setGifts] = useState<GiftItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');
  const { user } = useAuth();
  const { toast } = useToast();

  const categories = [
    { id: 'all', label: 'All Gifts', icon: '🎁' },
    { id: 'kitchen', label: 'Kitchen', icon: '🍴' },
    { id: 'bedroom', label: 'Bedroom', icon: '🛏️' },
    { id: 'entertaining', label: 'Entertaining', icon: '🥂' },
    { id: 'experiences', label: 'Experiences', icon: '✈️' },
    { id: 'outdoor', label: 'Outdoor', icon: '🌿' },
  ];

  const priorityLabels = {
    1: { label: 'High Priority', color: 'bg-red-100 text-red-800' },
    2: { label: 'Medium Priority', color: 'bg-yellow-100 text-yellow-800' },
    3: { label: 'Low Priority', color: 'bg-green-100 text-green-800' },
  };

  useEffect(() => {
    fetchGifts();
  }, []);

  const fetchGifts = async () => {
    try {
      const { data, error } = await supabase
        .from('gift_registry')
        .select('*')
        .order('priority', { ascending: true })
        .order('created_at', { ascending: true });

      if (error) throw error;
      setGifts(data || []);
    } catch (error) {
      console.error('Error fetching gifts:', error);
      toast({
        title: "Error",
        description: "Failed to load gift registry. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const markAsPurchased = async (giftId: string) => {
    if (!user) return;

    try {
      const { error } = await supabase
        .from('gift_registry')
        .update({
          is_purchased: true,
          purchased_by: user.id,
          purchased_at: new Date().toISOString(),
        })
        .eq('id', giftId);

      if (error) throw error;

      toast({
        title: "Thank you!",
        description: "Gift marked as purchased. Tim & Kirsten will be so grateful!",
      });

      fetchGifts(); // Refresh the list
    } catch (error) {
      console.error('Error marking gift as purchased:', error);
      toast({
        title: "Error",
        description: "Failed to update gift status. Please try again.",
        variant: "destructive",
      });
    }
  };

  const filteredGifts = filter === 'all' 
    ? gifts 
    : gifts.filter(gift => gift.category === filter);

  const availableGifts = filteredGifts.filter(gift => !gift.is_purchased);
  const purchasedGifts = filteredGifts.filter(gift => gift.is_purchased);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-wedding-navy"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen px-5 pt-12 pb-6">
      {/* Header */}
      <div className="text-center mb-8 animate-fade-up">
        <h1 className="wedding-heading text-wedding-navy mb-3">
          Gift Registry
        </h1>
        <p className="wedding-body text-muted-foreground max-w-2xl mx-auto">
          Your presence is the greatest gift, but if you'd like to help us start our new life together, 
          here are some things we'd love to have in our new home.
        </p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-3 mb-8">
        <GlassCard 
          className="p-4 text-center animate-fade-up" 
          style={{ animationDelay: '0.1s' }}
          variant="secondary"
        >
          <Gift className="w-6 h-6 mx-auto mb-2 text-glass-blue" />
          <div className="text-lg font-light text-wedding-navy">{gifts.length}</div>
          <div className="text-xs text-muted-foreground">Total Items</div>
        </GlassCard>
        
        <GlassCard 
          className="p-4 text-center animate-fade-up" 
          style={{ animationDelay: '0.2s' }}
          variant="secondary"
        >
          <Heart className="w-6 h-6 mx-auto mb-2 text-glass-pink" />
          <div className="text-lg font-light text-wedding-navy">{purchasedGifts.length}</div>
          <div className="text-xs text-muted-foreground">Purchased</div>
        </GlassCard>
        
        <GlassCard 
          className="p-4 text-center animate-fade-up" 
          style={{ animationDelay: '0.3s' }}
          variant="secondary"
        >
          <DollarSign className="w-6 h-6 mx-auto mb-2 text-glass-green" />
          <div className="text-lg font-light text-wedding-navy">{availableGifts.length}</div>
          <div className="text-xs text-muted-foreground">Available</div>
        </GlassCard>
      </div>

      {/* Category Filter */}
      <GlassCard className="mb-8 p-4 animate-fade-up" style={{ animationDelay: '0.4s' }}>
        <div className="flex flex-wrap gap-2 justify-center">
          {categories.map((category) => (
            <button
              key={category.id}
              onClick={() => setFilter(category.id)}
              className={`flex items-center gap-2 px-4 py-2 rounded-glass text-sm font-medium transition-all ${
                filter === category.id
                  ? 'bg-wedding-navy text-white scale-105'
                  : 'bg-secondary/30 text-muted-foreground hover:bg-secondary/50'
              }`}
            >
              <span>{category.icon}</span>
              {category.label}
            </button>
          ))}
        </div>
      </GlassCard>

      {/* Available Gifts */}
      {availableGifts.length > 0 && (
        <div className="mb-12">
          <h2 className="text-xl font-semibold text-wedding-navy mb-6 text-center">
            Available Gifts
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            {availableGifts.map((gift, index) => (
              <GlassCard
                key={gift.id}
                className="p-6 animate-fade-up glass-card"
                style={{ animationDelay: `${0.5 + (index * 0.1)}s` }}
              >
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1">
                    <h3 className="font-semibold text-wedding-navy mb-2 text-lg">
                      {gift.title}
                    </h3>
                    {gift.description && (
                      <p className="text-muted-foreground text-sm mb-3 leading-relaxed">
                        {gift.description}
                      </p>
                    )}
                  </div>
                  
                  <div className="flex flex-col items-end gap-2 ml-4">
                    <Badge className={priorityLabels[gift.priority as keyof typeof priorityLabels].color}>
                      <Star className="w-3 h-3 mr-1" />
                      {priorityLabels[gift.priority as keyof typeof priorityLabels].label}
                    </Badge>
                  </div>
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    {gift.price && (
                      <span className="text-xl font-semibold text-wedding-navy">
                        ${gift.price.toFixed(2)}
                      </span>
                    )}
                    {gift.store_url && (
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
                  
                  <Button
                    onClick={() => markAsPurchased(gift.id)}
                    className="bg-wedding-navy hover:bg-wedding-navy-light"
                  >
                    <Heart className="w-4 h-4 mr-2" />
                    I'll Get This
                  </Button>
                </div>
              </GlassCard>
            ))}
          </div>
        </div>
      )}

      {/* Purchased Gifts */}
      {purchasedGifts.length > 0 && (
        <div>
          <h2 className="text-xl font-semibold text-wedding-navy mb-6 text-center">
            Already Purchased - Thank You! 💖
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            {purchasedGifts.map((gift, index) => (
              <GlassCard
                key={gift.id}
                className="p-6 animate-fade-up glass-card opacity-60"
                style={{ animationDelay: `${0.5 + (index * 0.1)}s` }}
              >
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1">
                    <h3 className="font-semibold text-wedding-navy mb-2 text-lg line-through">
                      {gift.title}
                    </h3>
                    {gift.description && (
                      <p className="text-muted-foreground text-sm mb-3 leading-relaxed">
                        {gift.description}
                      </p>
                    )}
                  </div>
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    {gift.price && (
                      <span className="text-xl font-semibold text-muted-foreground line-through">
                        ${gift.price.toFixed(2)}
                      </span>
                    )}
                  </div>
                  
                  <Badge className="bg-green-100 text-green-800">
                    <Heart className="w-3 h-3 mr-1 fill-current" />
                    Purchased
                  </Badge>
                </div>
              </GlassCard>
            ))}
          </div>
        </div>
      )}

      {filteredGifts.length === 0 && (
        <GlassCard className="p-8 text-center" variant="secondary">
          <Gift className="w-12 h-12 mx-auto mb-4 text-muted-foreground" />
          <p className="text-muted-foreground">No gifts found in this category.</p>
        </GlassCard>
      )}
    </div>
  );
};

export default GiftRegistry;