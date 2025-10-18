import { EvidenceNode, EvidenceEdge } from '../types';
import { getEdgeColor } from './networkUtils';

export const drawEdges = (
  ctx: CanvasRenderingContext2D,
  edges: EvidenceEdge[],
  nodes: EvidenceNode[]
) => {
  edges.forEach((edge) => {
    const sourceNode = nodes.find(n => n.id === edge.source);
    const targetNode = nodes.find(n => n.id === edge.target);

    if (sourceNode && targetNode) {
      ctx.strokeStyle = getEdgeColor(edge.type);
      ctx.lineWidth = edge.strength * 3;
      ctx.setLineDash(edge.type === 'contradicts' ? [5, 5] : []);

      ctx.beginPath();
      ctx.moveTo(sourceNode.x!, sourceNode.y!);
      ctx.lineTo(targetNode.x!, targetNode.y!);
      ctx.stroke();

      // Draw arrow
      const angle = Math.atan2(targetNode.y! - sourceNode.y!, targetNode.x! - sourceNode.x!);
      const arrowLength = 10;
      const arrowAngle = Math.PI / 6;

      ctx.beginPath();
      ctx.moveTo(targetNode.x!, targetNode.y!);
      ctx.lineTo(
        targetNode.x! - arrowLength * Math.cos(angle - arrowAngle),
        targetNode.y! - arrowLength * Math.sin(angle - arrowAngle)
      );
      ctx.moveTo(targetNode.x!, targetNode.y!);
      ctx.lineTo(
        targetNode.x! - arrowLength * Math.cos(angle + arrowAngle),
        targetNode.y! - arrowLength * Math.sin(angle + arrowAngle)
      );
      ctx.stroke();
    }
  });
};

export const drawNodes = (
  ctx: CanvasRenderingContext2D,
  nodes: EvidenceNode[],
  selectedNodeId: string | null,
  showLabels: boolean,
  filterType: string,
  filterStrength: string
) => {
  nodes.forEach((node) => {
    if (filterType !== 'all' && node.type !== filterType) return;
    if (filterStrength !== 'all' && node.strength !== filterStrength) return;

    // Node circle
    ctx.fillStyle = node.color!;
    ctx.strokeStyle = selectedNodeId === node.id ? '#1f2937' : '#6b7280';
    ctx.lineWidth = selectedNodeId === node.id ? 3 : 1;

    ctx.beginPath();
    ctx.arc(node.x!, node.y!, node.size!, 0, 2 * Math.PI);
    ctx.fill();
    ctx.stroke();

    // Strength indicator
    ctx.fillStyle = '#ffffff';
    ctx.beginPath();
    ctx.arc(node.x! + node.size! * 0.6, node.y! - node.size! * 0.6, 8, 0, 2 * Math.PI);
    ctx.fill();
    ctx.stroke();

    // Labels
    if (showLabels) {
      ctx.fillStyle = '#1f2937';
      ctx.font = '12px sans-serif';
      ctx.textAlign = 'center';
      ctx.fillText(node.label, node.x!, node.y! + node.size! + 15);
    }
  });
};

export const findNodeAtPosition = (
  nodes: EvidenceNode[],
  x: number,
  y: number
): EvidenceNode | null => {
  return nodes.find(node => {
    const distance = Math.sqrt((x - node.x!) ** 2 + (y - node.y!) ** 2);
    return distance <= node.size!;
  }) || null;
};
