import { useState, useEffect } from 'react';
import { ERDProvider } from '@/context/ERDContext';
import ERDCanvas from '@/components/erd/ERDCanvas';
import CodePanel from '@/components/erd/CodePanel';
import JsonSyncPanel from '@/components/erd/JsonSyncPanel';
import ThemeToggle from '@/components/ThemeToggle';
import { Code, Eye, GripVertical, Database } from 'lucide-react';

function ERDApp() {
  const [rightPanel, setRightPanel] = useState<'code' | 'json'>('code');
  const [splitPercent, setSplitPercent] = useState(55);
  const [isDragging, setIsDragging] = useState(false);

  const handleMouseDown = () => setIsDragging(true);
  const handleMouseUp = () => setIsDragging(false);
  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging) return;
    const percent = (e.clientX / window.innerWidth) * 100;
    setSplitPercent(Math.max(30, Math.min(75, percent)));
  };

  return (
    <div
      className="h-screen w-screen flex flex-col overflow-hidden bg-background select-none"
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
      onMouseLeave={handleMouseUp}
    >
      {/* Header */}
      <header className="h-13 border-b border-border/60 flex items-center justify-between px-5 bg-card/80 backdrop-blur-md shrink-0">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-primary to-primary/70 flex items-center justify-center shadow-sm">
            <Database size={16} className="text-primary-foreground" />
          </div>
          <div>
            <h1 className="text-sm font-display font-bold tracking-tight text-foreground leading-none">ERDtoSQL</h1>
            <span className="text-[10px] text-muted-foreground font-mono">Visual Database Designer</span>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-0.5 bg-muted/60 rounded-lg p-0.5">
            <button
              onClick={() => setRightPanel('code')}
              className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-md text-xs font-display font-medium transition-all ${
                rightPanel === 'code'
                  ? 'bg-card text-foreground shadow-sm'
                  : 'text-muted-foreground hover:text-foreground'
              }`}
            >
              <Code size={13} /> Code
            </button>
            <button
              onClick={() => setRightPanel('json')}
              className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-md text-xs font-display font-medium transition-all ${
                rightPanel === 'json'
                  ? 'bg-card text-foreground shadow-sm'
                  : 'text-muted-foreground hover:text-foreground'
              }`}
            >
              <Eye size={13} /> JSON
            </button>
          </div>
          <ThemeToggle />
        </div>
      </header>

      {/* Main */}
      <div className="flex-1 flex min-h-0">
        {/* Canvas */}
        <div style={{ width: `${splitPercent}%` }} className="h-full">
          <ERDCanvas />
        </div>

        {/* Divider */}
        <div
          onMouseDown={handleMouseDown}
          className={`w-1.5 cursor-col-resize flex items-center justify-center shrink-0 transition-colors ${
            isDragging ? 'bg-primary/40' : 'bg-border/60 hover:bg-primary/20'
          }`}
        >
          <GripVertical size={10} className="text-muted-foreground" />
        </div>

        {/* Right panel */}
        <div style={{ width: `${100 - splitPercent}%` }} className="h-full min-w-0">
          {rightPanel === 'code' ? <CodePanel /> : <JsonSyncPanel />}
        </div>
      </div>
    </div>
  );
}

export default function Index() {
  return (
    <ERDProvider>
      <ERDApp />
    </ERDProvider>
  );
}
