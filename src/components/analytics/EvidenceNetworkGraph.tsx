"use client";

import React, { useState, useRef } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Network } from 'lucide-react';
import { EvidenceNode, EvidenceNetworkGraphProps } from './evidence-network/types';
import { NetworkControls } from './evidence-network/components/NetworkControls';
import { NetworkLegend } from './evidence-network/components/NetworkLegend';
import { NodeDetails } from './evidence-network/components/NodeDetails';
import { useNetworkData } from './evidence-network/hooks/useNetworkData';
import { useNetworkCanvas } from './evidence-network/hooks/useNetworkCanvas';
import { exportNetworkImage } from './evidence-network/utils/networkUtils';
import { findNodeAtPosition } from './evidence-network/utils/canvasUtils';
import { CANVAS_CONFIG } from './evidence-network/constants';

const EvidenceNetworkGraph: React.FC<EvidenceNetworkGraphProps> = ({
  evidenceData,
  onNodeClick
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const { nodes, edges } = useNetworkData(evidenceData);
  const [selectedNode, setSelectedNode] = useState<EvidenceNode | null>(null);
  const [zoom, setZoom] = useState(1);
  const [pan, setPan] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const [showLabels, setShowLabels] = useState(true);
  const [showEdges, setShowEdges] = useState(true);
  const [filterType, setFilterType] = useState<string>('all');
  const [filterStrength, setFilterStrength] = useState<string>('all');

  useNetworkCanvas(
    canvasRef,
    nodes,
    edges,
    zoom,
    pan,
    selectedNode,
    showLabels,
    showEdges,
    filterType,
    filterStrength
  );

  const handleCanvasClick = (event: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const rect = canvas.getBoundingClientRect();
    const x = (event.clientX - rect.left) / zoom - pan.x;
    const y = (event.clientY - rect.top) / zoom - pan.y;

    const clickedNode = findNodeAtPosition(nodes, x, y);

    if (clickedNode) {
      setSelectedNode(clickedNode);
      onNodeClick?.(clickedNode);
    } else {
      setSelectedNode(null);
    }
  };

  const handleMouseDown = (event: React.MouseEvent<HTMLCanvasElement>) => {
    setIsDragging(true);
    setDragStart({ x: event.clientX, y: event.clientY });
  };

  const handleMouseMove = (event: React.MouseEvent<HTMLCanvasElement>) => {
    if (isDragging) {
      const deltaX = event.clientX - dragStart.x;
      const deltaY = event.clientY - dragStart.y;
      setPan(prev => ({ x: prev.x + deltaX, y: prev.y + deltaY }));
      setDragStart({ x: event.clientX, y: event.clientY });
    }
  };

  const handleWheel = (event: React.WheelEvent<HTMLCanvasElement>) => {
    event.preventDefault();
    const delta = event.deltaY > 0 ? 0.9 : 1.1;
    setZoom(prev => Math.max(CANVAS_CONFIG.minZoom, Math.min(CANVAS_CONFIG.maxZoom, prev * delta)));
  };

  const resetView = () => {
    setZoom(1);
    setPan({ x: 0, y: 0 });
  };

  const handleExport = () => {
    if (canvasRef.current) {
      exportNetworkImage(canvasRef.current);
    }
  };

  return (
    <div className="space-y-4">
      <NetworkControls
        showLabels={showLabels}
        showEdges={showEdges}
        filterType={filterType}
        filterStrength={filterStrength}
        onToggleLabels={() => setShowLabels(!showLabels)}
        onToggleEdges={() => setShowEdges(!showEdges)}
        onZoomIn={() => setZoom(prev => Math.min(CANVAS_CONFIG.maxZoom, prev * (1 + CANVAS_CONFIG.zoomStep)))}
        onZoomOut={() => setZoom(prev => Math.max(CANVAS_CONFIG.minZoom, prev * (1 - CANVAS_CONFIG.zoomStep)))}
        onReset={resetView}
        onExport={handleExport}
        onFilterTypeChange={setFilterType}
        onFilterStrengthChange={setFilterStrength}
      />

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Network className="h-5 w-5" />
            Evidence Network Graph
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="relative">
            <canvas
              ref={canvasRef}
              width={CANVAS_CONFIG.width}
              height={CANVAS_CONFIG.height}
              className="border border-slate-200 rounded-lg cursor-move"
              onClick={handleCanvasClick}
              onMouseDown={handleMouseDown}
              onMouseMove={handleMouseMove}
              onMouseUp={() => setIsDragging(false)}
              onWheel={handleWheel}
            />
            <NetworkLegend />
          </div>
        </CardContent>
      </Card>

      {selectedNode && <NodeDetails node={selectedNode} />}
    </div>
  );
};

export default EvidenceNetworkGraph;
