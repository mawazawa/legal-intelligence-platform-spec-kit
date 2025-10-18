import { EvidenceNode, EvidenceEdge } from '../types';
import { NODE_SIZES, NODE_COLORS, EDGE_COLORS } from '../constants';

export const getNodeSize = (strength: string): number => {
  return NODE_SIZES[strength as keyof typeof NODE_SIZES] || NODE_SIZES.default;
};

export const getNodeColor = (category: string, strength: string): string => {
  if (category === 'petitioner') {
    return NODE_COLORS.petitioner[strength as keyof typeof NODE_COLORS.petitioner] || NODE_COLORS.petitioner.default;
  } else if (category === 'respondent') {
    return NODE_COLORS.respondent[strength as keyof typeof NODE_COLORS.respondent] || NODE_COLORS.respondent.default;
  }
  return NODE_COLORS.neutral;
};

export const getEdgeColor = (type: string): string => {
  return EDGE_COLORS[type as keyof typeof EDGE_COLORS] || EDGE_COLORS.default;
};

export const createNetworkNodes = (evidenceData: any[]): EvidenceNode[] => {
  return evidenceData.map((item) => ({
    id: item.id,
    label: item.title,
    type: item.category === 'petitioner' ? 'petitioner' :
          item.category === 'respondent' ? 'respondent' : 'neutral',
    strength: item.strength,
    verified: item.verified,
    category: item.category,
    tags: item.tags,
    x: Math.random() * 800 + 100,
    y: Math.random() * 600 + 100,
    size: getNodeSize(item.strength),
    color: getNodeColor(item.category, item.strength)
  }));
};

export const createNetworkEdges = (evidenceData: any[]): EvidenceEdge[] => {
  const edges: EvidenceEdge[] = [];

  evidenceData.forEach((item) => {
    if (item.counterEvidence) {
      item.counterEvidence.forEach((counterId: string) => {
        edges.push({
          id: `${item.id}-${counterId}`,
          source: item.id,
          target: counterId,
          type: 'contradicts',
          strength: 0.8,
          label: 'Contradicts'
        });
      });
    }

    if (item.rebuttal) {
      evidenceData.forEach((otherItem) => {
        if (otherItem.id !== item.id &&
            (otherItem.tags.some(tag => item.tags.includes(tag)) ||
             otherItem.category === item.category)) {
          edges.push({
            id: `${item.id}-${otherItem.id}`,
            source: item.id,
            target: otherItem.id,
            type: 'relates',
            strength: 0.6,
            label: 'Related'
          });
        }
      });
    }
  });

  return edges;
};

export const exportNetworkImage = (canvas: HTMLCanvasElement) => {
  const link = document.createElement('a');
  link.download = 'evidence-network.png';
  link.href = canvas.toDataURL();
  link.click();
};
