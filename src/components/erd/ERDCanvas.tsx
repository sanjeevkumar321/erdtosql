import { useState, useCallback, useEffect } from 'react';
import {
  ReactFlow,
  Background,
  Controls,
  MiniMap,
  useNodesState,
  useEdgesState,
  type Connection,
  type Edge,
  BackgroundVariant,
  MarkerType,
} from '@xyflow/react';
import '@xyflow/react/dist/style.css';
import { useERD } from '@/context/ERDContext';
import EntityNode from './EntityNode';
import ERDEdge from './ERDEdge';
import Toolbar from './Toolbar';
import RelationshipDialog from './RelationshipDialog';
import { sampleNodePositions } from '@/data/sampleSchema';
import type { RelationshipType } from '@/types/erd';
import { Database, Plus, ArrowRight } from 'lucide-react';

const nodeTypes = { entity: EntityNode };
const edgeTypes = { erd: ERDEdge };

export default function ERDCanvas() {
  const { schema, addEntity, addRelationship, removeRelationship, loadSample, undo, redo, nodePositions, saveNodePositions } = useERD();
  const [nodes, setNodes, onNodesChange] = useNodesState([]);
  const [edges, setEdges, onEdgesChange] = useEdgesState([]);
  const [pendingConnection, setPendingConnection] = useState<Connection | null>(null);

  // Keyboard shortcuts
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key === 'z' && !e.shiftKey) { e.preventDefault(); undo(); }
      if ((e.ctrlKey || e.metaKey) && (e.key === 'y' || (e.key === 'z' && e.shiftKey))) { e.preventDefault(); redo(); }
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [undo, redo]);

  // Sync entities → nodes
  useEffect(() => {
    setNodes(prev => {
      const existingPositions: Record<string, { x: number; y: number }> = {};
      prev.forEach(n => { existingPositions[n.id] = n.position; });

      return schema.entities.map((entity, i) => ({
        id: entity.id,
        type: 'entity',
        position: existingPositions[entity.id] || nodePositions[entity.id] || sampleNodePositions[entity.id] || { x: 100 + (i % 3) * 350, y: 80 + Math.floor(i / 3) * 300 },
        data: { entity },
        selected: prev.find(n => n.id === entity.id)?.selected || false,
      }));
    });
  }, [schema.entities, setNodes, nodePositions]);

  // Save node positions on drag end
  const handleNodesChange = useCallback((changes: any) => {
    onNodesChange(changes);
    const hasDrag = changes.some((c: any) => c.type === 'position' && c.dragging === false);
    if (hasDrag) {
      setNodes(current => {
        const positions: Record<string, { x: number; y: number }> = {};
        current.forEach(n => { positions[n.id] = n.position; });
        saveNodePositions(positions);
        return current;
      });
    }
  }, [onNodesChange, setNodes, saveNodePositions]);

  // Sync relationships → edges
  useEffect(() => {
    setEdges(
      schema.relationships.map(rel => ({
        id: rel.id,
        source: rel.sourceEntityId,
        target: rel.targetEntityId,
        type: 'erd',
        data: { onDelete: removeRelationship },
        animated: rel.type === 'N:M',
        label: rel.type,
        style: { stroke: 'hsl(var(--primary))', strokeWidth: 2 },
        markerEnd: { type: MarkerType.ArrowClosed, color: 'hsl(var(--primary))' },
      }))
    );
  }, [schema.relationships, setEdges, removeRelationship]);

  const onConnect = useCallback((connection: Connection) => {
    if (connection.source && connection.target && connection.source !== connection.target) {
      addRelationship(connection.source, connection.target, '1:N');
    }
  }, [addRelationship]);

  const onEdgesDelete = useCallback((deletedEdges: Edge[]) => {
    deletedEdges.forEach(e => removeRelationship(e.id));
  }, [removeRelationship]);

  const onEdgeClick = useCallback((_: React.MouseEvent, edge: Edge) => {
    const rel = schema.relationships.find(r => r.id === edge.id);
    if (!rel) return;

    // Cycle through types: 1:N -> N:M -> 1:1 -> 1:N
    const nextType: RelationshipType = 
      rel.type === '1:N' ? 'N:M' : 
      rel.type === 'N:M' ? '1:1' : '1:N';
    
    // Simple way to update: remove and add back with new type, or update context
    removeRelationship(rel.id);
    addRelationship(rel.sourceEntityId, rel.targetEntityId, nextType);
  }, [schema.relationships, addRelationship, removeRelationship]);

  const handleAddEntity = useCallback(() => {
    addEntity(`table_${schema.entities.length + 1}`);
  }, [addEntity, schema.entities.length]);

  const isEmpty = schema.entities.length === 0;

  return (
    <div className="h-full w-full relative">
      <Toolbar onAddEntity={handleAddEntity} />
      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodesChange={handleNodesChange}
        onEdgesChange={onEdgesChange}
        onConnect={onConnect}
        onEdgesDelete={onEdgesDelete}
        onEdgeClick={onEdgeClick}
        nodeTypes={nodeTypes}
        edgeTypes={edgeTypes}
        fitView
        snapToGrid
        snapGrid={[16, 16]}
        deleteKeyCode="Delete"
        className="bg-canvas"
        proOptions={{ hideAttribution: true }}
      >
        <Background variant={BackgroundVariant.Dots} gap={16} size={1.2} color="hsl(var(--canvas-dot))" />
        <Controls />
        <MiniMap
          nodeColor="hsl(var(--primary))"
          maskColor="hsl(var(--background) / 0.7)"
          style={{ borderRadius: 8 }}
        />
      </ReactFlow>

      {/* Empty state */}
      {isEmpty && (
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-[5]">
          <div className="flex flex-col items-center gap-5 pointer-events-auto animate-fade-in">
            <div className="w-16 h-16 rounded-2xl bg-muted/60 flex items-center justify-center">
              <Database size={28} className="text-muted-foreground" />
            </div>
            <div className="text-center">
              <p className="text-sm font-display font-semibold text-foreground">No tables yet</p>
              <p className="text-xs text-muted-foreground mt-1">Start designing your database schema</p>
            </div>
            <div className="flex items-center gap-3">
              <button
                onClick={handleAddEntity}
                className="flex items-center gap-1.5 px-5 py-2.5 rounded-xl text-sm font-display font-semibold bg-primary text-primary-foreground hover:bg-primary/90 shadow-lg shadow-primary/20 transition-all hover:shadow-xl active:scale-95"
              >
                <Plus size={16} /> Add Table
              </button>
              <button
                onClick={loadSample}
                className="flex items-center gap-1.5 px-5 py-2.5 rounded-xl text-sm font-display text-muted-foreground bg-muted hover:bg-muted/80 transition-all active:scale-95"
              >
                <ArrowRight size={14} /> Load Sample
              </button>
            </div>
            <p className="text-[10px] text-muted-foreground/60 font-mono">Ctrl+Z to undo · Drag between tables to connect</p>
          </div>
        </div>
      )}
    </div>
  );
}
