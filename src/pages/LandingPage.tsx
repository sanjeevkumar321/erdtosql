import { useParams, Link } from 'react-router-dom';
import { useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Database, Layout, Save, Share2, Code2, Zap } from 'lucide-react';

const SEO_CONTENT: Record<string, { title: string; description: string; features: string[] }> = {
  'postgresql-erd-designer': {
    title: 'Visual PostgreSQL ERD Designer',
    description: 'The most intuitive visual database designer for PostgreSQL. Create Entity Relationship Diagrams and generate production-ready SQL instantly.',
    features: ['PostgreSQL dialect support', 'Custom data types', 'Instant SQL generation', 'Foreign key visualization']
  },
  'mysql-schema-builder': {
    title: 'Free MySQL Schema Builder',
    description: 'Design your MySQL database schemas visually. Drag-and-drop tables, define relationships, and export SQL scripts.',
    features: ['MySQL 8.0+ support', 'Visual relationship mapping', 'Export to .sql files', 'Schema version control']
  },
  'sqlite-visual-editor': {
    title: 'Online SQLite Visual Database Editor',
    description: 'The perfect tool for SQLite database modeling. Design lightweight schemas with a powerful visual interface.',
    features: ['SQLite type mapping', 'Simple and fast UI', 'Local storage persistence', 'No installation required']
  },
  'prisma-schema-generator': {
    title: 'Visual Prisma Schema Generator',
    description: 'Convert your visual ERD diagrams directly into Prisma schema files. Model your data and get the schema.prisma you need.',
    features: ['Prisma model generation', 'One-to-many & Many-to-many support', 'Enums and Attributes', 'Modern developer experience']
  },
  'erd-to-sql-converter': {
    title: 'Visual ERD to SQL Converter',
    description: 'Convert your Entity Relationship Diagrams into clean, optimized SQL for any database system.',
    features: ['Multi-dialect support', 'Clean SQL output', 'Visual modeling', 'One-click export']
  }
};

export default function LandingPage() {
  const { slug } = useParams();
  const content = SEO_CONTENT[slug || 'erd-to-sql-converter'] || SEO_CONTENT['erd-to-sql-converter'];

  useEffect(() => {
    document.title = `${content.title} | ERDtoSQL`;
    const metaDescription = document.querySelector('meta[name="description"]');
    if (metaDescription) {
      metaDescription.setAttribute('content', content.description);
    }
  }, [content]);

  return (
    <div className="min-h-screen bg-background text-foreground font-display selection:bg-primary/20">
      <header className="fixed top-0 w-full border-b border-border/40 bg-background/80 backdrop-blur-md z-50">
        <div className="container flex h-16 items-center justify-between px-4 sm:px-8">
          <Link to="/" className="flex items-center gap-2.5 group">
            <div className="bg-primary p-2 rounded-lg shadow-lg group-hover:scale-105 transition-transform">
              <Database className="text-primary-foreground" size={20} />
            </div>
            <span className="font-bold text-lg tracking-tight">ERDtoSQL</span>
          </Link>
          <Link to="/">
            <Button variant="outline" size="sm">Open Studio</Button>
          </Link>
        </div>
      </header>

      <main className="pt-32 pb-20 px-4">
        <div className="container max-w-4xl mx-auto space-y-12">
          <div className="space-y-6 text-center">
            <h1 className="text-4xl sm:text-6xl font-extrabold tracking-tight bg-gradient-to-br from-foreground to-foreground/60 bg-clip-text text-transparent">
              {content.title}
            </h1>
            <p className="text-xl text-muted-foreground leading-relaxed">
              {content.description}
            </p>
            <div className="flex flex-wrap justify-center gap-4 pt-4">
              <Link to="/">
                <Button size="lg" className="px-8 py-6 text-lg rounded-xl shadow-xl hover:shadow-2xl transition-all">
                  Launch Visual Editor (Free)
                </Button>
              </Link>
              <Button variant="ghost" size="lg" className="px-8 py-6 text-lg rounded-xl">
                View Documentation
              </Button>
            </div>
          </div>

          <div className="grid sm:grid-cols-2 gap-6 pt-12 text-left">
            {content.features.map((feature, i) => (
              <div key={i} className="p-6 rounded-2xl border border-border/40 bg-muted/30 backdrop-blur-sm flex items-start gap-4 hover:border-primary/20 transition-colors">
                <div className="bg-primary/10 p-2.5 rounded-xl text-primary shrink-0">
                  <Zap size={20} />
                </div>
                <div className="space-y-1">
                  <h3 className="font-semibold text-lg">{feature}</h3>
                  <p className="text-muted-foreground text-sm leading-relaxed">
                    Built for performance and ease of use. Get the most out of your database design workflow.
                  </p>
                </div>
              </div>
            ))}
          </div>

          <div className="pt-20 border-t border-border/40">
            <div className="rounded-3xl overflow-hidden bg-muted/20 border border-border/40 shadow-2xl">
              <div className="p-8 sm:p-12 space-y-8 text-center bg-gradient-to-b from-transparent to-muted/20">
                <h2 className="text-3xl font-bold tracking-tight">Why Choose ERDtoSQL?</h2>
                <div className="grid sm:grid-cols-3 gap-8 text-sm">
                  {[
                    { icon: Layout, title: "Visual Design", text: "Drag-and-drop tables and draw relationships with ease." },
                    { icon: Save, title: "Auto-Save", text: "All your work is saved in your browser locally." },
                    { icon: Share2, title: "Easy Export", text: "Download SQL or Prisma schemas in seconds." }
                  ].map((item, i) => (
                    <div key={i} className="space-y-3">
                      <div className="mx-auto w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary">
                        <item.icon size={20} />
                      </div>
                      <h4 className="font-semibold">{item.title}</h4>
                      <p className="text-muted-foreground leading-relaxed">{item.text}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>

      <footer className="py-12 border-t border-border/40">
        <div className="container px-4 sm:px-8 text-center text-muted-foreground space-y-4">
          <div className="flex items-center justify-center gap-2 group mb-6">
            <Database className="text-primary" size={16} />
            <span className="font-bold text-foreground">ERDtoSQL</span>
          </div>
          <p className="text-sm max-w-lg mx-auto">
            Powered by high-performance visual modeling. The choice of database architects and developers worldwide.
          </p>
          <div className="pt-8 text-xs flex justify-center gap-6 opacity-60">
            <span>© 2026 ERDtoSQL</span>
            <Link to="/postgresql-erd-designer" className="hover:text-primary transition-colors">PostgreSQL Tool</Link>
            <Link to="/mysql-schema-builder" className="hover:text-primary transition-colors">MySQL Tool</Link>
            <Link to="/prisma-schema-generator" className="hover:text-primary transition-colors">Prisma Tool</Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
