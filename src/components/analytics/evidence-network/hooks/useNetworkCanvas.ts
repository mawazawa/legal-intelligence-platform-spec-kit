import { useEffect, RefObject } from 'react';
import { EvidenceNode, EvidenceEdge } from '../types';
import { drawEdges, drawNodes } from '../utils/canvasUtils';

export const useNetworkCanvas = (
  canvasRef: RefObject<HTMLCanvasElement>,
  nodes: EvidenceNode[],
  edges: EvidenceEdge[],
  zoom: number,
  pan: { x: number; y: number },
  selectedNode: EvidenceNode | null,
  showLabels: boolean,
  showEdges: boolean,
  filterType: string,
  filterStrength: string
) => {
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Clear canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Apply zoom and pan
    ctx.save();
    ctx.scale(zoom, zoom);
    ctx.translate(pan.x, pan.y);

    // Draw edges
    if (showEdges) {
      drawEdges(ctx, edges, nodes);
    }

    // Draw nodes
    drawNodes(ctx, nodes, selectedNode?.id || null, showLabels, filterType, filterStrength);

    ctx.restore();
  }, [canvasRef, nodes, edges, zoom, pan, selectedNode, showLabels, showEdges, filterType, filterStrength]);
};
