import { useState, useEffect } from 'react';
import { RFOAnalysisData, TabId } from '../types';
import { getMockRFOData } from '../mockData';

export const useRFOAnalysis = () => {
  const [analysisData, setAnalysisData] = useState<RFOAnalysisData | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<TabId>('overview');

  useEffect(() => {
    // TODO: Replace with real API call to /api/rfo-analysis
    const loadData = async () => {
      setLoading(true);
      await new Promise(resolve => setTimeout(resolve, 1000));
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
