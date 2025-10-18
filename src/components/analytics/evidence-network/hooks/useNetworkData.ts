import { useState, useEffect } from 'react';
import { EvidenceNode, EvidenceEdge } from '../types';
import { createNetworkNodes, createNetworkEdges } from '../utils/networkUtils';

export const useNetworkData = (evidenceData?: any[]) => {
  const [nodes, setNodes] = useState<EvidenceNode[]>([]);
  const [edges, setEdges] = useState<EvidenceEdge[]>([]);

  useEffect(() => {
    if (!evidenceData) return;

    const networkNodes = createNetworkNodes(evidenceData);
    const networkEdges = createNetworkEdges(evidenceData);

    setNodes(networkNodes);
    setEdges(networkEdges);
  }, [evidenceData]);

  return { nodes, edges };
};
