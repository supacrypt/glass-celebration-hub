import React, { useState, useEffect } from 'react';
import { Plus, Edit, Trash2, Gift, ShoppingCart } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

interface GiftItem {
  id: string;
  title: string;
  description?: string;
  price?: number;
  category: string;
  is_purchased: boolean;
  purchased_by?: string;
  image_url?: string;
}

const CompactGiftManagement: React.FC = () => {
  const [gifts, setGifts] = useState<GiftItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingGift, setEditingGift] = useState<GiftItem | null>(null);
  const { toast } = useToast();

  const [formData, setFormData] = useState({
    title: '',
    description: '',
    price: '',
    category: 'general',
    image_url: ''
  });

  useEffect(() => {
    fetchGifts();
  }, []);

  const fetchGifts = async () => {
    try {
      const { data, error } = await supabase
        .from('gift_registry')
        .select('*')
        .order('created_at', { ascending: false });

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
        category: formData.category,
        image_url: formData.image_url || null,
      };

      if (editingGift) {
        const { error } = await supabase
          .from('gift_registry')
          .update(giftData)
          .eq('id', editingGift.id);
        
        if (error) throw error;
        toast({ title: "Success", description: "Gift updated successfully" });
      } else {
        const { error } = await supabase
          .from('gift_registry')
          .insert([giftData]);
        
        if (error) throw error;
        toast({ title: "Success", description: "Gift added successfully" });
      }

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

  const deleteGift = async (id: string) => {
    try {
      const { error } = await supabase
        .from('gift_registry')
        .delete()
        .eq('id', id);

      if (error) throw error;
      
      toast({ title: "Success", description: "Gift deleted successfully" });
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

  const resetForm = () => {
    setFormData({ title: '', description: '', price: '', category: 'general', image_url: '' });
    setEditingGift(null);
    setShowForm(false);
  };

  const editGift = (gift: GiftItem) => {
    setFormData({
      title: gift.title,
      description: gift.description || '',
      price: gift.price?.toString() || '',
      category: gift.category,
      image_url: gift.image_url || ''
    });
    setEditingGift(gift);
    setShowForm(true);
  };

  const categories = ['general', 'kitchen', 'bedroom', 'bathroom', 'living room', 'outdoor'];
  const purchasedCount = gifts.filter(g => g.is_purchased).length;
  const totalValue = gifts.reduce((sum, g) => sum + (g.price || 0), 0);

  if (loading) {
    return <div className="text-center py-4">Loading gifts...</div>;
  }

  return (
    <div className="space-y-4">
      {/* Quick Stats */}
      <div className="grid grid-cols-3 gap-2">
        <div className="glass-card p-3 text-center">
          <Gift className="w-4 h-4 mx-auto text-glass-purple mb-1" />
          <div className="text-sm font-semibold">{gifts.length}</div>
          <div className="text-xs text-muted-foreground">Total</div>
        </div>
        <div className="glass-card p-3 text-center">
          <ShoppingCart className="w-4 h-4 mx-auto text-glass-green mb-1" />
          <div className="text-sm font-semibold">{purchasedCount}</div>
          <div className="text-xs text-muted-foreground">Purchased</div>
        </div>
        <div className="glass-card p-3 text-center">
          <div className="text-sm font-semibold">${totalValue.toFixed(0)}</div>
          <div className="text-xs text-muted-foreground">Total Value</div>
        </div>
      </div>

      {/* Add/Edit Form */}
      {showForm && (
        <div className="glass-card p-4 space-y-3">
          <div className="flex items-center justify-between">
            <h4 className="text-sm font-medium">{editingGift ? 'Edit' : 'Add'} Gift</h4>
            <Button variant="outline" size="sm" onClick={resetForm}>Cancel</Button>
          </div>
          
          <form onSubmit={handleSubmit} className="space-y-3">
            <Input
              placeholder="Gift title"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              required
              className="text-sm"
            />
            
            <div className="grid grid-cols-2 gap-2">
              <Input
                placeholder="Price ($)"
                type="number"
                step="0.01"
                value={formData.price}
                onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                className="text-sm"
              />
              
              <select
                value={formData.category}
                onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
              >
                {categories.map(cat => (
                  <option key={cat} value={cat}>{cat}</option>
                ))}
              </select>
            </div>
            
            <Button type="submit" size="sm" className="w-full">
              {editingGift ? 'Update' : 'Add'} Gift
            </Button>
          </form>
        </div>
      )}

      {/* Add Button */}
      {!showForm && (
        <Button 
          onClick={() => setShowForm(true)} 
          size="sm" 
          className="w-full"
        >
          <Plus className="w-4 h-4 mr-2" />
          Add Gift
        </Button>
      )}

      {/* Gift List */}
      <div className="space-y-2 max-h-72 overflow-y-auto">
        {gifts.slice(0, 8).map((gift) => (
          <div key={gift.id} className="glass-card p-3">
            <div className="flex items-center justify-between">
              <div className="flex-1 min-w-0">
                <div className="flex items-center space-x-2">
                  <div className="text-sm font-medium text-wedding-navy truncate">
                    {gift.title}
                  </div>
                  <Badge variant={gift.is_purchased ? "secondary" : "outline"}>
                    {gift.category}
                  </Badge>
                </div>
                <div className="flex items-center space-x-2 mt-1">
                  {gift.price && (
                    <span className="text-xs text-muted-foreground">
                      ${gift.price}
                    </span>
                  )}
                  {gift.is_purchased && (
                    <Badge variant="secondary" className="text-xs">Purchased</Badge>
                  )}
                </div>
              </div>
              
              <div className="flex space-x-1 flex-shrink-0">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => editGift(gift)}
                  className="text-xs px-2 py-1 h-6"
                >
                  <Edit className="w-3 h-3" />
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => deleteGift(gift.id)}
                  className="text-xs px-2 py-1 h-6"
                >
                  <Trash2 className="w-3 h-3" />
                </Button>
              </div>
            </div>
          </div>
        ))}
        
        {gifts.length > 8 && (
          <div className="text-center text-xs text-muted-foreground">
            Showing 8 of {gifts.length} gifts
          </div>
        )}
      </div>
    </div>
  );
};

export default CompactGiftManagement;