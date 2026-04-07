import { useState } from 'react';
import { useERD } from '@/context/ERDContext';
import { Code, Eye } from 'lucide-react';

export default function JsonSyncPanel() {
  const { schema, setSchema } = useERD();
  const [jsonText, setJsonText] = useState('');
  const [isJsonMode, setIsJsonMode] = useState(false);
  const [error, setError] = useState('');

  const toggleMode = () => {
    if (!isJsonMode) {
      setJsonText(JSON.stringify(schema, null, 2));
      setError('');
    } else {
      try {
        const parsed = JSON.parse(jsonText);
        if (parsed.entities && parsed.relationships) {
          setSchema(parsed);
          setError('');
        } else {
          setError('Invalid schema structure');
          return;
        }
      } catch {
        setError('Invalid JSON');
        return;
      }
    }
    setIsJsonMode(!isJsonMode);
  };

  return (
    <div className="h-full flex flex-col bg-code-bg">
      <div className="flex items-center justify-between px-4 py-2 border-b border-border/20">
        <span className="text-xs font-mono text-muted-foreground">
          {isJsonMode ? 'JSON Mode' : 'Visual Mode'}
        </span>
        <button
          onClick={toggleMode}
          className="flex items-center gap-1.5 px-3 py-1 rounded-md text-xs font-mono bg-primary/10 text-primary hover:bg-primary/20 transition-colors"
        >
          {isJsonMode ? <Eye size={12} /> : <Code size={12} />}
          {isJsonMode ? 'Apply & Switch to Visual' : 'Edit as JSON'}
        </button>
      </div>
      {isJsonMode && (
        <div className="flex-1 flex flex-col">
          {error && (
            <div className="px-4 py-1 text-xs text-destructive bg-destructive/10">{error}</div>
          )}
          <textarea
            className="flex-1 p-4 bg-transparent text-code-fg font-mono text-xs outline-none resize-none"
            value={jsonText}
            onChange={e => setJsonText(e.target.value)}
            spellCheck={false}
          />
        </div>
      )}
    </div>
  );
}
