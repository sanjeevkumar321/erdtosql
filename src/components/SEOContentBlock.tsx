import { useState } from 'react';
import { ChevronDown, Info, BookOpen, CheckCircle, Sparkles } from 'lucide-react';

interface SEOContentBlockProps {
  content: string;
  title: string;
}

export default function SEOContentBlock({ content, title }: SEOContentBlockProps) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="w-full max-w-4xl mx-auto mt-20 mb-10 overflow-hidden rounded-3xl border border-primary/10 bg-gradient-to-b from-card/50 to-muted/20 backdrop-blur-sm shadow-xl transition-all hover:border-primary/30 group">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full p-8 flex items-center justify-between text-left focus:outline-none focus-visible:ring-2 focus-visible:ring-primary/20 transition-all"
      >
        <div className="flex items-center gap-4">
          <div className="p-3 rounded-2xl bg-primary/10 text-primary group-hover:scale-110 transition-transform">
            <Sparkles size={24} />
          </div>
          <div>
            <h2 className="text-2xl font-bold tracking-tight text-foreground/90 leading-tight">
              Deep Dive: {title}
            </h2>
            <p className="text-sm text-muted-foreground mt-1 flex items-center gap-1.5 font-medium">
              <BookOpen size={14} className="text-primary/60" />
              Everything you need to know about our visual modeling tool
            </p>
          </div>
        </div>
        <div className={`p-2 rounded-full bg-muted/40 text-muted-foreground transition-all duration-300 ${isOpen ? 'rotate-180 bg-primary/10 text-primary' : ''}`}>
          <ChevronDown size={22} />
        </div>
      </button>

      <div 
        className={`transition-all duration-500 ease-in-out overflow-hidden ${
          isOpen ? 'max-h-[2000px] opacity-100' : 'max-h-0 opacity-0'
        }`}
      >
        <div className="px-8 pb-10">
          <div className="h-px w-full bg-gradient-to-r from-transparent via-primary/20 to-transparent mb-10" />
          <div 
            className="prose prose-invert max-w-none prose-h2:text-2xl prose-h2:font-bold prose-h2:mt-8 prose-h2:mb-4 prose-h3:text-xl prose-h3:font-semibold prose-h3:mt-6 prose-p:text-muted-foreground prose-p:leading-relaxed prose-li:text-muted-foreground prose-strong:text-foreground prose-ul:my-6 prose-li:my-2"
            dangerouslySetInnerHTML={{ __html: content }}
          />
          
          <div className="mt-12 p-6 rounded-2xl bg-primary/5 border border-primary/10 flex flex-col sm:flex-row items-center gap-6">
            <div className="p-4 rounded-xl bg-primary text-primary-foreground shadow-lg shrink-0">
              <CheckCircle size={28} />
            </div>
            <div className="flex-1 space-y-1 text-center sm:text-left">
              <h4 className="font-bold text-lg text-foreground">Ready to Build Your Schema?</h4>
              <p className="text-sm text-muted-foreground">Stop writing SQL by hand. Join thousands of developers who design visually and ship faster.</p>
            </div>
            <button 
              onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
              className="px-6 py-3 rounded-xl bg-foreground text-background font-bold text-sm hover:scale-105 active:scale-95 transition-all shadow-md shrink-0"
            >
              Start Designing Now
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
