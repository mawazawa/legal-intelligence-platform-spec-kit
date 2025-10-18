"use client";

import React, { useState, useRef, useMemo } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

// Components
import { DeclarationHeader } from './components/DeclarationHeader';
import { DeclarationControls } from './components/DeclarationControls';
import { OverviewTab } from './components/OverviewTab';
import { PetitionerClaimsTab } from './components/PetitionerClaimsTab';
import { RespondentRebuttalTab } from './components/RespondentRebuttalTab';
import { EvidenceTab } from './components/EvidenceTab';

// Data
import { evidenceDatabase } from './data/evidenceDatabase';
import { declarationPoints } from './data/declarationPoints';

const SideBySideDeclarations: React.FC = () => {
  // State management
  const [activeTab, setActiveTab] = useState<string>('overview');
  const [expandedPoints, setExpandedPoints] = useState<Set<string>>(new Set());
  const [filterStrength, setFilterStrength] = useState<string>('all');
  const [filterCategory, setFilterCategory] = useState<string>('all');
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [showOnlyVerified, setShowOnlyVerified] = useState<boolean>(false);
  const printRef = useRef<HTMLDivElement>(null);

  // Filtering logic
  const filteredPoints = useMemo(() => {
    return declarationPoints.filter(point => {
      const matchesSearch = point.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           point.petitionerClaim.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           point.respondentRebuttal.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesStrength = filterStrength === 'all' || point.strength === filterStrength;
      const matchesCategory = filterCategory === 'all' || point.category === filterCategory;
      return matchesSearch && matchesStrength && matchesCategory;
    });
  }, [searchTerm, filterStrength, filterCategory]);

  // Event handlers
  const togglePointExpansion = (pointId: string) => {
    const newExpanded = new Set(expandedPoints);
    if (newExpanded.has(pointId)) {
      newExpanded.delete(pointId);
    } else {
      newExpanded.add(pointId);
    }
    setExpandedPoints(newExpanded);
  };

  const printDeclarations = () => {
    window.print();
  };

  return (
    <div ref={printRef} className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
      <DeclarationHeader onPrint={printDeclarations} />

      <DeclarationControls
        searchTerm={searchTerm}
        onSearchChange={setSearchTerm}
        filterStrength={filterStrength}
        onFilterStrengthChange={setFilterStrength}
        filterCategory={filterCategory}
        onFilterCategoryChange={setFilterCategory}
        showOnlyVerified={showOnlyVerified}
        onShowOnlyVerifiedChange={setShowOnlyVerified}
      />

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="petitioner">Petitioner Claims</TabsTrigger>
            <TabsTrigger value="respondent">Respondent Rebuttal</TabsTrigger>
            <TabsTrigger value="evidence">Granular Evidence</TabsTrigger>
          </TabsList>

          <TabsContent value="overview">
            <OverviewTab
              declarationPoints={declarationPoints}
              evidenceDatabase={evidenceDatabase}
            />
          </TabsContent>

          <TabsContent value="petitioner">
            <PetitionerClaimsTab points={filteredPoints} />
          </TabsContent>

          <TabsContent value="respondent">
            <RespondentRebuttalTab points={filteredPoints} />
          </TabsContent>

          <TabsContent value="evidence">
            <EvidenceTab
              points={filteredPoints}
              expandedPoints={expandedPoints}
              onTogglePoint={togglePointExpansion}
            />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default SideBySideDeclarations;
