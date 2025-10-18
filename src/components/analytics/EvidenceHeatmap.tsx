"use client";

import React, { useState, useEffect, useRef } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  BarChart3,
  TrendingUp,
  Activity,
  Target,
  Zap,
  Flame,
  Rocket,
  Star,
  Crown,
  Diamond,
  Sparkles,
  Award,
  Trophy,
  Calendar,
  Clock,
  DollarSign,
  Scale,
  Gavel,
  FileText,
  Users,
  Building,
  CreditCard,
  Receipt,
  Landmark,
  Banknote,
  Percent,
  Home,
  User,
  Mail,
  Phone,
  MapPin,
  Hash,
  Flag,
  Shield,
  Eye,
  EyeOff,
  Filter,
  Search,
  Download,
  Settings,
  Layers,
  RotateCcw,
  ZoomIn,
  ZoomOut,
  Maximize,
  Minimize,
  Grid,
  Table,
  List,
  Grid3X3,
  Square,
  Circle,
  Triangle,
  Hexagon,
  Octagon,
  Pentagon,
  Heart,
  Smile,
  Frown,
  Meh,
  ThumbsUp,
  ThumbsDown,
  Check,
  X,
  Plus,
  Minus,
  Equal,
  Divide,
  Calculator,
  PieChart,
  LineChart,
  AreaChart,
  ScatterChart,
  CandlestickChart
} from 'lucide-react';

interface HeatmapData {
  id: string;
  category: string;
  subcategory: string;
  strength: 'weak' | 'moderate' | 'strong' | 'airtight';
  value: number;
  evidence: string[];
  verified: boolean;
  date: string;
  source: string;
  tags: string[];
}

interface EvidenceHeatmapProps {
  evidenceData?: any[];
  onCellClick?: (data: HeatmapData) => void;
}

const EvidenceHeatmap: React.FC<EvidenceHeatmapProps> = ({
  evidenceData,
  onCellClick
}) => {
  const [heatmapData, setHeatmapData] = useState<HeatmapData[]>([]);
  const [selectedCell, setSelectedCell] = useState<HeatmapData | null>(null);
  const [viewMode, setViewMode] = useState<'strength' | 'category' | 'timeline' | 'verified'>('strength');
  const [showLabels, setShowLabels] = useState(true);
  const [showValues, setShowValues] = useState(true);
  const [colorScheme, setColorScheme] = useState<'red-blue' | 'green-red' | 'blue-yellow' | 'purple-orange'>('red-blue');
  const [filterStrength, setFilterStrength] = useState<string>('all');
  const [filterCategory, setFilterCategory] = useState<string>('all');
  const [searchTerm, setSearchTerm] = useState<string>('');

  // Initialize heatmap data
  useEffect(() => {
    if (!evidenceData) return;
    
    const data: HeatmapData[] = evidenceData.map((item) => ({
      id: item.id,
      category: item.category,
      subcategory: item.type,
      strength: item.strength,
      value: getStrengthValue(item.strength),
      evidence: [item.title],
      verified: item.verified,
      date: new Date().toISOString().split('T')[0],
      source: item.source,
      tags: item.tags
    }));

    setHeatmapData(data);
  }, [evidenceData]);

  const getStrengthValue = (strength: string) => {
    switch (strength) {
      case 'airtight': return 4;
      case 'strong': return 3;
      case 'moderate': return 2;
      case 'weak': return 1;
      default: return 0;
    }
  };

  const getStrengthColor = (strength: string) => {
    switch (strength) {
      case 'airtight': return '#059669'; // emerald-600
      case 'strong': return '#0d9488'; // teal-600
      case 'moderate': return '#0891b2'; // cyan-600
      case 'weak': return '#0284c7'; // sky-600
      default: return '#6b7280'; // gray-500
    }
  };

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'petitioner': return '#dc2626'; // red-600
      case 'respondent': return '#059669'; // emerald-600
      case 'neutral': return '#6b7280'; // gray-500
      case 'legal': return '#7c3aed'; // violet-600
      case 'financial': return '#d97706'; // amber-600
      case 'timeline': return '#0891b2'; // cyan-600
      default: return '#6b7280';
    }
  };

  const getTimelineColor = (date: string) => {
    const daysSince = Math.floor((Date.now() - new Date(date).getTime()) / (1000 * 60 * 60 * 24));
    if (daysSince < 7) return '#059669'; // emerald-600
    if (daysSince < 30) return '#0d9488'; // teal-600
    if (daysSince < 90) return '#0891b2'; // cyan-600
    return '#0284c7'; // sky-600
  };

  const getVerifiedColor = (verified: boolean) => {
    return verified ? '#059669' : '#dc2626'; // emerald-600 : red-600
  };

  const getCellColor = (data: HeatmapData) => {
    switch (viewMode) {
      case 'strength': return getStrengthColor(data.strength);
      case 'category': return getCategoryColor(data.category);
      case 'timeline': return getTimelineColor(data.date);
      case 'verified': return getVerifiedColor(data.verified);
      default: return getStrengthColor(data.strength);
    }
  };

  const getCellIntensity = (data: HeatmapData) => {
    switch (viewMode) {
      case 'strength': return data.value / 4;
      case 'category': return 1;
      case 'timeline': return 1;
      case 'verified': return data.verified ? 1 : 0.5;
      default: return data.value / 4;
    }
  };

  const filteredData = heatmapData.filter(data => {
    const matchesSearch = data.evidence.some(e => e.toLowerCase().includes(searchTerm.toLowerCase())) ||
                         data.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()));
    const matchesStrength = filterStrength === 'all' || data.strength === filterStrength;
    const matchesCategory = filterCategory === 'all' || data.category === filterCategory;
    return matchesSearch && matchesStrength && matchesCategory;
  });

  // Group data for heatmap display
  const groupedData = filteredData.reduce((acc, data) => {
    const key = `${data.category}-${data.subcategory}`;
    if (!acc[key]) {
      acc[key] = {
        category: data.category,
        subcategory: data.subcategory,
        items: [],
        totalValue: 0,
        verifiedCount: 0,
        totalCount: 0
      };
    }
    acc[key].items.push(data);
    acc[key].totalValue += data.value;
    acc[key].totalCount += 1;
    if (data.verified) acc[key].verifiedCount += 1;
    return acc;
  }, {} as Record<string, any>);

  const categories = [...new Set(filteredData.map(d => d.category))];
  const subcategories = [...new Set(filteredData.map(d => d.subcategory))];

  const exportHeatmap = () => {
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    canvas.width = 800;
    canvas.height = 600;

    // Draw heatmap
    const cellWidth = canvas.width / subcategories.length;
    const cellHeight = canvas.height / categories.length;

    categories.forEach((category, categoryIndex) => {
      subcategories.forEach((subcategory, subcategoryIndex) => {
        const key = `${category}-${subcategory}`;
        const groupData = groupedData[key];
        
        if (groupData) {
          const color = getCellColor(groupData.items[0]);
          const intensity = getCellIntensity(groupData.items[0]);
          
          ctx.fillStyle = color;
          ctx.globalAlpha = intensity;
          ctx.fillRect(
            subcategoryIndex * cellWidth,
            categoryIndex * cellHeight,
            cellWidth,
            cellHeight
          );
          
          ctx.globalAlpha = 1;
          ctx.strokeStyle = '#ffffff';
          ctx.lineWidth = 1;
          ctx.strokeRect(
            subcategoryIndex * cellWidth,
            categoryIndex * cellHeight,
            cellWidth,
            cellHeight
          );
        }
      });
    });

    // Export
    const link = document.createElement('a');
    link.download = 'evidence-heatmap.png';
    link.href = canvas.toDataURL();
    link.click();
  };

  return (
    <div className="space-y-4">
      {/* Controls */}
      <div className="flex flex-wrap items-center gap-4 p-4 bg-white rounded-lg border">
        <div className="flex items-center gap-2">
          <Button
            variant={viewMode === 'strength' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setViewMode('strength')}
          >
            <Target className="h-4 w-4" />
            Strength
          </Button>
          <Button
            variant={viewMode === 'category' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setViewMode('category')}
          >
            <BarChart3 className="h-4 w-4" />
            Category
          </Button>
          <Button
            variant={viewMode === 'timeline' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setViewMode('timeline')}
          >
            <Calendar className="h-4 w-4" />
            Timeline
          </Button>
          <Button
            variant={viewMode === 'verified' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setViewMode('verified')}
          >
            <Check className="h-4 w-4" />
            Verified
          </Button>
        </div>

        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setShowLabels(!showLabels)}
          >
            {showLabels ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
            Labels
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => setShowValues(!showValues)}
          >
            {showValues ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
            Values
          </Button>
        </div>

        <select
          value={filterStrength}
          onChange={(e) => setFilterStrength(e.target.value)}
          className="px-3 py-1 border border-slate-300 rounded text-sm"
        >
          <option value="all">All Strengths</option>
          <option value="airtight">Airtight</option>
          <option value="strong">Strong</option>
          <option value="moderate">Moderate</option>
          <option value="weak">Weak</option>
        </select>

        <select
          value={filterCategory}
          onChange={(e) => setFilterCategory(e.target.value)}
          className="px-3 py-1 border border-slate-300 rounded text-sm"
        >
          <option value="all">All Categories</option>
          <option value="petitioner">Petitioner</option>
          <option value="respondent">Respondent</option>
          <option value="neutral">Neutral</option>
          <option value="legal">Legal</option>
          <option value="financial">Financial</option>
          <option value="timeline">Timeline</option>
        </select>

        <div className="flex-1 min-w-64">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-slate-400" />
            <input
              type="text"
              placeholder="Search evidence..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-1 border border-slate-300 rounded text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
        </div>

        <Button
          variant="outline"
          size="sm"
          onClick={exportHeatmap}
        >
          <Download className="h-4 w-4" />
          Export
        </Button>
      </div>

      {/* Heatmap Grid */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Grid className="h-5 w-5" />
            Evidence Heatmap - {viewMode.charAt(0).toUpperCase() + viewMode.slice(1)} View
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <div className="min-w-full">
              {/* Header Row */}
              <div className="flex border-b border-slate-200">
                <div className="w-32 p-2 font-semibold text-sm bg-slate-50"></div>
                {subcategories.map((subcategory) => (
                  <div key={subcategory} className="w-24 p-2 text-center font-semibold text-sm bg-slate-50">
                    {subcategory}
                  </div>
                ))}
              </div>

              {/* Data Rows */}
              {categories.map((category) => (
                <div key={category} className="flex border-b border-slate-200">
                  <div className="w-32 p-2 font-semibold text-sm bg-slate-50">
                    {category}
                  </div>
                  {subcategories.map((subcategory) => {
                    const key = `${category}-${subcategory}`;
                    const groupData = groupedData[key];
                    
                    if (groupData) {
                      const color = getCellColor(groupData.items[0]);
                      const intensity = getCellIntensity(groupData.items[0]);
                      
                      return (
                        <div
                          key={subcategory}
                          className="w-24 h-16 p-1 cursor-pointer hover:opacity-80 transition-opacity"
                          style={{
                            backgroundColor: color,
                            opacity: intensity
                          }}
                          onClick={() => {
                            setSelectedCell(groupData.items[0]);
                            onCellClick?.(groupData.items[0]);
                          }}
                        >
                          {showLabels && (
                            <div className="text-xs text-white font-semibold text-center">
                              {category}
                            </div>
                          )}
                          {showValues && (
                            <div className="text-xs text-white text-center">
                              {groupData.totalCount}
                            </div>
                          )}
                        </div>
                      );
                    }
                    
                    return (
                      <div
                        key={subcategory}
                        className="w-24 h-16 p-1 bg-slate-100 border border-slate-200"
                      >
                        <div className="text-xs text-slate-400 text-center">-</div>
                      </div>
                    );
                  })}
                </div>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Legend */}
      <Card>
        <CardHeader>
          <CardTitle className="text-sm">Legend</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
            {viewMode === 'strength' && (
              <>
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 rounded bg-emerald-600"></div>
                  <span>Airtight</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 rounded bg-teal-600"></div>
                  <span>Strong</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 rounded bg-cyan-600"></div>
                  <span>Moderate</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 rounded bg-sky-600"></div>
                  <span>Weak</span>
                </div>
              </>
            )}
            
            {viewMode === 'category' && (
              <>
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 rounded bg-red-600"></div>
                  <span>Petitioner</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 rounded bg-emerald-600"></div>
                  <span>Respondent</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 rounded bg-gray-500"></div>
                  <span>Neutral</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 rounded bg-violet-600"></div>
                  <span>Legal</span>
                </div>
              </>
            )}
            
            {viewMode === 'verified' && (
              <>
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 rounded bg-emerald-600"></div>
                  <span>Verified</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 rounded bg-red-600"></div>
                  <span>Unverified</span>
                </div>
              </>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Selected Cell Details */}
      {selectedCell && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Target className="h-5 w-5" />
              {selectedCell.evidence[0]}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <h4 className="font-semibold text-sm mb-2">Details</h4>
                <div className="space-y-1 text-sm">
                  <div><strong>Category:</strong> {selectedCell.category}</div>
                  <div><strong>Subcategory:</strong> {selectedCell.subcategory}</div>
                  <div><strong>Strength:</strong> {selectedCell.strength}</div>
                  <div><strong>Verified:</strong> {selectedCell.verified ? 'Yes' : 'No'}</div>
                  <div><strong>Value:</strong> {selectedCell.value}</div>
                </div>
              </div>
              <div>
                <h4 className="font-semibold text-sm mb-2">Tags</h4>
                <div className="flex flex-wrap gap-1">
                  {selectedCell.tags.map((tag) => (
                    <Badge key={tag} variant="secondary" className="text-xs">
                      {tag}
                    </Badge>
                  ))}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default EvidenceHeatmap;
