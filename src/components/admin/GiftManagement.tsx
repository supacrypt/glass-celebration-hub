import React, { useState, useEffect } from 'react';
import { Plus, Edit, Trash2, ExternalLink, DollarSign, Package } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { useStorage } from '@/hooks/useStorage';

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

interface GiftFormData {
  title: string;
  description: string;
  price: string;
  store_url: string;
  category: string;
  priority: number;
}

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
    priority: 2
  });
  
  const { toast } = useToast();
  const { uploadGiftImage, uploading } = useStorage();

  const categories = [
    { value: 'kitchen', label: 'Kitchen' },
    { value: 'bedroom', label: 'Bedroom' },
    { value: 'entertaining', label: 'Entertaining' },
    { value: 'experiences', label: 'Experiences' },
    { value: 'outdoor', label: 'Outdoor' },
    { value: 'general', label: 'General' }
  ];

  const priorities = [
    { value: 1, label: 'High Priority', color: 'bg-red-100 text-red-800' },
    { value: 2, label: 'Medium Priority', color: 'bg-yellow-100 text-yellow-800' },
    { value: 3, label: 'Low Priority', color: 'bg-green-100 text-green-800' }
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
        priority: formData.priority
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
      priority: gift.priority
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
      priority: 2
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
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button onClick={handleOpenDialog} className="bg-wedding-navy hover:bg-wedding-navy-light">
              <Plus className="w-4 h-4 mr-2" />
              Add Gift
            </Button>
          </DialogTrigger>
          
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle>
                {editingGift ? 'Edit Gift' : 'Add New Gift'}
              </DialogTitle>
            </DialogHeader>
            
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <Label htmlFor="title">Title *</Label>
                <Input
                  id="title"
                  value={formData.title}
                  onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                  required
                />
              </div>
              
              <div>
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  value={formData.description}
                  onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                  rows={3}
                />
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="price">Price</Label>
                  <Input
                    id="price"
                    type="number"
                    step="0.01"
                    value={formData.price}
                    onChange={(e) => setFormData(prev => ({ ...prev, price: e.target.value }))}
                    placeholder="0.00"
                  />
                </div>
                
                <div>
                  <Label htmlFor="category">Category</Label>
                  <Select
                    value={formData.category}
                    onValueChange={(value) => setFormData(prev => ({ ...prev, category: value }))}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {categories.map(category => (
                        <SelectItem key={category.value} value={category.value}>
                          {category.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
              
              <div>
                <Label htmlFor="store_url">Store URL</Label>
                <Input
                  id="store_url"
                  type="url"
                  value={formData.store_url}
                  onChange={(e) => setFormData(prev => ({ ...prev, store_url: e.target.value }))}
                  placeholder="https://..."
                />
              </div>
              
              <div>
                <Label htmlFor="priority">Priority</Label>
                <Select
                  value={formData.priority.toString()}
                  onValueChange={(value) => setFormData(prev => ({ ...prev, priority: parseInt(value) }))}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {priorities.map(priority => (
                      <SelectItem key={priority.value} value={priority.value.toString()}>
                        {priority.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              
              <div className="flex justify-end space-x-2 pt-4">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setIsDialogOpen(false)}
                >
                  Cancel
                </Button>
                <Button type="submit" className="bg-wedding-navy hover:bg-wedding-navy-light">
                  {editingGift ? 'Update Gift' : 'Add Gift'}
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {gifts.map((gift) => {
          const priorityInfo = priorities.find(p => p.value === gift.priority);
          
          return (
            <Card key={gift.id} className={`${gift.is_purchased ? 'opacity-60' : ''}`}>
              <CardHeader className="pb-3">
                <div className="flex justify-between items-start">
                  <CardTitle className="text-lg line-clamp-2">
                    {gift.title}
                  </CardTitle>
                  <div className="flex space-x-1">
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => handleEdit(gift)}
                    >
                      <Edit className="w-4 h-4" />
                    </Button>
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => handleDelete(gift.id)}
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
        })}
      </div>

      {gifts.length === 0 && (
        <Card className="p-8 text-center">
          <Package className="w-12 h-12 mx-auto mb-4 text-muted-foreground" />
          <h3 className="text-lg font-semibold mb-2">No gifts yet</h3>
          <p className="text-muted-foreground mb-4">
            Start building your gift registry by adding items.
          </p>
          <Button onClick={handleOpenDialog} className="bg-wedding-navy hover:bg-wedding-navy-light">
            <Plus className="w-4 h-4 mr-2" />
            Add First Gift
          </Button>
        </Card>
      )}
    </div>
  );
};

export default GiftManagement;