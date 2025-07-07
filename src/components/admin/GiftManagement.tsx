import React, { useState, useEffect } from 'react';
import { Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { GiftForm, GiftGrid, EmptyGiftsState } from './gift-management';
import { GiftItem, GiftFormData } from './gift-management/types';

const GiftManagement: React.FC = () => {
  const [gifts, setGifts] = useState<GiftItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingGift, setEditingGift] = useState<GiftItem | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [formData, setFormData] = useState<GiftFormData>({
    title: '',
    description: '',
    price: '',
    store_url: '',
    category: 'kitchen',
    priority: 2,
    image_url: ''
  });
  const { toast } = useToast();

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
        description: "Failed to load gifts",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      const giftData = {
        title: formData.title,
        description: formData.description || null,
        price: formData.price ? parseFloat(formData.price) : null,
        store_url: formData.store_url || null,
        category: formData.category,
        priority: formData.priority,
        image_url: formData.image_url || null
      };

      if (editingGift) {
        const { error } = await supabase
          .from('gift_registry')
          .update(giftData)
          .eq('id', editingGift.id);

        if (error) throw error;
        
        toast({
          title: "Success",
          description: "Gift updated successfully"
        });
      } else {
        const { error } = await supabase
          .from('gift_registry')
          .insert([giftData]);

        if (error) throw error;
        
        toast({
          title: "Success",
          description: "Gift added successfully"
        });
      }

      setIsDialogOpen(false);
      resetForm();
      fetchGifts();
    } catch (error) {
      console.error('Error saving gift:', error);
      toast({
        title: "Error",
        description: "Failed to save gift",
        variant: "destructive"
      });
    }
  };

  const handleDelete = async (giftId: string) => {
    if (!confirm('Are you sure you want to delete this gift?')) return;

    try {
      const { error } = await supabase
        .from('gift_registry')
        .delete()
        .eq('id', giftId);

      if (error) throw error;
      
      toast({
        title: "Success",
        description: "Gift deleted successfully"
      });
      
      fetchGifts();
    } catch (error) {
      console.error('Error deleting gift:', error);
      toast({
        title: "Error",
        description: "Failed to delete gift",
        variant: "destructive"
      });
    }
  };

  const handleEdit = (gift: GiftItem) => {
    setEditingGift(gift);
    setFormData({
      title: gift.title,
      description: gift.description || '',
      price: gift.price?.toString() || '',
      store_url: gift.store_url || '',
      category: gift.category,
      priority: gift.priority,
      image_url: gift.image_url || ''
    });
    setIsDialogOpen(true);
  };

  const resetForm = () => {
    setEditingGift(null);
    setFormData({
      title: '',
      description: '',
      price: '',
      store_url: '',
      category: 'kitchen',
      priority: 2,
      image_url: ''
    });
  };

  const handleOpenDialog = () => {
    resetForm();
    setIsDialogOpen(true);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-wedding-navy"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-wedding-navy">Gift Registry Management</h2>
        <Button onClick={handleOpenDialog} className="bg-wedding-navy hover:bg-wedding-navy-light">
          <Plus className="w-4 h-4 mr-2" />
          Add Gift
        </Button>
      </div>

      <GiftForm
        isOpen={isDialogOpen}
        onClose={() => setIsDialogOpen(false)}
        editingGift={editingGift}
        formData={formData}
        setFormData={setFormData}
        onSubmit={handleSubmit}
      />

      {gifts.length === 0 ? (
        <EmptyGiftsState onAddFirst={handleOpenDialog} />
      ) : (
        <GiftGrid
          gifts={gifts}
          onEdit={handleEdit}
          onDelete={handleDelete}
        />
      )}
    </div>
  );
};

export default GiftManagement;