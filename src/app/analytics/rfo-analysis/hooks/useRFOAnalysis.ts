import { useState, useEffect } from 'react';
import { RFOAnalysisData, TabId } from '../types';
import { getMockRFOData } from '../mockData';

export const useRFOAnalysis = () => {
  const [analysisData, setAnalysisData] = useState<RFOAnalysisData | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<TabId>('overview');

  useEffect(() => {
    // Load RFO analysis data
    // NOTE: Using mock data until /api/rfo-analysis endpoint is implemented
    const loadData = async () => {
      setLoading(true);

      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 1000));

      // Use mock data (replace with: const response = await fetch('/api/rfo-analysis'))
      setAnalysisData(getMockRFOData());
      setLoading(false);
    };

    loadData();
  }, []);

  return {
    analysisData,
    loading,
    activeTab,
    setActiveTab
  };
};
