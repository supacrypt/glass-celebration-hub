export interface GiftItem {
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

export interface GiftFormData {
  title: string;
  description: string;
  price: string;
  store_url: string;
  category: string;
  priority: number;
  image_url: string;
}

export const categories = [
  { value: 'kitchen', label: 'Kitchen' },
  { value: 'bedroom', label: 'Bedroom' },
  { value: 'entertaining', label: 'Entertaining' },
  { value: 'experiences', label: 'Experiences' },
  { value: 'outdoor', label: 'Outdoor' },
  { value: 'general', label: 'General' }
];

export const priorities = [
  { value: 1, label: 'High Priority', color: 'bg-red-100 text-red-800' },
  { value: 2, label: 'Medium Priority', color: 'bg-yellow-100 text-yellow-800' },
  { value: 3, label: 'Low Priority', color: 'bg-green-100 text-green-800' }
];