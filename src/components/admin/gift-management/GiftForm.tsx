import React from 'react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import ImageUpload from '@/components/gift-registry/ImageUpload';
import { GiftItem, GiftFormData, categories, priorities } from './types';

interface GiftFormProps {
  isOpen: boolean;
  onClose: () => void;
  editingGift: GiftItem | null;
  formData: GiftFormData;
  setFormData: React.Dispatch<React.SetStateAction<GiftFormData>>;
  onSubmit: (e: React.FormEvent) => void;
}

const GiftForm: React.FC<GiftFormProps> = ({
  isOpen,
  onClose,
  editingGift,
  formData,
  setFormData,
  onSubmit
}) => {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>
            {editingGift ? 'Edit Gift' : 'Add New Gift'}
          </DialogTitle>
        </DialogHeader>
        
        <form onSubmit={onSubmit} className="space-y-4">
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
          
          <div>
            <Label>Gift Image</Label>
            <ImageUpload
              onImageUploaded={(imageUrl) => setFormData(prev => ({ ...prev, image_url: imageUrl }))}
              currentImageUrl={formData.image_url}
              onImageRemoved={() => setFormData(prev => ({ ...prev, image_url: '' }))}
            />
          </div>
          
          <div className="flex justify-end space-x-2 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
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
  );
};

export default GiftForm;