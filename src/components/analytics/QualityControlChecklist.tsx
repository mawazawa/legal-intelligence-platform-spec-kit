"use client";

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Checkbox } from '@/components/ui/checkbox';
import { Progress } from '@/components/ui/progress';
import { 
  CheckCircle2, 
  XCircle, 
  AlertTriangle, 
  Info, 
  FileCheck, 
  Scale, 
  Gavel,
  BookOpen,
  Target,
  Shield,
  Eye,
  Search,
  Filter,
  Download,
  Printer,
  Send,
  Save,
  Edit,
  Trash2,
  Copy,
  Share,
  Link,
  ExternalLink,
  Calendar,
  Clock,
  User,
  Users,
  Building,
  Home,
  Mail,
  Phone,
  MapPin,
  Hash,
  Flag,
  Star,
  Heart,
  ThumbsUp,
  ThumbsDown,
  Smile,
  Frown,
  Meh,
  Check,
  X,
  Plus,
  Minus,
  Equal,
  Divide,
  Multiply,
  Calculator,
  BarChart3,
  PieChart,
  LineChart,
  TrendingUp,
  Activity,
  Zap,
  Flame,
  Thunder,
  Lightning,
  Rocket,
  Crown,
  Diamond,
  Sparkles,
  Award,
  Trophy,
  Brain,
  Cpu,
  Database,
  Network,
  Layers,
  Settings,
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
  Pentagon
} from 'lucide-react';

interface QualityCheckItem {
  id: string;
  category: 'legal' | 'mathematical' | 'citation' | 'format' | 'ethics' | 'completeness';
  title: string;
  description: string;
  required: boolean;
  checked: boolean;
  severity: 'critical' | 'high' | 'medium' | 'low';
  evidence?: string;
  notes?: string;
}

interface QualityControlChecklistProps {
  evidenceData?: any[];
  onChecklistComplete?: (results: QualityCheckItem[]) => void;
}

const QualityControlChecklist: React.FC<QualityControlChecklistProps> = ({
  evidenceData,
  onChecklistComplete
}) => {
  const [checklistItems, setChecklistItems] = useState<QualityCheckItem[]>([]);
  const [activeCategory, setActiveCategory] = useState<string>('all');
  const [showOnlyCritical, setShowOnlyCritical] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [completionPercentage, setCompletionPercentage] = useState(0);

  // Initialize checklist items
  useEffect(() => {
    if (!evidenceData) return;
    
    const items: QualityCheckItem[] = [
      // Legal Checks
      {
        id: 'legal-001',
        category: 'legal',
        title: 'Family Code Section 2550 Compliance',
        description: 'Verify equal division requirement is met',
        required: true,
        checked: false,
        severity: 'critical',
        evidence: 'Family Code Section 2550 requires equal division of community property'
      },
      {
        id: 'legal-002',
        category: 'legal',
        title: 'Watts Charges Legal Standard',
        description: 'Confirm Watts charges end when possession changes',
        required: true,
        checked: false,
        severity: 'critical',
        evidence: 'Watts v. Watts (1985) 171 Cal.App.3d 366'
      },
      {
        id: 'legal-003',
        category: 'legal',
        title: 'Attorney Fees Sanctions Standard',
        description: 'Verify bad faith requirement for sanctions',
        required: true,
        checked: false,
        severity: 'high',
        evidence: 'Family Code Section 271 requires showing conduct that frustrates settlement policy'
      },

      // Mathematical Checks
      {
        id: 'math-001',
        category: 'mathematical',
        title: 'Double-Counting Error Identification',
        description: 'Confirm Petitioner\'s mathematical impossibility',
        required: true,
        checked: false,
        severity: 'critical',
        evidence: 'Petitioner attempts to both deduct and add back $77,779.88'
      },
      {
        id: 'math-002',
        category: 'mathematical',
        title: 'Net Proceeds Calculation Verification',
        description: 'Verify actual escrow proceeds amount',
        required: true,
        checked: false,
        severity: 'critical',
        evidence: 'Escrow Closing Statement shows $280,355.83'
      },
      {
        id: 'math-003',
        category: 'mathematical',
        title: 'Proportional Distribution Check',
        description: 'Confirm 65/35 split application',
        required: true,
        checked: false,
        severity: 'high',
        evidence: 'Judgment specifies 65% to Respondent, 35% to Petitioner'
      },

      // Citation Checks
      {
        id: 'cite-001',
        category: 'citation',
        title: 'Bluebook Formatting Compliance',
        description: 'Verify all citations follow Bluebook format',
        required: true,
        checked: false,
        severity: 'medium',
        evidence: 'All legal citations must follow Bluebook format'
      },
      {
        id: 'cite-002',
        category: 'citation',
        title: 'Page and Paragraph References',
        description: 'Confirm all evidence has specific page/paragraph citations',
        required: true,
        checked: false,
        severity: 'high',
        evidence: 'Each evidence item must have specific citation'
      },
      {
        id: 'cite-003',
        category: 'citation',
        title: 'Source Verification',
        description: 'Verify all sources are authentic and accessible',
        required: true,
        checked: false,
        severity: 'critical',
        evidence: 'All sources must be verifiable and authentic'
      },

      // Format Checks
      {
        id: 'format-001',
        category: 'format',
        title: 'Declaration Format Compliance',
        description: 'Verify declaration follows court format requirements',
        required: true,
        checked: false,
        severity: 'medium',
        evidence: 'Declaration must follow court format requirements'
      },
      {
        id: 'format-002',
        category: 'format',
        title: 'Exhibit Organization',
        description: 'Confirm exhibits are properly organized and labeled',
        required: true,
        checked: false,
        severity: 'medium',
        evidence: 'Exhibits must be properly organized and labeled'
      },
      {
        id: 'format-003',
        category: 'format',
        title: 'Print Formatting',
        description: 'Verify print formatting is correct',
        required: false,
        checked: false,
        severity: 'low',
        evidence: 'Print formatting should be optimized for court submission'
      },

      // Ethics Checks
      {
        id: 'ethics-001',
        category: 'ethics',
        title: 'Truthfulness Verification',
        description: 'Confirm all statements are truthful and accurate',
        required: true,
        checked: false,
        severity: 'critical',
        evidence: 'All statements must be truthful under penalty of perjury'
      },
      {
        id: 'ethics-002',
        category: 'ethics',
        title: 'No Misrepresentation',
        description: 'Verify no misrepresentation of facts or law',
        required: true,
        checked: false,
        severity: 'critical',
        evidence: 'No misrepresentation of facts or law is permitted'
      },
      {
        id: 'ethics-003',
        category: 'ethics',
        title: 'Client Confidentiality',
        description: 'Confirm client confidentiality is maintained',
        required: true,
        checked: false,
        severity: 'high',
        evidence: 'Client confidentiality must be maintained'
      },

      // Completeness Checks
      {
        id: 'complete-001',
        category: 'completeness',
        title: 'All Required Sections Included',
        description: 'Verify all required declaration sections are included',
        required: true,
        checked: false,
        severity: 'high',
        evidence: 'All required sections must be included'
      },
      {
        id: 'complete-002',
        category: 'completeness',
        title: 'Evidence Completeness',
        description: 'Confirm all evidence items are complete',
        required: true,
        checked: false,
        severity: 'high',
        evidence: 'All evidence items must be complete'
      },
      {
        id: 'complete-003',
        category: 'completeness',
        title: 'Counter-Evidence Analysis',
        description: 'Verify counter-evidence is properly analyzed',
        required: true,
        checked: false,
        severity: 'medium',
        evidence: 'Counter-evidence must be properly analyzed'
      }
    ];

    setChecklistItems(items);
  }, [evidenceData]);

  // Update completion percentage
  useEffect(() => {
    const totalItems = checklistItems.length;
    const checkedItems = checklistItems.filter(item => item.checked).length;
    const percentage = totalItems > 0 ? (checkedItems / totalItems) * 100 : 0;
    setCompletionPercentage(percentage);
  }, [checklistItems]);

  const toggleCheckItem = (itemId: string) => {
    setChecklistItems(prev => 
      prev.map(item => 
        item.id === itemId 
          ? { ...item, checked: !item.checked }
          : item
      )
    );
  };

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'critical': return 'text-red-700 bg-red-100 border-red-300';
      case 'high': return 'text-orange-700 bg-orange-100 border-orange-300';
      case 'medium': return 'text-yellow-700 bg-yellow-100 border-yellow-300';
      case 'low': return 'text-green-700 bg-green-100 border-green-300';
      default: return 'text-gray-700 bg-gray-100 border-gray-300';
    }
  };

  const getSeverityIcon = (severity: string) => {
    switch (severity) {
      case 'critical': return <XCircle className="h-4 w-4" />;
      case 'high': return <AlertTriangle className="h-4 w-4" />;
      case 'medium': return <Info className="h-4 w-4" />;
      case 'low': return <CheckCircle2 className="h-4 w-4" />;
      default: return <Info className="h-4 w-4" />;
    }
  };

  const filteredItems = checklistItems.filter(item => {
    const matchesCategory = activeCategory === 'all' || item.category === activeCategory;
    const matchesSearch = item.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         item.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesSeverity = !showOnlyCritical || item.severity === 'critical';
    return matchesCategory && matchesSearch && matchesSeverity;
  });

  const criticalItems = checklistItems.filter(item => item.severity === 'critical');
  const uncheckedCriticalItems = criticalItems.filter(item => !item.checked);

  const exportChecklist = () => {
    const data = {
      completionPercentage,
      totalItems: checklistItems.length,
      checkedItems: checklistItems.filter(item => item.checked).length,
      criticalItems: criticalItems.length,
      uncheckedCriticalItems: uncheckedCriticalItems.length,
      items: checklistItems
    };
    
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'quality-control-checklist.json';
    link.click();
    URL.revokeObjectURL(url);
  };

  const printChecklist = () => {
    window.print();
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-slate-900">Quality Control Checklist</h2>
          <p className="text-slate-600">Comprehensive review of legal document quality and compliance</p>
        </div>
        <div className="flex items-center gap-2">
          <Button onClick={exportChecklist} variant="outline" size="sm">
            <Download className="h-4 w-4 mr-2" />
            Export
          </Button>
          <Button onClick={printChecklist} variant="outline" size="sm">
            <Printer className="h-4 w-4 mr-2" />
            Print
          </Button>
        </div>
      </div>

      {/* Progress Overview */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Target className="h-5 w-5" />
            Progress Overview
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div>
              <div className="flex items-center justify-between text-sm mb-2">
                <span>Overall Completion</span>
                <span>{completionPercentage.toFixed(1)}%</span>
              </div>
              <Progress value={completionPercentage} className="h-3" />
            </div>
            
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="text-center">
                <div className="text-2xl font-bold text-slate-900">{checklistItems.length}</div>
                <div className="text-sm text-slate-600">Total Items</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-green-600">
                  {checklistItems.filter(item => item.checked).length}
                </div>
                <div className="text-sm text-slate-600">Completed</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-red-600">{criticalItems.length}</div>
                <div className="text-sm text-slate-600">Critical Items</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-orange-600">{uncheckedCriticalItems.length}</div>
                <div className="text-sm text-slate-600">Unchecked Critical</div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Controls */}
      <div className="flex flex-wrap items-center gap-4 p-4 bg-white rounded-lg border">
        <div className="flex items-center gap-2">
          <Button
            variant={activeCategory === 'all' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setActiveCategory('all')}
          >
            All
          </Button>
          <Button
            variant={activeCategory === 'legal' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setActiveCategory('legal')}
          >
            <Gavel className="h-4 w-4" />
            Legal
          </Button>
          <Button
            variant={activeCategory === 'mathematical' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setActiveCategory('mathematical')}
          >
            <Calculator className="h-4 w-4" />
            Math
          </Button>
          <Button
            variant={activeCategory === 'citation' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setActiveCategory('citation')}
          >
            <BookOpen className="h-4 w-4" />
            Citations
          </Button>
          <Button
            variant={activeCategory === 'format' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setActiveCategory('format')}
          >
            <FileCheck className="h-4 w-4" />
            Format
          </Button>
          <Button
            variant={activeCategory === 'ethics' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setActiveCategory('ethics')}
          >
            <Shield className="h-4 w-4" />
            Ethics
          </Button>
          <Button
            variant={activeCategory === 'completeness' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setActiveCategory('completeness')}
          >
            <CheckCircle2 className="h-4 w-4" />
            Complete
          </Button>
        </div>

        <div className="flex-1 min-w-64">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-slate-400" />
            <input
              type="text"
              placeholder="Search checklist items..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
        </div>

        <label className="flex items-center gap-2">
          <Checkbox
            checked={showOnlyCritical}
            onCheckedChange={setShowOnlyCritical}
          />
          <span className="text-sm text-slate-600">Critical Only</span>
        </label>
      </div>

      {/* Checklist Items */}
      <div className="space-y-3">
        {filteredItems.map((item) => (
          <Card key={item.id} className="border-l-4 border-l-slate-200">
            <CardContent className="pt-6">
              <div className="flex items-start gap-3">
                <Checkbox
                  checked={item.checked}
                  onCheckedChange={() => toggleCheckItem(item.id)}
                  className="mt-1"
                />
                
                <div className="flex-1">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <h3 className="font-semibold text-slate-900">{item.title}</h3>
                      <Badge className={getSeverityColor(item.severity)}>
                        {getSeverityIcon(item.severity)}
                        <span className="ml-1 capitalize">{item.severity}</span>
                      </Badge>
                      {item.required && (
                        <Badge variant="outline" className="text-xs text-red-600">
                          Required
                        </Badge>
                      )}
                    </div>
                  </div>
                  
                  <p className="text-sm text-slate-600 mb-2">{item.description}</p>
                  
                  {item.evidence && (
                    <div className="bg-blue-50 border border-blue-200 rounded p-2 mb-2">
                      <p className="text-xs text-blue-800">
                        <strong>Evidence:</strong> {item.evidence}
                      </p>
                    </div>
                  )}
                  
                  {item.notes && (
                    <div className="bg-yellow-50 border border-yellow-200 rounded p-2">
                      <p className="text-xs text-yellow-800">
                        <strong>Notes:</strong> {item.notes}
                      </p>
                    </div>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Summary */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <CheckCircle2 className="h-5 w-5" />
            Quality Control Summary
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <h4 className="font-semibold text-sm mb-2">Completion Status</h4>
                <div className="space-y-1 text-sm">
                  <div>Total Items: {checklistItems.length}</div>
                  <div>Completed: {checklistItems.filter(item => item.checked).length}</div>
                  <div>Remaining: {checklistItems.filter(item => !item.checked).length}</div>
                  <div>Completion Rate: {completionPercentage.toFixed(1)}%</div>
                </div>
              </div>
              <div>
                <h4 className="font-semibold text-sm mb-2">Critical Items</h4>
                <div className="space-y-1 text-sm">
                  <div>Total Critical: {criticalItems.length}</div>
                  <div>Completed Critical: {criticalItems.filter(item => item.checked).length}</div>
                  <div>Remaining Critical: {uncheckedCriticalItems.length}</div>
                  <div className={uncheckedCriticalItems.length > 0 ? 'text-red-600 font-semibold' : 'text-green-600 font-semibold'}>
                    Status: {uncheckedCriticalItems.length > 0 ? 'Incomplete' : 'Complete'}
                  </div>
                </div>
              </div>
            </div>
            
            {uncheckedCriticalItems.length > 0 && (
              <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                <h4 className="font-semibold text-red-800 mb-2">Critical Items Remaining</h4>
                <div className="space-y-1">
                  {uncheckedCriticalItems.map((item) => (
                    <div key={item.id} className="text-sm text-red-700">
                      • {item.title}
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default QualityControlChecklist;
