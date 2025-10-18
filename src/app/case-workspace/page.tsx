'use client';

import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import EnhancedCaseFileExplorer from '@/components/navigation/EnhancedCaseFileExplorer';
import JudgmentCalculator from '@/components/calculator/JudgmentCalculator';
import {
  FileText,
  Scale,
  Eye,
  ExternalLink,
  Download,
  DollarSign
} from 'lucide-react';

interface CaseFile {
  id: string;
  name: string;
  originalName: string;
  type: 'judgment' | 'rfo' | 'fl320' | 'exhibit' | 'evidence' | 'financial' | 'email' | 'other';
  category: 'core' | 'supporting' | 'reference' | 'exhibit';
  tags: string[];
  date: string;
  size: string;
  description: string;
  relevance: 'critical' | 'important' | 'supporting' | 'reference';
  linkedTo?: string[];
  content?: string;
  metadata?: Record<string, any>;
}

interface JudgmentData {
  id: string;
  title: string;
  content: string;
  keyPoints: string[];
  calculations: {
    netProceeds: number;
    petitionerPercentage: number;
    respondentPercentage: number;
    adjustments: Array<{
      type: 'watts' | 'tax' | 'arrears' | 'other';
      amount: number;
      description: string;
      party: 'petitioner' | 'respondent' | 'both';
    }>;
  };
}

const CaseWorkspacePage: React.FC = () => {
  const [selectedFile, setSelectedFile] = useState<CaseFile | null>(null);
  const [activeTab, setActiveTab] = useState('explorer');
  const [currentCalculation, setCurrentCalculation] = useState<any>(null);

  // Mock data - in real implementation, this would come from API
  const mockFiles: CaseFile[] = [
    {
      id: 'judgment-1',
      name: 'Statement of Decision - Final Judgment',
      originalName: 'Judgment copy 2.pdf',
      type: 'judgment',
      category: 'core',
      tags: ['judgment', 'core-document', 'final'],
      date: '2023-12-28',
      size: '2.4 MB',
      description: 'Final judgment with 35%/65% distribution and key calculations',
      relevance: 'critical',
      content: 'The court finds that the net proceeds from the sale of the marital residence shall be distributed 35% to Petitioner and 65% to Respondent, with adjustments for Watts charges, tax withholding, and other specified items.',
      metadata: { pages: 15, caseNumber: 'FDI-21-794666' }
    },
    {
      id: 'rfo-1',
      name: 'Request for Order - Petitioner',
      originalName: 'RFO.pdf',
      type: 'rfo',
      category: 'core',
      tags: ['rfo', 'petitioner-filing', 'add-back'],
      date: '2025-06-26',
      size: '1.8 MB',
      description: 'Petitioner\'s RFO requesting add-back of mortgage arrears',
      relevance: 'critical',
      content: 'Petitioner requests that mortgage arrears of $77,779.88 be added back to net proceeds before distribution.',
      metadata: { pages: 12, attorney: 'Selam Gezahegn' }
    },
    {
      id: 'fl320-1',
      name: 'Responsive Declaration FL-320',
      originalName: 'Declaration of Alvero (3).docx',
      type: 'fl320',
      category: 'core',
      tags: ['fl320', 'respondent-filing', 'rebuttal'],
      date: '2025-07-15',
      size: '1.2 MB',
      description: 'Respondent\'s FL-320 with correct calculation methodology',
      relevance: 'critical',
      content: 'Respondent disputes the add-back methodology and provides correct calculation based on actual net proceeds.',
      metadata: { pages: 8, respondent: 'Mathieu Wauters' }
    },
    {
      id: 'closing-1',
      name: 'Final Closing Statement',
      originalName: 'Final Sellers Closing Statement.tjr markup (1).pdf',
      type: 'financial',
      category: 'supporting',
      tags: ['financial', 'closing-statement', 'net-proceeds'],
      date: '2024-11-15',
      size: '0.8 MB',
      description: 'Official closing statement showing actual net proceeds',
      relevance: 'important',
      content: 'Net proceeds from sale: $280,355.83',
      metadata: { netProceeds: 280355.83, closingDate: '2024-11-15' }
    },
    {
      id: 'exhibit-a',
      name: 'Exhibit A - Financial Calculations',
      originalName: 'exhibit-a-calculations.pdf',
      type: 'exhibit',
      category: 'exhibit',
      tags: ['exhibit', 'financial', 'calculations'],
      date: '2025-07-20',
      size: '0.5 MB',
      description: 'Detailed financial calculations and supporting documents',
      relevance: 'important',
      content: 'Supporting calculations for distribution methodology',
      metadata: { exhibitNumber: 'A', pages: 6 }
    }
  ];

  const mockJudgment: JudgmentData = {
    id: 'judgment-1',
    title: 'Statement of Decision - Final Judgment',
    content: `The court finds that the net proceeds from the sale of the marital residence shall be distributed 35% to Petitioner and 65% to Respondent, with adjustments for Watts charges, tax withholding, and other specified items. The court further finds that mortgage arrears were satisfied through the sale proceeds and should not be added back to the distributable amount.`,
    keyPoints: [
      '35%/65% distribution ratio established',
      'Net proceeds: $280,355.83 from closing statement',
      'Mortgage arrears satisfied through sale proceeds',
      'Watts charges to be calculated symmetrically',
      'Tax withholding credits to be applied equally'
    ],
    calculations: {
      netProceeds: 280355.83,
      petitionerPercentage: 35,
      respondentPercentage: 65,
      adjustments: [
        {
          type: 'watts',
          amount: 5000,
          description: 'Watts charges - Petitioner',
          party: 'petitioner'
        },
        {
          type: 'tax',
          amount: -8690,
          description: 'Tax withholding credit - Petitioner',
          party: 'petitioner'
        }
      ]
    }
  };

  const handleFileSelect = (file: CaseFile) => {
    setSelectedFile(file);
  };

  const handleFileOpen = (file: CaseFile) => {
    // TODO: Implement file viewer for opening files
  };

  const handleFileUpdate = (fileId: string, updates: Partial<CaseFile>) => {
    // TODO: Implement file update to database
  };

  const handleCalculationUpdate = (calculation: any) => {
    setCurrentCalculation(calculation);
  };

  const handleSaveCalculation = (calculation: any) => {
    // TODO: Implement calculation persistence to database
  };

  const getFileIcon = (type: CaseFile['type']) => {
    switch (type) {
      case 'judgment': return <Scale className="h-4 w-4 text-purple-600" />;
      case 'rfo': return <FileText className="h-4 w-4 text-red-600" />;
      case 'fl320': return <FileText className="h-4 w-4 text-blue-600" />;
      case 'exhibit': return <ExternalLink className="h-4 w-4 text-green-600" />;
      case 'financial': return <DollarSign className="h-4 w-4 text-yellow-600" />;
      default: return <FileText className="h-4 w-4 text-gray-500" />;
    }
  };

  return (
    <div className="h-screen flex flex-col bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Scale className="h-6 w-6 text-purple-600" />
            <div>
              <h1 className="text-xl font-semibold">Case Workspace</h1>
              <p className="text-sm text-gray-600">FDI-21-794666 - Divorce Case Management</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Badge variant="outline" className="text-green-600 border-green-200">
              Active Case
            </Badge>
            <Button variant="outline" size="sm">
              <Download className="h-4 w-4 mr-2" />
              Export
            </Button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex overflow-hidden">
        {/* Navigation Sidebar */}
        <div className="w-80 bg-white border-r border-gray-200 flex flex-col">
          <Tabs value={activeTab} onValueChange={setActiveTab} className="flex-1 flex flex-col">
            <TabsList className="grid w-full grid-cols-2 m-4">
              <TabsTrigger value="explorer">File Explorer</TabsTrigger>
              <TabsTrigger value="calculator">Calculator</TabsTrigger>
            </TabsList>
            
            <TabsContent value="explorer" className="flex-1 m-0">
              <EnhancedCaseFileExplorer
                files={mockFiles}
                onFileSelect={handleFileSelect}
                onFileOpen={handleFileOpen}
                onFileUpdate={handleFileUpdate}
                selectedFileId={selectedFile?.id}
              />
            </TabsContent>
            
            <TabsContent value="calculator" className="flex-1 m-0">
              <JudgmentCalculator
                judgment={mockJudgment}
                onCalculationUpdate={handleCalculationUpdate}
                onSaveCalculation={handleSaveCalculation}
              />
            </TabsContent>
          </Tabs>
        </div>

        {/* Main Workspace */}
        <div className="flex-1 flex flex-col">
          {selectedFile ? (
            <div className="flex-1 flex flex-col">
              {/* File Header */}
              <div className="bg-white border-b border-gray-200 px-6 py-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    {getFileIcon(selectedFile.type)}
                    <div>
                      <h2 className="text-lg font-semibold">{selectedFile.name}</h2>
                      <p className="text-sm text-gray-600">{selectedFile.description}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge variant="outline" className={`
                      ${selectedFile.relevance === 'critical' ? 'text-red-600 border-red-200' : ''}
                      ${selectedFile.relevance === 'important' ? 'text-yellow-600 border-yellow-200' : ''}
                      ${selectedFile.relevance === 'supporting' ? 'text-blue-600 border-blue-200' : ''}
                      ${selectedFile.relevance === 'reference' ? 'text-gray-600 border-gray-200' : ''}
                    `}>
                      {selectedFile.relevance}
                    </Badge>
                    <Button variant="outline" size="sm">
                      <Eye className="h-4 w-4 mr-2" />
                      View
                    </Button>
                  </div>
                </div>
              </div>

              {/* File Content */}
              <div className="flex-1 overflow-auto p-6">
                <div className="max-w-4xl mx-auto">
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <FileText className="h-5 w-5" />
                        Document Content
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        <div>
                          <h4 className="font-semibold text-sm text-gray-700 mb-2">Content Preview</h4>
                          <p className="text-sm text-gray-600 leading-relaxed">
                            {selectedFile.content || 'Document content would be displayed here...'}
                          </p>
                        </div>
                        
                        <div>
                          <h4 className="font-semibold text-sm text-gray-700 mb-2">Tags</h4>
                          <div className="flex flex-wrap gap-2">
                            {selectedFile.tags.map(tag => (
                              <Badge key={tag} variant="secondary" className="text-xs">
                                {tag}
                              </Badge>
                            ))}
                          </div>
                        </div>

                        <div>
                          <h4 className="font-semibold text-sm text-gray-700 mb-2">Metadata</h4>
                          <div className="grid grid-cols-2 gap-4 text-sm">
                            <div>
                              <span className="text-gray-600">Date:</span>
                              <span className="ml-2">{selectedFile.date}</span>
                            </div>
                            <div>
                              <span className="text-gray-600">Size:</span>
                              <span className="ml-2">{selectedFile.size}</span>
                            </div>
                            <div>
                              <span className="text-gray-600">Type:</span>
                              <span className="ml-2">{selectedFile.type}</span>
                            </div>
                            <div>
                              <span className="text-gray-600">Category:</span>
                              <span className="ml-2">{selectedFile.category}</span>
                            </div>
                          </div>
                        </div>

                        {selectedFile.linkedTo && selectedFile.linkedTo.length > 0 && (
                          <div>
                            <h4 className="font-semibold text-sm text-gray-700 mb-2">Related Documents</h4>
                            <div className="space-y-2">
                              {selectedFile.linkedTo.map(linkedId => {
                                const linkedFile = mockFiles.find(f => f.id === linkedId);
                                return linkedFile ? (
                                  <div key={linkedId} className="flex items-center gap-2 p-2 bg-gray-50 rounded">
                                    {getFileIcon(linkedFile.type)}
                                    <span className="text-sm">{linkedFile.name}</span>
                                    <Button variant="ghost" size="sm" className="ml-auto">
                                      <ExternalLink className="h-3 w-3" />
                                    </Button>
                                  </div>
                                ) : null;
                              })}
                            </div>
                          </div>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </div>
            </div>
          ) : (
            <div className="flex-1 flex items-center justify-center">
              <div className="text-center">
                <FileText className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-gray-600 mb-2">Select a Document</h3>
                <p className="text-gray-500">Choose a file from the explorer to view its content</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default CaseWorkspacePage;
