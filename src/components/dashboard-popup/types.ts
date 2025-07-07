import { LucideIcon } from 'lucide-react';

export interface DashboardPopupProps {
  isOpen: boolean;
  onClose: () => void;
  userRole: 'guest' | 'admin' | 'couple';
}

export interface TabItem {
  id: string;
  label: string;
  icon: LucideIcon;
}

export interface StatItem {
  label: string;
  value: string;
  total?: string;
  icon: LucideIcon;
  color?: string;
}

export interface ActivityItem {
  icon: string;
  text: string;
  time: string;
}