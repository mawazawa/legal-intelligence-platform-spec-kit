"use client";

import React, { useState, useEffect, useRef, Suspense, lazy, ComponentType } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { 
  LayoutDashboard, 
  Calculator, 
  FileText, 
  BarChart3,
  ArrowUp,
  Menu,
  X,
  ChevronDown,
  ChevronRight
} from 'lucide-react';
import { cn } from '@/lib/utils';

const DashboardHome = lazy(() => import('@/components/DashboardHome').then(m => ({ default: m.DashboardHome })));
const FinalDistributionSSOT = lazy(() => import('@/app/final-distribution/page'));
const HousingCostCalculator = lazy(() => import('@/components/HousingCostCalculator'));
const TaxWithholdingAnalysis = lazy(() => import('@/components/TaxWithholdingAnalysis'));
const CourtFilingPage = lazy(() => import('@/app/court-filing/page'));
const RFOComparisonPage = lazy(() => import('@/app/rfo-comparison/page'));
const ResponsiveDeclarationPage = lazy(() => import('@/app/responsive-declaration/page'));
const PleadingPaperPage = lazy(() => import('@/app/pleading-paper/page'));
const RFOAnalysisPage = lazy(() => import('@/app/analytics/rfo-analysis/page'));
const ClaimsAnalysisPage = lazy(() => import('@/app/analytics/claims/page'));
const ContinuancesPage = lazy(() => import('@/app/analytics/continuances/page'));
const CommunicationsPage = lazy(() => import('@/app/analytics/communications/page'));
const EvidenceMatrixPage = lazy(() => import('@/app/analytics/evidence-matrix/page'));
const SideBySideDeclarations = lazy(() => import('@/components/declarations/SideBySideDeclarations'));
const EvidenceNetworkGraph = lazy(() => import('@/components/analytics/EvidenceNetworkGraph'));
const EvidenceHeatmap = lazy(() => import('@/components/analytics/EvidenceHeatmap'));
const PredictiveModels = lazy(() => import('@/components/analytics/PredictiveModels'));
const QualityControlChecklist = lazy(() => import('@/components/analytics/QualityControlChecklist'));

interface NavSection {
  id: string;
  title: string;
  icon: React.ReactNode;
  subsections: {
    id: string;
    title: string;
    component: ComponentType;
  }[];
}

const navigationSections: NavSection[] = [
  {
    id: 'overview',
    title: 'Case Overview',
    icon: <LayoutDashboard className="h-5 w-5" />,
    subsections: [
      { id: 'dashboard', title: 'Dashboard', component: DashboardHome },
    ]
  },
  {
    id: 'financial',
    title: 'Financial Analysis',
    icon: <Calculator className="h-5 w-5" />,
    subsections: [
      { id: 'final-distribution', title: 'Final Distribution', component: FinalDistributionSSOT },
      { id: 'housing-costs', title: 'Housing Costs', component: HousingCostCalculator },
      { id: 'tax-withholding', title: 'Tax Withholding', component: TaxWithholdingAnalysis },
    ]
  },
  {
    id: 'legal',
    title: 'Legal Filings',
    icon: <FileText className="h-5 w-5" />,
    subsections: [
      { id: 'side-by-side-declarations', title: 'Side-by-Side Declarations', component: SideBySideDeclarations },
      { id: 'court-filing', title: 'Court Filing Package', component: CourtFilingPage },
      { id: 'rfo-comparison', title: 'RFO Comparison', component: RFOComparisonPage },
      { id: 'responsive-declaration', title: 'Responsive Declaration', component: ResponsiveDeclarationPage },
      { id: 'pleading-paper', title: 'Pleading Paper', component: PleadingPaperPage },
    ]
  },
  {
    id: 'analytics',
    title: 'Analytics & Evidence',
    icon: <BarChart3 className="h-5 w-5" />,
    subsections: [
      { id: 'evidence-network', title: 'Evidence Network Graph', component: EvidenceNetworkGraph },
      { id: 'evidence-heatmap', title: 'Evidence Heatmap', component: EvidenceHeatmap },
      { id: 'predictive-models', title: 'Predictive Models', component: PredictiveModels },
      { id: 'quality-control', title: 'Quality Control Checklist', component: QualityControlChecklist },
      { id: 'rfo-analysis', title: 'RFO Analysis', component: RFOAnalysisPage },
      { id: 'claims', title: 'Claims Analysis', component: ClaimsAnalysisPage },
      { id: 'continuances', title: 'Continuances', component: ContinuancesPage },
      { id: 'communications', title: 'Communications', component: CommunicationsPage },
      { id: 'evidence-matrix', title: 'Evidence Matrix', component: EvidenceMatrixPage },
    ]
  }
];

const LegalIntelligencePlatform: React.FC = () => {
  const [activeSection, setActiveSection] = useState<string>('overview');
  const [activeSubsection, setActiveSubsection] = useState<string>('dashboard');
  const [expandedSections, setExpandedSections] = useState<Set<string>>(new Set(['overview']));
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [showBackToTop, setShowBackToTop] = useState(false);
  const mainRef = useRef<HTMLDivElement>(null);

  // Handle scroll to show back to top button
  useEffect(() => {
    const handleScroll = () => {
      setShowBackToTop(window.scrollY > 300);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Smooth scroll to section
  const scrollToSection = (sectionId: string, subsectionId: string) => {
    const element = document.getElementById(`${sectionId}-${subsectionId}`);
    if (element) {
      element.scrollIntoView({ 
        behavior: 'smooth',
        block: 'start'
      });
    }
    setActiveSection(sectionId);
    setActiveSubsection(subsectionId);
    setIsMobileMenuOpen(false);
  };

  // Toggle section expansion
  const toggleSection = (sectionId: string) => {
    const newExpanded = new Set(expandedSections);
    if (newExpanded.has(sectionId)) {
      newExpanded.delete(sectionId);
    } else {
      newExpanded.add(sectionId);
    }
    setExpandedSections(newExpanded);
  };

  // Back to top
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const currentSubsection = navigationSections
    .find(section => section.id === activeSection)
    ?.subsections.find(subsection => subsection.id === activeSubsection);

  const CurrentComponent = currentSubsection?.component || DashboardHome;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
      {/* Header */}
      <header className="sticky top-0 z-40 bg-white/80 backdrop-blur-sm border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            {/* Logo */}
            <div className="flex items-center">
              <div className="text-xl font-bold text-slate-900">
                Legal Intelligence Platform
              </div>
            </div>

            {/* Desktop Navigation */}
            <nav className="hidden lg:flex space-x-1">
              {navigationSections.map((section) => (
                <div key={section.id} className="relative group">
                  <Button
                    variant="ghost"
                    onClick={() => toggleSection(section.id)}
                    className={cn(
                      "flex items-center gap-2 px-3 py-2 text-sm font-medium transition-colors",
                      activeSection === section.id 
                        ? "text-blue-600 bg-blue-50" 
                        : "text-slate-600 hover:text-slate-900 hover:bg-slate-50"
                    )}
                  >
                    {section.icon}
                    {section.title}
                    {expandedSections.has(section.id) ? (
                      <ChevronDown className="h-4 w-4" />
                    ) : (
                      <ChevronRight className="h-4 w-4" />
                    )}
                  </Button>

                  {/* Dropdown Menu */}
                  {expandedSections.has(section.id) && (
                    <div className="absolute top-full left-0 mt-1 w-64 bg-white rounded-lg shadow-lg border border-slate-200 py-2 z-50">
                      {section.subsections.map((subsection) => (
                        <button
                          key={subsection.id}
                          onClick={() => scrollToSection(section.id, subsection.id)}
                          className={cn(
                            "w-full text-left px-4 py-2 text-sm transition-colors",
                            activeSection === section.id && activeSubsection === subsection.id
                              ? "text-blue-600 bg-blue-50"
                              : "text-slate-600 hover:text-slate-900 hover:bg-slate-50"
                          )}
                        >
                          {subsection.title}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </nav>

            {/* Mobile Menu Button */}
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="lg:hidden"
            >
              {isMobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </Button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isMobileMenuOpen && (
          <div className="lg:hidden border-t border-slate-200 bg-white">
            <div className="max-w-7xl mx-auto px-4 py-4">
              <div className="space-y-2">
                {navigationSections.map((section) => (
                  <div key={section.id}>
                    <Button
                      variant="ghost"
                      onClick={() => toggleSection(section.id)}
                      className="w-full justify-start gap-2 text-left"
                    >
                      {section.icon}
                      {section.title}
                      {expandedSections.has(section.id) ? (
                        <ChevronDown className="h-4 w-4 ml-auto" />
                      ) : (
                        <ChevronRight className="h-4 w-4 ml-auto" />
                      )}
                    </Button>
                    {expandedSections.has(section.id) && (
                      <div className="ml-6 space-y-1">
                        {section.subsections.map((subsection) => (
                          <Button
                            key={subsection.id}
                            variant="ghost"
                            size="sm"
                            onClick={() => scrollToSection(section.id, subsection.id)}
                            className="w-full justify-start text-left text-sm"
                          >
                            {subsection.title}
                          </Button>
                        ))}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </header>

      {/* Main Content */}
      <main ref={mainRef} className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Current Section Header */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-2">
            {navigationSections.find(s => s.id === activeSection)?.icon}
            <h1 className="text-2xl font-bold text-slate-900">
              {navigationSections.find(s => s.id === activeSection)?.title}
            </h1>
            <Badge variant="outline" className="text-xs">
              {currentSubsection?.title}
            </Badge>
          </div>
          <p className="text-slate-600">
            {activeSection === 'overview' && 'Case overview and dashboard'}
            {activeSection === 'financial' && 'Financial calculations and analysis'}
            {activeSection === 'legal' && 'Legal documents and filings'}
            {activeSection === 'analytics' && 'Data analysis and evidence presentation'}
          </p>
        </div>

        {/* Section Content */}
        <div className="space-y-8">
          {navigationSections.map((section) => (
            <div key={section.id} className="space-y-6">
              {section.subsections.map((subsection) => (
                <div
                  key={subsection.id}
                  id={`${section.id}-${subsection.id}`}
                  className="min-h-screen"
                >
                  <Card className="shadow-lg">
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        {section.icon}
                        {subsection.title}
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <Suspense fallback={
                        <div className="flex items-center justify-center py-8">
                          <div className="animate-spin rounded-full h-8 w-8 border-2 border-blue-500 border-t-transparent"></div>
                        </div>
                      }>
                        <subsection.component />
                      </Suspense>
                    </CardContent>
                  </Card>
                </div>
              ))}
            </div>
          ))}
        </div>
      </main>

      {/* Back to Top Button */}
      {showBackToTop && (
        <Button
          onClick={scrollToTop}
          className="fixed bottom-8 right-8 z-50 rounded-full shadow-lg"
          size="sm"
        >
          <ArrowUp className="h-4 w-4" />
        </Button>
      )}

      {/* Footer */}
      <footer className="bg-slate-900 text-white py-12 mt-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h3 className="text-lg font-semibold mb-4">Legal Intelligence Platform</h3>
            <p className="text-slate-400 mb-4">
              Comprehensive case management and legal document preparation
            </p>
            <div className="text-sm text-slate-500">
              Case: Wauters v. Alvero | Case Number: FDI-21-794666
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default LegalIntelligencePlatform;
