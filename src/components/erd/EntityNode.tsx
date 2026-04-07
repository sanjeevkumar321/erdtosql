import { memo, useCallback, useState } from 'react';
import { Handle, Position, type NodeProps } from '@xyflow/react';
import { useERD } from '@/context/ERDContext';
import { DATA_TYPES, type DataType } from '@/types/erd';
import { Plus, Trash2, Key, Snowflake, Asterisk, Table2, Palette } from 'lucide-react';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';

const ENTITY_COLORS = [
  { name: 'Default', value: 'var(--primary)' },
  { name: 'Blue', value: '217 91% 60%' },
  { name: 'Green', value: '142 71% 45%' },
  { name: 'Amber', value: '38 92% 50%' },
  { name: 'Rose', value: '346 84% 61%' },
  { name: 'Indigo', value: '239 84% 67%' },
  { name: 'Purple', value: '270 91% 65%' },
];

function EntityNode({ data, selected }: NodeProps) {
  const { updateEntity, addColumn, removeColumn, updateColumn, removeEntity } = useERD();
  const entity = data.entity as any;
  const [editingName, setEditingName] = useState(false);
  const [nameValue, setNameValue] = useState(entity.name);

  const handleNameSave = useCallback(() => {
    updateEntity(entity.id, { name: nameValue });
    setEditingName(false);
  }, [entity.id, nameValue, updateEntity]);

  return (
    <div className={`min-w-[280px] rounded-xl overflow-hidden transition-all duration-200 ${
      selected
        ? 'shadow-2xl ring-2 ring-primary/40 scale-[1.02]'
        : 'shadow-md hover:shadow-lg'
    }`}
    style={{
      background: 'hsl(var(--card))',
      border: `1.5px solid ${entity.color ? `hsl(${entity.color})` : (selected ? 'hsl(var(--primary))' : 'hsl(var(--entity-border))')}`,
    }}
    >
      <Handle type="target" position={Position.Left}
        style={{ backgroundColor: entity.color ? `hsl(${entity.color})` : 'hsl(var(--primary))' }}
        className="!w-3.5 !h-3.5 !border-[2.5px] !border-card !rounded-full !-left-[7px]"
      />
      <Handle type="source" position={Position.Right}
        style={{ backgroundColor: entity.color ? `hsl(${entity.color})` : 'hsl(var(--primary))' }}
        className="!w-3.5 !h-3.5 !border-[2.5px] !border-card !rounded-full !-right-[7px]"
      />

      {/* Header */}
      <div className="px-3.5 py-2.5 flex items-center justify-between gap-2"
        style={{
          background: entity.color 
            ? `linear-gradient(135deg, hsl(${entity.color}), hsl(${entity.color} / 0.85))`
            : `linear-gradient(135deg, hsl(var(--entity-header)), hsl(var(--entity-header) / 0.85))`,
          color: 'hsl(var(--entity-header-foreground))',
        }}>
        <div className="flex items-center gap-2">
          <Table2 size={14} className="opacity-70" />
          {editingName ? (
            <input
              className="bg-white/15 backdrop-blur rounded px-1.5 py-0.5 border-none outline-none font-semibold text-sm w-full font-mono"
              value={nameValue}
              onChange={e => setNameValue(e.target.value)}
              onBlur={handleNameSave}
              onKeyDown={e => e.key === 'Enter' && handleNameSave()}
              autoFocus
            />
          ) : (
            <span
              className="font-semibold text-sm cursor-pointer font-mono tracking-wide"
              onDoubleClick={() => setEditingName(true)}
              title="Double-click to rename"
            >
              {entity.name}
            </span>
          )}
        </div>
        <div className="flex items-center gap-1">
          <Popover>
            <PopoverTrigger asChild>
              <button className="opacity-40 hover:opacity-100 hover:bg-white/15 rounded p-0.5 transition-all">
                <Palette size={13} />
              </button>
            </PopoverTrigger>
            <PopoverContent className="w-40 p-2 border-border/40 bg-popover/95 backdrop-blur-md" side="top">
              <div className="grid grid-cols-4 gap-1.5">
                {ENTITY_COLORS.map(c => (
                  <button
                    key={c.name}
                    className="w-full aspect-square rounded-md border border-white/10 transition-transform hover:scale-110 active:scale-95"
                    style={{ background: c.value.startsWith('var') ? `hsl(${c.value})` : `hsl(${c.value})` }}
                    onClick={() => updateEntity(entity.id, { color: c.value.startsWith('var') ? undefined : c.value })}
                    title={c.name}
                  />
                ))}
              </div>
            </PopoverContent>
          </Popover>
          <button onClick={() => removeEntity(entity.id)}
            className="opacity-40 hover:opacity-100 hover:bg-white/15 rounded p-0.5 transition-all">
            <Trash2 size={13} />
          </button>
        </div>
      </div>

      {/* Columns */}
      <div className="divide-y divide-border/50">
        {entity.columns.map((col: any, i: number) => (
          <div key={col.id}
            className="px-3.5 py-2 flex items-center gap-2 text-xs group hover:bg-muted/40 transition-colors"
          >
            <div className="flex items-center gap-1 shrink-0 w-5 justify-center">
              {col.isPrimaryKey && <Key size={11} className="text-amber-500" />}
              {col.isUnique && !col.isPrimaryKey && <Snowflake size={11} className="text-blue-400" />}
              {col.isRequired && !col.isPrimaryKey && !col.isUnique && <Asterisk size={9} className="text-destructive" />}
            </div>
            <input
              className="bg-transparent outline-none font-mono text-xs flex-1 min-w-0 text-foreground font-medium"
              value={col.name}
              onChange={e => updateColumn(entity.id, col.id, { name: e.target.value })}
            />
            <select
              className="bg-muted rounded px-1.5 py-0.5 outline-none font-mono text-[10px] text-muted-foreground cursor-pointer border-none [&>option]:bg-popover [&>option]:text-popover-foreground"
              value={col.type}
              onChange={e => updateColumn(entity.id, col.id, { type: e.target.value as DataType })}
            >
              {DATA_TYPES.map(t => <option key={t} value={t}>{t}</option>)}
            </select>
            <div className="flex items-center gap-0.5 opacity-0 group-hover:opacity-100 transition-opacity shrink-0">
              <button
                onClick={() => updateColumn(entity.id, col.id, { isPrimaryKey: !col.isPrimaryKey })}
                className={`p-1 rounded transition-colors ${col.isPrimaryKey ? 'text-amber-500 bg-amber-500/10' : 'text-muted-foreground hover:text-foreground hover:bg-muted'}`}
                title="Primary Key"
              >
                <Key size={10} />
              </button>
              <button
                onClick={() => updateColumn(entity.id, col.id, { isUnique: !col.isUnique })}
                className={`p-1 rounded transition-colors ${col.isUnique ? 'text-blue-400 bg-blue-400/10' : 'text-muted-foreground hover:text-foreground hover:bg-muted'}`}
                title="Unique"
              >
                <Snowflake size={10} />
              </button>
              <button
                onClick={() => updateColumn(entity.id, col.id, { isRequired: !col.isRequired })}
                className={`p-1 rounded transition-colors ${col.isRequired ? 'text-destructive bg-destructive/10' : 'text-muted-foreground hover:text-foreground hover:bg-muted'}`}
                title="Required"
              >
                <Asterisk size={9} />
              </button>
              <button
                onClick={() => removeColumn(entity.id, col.id)}
                className="p-1 text-muted-foreground hover:text-destructive hover:bg-destructive/10 rounded transition-colors"
                title="Remove"
              >
                <Trash2 size={10} />
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Add column */}
      <button
        onClick={() => addColumn(entity.id)}
        className="w-full px-3.5 py-2 text-xs text-muted-foreground hover:text-primary hover:bg-primary/5 flex items-center gap-1.5 transition-colors border-t border-border/30"
      >
        <Plus size={13} /> Add column
      </button>
    </div>
  );
}

export default memo(EntityNode);
