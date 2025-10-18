import { CaseFile } from '../types';
import { Scale, FileText, DollarSign, User, ExternalLink } from 'lucide-react';

export const getFileIcon = (type: CaseFile['type']) => {
  const iconMap: Record<CaseFile['type'], { icon: typeof FileText; color: string }> = {
    judgment: { icon: Scale, color: 'text-purple-600' },
    rfo: { icon: FileText, color: 'text-red-600' },
    fl320: { icon: FileText, color: 'text-blue-600' },
    exhibit: { icon: ExternalLink, color: 'text-green-600' },
    evidence: { icon: FileText, color: 'text-blue-700' },
    financial: { icon: DollarSign, color: 'text-yellow-600' },
    email: { icon: User, color: 'text-gray-600' },
    other: { icon: FileText, color: 'text-gray-500' }
  };

  const { icon: Icon, color } = iconMap[type];
  return <Icon className={`h-4 w-4 ${color}`} />;
};

export const getRelevanceColor = (relevance: CaseFile['relevance']) => {
  const colorMap = {
    critical: 'bg-red-100 text-red-800 border-red-200',
    important: 'bg-yellow-100 text-yellow-800 border-yellow-200',
    supporting: 'bg-blue-100 text-blue-800 border-blue-200',
    reference: 'bg-gray-100 text-gray-800 border-gray-200'
  };

  return colorMap[relevance] || colorMap.reference;
};

export const groupFilesByCategory = (files: CaseFile[]): Record<string, CaseFile[]> => {
  const groups: Record<string, CaseFile[]> = {};
  files.forEach(file => {
    if (!groups[file.category]) {
      groups[file.category] = [];
    }
    groups[file.category].push(file);
  });
  return groups;
};

export const filterFiles = (
  files: CaseFile[],
  searchQuery: string,
  selectedCategory: string,
  selectedType: string
): CaseFile[] => {
  return files.filter(file => {
    const matchesSearch = !searchQuery ||
      file.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      file.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase())) ||
      file.description.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesCategory = selectedCategory === 'all' || file.category === selectedCategory;
    const matchesType = selectedType === 'all' || file.type === selectedType;

    return matchesSearch && matchesCategory && matchesType;
  });
};
