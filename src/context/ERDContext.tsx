import { createContext, useContext, useCallback, useState, useEffect, useRef, type ReactNode } from 'react';
import { ERDSchema, Entity, Column, Relationship, RelationshipType, DataType } from '@/types/erd';
import { sampleSchema } from '@/data/sampleSchema';

const STORAGE_KEY = 'schema-forge-project';

interface SavedProject {
  schema: ERDSchema;
  nodePositions: Record<string, { x: number; y: number }>;
}

function loadFromStorage(): SavedProject | null {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) return JSON.parse(raw);
  } catch { /* ignore */ }
  return null;
}

function saveToStorage(project: SavedProject) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(project));
  } catch { /* ignore */ }
}
interface HistoryEntry {
  schema: ERDSchema;
}

interface ERDContextType {
  schema: ERDSchema;
  setSchema: (s: ERDSchema) => void;
  addEntity: (name: string, position?: { x: number; y: number }) => string;
  removeEntity: (id: string) => void;
  updateEntity: (id: string, updates: Partial<Entity>) => void;
  addColumn: (entityId: string) => void;
  removeColumn: (entityId: string, columnId: string) => void;
  updateColumn: (entityId: string, columnId: string, updates: Partial<Column>) => void;
  addRelationship: (sourceId: string, targetId: string, type: RelationshipType) => void;
  removeRelationship: (id: string) => void;
  updateRelationship: (id: string, updates: Partial<Relationship>) => void;
  loadSample: () => void;
  resetCanvas: () => void;
  undo: () => void;
  redo: () => void;
  canUndo: boolean;
  canRedo: boolean;
  nodePositions: Record<string, { x: number; y: number }>;
  saveNodePositions: (positions: Record<string, { x: number; y: number }>) => void;
}

const ERDContext = createContext<ERDContextType | null>(null);

export function useERD() {
  const ctx = useContext(ERDContext);
  if (!ctx) throw new Error('useERD must be inside ERDProvider');
  return ctx;
}

let entityCounter = 0;
let columnCounter = 0;
let relCounter = 0;

export function ERDProvider({ children }: { children: ReactNode }) {
  const saved = loadFromStorage();
  const initialSchema = saved?.schema ?? { entities: [], relationships: [] };
  const [schema, setSchemaRaw] = useState<ERDSchema>(initialSchema);
  const [history, setHistory] = useState<HistoryEntry[]>([{ schema: initialSchema }]);
  const [historyIndex, setHistoryIndex] = useState(0);
  const [nodePositions, setNodePositions] = useState<Record<string, { x: number; y: number }>>(saved?.nodePositions ?? {});
  const historyTimerRef = useRef<NodeJS.Timeout | null>(null);

  const pushHistory = useCallback((newSchema: ERDSchema, immediate = false) => {
    if (historyTimerRef.current) {
      clearTimeout(historyTimerRef.current);
    }

    const update = () => {
      setHistory(prev => {
        const current = prev[historyIndex];
        // Deep compare to avoid redundant history entries
        if (JSON.stringify(current?.schema) === JSON.stringify(newSchema)) {
          return prev;
        }
        const sliced = prev.slice(0, historyIndex + 1);
        return [...sliced, { schema: newSchema }];
      });
      setHistoryIndex(prev => {
        const sliced = history.slice(0, prev + 1);
        if (JSON.stringify(sliced[sliced.length - 1]?.schema) === JSON.stringify(newSchema)) {
          return prev;
        }
        return prev + 1;
      });
    };

    if (immediate) {
      update();
    } else {
      historyTimerRef.current = setTimeout(update, 1000);
    }
  }, [historyIndex, history]);

  const setSchema = useCallback((s: ERDSchema) => {
    setSchemaRaw(s);
    pushHistory(s, true);
  }, [pushHistory]);

  const undo = useCallback(() => {
    if (historyIndex > 0) {
      const newIndex = historyIndex - 1;
      setHistoryIndex(newIndex);
      setSchemaRaw(history[newIndex].schema);
    }
  }, [historyIndex, history]);

  const redo = useCallback(() => {
    if (historyIndex < history.length - 1) {
      const newIndex = historyIndex + 1;
      setHistoryIndex(newIndex);
      setSchemaRaw(history[newIndex].schema);
    }
  }, [historyIndex, history]);

  const addEntity = useCallback((name: string) => {
    const id = `entity-${++entityCounter}-${Date.now()}`;
    const newEntity: Entity = {
      id,
      name,
      columns: [
        {
          id: `col-${++columnCounter}`,
          name: 'id',
          type: 'SERIAL' as DataType,
          isPrimaryKey: true,
          isUnique: true,
          isRequired: true,
        },
      ],
    };
    setSchemaRaw(prev => {
      const next = { ...prev, entities: [...prev.entities, newEntity] };
      pushHistory(next, true);
      return next;
    });
    return id;
  }, [pushHistory]);

  const removeEntity = useCallback((id: string) => {
    setSchemaRaw(prev => {
      const next = {
        entities: prev.entities.filter(e => e.id !== id),
        relationships: prev.relationships.filter(r => r.sourceEntityId !== id && r.targetEntityId !== id),
      };
      pushHistory(next, true);
      return next;
    });
  }, [pushHistory]);

  const updateEntity = useCallback((id: string, updates: Partial<Entity>) => {
    setSchemaRaw(prev => {
      const next = {
        ...prev,
        entities: prev.entities.map(e => e.id === id ? { ...e, ...updates } : e),
      };
      pushHistory(next, updates.name === undefined); // Debounce if name is being updated
      return next;
    });
  }, [pushHistory]);

  const addColumn = useCallback((entityId: string) => {
    const colId = `col-${++columnCounter}`;
    const newCol: Column = {
      id: colId,
      name: 'new_column',
      type: 'VARCHAR',
      isPrimaryKey: false,
      isUnique: false,
      isRequired: false,
    };
    setSchemaRaw(prev => {
      const next = {
        ...prev,
        entities: prev.entities.map(e =>
          e.id === entityId ? { ...e, columns: [...e.columns, newCol] } : e
        ),
      };
      pushHistory(next, true);
      return next;
    });
  }, [pushHistory]);

  const removeColumn = useCallback((entityId: string, columnId: string) => {
    setSchemaRaw(prev => {
      const next = {
        ...prev,
        entities: prev.entities.map(e =>
          e.id === entityId ? { ...e, columns: e.columns.filter(c => c.id !== columnId) } : e
        ),
      };
      pushHistory(next, true);
      return next;
    });
  }, [pushHistory]);

  const updateColumn = useCallback((entityId: string, columnId: string, updates: Partial<Column>) => {
    setSchemaRaw(prev => {
      const next = {
        ...prev,
        entities: prev.entities.map(e =>
          e.id === entityId
            ? { ...e, columns: e.columns.map(c => c.id === columnId ? { ...c, ...updates } : c) }
            : e
        ),
      };
      pushHistory(next, updates.name === undefined && updates.type === undefined); // Debounce if name/type is being updated
      return next;
    });
  }, [pushHistory]);

  const addRelationship = useCallback((sourceId: string, targetId: string, type: RelationshipType) => {
    const id = `rel-${++relCounter}`;
    const rel: Relationship = { id, sourceEntityId: sourceId, targetEntityId: targetId, type };
    setSchemaRaw(prev => {
      const next = { ...prev, relationships: [...prev.relationships, rel] };
      pushHistory(next, true);
      return next;
    });
  }, [pushHistory]);

  const removeRelationship = useCallback((id: string) => {
    setSchemaRaw(prev => {
      const next = { ...prev, relationships: prev.relationships.filter(r => r.id !== id) };
      pushHistory(next, true);
      return next;
    });
  }, [pushHistory]);

  const updateRelationship = useCallback((id: string, updates: Partial<Relationship>) => {
    setSchemaRaw(prev => {
      const next = {
        ...prev,
        relationships: prev.relationships.map(r => r.id === id ? { ...r, ...updates } : r),
      };
      pushHistory(next, true);
      return next;
    });
  }, [pushHistory]);

  const loadSample = useCallback(() => {
    setSchemaRaw(sampleSchema);
    pushHistory(sampleSchema);
    setNodePositions({});
  }, [pushHistory]);

  const resetCanvas = useCallback(() => {
    const empty: ERDSchema = { entities: [], relationships: [] };
    setSchemaRaw(empty);
    pushHistory(empty, true);
    setNodePositions({});
  }, [pushHistory]);

  const saveNodePositions = useCallback((positions: Record<string, { x: number; y: number }>) => {
    setNodePositions(positions);
  }, []);

  // Auto-save to localStorage
  useEffect(() => {
    saveToStorage({ schema, nodePositions });
  }, [schema, nodePositions]);

  return (
    <ERDContext.Provider value={{
      schema, setSchema,
      addEntity, removeEntity, updateEntity,
      addColumn, removeColumn, updateColumn,
      addRelationship, removeRelationship, updateRelationship,
      loadSample, resetCanvas,
      undo, redo,
      canUndo: historyIndex > 0,
      canRedo: historyIndex < history.length - 1,
      nodePositions, saveNodePositions,
    }}>
      {children}
    </ERDContext.Provider>
  );
}
