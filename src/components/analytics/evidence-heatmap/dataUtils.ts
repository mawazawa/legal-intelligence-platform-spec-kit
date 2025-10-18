import { HeatmapData, GroupedData } from './types';
import { STRENGTH_VALUES } from './constants';

export const getStrengthValue = (strength: string): number => {
  return STRENGTH_VALUES[strength as keyof typeof STRENGTH_VALUES] ?? STRENGTH_VALUES.default;
};

export const transformEvidenceData = (evidenceData: any[]): HeatmapData[] => {
  return evidenceData.map((item) => ({
    id: item.id,
    category: item.category,
    subcategory: item.type,
    strength: item.strength,
    value: getStrengthValue(item.strength),
    evidence: [item.title],
    verified: item.verified,
    date: new Date().toISOString().split('T')[0],
    source: item.source,
    tags: item.tags,
  }));
};

export const filterHeatmapData = (
  data: HeatmapData[],
  searchTerm: string,
  filterStrength: string,
  filterCategory: string
): HeatmapData[] => {
  return data.filter(item => {
    const matchesSearch = item.evidence.some(e =>
      e.toLowerCase().includes(searchTerm.toLowerCase())
    ) || item.tags.some(tag =>
      tag.toLowerCase().includes(searchTerm.toLowerCase())
    );
    const matchesStrength = filterStrength === 'all' || item.strength === filterStrength;
    const matchesCategory = filterCategory === 'all' || item.category === filterCategory;
    return matchesSearch && matchesStrength && matchesCategory;
  });
};

export const groupHeatmapData = (data: HeatmapData[]): Record<string, GroupedData> => {
  return data.reduce((acc, item) => {
    const key = `${item.category}-${item.subcategory}`;
    if (!acc[key]) {
      acc[key] = {
        category: item.category,
        subcategory: item.subcategory,
        items: [],
        totalValue: 0,
        verifiedCount: 0,
        totalCount: 0,
      };
    }
    acc[key].items.push(item);
    acc[key].totalValue += item.value;
    acc[key].totalCount += 1;
    if (item.verified) acc[key].verifiedCount += 1;
    return acc;
  }, {} as Record<string, GroupedData>);
};

export const extractCategories = (data: HeatmapData[]): string[] => {
  return [...new Set(data.map(d => d.category))];
};

export const extractSubcategories = (data: HeatmapData[]): string[] => {
  return [...new Set(data.map(d => d.subcategory))];
};
