import { useParams, Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Database, Layout, Save, Share2, Zap } from 'lucide-react';
import { SEO_CONTENT } from '@/data/seoContent';
import SEO from '@/components/SEO';
import SEOContentBlock from '@/components/SEOContentBlock';

export default function LandingPage() {
  const { slug } = useParams();
  const content = SEO_CONTENT[slug || 'erd-to-sql-converter'] || SEO_CONTENT['erd-to-sql-converter'];

  return (
    <div className="min-h-screen bg-background text-foreground font-display selection:bg-primary/20 transition-colors">
      <SEO data={content} />
      
      <header className="fixed top-0 w-full border-b border-border/40 bg-background/80 backdrop-blur-md z-50">
        <div className="container flex h-16 items-center justify-between px-4 sm:px-8">
          <Link to="/" className="flex items-center gap-2.5 group">
            <div className="bg-primary p-2 rounded-lg shadow-lg group-hover:scale-105 transition-transform">
              <Database className="text-primary-foreground" size={20} />
            </div>
            <span className="font-bold text-lg tracking-tight">ERDtoSQL</span>
          </Link>
          <Link to="/">
            <Button variant="outline" size="sm" className="hover:bg-primary hover:text-primary-foreground transition-all">
              Open Studio
            </Button>
          </Link>
        </div>
      </header>

      <main className="pt-32 pb-20 px-4">
        <div className="container max-w-4xl mx-auto space-y-12">
          <div className="space-y-6 text-center animate-fade-in">
            <h1 className="text-4xl sm:text-6xl font-extrabold tracking-tight bg-gradient-to-br from-foreground to-foreground/60 bg-clip-text text-transparent leading-tight">
              {content.title}
            </h1>
            <p className="text-xl text-muted-foreground leading-relaxed max-w-2xl mx-auto">
              {content.description}
            </p>
            <div className="flex flex-wrap justify-center gap-4 pt-4">
              <Link to="/">
                <Button size="lg" className="px-8 py-7 text-lg rounded-2xl shadow-xl hover:shadow-2xl hover:scale-[1.02] transition-all bg-primary text-primary-foreground">
                  Launch Visual Editor (Free)
                </Button>
              </Link>
              <Button variant="outline" size="lg" className="px-8 py-7 text-lg rounded-2xl hover:bg-muted/50 transition-all border-border/60">
                View Documentation
              </Button>
            </div>
          </div>

          <div className="grid sm:grid-cols-2 gap-6 pt-12 text-left">
            {content.features.map((feature, i) => (
              <div key={i} className="p-7 rounded-2xl border border-border/40 bg-card/40 backdrop-blur-sm flex items-start gap-5 hover:border-primary/30 hover:bg-card/60 transition-all group">
                <div className="bg-primary/10 p-3 rounded-xl text-primary shrink-0 group-hover:scale-110 group-hover:bg-primary/20 transition-all">
                  <Zap size={22} />
                </div>
                <div className="space-y-2">
                  <h3 className="font-bold text-lg tracking-tight">{feature}</h3>
                  <p className="text-muted-foreground text-sm leading-relaxed opacity-80">
                    Engineered for maximum reliability. Capture your data architecture with precision and clarity.
                  </p>
                </div>
              </div>
            ))}
          </div>

          <div className="pt-20">
            <div className="rounded-[2.5rem] overflow-hidden bg-gradient-to-b from-muted/30 to-muted/10 border border-border/40 shadow-2xl relative">
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_0%,rgba(var(--primary-rgb),0.05),transparent_50%)]" />
              <div className="p-8 sm:p-16 space-y-12 text-center relative z-10">
                <h2 className="text-3xl font-extrabold tracking-tight">Why Architects Choose ERDtoSQL?</h2>
                <div className="grid sm:grid-cols-3 gap-10">
                  {[
                    { icon: Layout, title: "Visual Design", text: "Prototyping database models has never been faster." },
                    { icon: Save, title: "Local Persistence", text: "Your schemas stay in your browser. Privacy by default." },
                    { icon: Share2, title: "Multi-Format Export", text: "SQL, Prisma, or JSON. Choose what fits your stack." }
                  ].map((item, i) => (
                    <div key={i} className="space-y-4 group">
                      <div className="mx-auto w-14 h-14 rounded-2xl bg-primary/10 flex items-center justify-center text-primary group-hover:scale-110 group-hover:bg-primary group-hover:text-primary-foreground transition-all duration-300 shadow-sm">
                        <item.icon size={28} />
                      </div>
                      <h4 className="font-bold text-lg">{item.title}</h4>
                      <p className="text-muted-foreground leading-relaxed text-sm opacity-90">{item.text}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* SEO Content Block */}
          <SEOContentBlock 
            title={content.title} 
            content={content.longContent} 
          />
        </div>
      </main>

      <footer className="py-16 border-t border-border/40 bg-muted/20">
        <div className="container px-4 sm:px-8 text-center text-muted-foreground space-y-8">
          <div className="flex items-center justify-center gap-2.5 group">
            <div className="bg-primary/10 p-2 rounded-lg">
              <Database className="text-primary" size={20} />
            </div>
            <span className="font-bold text-xl text-foreground tracking-tight">ERDtoSQL</span>
          </div>
          <p className="text-sm max-w-xl mx-auto leading-relaxed">
            The free, open-source choice for database architects and modern developers worldwide. High-performance visual modeling at your fingertips.
          </p>
          <div className="pt-8 text-xs font-medium flex flex-wrap justify-center gap-x-8 gap-y-4 text-muted-foreground/60">
            <span>© 2026 ERDtoSQL Studio</span>
            <Link to="/postgresql-erd-designer" className="hover:text-primary transition-colors">PostgreSQL Tool</Link>
            <Link to="/mysql-schema-builder" className="hover:text-primary transition-colors">MySQL Tool</Link>
            <Link to="/prisma-schema-generator" className="hover:text-primary transition-colors">Prisma Tool</Link>
            <Link to="/erd-to-sql-converter" className="hover:text-primary transition-colors">SQL Converter</Link>
          </div>
        </div>
      </footer>
    </div>
  );
}

