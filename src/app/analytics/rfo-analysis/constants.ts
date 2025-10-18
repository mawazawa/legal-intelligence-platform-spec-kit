import { TrendingUp, Calculator, Calendar, Mail, DollarSign } from 'lucide-react';
import { TabId } from './types';

export const TYPE_COLORS = {
  court_order: 'bg-purple-100 text-purple-700 border-purple-300',
  settlement_stmt: 'bg-blue-100 text-blue-700 border-blue-300',
  rfo: 'bg-red-100 text-red-700 border-red-300',
  email: 'bg-green-100 text-green-700 border-green-300',
  roa: 'bg-yellow-100 text-yellow-700 border-yellow-300',
  declaration: 'bg-indigo-100 text-indigo-700 border-indigo-300',
  exhibit: 'bg-pink-100 text-pink-700 border-pink-300'
} as const;

export const TAB_CONFIG = [
  { id: 'overview' as TabId, label: 'Overview', icon: TrendingUp },
  { id: 'mathematical' as TabId, label: 'Mathematical Errors', icon: Calculator },
  { id: 'timeline' as TabId, label: 'Timeline Analysis', icon: Calendar },
  { id: 'communications' as TabId, label: 'Communications', icon: Mail },
  { id: 'financial' as TabId, label: 'Financial Claims', icon: DollarSign }
];
