import { useState, useMemo, useCallback } from 'react';
import { 
  generateSQL, 
  generatePostgreSQL, 
  generateMySQL, 
  generateSQLite, 
  generatePrisma, 
  generateJSONSchema 
} from '@/lib/codeGenerators';
import { useERD } from '@/context/ERDContext';
import { Copy, Download, Check, Braces, Database, FileCode, Coffee, Box } from 'lucide-react';

type Tab = 'sql' | 'postgresql' | 'mysql' | 'sqlite' | 'prisma' | 'json';

const SQL_KEYWORDS = new Set([
  'CREATE','TABLE','NOT','NULL','PRIMARY','KEY','UNIQUE','REFERENCES',
  'DEFAULT','CONSTRAINT','FOREIGN','ON','DELETE','CASCADE','INSERT',
  'INTO','VALUES','SELECT','FROM','WHERE','ALTER','DROP','INDEX',
  'IF','EXISTS','SET','UPDATE','AND','OR','IN','AS','ADD','CHECK',
  'SERIAL','BIGSERIAL','GENERATED','ALWAYS','IDENTITY','BY',
  'MODEL', 'ENUM', 'DATASOURCE', 'GENERATOR', 'RELATION', 'FIELDS', 'REFERENCES' // Prisma-ish
]);

const SQL_TYPES = new Set([
  'INTEGER','INT','BIGINT','SMALLINT','TEXT','VARCHAR','CHAR','BOOLEAN',
  'TIMESTAMP','TIMESTAMPTZ','DATE','TIME','FLOAT','DOUBLE','DECIMAL',
  'NUMERIC','UUID','JSON','JSONB','BYTEA','SERIAL','BIGSERIAL',
  'REAL','BLOB','CLOB',
  'STRING', 'DATETIME', 'JSON', 'DECIMAL' // Prisma-ish
]);

function highlightSQL(code: string): React.ReactNode[] {
  return code.split('\n').map((line, li) => {
    const parts: React.ReactNode[] = [];
    if (line.trimStart().startsWith('--') || line.trimStart().startsWith('//')) {
      parts.push(<span key={0} className="comment">{line}</span>);
    } else {
      const regex = /('(?:[^'\\]|\\.)*')|(\b\d+\b)|(\b[A-Za-z_]\w*\b)|([^'A-Za-z_\d\s]+|\s+)/g;
      let m: RegExpExecArray | null;
      let idx = 0;
      while ((m = regex.exec(line)) !== null) {
        const [token, str, num, word] = m;
        if (str) {
          parts.push(<span key={idx++} className="string">{token}</span>);
        } else if (num) {
          parts.push(<span key={idx++} className="number">{token}</span>);
        } else if (word) {
          const upper = word.toUpperCase();
          if (SQL_KEYWORDS.has(upper)) {
            parts.push(<span key={idx++} className="keyword">{token}</span>);
          } else if (SQL_TYPES.has(upper)) {
            parts.push(<span key={idx++} className="type">{token}</span>);
          } else {
            parts.push(<span key={idx++}>{token}</span>);
          }
        } else {
          parts.push(<span key={idx++}>{token}</span>);
        }
      }
    }
    return <div key={li} className="leading-[1.7]">{parts.length ? parts : '\n'}</div>;
  });
}

function highlightJSON(code: string): React.ReactNode[] {
  return code.split('\n').map((line, li) => {
    const parts: React.ReactNode[] = [];
    const regex = /("(?:[^"\\]|\\.)*")\s*(:?)|(true|false|null)\b|(-?\d+(?:\.\d+)?(?:[eE][+-]?\d+)?)|([^\s"]+|\s+)/g;
    let m: RegExpExecArray | null;
    let idx = 0;
    while ((m = regex.exec(line)) !== null) {
      const [token, str, colon, keyword, num] = m;
      if (str) {
        if (colon) {
          parts.push(<span key={idx++} className="type">{str}</span>);
          parts.push(<span key={idx++}>{colon}</span>);
        } else {
          parts.push(<span key={idx++} className="string">{str}</span>);
        }
      } else if (keyword) {
        parts.push(<span key={idx++} className="keyword">{token}</span>);
      } else if (num) {
        parts.push(<span key={idx++} className="number">{token}</span>);
      } else {
        parts.push(<span key={idx++}>{token}</span>);
      }
    }
    return <div key={li} className="leading-[1.7]">{parts.length ? parts : '\n'}</div>;
  });
}

export default function CodePanel() {
  const { schema } = useERD();
  const [tab, setTab] = useState<Tab>('sql');
  const [copied, setCopied] = useState(false);

  const output = useMemo(() => {
    switch (tab) {
      case 'sql': return generateSQL(schema);
      case 'postgresql': return generatePostgreSQL(schema);
      case 'mysql': return generateMySQL(schema);
      case 'sqlite': return generateSQLite(schema);
      case 'prisma': return generatePrisma(schema);
      case 'json': return generateJSONSchema(schema);
    }
  }, [schema, tab]);

  const lines = useMemo(() => output.split('\n'), [output]);

  const highlighted = useMemo(() => {
    if (tab === 'json') return highlightJSON(output);
    // Prisma has its own keywords, but SQL highlighter is "close enough" for now or we can expand it
    return highlightSQL(output);
  }, [output, tab]);

  const copyToClipboard = useCallback(() => {
    navigator.clipboard.writeText(output);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }, [output]);

  const download = useCallback(() => {
    const extMap: Record<Tab, string> = {
      sql: 'sql', postgresql: 'sql', mysql: 'sql', sqlite: 'sql', prisma: 'prisma', json: 'json'
    };
    const mimeMap: Record<Tab, string> = {
      sql: 'text/sql', postgresql: 'text/sql', mysql: 'text/sql', sqlite: 'text/sql', prisma: 'text/plain', json: 'application/json'
    };
    const blob = new Blob([output], { type: mimeMap[tab] });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `schema.${extMap[tab]}`;
    a.click();
    URL.revokeObjectURL(url);
  }, [output, tab]);

  const tabs: { key: Tab; label: string; icon: any }[] = [
    { key: 'sql', label: 'SQL', icon: FileCode },
    { key: 'postgresql', label: 'Postgres', icon: Database },
    { key: 'mysql', label: 'MySQL', icon: Database },
    { key: 'sqlite', label: 'SQLite', icon: Database },
    { key: 'prisma', label: 'Prisma', icon: Box },
    { key: 'json', label: 'JSON Schema', icon: Braces },
  ];

  return (
    <div className="h-full flex flex-col bg-code-bg">
      {/* Tab bar */}
      <div className="flex items-center border-b border-white/5 bg-code-bg">
        {tabs.map(t => (
          <button
            key={t.key}
            onClick={() => setTab(t.key)}
            className={`px-4 py-3 text-xs font-mono flex items-center gap-1.5 transition-all border-b-2 ${
              tab === t.key
                ? 'border-primary text-code-fg bg-white/[0.03]'
                : 'border-transparent text-muted-foreground hover:text-code-fg hover:bg-white/[0.02]'
            }`}
          >
            <t.icon size={13} />
            {t.label}
          </button>
        ))}
        <div className="ml-auto flex items-center gap-0.5 pr-3">
          <button
            onClick={copyToClipboard}
            className="p-2 rounded-md text-muted-foreground hover:text-code-fg hover:bg-white/5 transition-all"
            title="Copy to clipboard"
          >
            {copied ? <Check size={14} className="text-accent" /> : <Copy size={14} />}
          </button>
          <button
            onClick={download}
            className="p-2 rounded-md text-muted-foreground hover:text-code-fg hover:bg-white/5 transition-all"
            title="Download file"
          >
            <Download size={14} />
          </button>
        </div>
      </div>

      {/* Code output with line numbers */}
      <div className="flex-1 overflow-auto">
        <div className="flex min-h-full">
          <div className="py-4 pl-4 pr-2 text-right select-none shrink-0 border-r border-white/5">
            {lines.map((_, i) => (
              <div key={i} className="font-mono text-xs leading-[1.7] text-white/15">{i + 1}</div>
            ))}
          </div>
          <pre className="code-output p-4 flex-1 whitespace-pre-wrap break-words">{highlighted}</pre>
        </div>
      </div>
    </div>
  );
}