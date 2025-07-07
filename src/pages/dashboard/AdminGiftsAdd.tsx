import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Save, X } from 'lucide-react';
import GlassCard from '@/components/GlassCard';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import ImageUpload from '@/components/gift-registry/ImageUpload';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

const AdminGiftsAdd: React.FC = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    price: '',
    category: 'general',
    priority: '3',
    store_url: '',
    image_url: ''
  });

  const categories = [
    { value: 'general', label: 'General' },
    { value: 'home', label: 'Home & Kitchen' },
    { value: 'travel', label: 'Travel' },
    { value: 'experience', label: 'Experience' },
    { value: 'charity', label: 'Charity' }
  ];

  const priorities = [
    { value: '1', label: 'High Priority' },
    { value: '2', label: 'Medium Priority' },
    { value: '3', label: 'Low Priority' }
  ];

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleImageUpload = (imageUrl: string) => {
    setFormData(prev => ({ ...prev, image_url: imageUrl }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.title.trim()) {
      toast({
        title: "Error",
        description: "Gift title is required",
        variant: "destructive",
      });
      return;
    }

    setLoading(true);
    
    try {
      const { error } = await supabase
        .from('gift_registry')
        .insert({
          title: formData.title.trim(),
          description: formData.description.trim() || null,
          price: formData.price ? parseFloat(formData.price) : null,
          category: formData.category,
          priority: parseInt(formData.priority),
          store_url: formData.store_url.trim() || null,
          image_url: formData.image_url || null
        });

      if (error) throw error;

      toast({
        title: "Success!",
        description: "Gift added to registry successfully",
      });

      navigate('/dashboard/gifts');
    } catch (error: any) {
      console.error('Error adding gift:', error);
      toast({
        title: "Error",
        description: error.message || "Failed to add gift",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen px-5 pt-12 pb-6">
      {/* Header */}
      <div className="flex items-center gap-4 mb-6">
        <button
          onClick={() => navigate('/dashboard/gifts')}
          className="w-10 h-10 rounded-full bg-white/20 hover:bg-white/30 flex items-center justify-center transition-colors"
        >
          <ArrowLeft className="w-5 h-5 text-[#7a736b]" />
        </button>
        <div>
          <h1 className="text-2xl font-semibold text-[#2d3f51]">Add New Gift</h1>
          <p className="text-sm text-[#7a736b]">Add a new item to the gift registry</p>
        </div>
      </div>

      {/* Form */}
      <GlassCard className="p-6 max-w-2xl">
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Title */}
          <div className="space-y-2">
            <Label htmlFor="title">Gift Title *</Label>
            <Input
              id="title"
              value={formData.title}
              onChange={(e) => handleInputChange('title', e.target.value)}
              placeholder="Enter gift title"
              required
            />
          </div>

          {/* Description */}
          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              value={formData.description}
              onChange={(e) => handleInputChange('description', e.target.value)}
              placeholder="Enter gift description"
              rows={3}
            />
          </div>

          {/* Price and Category Row */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="price">Price</Label>
              <Input
                id="price"
                type="number"
                step="0.01"
                value={formData.price}
                onChange={(e) => handleInputChange('price', e.target.value)}
                placeholder="0.00"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="category">Category</Label>
              <Select value={formData.category} onValueChange={(value) => handleInputChange('category', value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Select category" />
                </SelectTrigger>
                <SelectContent>
                  {categories.map((category) => (
                    <SelectItem key={category.value} value={category.value}>
                      {category.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Priority and Store URL Row */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="priority">Priority</Label>
              <Select value={formData.priority} onValueChange={(value) => handleInputChange('priority', value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Select priority" />
                </SelectTrigger>
                <SelectContent>
                  {priorities.map((priority) => (
                    <SelectItem key={priority.value} value={priority.value}>
                      {priority.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="store_url">Store URL</Label>
              <Input
                id="store_url"
                type="url"
                value={formData.store_url}
                onChange={(e) => handleInputChange('store_url', e.target.value)}
                placeholder="https://store.example.com/item"
              />
            </div>
          </div>

          {/* Image Upload */}
          <div className="space-y-2">
            <Label>Gift Image</Label>
          <ImageUpload
            onImageUploaded={handleImageUpload}
            currentImageUrl={formData.image_url}
          />
          </div>

          {/* Form Actions */}
          <div className="flex gap-3 pt-4">
            <Button 
              type="submit" 
              disabled={loading}
              className="bg-wedding-navy hover:bg-wedding-navy-light flex-1"
            >
              <Save className="w-4 h-4 mr-2" />
              {loading ? 'Adding...' : 'Add Gift'}
            </Button>
            <Button 
              type="button" 
              variant="outline" 
              onClick={() => navigate('/dashboard/gifts')}
              disabled={loading}
            >
              <X className="w-4 h-4 mr-2" />
              Cancel
            </Button>
          </div>
        </form>
      </GlassCard>
    </div>
  );
};

export default AdminGiftsAdd;