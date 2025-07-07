import React, { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { useToast } from '@/hooks/use-toast';
import GiftStats from '@/components/gift-registry/GiftStats';
import CategoryFilter from '@/components/gift-registry/CategoryFilter';
import GiftList from '@/components/gift-registry/GiftList';

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
      <GiftStats 
        totalGifts={gifts.length}
        purchasedGifts={purchasedGifts.length}
        availableGifts={availableGifts.length}
      />

      {/* Category Filter */}
      <CategoryFilter 
        categories={categories}
        activeFilter={filter}
        onFilterChange={setFilter}
      />

      {/* Available Gifts */}
      <GiftList
        gifts={availableGifts}
        title="Available Gifts"
        onMarkAsPurchased={markAsPurchased}
      />

      {/* Purchased Gifts */}
      <GiftList
        gifts={purchasedGifts}
        title="Already Purchased - Thank You! 💖"
        isPurchasedList={true}
        onMarkAsPurchased={markAsPurchased}
      />

      {/* Empty State */}
      {filteredGifts.length === 0 && (
        <GiftList
          gifts={[]}
          title=""
          emptyMessage="No gifts found in this category."
          onMarkAsPurchased={markAsPurchased}
        />
      )}
    </div>
  );
};

export default GiftRegistry;