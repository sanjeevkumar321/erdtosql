import { useERD } from '@/context/ERDContext';
import { 
  Plus, 
  RotateCcw, 
  Undo2, 
  Redo2, 
  Database, 
  FileDown, 
  ChevronDown, 
  Braces, 
  Box, 
  Image as ImageIcon,
  FileCode
} from 'lucide-react';
import { 
  generateSQL, 
  generatePostgreSQL, 
  generateMySQL, 
  generateSQLite, 
  generatePrisma, 
  generateJSONSchema 
} from '@/lib/codeGenerators';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { trackEvent } from '@/lib/analytics';

interface ToolbarProps {
  onAddEntity: () => void;
}

export default function Toolbar({ onAddEntity }: ToolbarProps) {
  const { schema, loadSample, resetCanvas, undo, redo, canUndo, canRedo } = useERD();

  const exportFile = (name: string, content: string, type: string) => {
    trackEvent('export_file', 'engagement', name);
    const blob = new Blob([content], { type });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = name;
    a.click();
    URL.revokeObjectURL(url);
  };

  const exportSvg = () => {
    trackEvent('export_svg', 'engagement', 'schema_diagram');
    const svg = document.querySelector('.react-flow__renderer svg') as SVGElement;
    if (!svg) return;

    const svgData = new XMLSerializer().serializeToString(svg);
    const blob = new Blob([svgData], { type: 'image/svg+xml;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'schema_diagram.svg';
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="absolute top-4 left-1/2 -translate-x-1/2 z-10 flex items-center gap-1 px-3 py-2 rounded-xl bg-toolbar-bg/95 backdrop-blur-md border border-border/60 shadow-xl">
      <button
        onClick={onAddEntity}
        className="flex items-center gap-1.5 px-4 py-2 rounded-lg text-xs font-display font-semibold bg-primary text-primary-foreground hover:bg-primary/90 transition-all hover:shadow-md active:scale-95"
      >
        <Plus size={14} strokeWidth={2.5} /> Add Table
      </button>
      
      <div className="w-px h-6 bg-border/60 mx-1.5" />
      
      <button onClick={undo} disabled={!canUndo}
        className="p-2 rounded-lg text-muted-foreground hover:text-foreground hover:bg-muted disabled:opacity-25 disabled:hover:bg-transparent transition-all"
        title="Undo (Ctrl+Z)">
        <Undo2 size={15} />
      </button>
      <button onClick={redo} disabled={!canRedo}
        className="p-2 rounded-lg text-muted-foreground hover:text-foreground hover:bg-muted disabled:opacity-25 disabled:hover:bg-transparent transition-all"
        title="Redo (Ctrl+Y)">
        <Redo2 size={15} />
      </button>
      
      <div className="w-px h-6 bg-border/60 mx-1.5" />
      
      <button onClick={loadSample}
        className="flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs font-display text-muted-foreground hover:text-foreground hover:bg-muted transition-all"
        title="Load Sample Schema">
        <Database size={13} /> Sample
      </button>

      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <button
            className="flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs font-display text-muted-foreground hover:text-foreground hover:bg-muted transition-all"
            title="Export Schema"
          >
            <FileDown size={13} /> Export <ChevronDown size={10} className="opacity-50" />
          </button>
        </DropdownMenuTrigger>
        <DropdownMenuContent className="w-48 bg-popover/95 backdrop-blur-md border-border/40">
          <DropdownMenuLabel className="text-[10px] uppercase tracking-wider text-muted-foreground font-display">SQL Dialects</DropdownMenuLabel>
          <DropdownMenuItem onClick={() => exportFile('schema.sql', generateSQL(schema), 'text/sql')} className="text-xs flex items-center gap-2">
            <FileCode size={13} className="text-blue-400" /> Standard SQL
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => exportFile('schema_pg.sql', generatePostgreSQL(schema), 'text/sql')} className="text-xs flex items-center gap-2">
            <Database size={13} className="text-indigo-400" /> PostgreSQL
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => exportFile('schema_mysql.sql', generateMySQL(schema), 'text/sql')} className="text-xs flex items-center gap-2">
            <Database size={13} className="text-orange-400" /> MySQL
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => exportFile('schema_sqlite.sql', generateSQLite(schema), 'text/sql')} className="text-xs flex items-center gap-2">
            <Database size={13} className="text-slate-400" /> SQLite
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuLabel className="text-[10px] uppercase tracking-wider text-muted-foreground font-display">Modern Tools</DropdownMenuLabel>
          <DropdownMenuItem onClick={() => exportFile('schema.prisma', generatePrisma(schema), 'text/plain')} className="text-xs flex items-center gap-2">
            <Box size={13} className="text-blue-500" /> Prisma Schema
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => exportFile('schema.json', generateJSONSchema(schema), 'application/json')} className="text-xs flex items-center gap-2">
            <Braces size={13} className="text-amber-400" /> JSON Schema
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      <button onClick={resetCanvas}
        className="flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs font-display text-destructive/60 hover:text-destructive hover:bg-destructive/5 transition-all"
        title="Clear Canvas">
        <RotateCcw size={13} /> Reset
      </button>
    </div>
  );
}
