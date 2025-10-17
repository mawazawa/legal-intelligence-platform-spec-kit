"use client";

import React, { useState, useEffect, useRef } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  Network, 
  Target, 
  Link, 
  Nodes, 
  ArrowRight, 
  ArrowLeft,
  CheckCircle2,
  XCircle,
  AlertCircle,
  Info,
  Filter,
  Search,
  ZoomIn,
  ZoomOut,
  RotateCcw,
  Download,
  Eye,
  EyeOff,
  Layers,
  Settings,
  BarChart3,
  PieChart,
  TrendingUp,
  Activity,
  Zap,
  Flame,
  Thunder,
  Lightning,
  Rocket,
  Star,
  Crown,
  Diamond,
  Sparkles,
  Award,
  Trophy
} from 'lucide-react';

interface EvidenceNode {
  id: string;
  label: string;
  type: 'petitioner' | 'respondent' | 'neutral' | 'legal' | 'financial' | 'timeline';
  strength: 'weak' | 'moderate' | 'strong' | 'airtight';
  verified: boolean;
  category: string;
  tags: string[];
  x?: number;
  y?: number;
  size?: number;
  color?: string;
}

interface EvidenceEdge {
  id: string;
  source: string;
  target: string;
  type: 'supports' | 'contradicts' | 'relates' | 'rebuts';
  strength: number;
  label?: string;
}

interface EvidenceNetworkGraphProps {
  evidenceData?: any[];
  onNodeClick?: (node: EvidenceNode) => void;
  onEdgeClick?: (edge: EvidenceEdge) => void;
}

const EvidenceNetworkGraph: React.FC<EvidenceNetworkGraphProps> = ({
  evidenceData,
  onNodeClick,
  onEdgeClick
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [nodes, setNodes] = useState<EvidenceNode[]>([]);
  const [edges, setEdges] = useState<EvidenceEdge[]>([]);
  const [selectedNode, setSelectedNode] = useState<EvidenceNode | null>(null);
  const [selectedEdge, setSelectedEdge] = useState<EvidenceEdge | null>(null);
  const [zoom, setZoom] = useState(1);
  const [pan, setPan] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const [showLabels, setShowLabels] = useState(true);
  const [showEdges, setShowEdges] = useState(true);
  const [filterType, setFilterType] = useState<string>('all');
  const [filterStrength, setFilterStrength] = useState<string>('all');

  // Initialize network data
  useEffect(() => {
    const networkNodes: EvidenceNode[] = evidenceData.map((item, index) => ({
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

    const networkEdges: EvidenceEdge[] = [];
    
    // Create edges based on relationships
    evidenceData.forEach((item) => {
      if (item.counterEvidence) {
        item.counterEvidence.forEach((counterId: string) => {
          networkEdges.push({
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
        // Find related evidence items
        evidenceData.forEach((otherItem) => {
          if (otherItem.id !== item.id && 
              (otherItem.tags.some(tag => item.tags.includes(tag)) ||
               otherItem.category === item.category)) {
            networkEdges.push({
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

    setNodes(networkNodes);
    setEdges(networkEdges);
  }, [evidenceData]);

  const getNodeSize = (strength: string) => {
    switch (strength) {
      case 'airtight': return 40;
      case 'strong': return 35;
      case 'moderate': return 30;
      case 'weak': return 25;
      default: return 30;
    }
  };

  const getNodeColor = (category: string, strength: string) => {
    if (category === 'petitioner') {
      switch (strength) {
        case 'airtight': return '#dc2626'; // red-600
        case 'strong': return '#ea580c'; // orange-600
        case 'moderate': return '#d97706'; // amber-600
        case 'weak': return '#ca8a04'; // yellow-600
        default: return '#dc2626';
      }
    } else if (category === 'respondent') {
      switch (strength) {
        case 'airtight': return '#059669'; // emerald-600
        case 'strong': return '#0d9488'; // teal-600
        case 'moderate': return '#0891b2'; // cyan-600
        case 'weak': return '#0284c7'; // sky-600
        default: return '#059669';
      }
    } else {
      return '#6b7280'; // gray-500
    }
  };

  const getEdgeColor = (type: string) => {
    switch (type) {
      case 'supports': return '#059669'; // emerald-600
      case 'contradicts': return '#dc2626'; // red-600
      case 'relates': return '#6b7280'; // gray-500
      case 'rebuts': return '#ea580c'; // orange-600
      default: return '#6b7280';
    }
  };

  const getStrengthIcon = (strength: string) => {
    switch (strength) {
      case 'airtight': return <CheckCircle2 className="h-4 w-4" />;
      case 'strong': return <CheckCircle2 className="h-4 w-4" />;
      case 'moderate': return <AlertCircle className="h-4 w-4" />;
      case 'weak': return <XCircle className="h-4 w-4" />;
      default: return <Info className="h-4 w-4" />;
    }
  };

  // Canvas drawing functions
  const drawNetwork = () => {
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
    }

    // Draw nodes
    nodes.forEach((node) => {
      if (filterType !== 'all' && node.type !== filterType) return;
      if (filterStrength !== 'all' && node.strength !== filterStrength) return;

      // Node circle
      ctx.fillStyle = node.color!;
      ctx.strokeStyle = selectedNode?.id === node.id ? '#1f2937' : '#6b7280';
      ctx.lineWidth = selectedNode?.id === node.id ? 3 : 1;
      
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

    ctx.restore();
  };

  useEffect(() => {
    drawNetwork();
  }, [nodes, edges, zoom, pan, selectedNode, showLabels, showEdges, filterType, filterStrength]);

  const handleCanvasClick = (event: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const rect = canvas.getBoundingClientRect();
    const x = (event.clientX - rect.left) / zoom - pan.x;
    const y = (event.clientY - rect.top) / zoom - pan.y;

    // Check for node clicks
    const clickedNode = nodes.find(node => {
      const distance = Math.sqrt((x - node.x!) ** 2 + (y - node.y!) ** 2);
      return distance <= node.size!;
    });

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

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  const handleWheel = (event: React.WheelEvent<HTMLCanvasElement>) => {
    event.preventDefault();
    const delta = event.deltaY > 0 ? 0.9 : 1.1;
    setZoom(prev => Math.max(0.1, Math.min(3, prev * delta)));
  };

  const resetView = () => {
    setZoom(1);
    setPan({ x: 0, y: 0 });
  };

  const exportNetwork = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const link = document.createElement('a');
    link.download = 'evidence-network.png';
    link.href = canvas.toDataURL();
    link.click();
  };

  return (
    <div className="space-y-4">
      {/* Controls */}
      <div className="flex flex-wrap items-center gap-4 p-4 bg-white rounded-lg border">
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setShowLabels(!showLabels)}
          >
            {showLabels ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
            Labels
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => setShowEdges(!showEdges)}
          >
            {showEdges ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
            Edges
          </Button>
        </div>

        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setZoom(prev => Math.min(3, prev * 1.2))}
          >
            <ZoomIn className="h-4 w-4" />
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => setZoom(prev => Math.max(0.1, prev * 0.8))}
          >
            <ZoomOut className="h-4 w-4" />
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={resetView}
          >
            <RotateCcw className="h-4 w-4" />
          </Button>
        </div>

        <select
          value={filterType}
          onChange={(e) => setFilterType(e.target.value)}
          className="px-3 py-1 border border-slate-300 rounded text-sm"
        >
          <option value="all">All Types</option>
          <option value="petitioner">Petitioner</option>
          <option value="respondent">Respondent</option>
          <option value="neutral">Neutral</option>
        </select>

        <select
          value={filterStrength}
          onChange={(e) => setFilterStrength(e.target.value)}
          className="px-3 py-1 border border-slate-300 rounded text-sm"
        >
          <option value="all">All Strengths</option>
          <option value="airtight">Airtight</option>
          <option value="strong">Strong</option>
          <option value="moderate">Moderate</option>
          <option value="weak">Weak</option>
        </select>

        <Button
          variant="outline"
          size="sm"
          onClick={exportNetwork}
        >
          <Download className="h-4 w-4" />
          Export
        </Button>
      </div>

      {/* Network Canvas */}
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
              width={800}
              height={600}
              className="border border-slate-200 rounded-lg cursor-move"
              onClick={handleCanvasClick}
              onMouseDown={handleMouseDown}
              onMouseMove={handleMouseMove}
              onMouseUp={handleMouseUp}
              onWheel={handleWheel}
            />
            
            {/* Legend */}
            <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-sm rounded-lg p-3 border border-slate-200">
              <h4 className="font-semibold text-sm mb-2">Legend</h4>
              <div className="space-y-1 text-xs">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-red-600"></div>
                  <span>Petitioner</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-emerald-600"></div>
                  <span>Respondent</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-gray-500"></div>
                  <span>Neutral</span>
                </div>
                <div className="flex items-center gap-2 mt-2">
                  <div className="w-4 h-0.5 bg-red-600"></div>
                  <span>Contradicts</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-4 h-0.5 bg-emerald-600"></div>
                  <span>Supports</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-4 h-0.5 bg-gray-500"></div>
                  <span>Related</span>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Selected Node Details */}
      {selectedNode && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              {getStrengthIcon(selectedNode.strength)}
              {selectedNode.label}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <h4 className="font-semibold text-sm mb-2">Details</h4>
                <div className="space-y-1 text-sm">
                  <div><strong>Type:</strong> {selectedNode.type}</div>
                  <div><strong>Strength:</strong> {selectedNode.strength}</div>
                  <div><strong>Verified:</strong> {selectedNode.verified ? 'Yes' : 'No'}</div>
                  <div><strong>Category:</strong> {selectedNode.category}</div>
                </div>
              </div>
              <div>
                <h4 className="font-semibold text-sm mb-2">Tags</h4>
                <div className="flex flex-wrap gap-1">
                  {selectedNode.tags.map((tag) => (
                    <Badge key={tag} variant="secondary" className="text-xs">
                      {tag}
                    </Badge>
                  ))}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default EvidenceNetworkGraph;
