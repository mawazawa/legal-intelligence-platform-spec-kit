import type { ReactNode } from 'react';

export interface Person {
  name: string;
  role: string;
  organization?: string;
  email?: string;
  phone?: string;
  address?: string;
  status?: 'active' | 'resolved' | 'pending' | 'critical';
  description?: string;
  icon: ReactNode;
  category: 'party' | 'legal' | 'buyer' | 'vendor' | 'other';
}

export interface PersonsOfInterestProps {
  showCategories?: string[];
  compact?: boolean;
}

export interface Category {
  id: string;
  title: string;
  icon: ReactNode;
}
