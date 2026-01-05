import { useLocation, Link } from "react-router-dom";
import { useEffect } from "react";
import { Dna, ArrowLeft, AlertTriangle, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";

const NotFound = () => {
  const location = useLocation();

  useEffect(() => {
    console.error(
      "404 Error: User attempted to access non-existent route:",
      location.pathname
    );
  }, [location.pathname]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-6 relative overflow-hidden">
      {/* Background Orbs */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full max-w-4xl pointer-events-none opacity-20">
        <div className="absolute top-0 right-0 w-96 h-96 bg-primary blur-[120px] rounded-full animate-float" />
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-accent blur-[120px] rounded-full animate-float" style={{ animationDelay: '-2s' }} />
      </div>

      <div className="relative z-10 glass rounded-[3rem] p-12 md:p-20 max-w-2xl w-full text-center border-border/50 shadow-2xl animate-in zoom-in duration-700">
        <div className="flex justify-center mb-10">
          <div className="relative group">
            <div className="absolute inset-0 bg-primary/20 blur-2xl rounded-full scale-150 group-hover:bg-primary/30 transition-all" />
            <div className="relative p-6 rounded-3xl bg-primary/10 text-primary border border-primary/20">
              <Dna className="h-16 w-16 animate-dna-spin" />
            </div>
            <div className="absolute -top-2 -right-2 p-2 rounded-xl bg-destructive text-destructive-foreground rotate-12 shadow-lg">
              <AlertTriangle className="h-4 w-4" />
            </div>
          </div>
        </div>

        <div className="space-y-6">
          <div className="space-y-2">
            <h1 className="text-8xl font-black tracking-tighter text-gradient leading-none">404</h1>
            <p className="text-[10px] font-black uppercase tracking-[0.5em] text-muted-foreground ml-2">Sequence Not Identified</p>
          </div>

          <div className="space-y-4">
            <h2 className="text-3xl font-black tracking-tight">Genomic Path Misaligned.</h2>
            <p className="text-muted-foreground font-medium text-lg leading-relaxed">
              The digital sequence for <code className="px-2 py-0.5 rounded-md bg-muted text-primary font-mono text-sm">{location.pathname}</code> does not exist in our master index.
            </p>
          </div>

          <div className="pt-8 flex flex-col md:flex-row gap-4 justify-center">
            <Link to="/analysis">
              <Button className="w-full md:w-auto px-10 py-7 rounded-2xl bg-primary hover:bg-primary/90 text-primary-foreground font-black shadow-xl shadow-primary/20 gap-3 group">
                <ArrowLeft className="h-4 w-4 group-hover:-translate-x-1 transition-transform" />
                Back to Analysis
              </Button>
            </Link>
            <Link to="/tools">
              <Button variant="outline" className="w-full md:w-auto px-10 py-7 rounded-2xl glass border-border/50 hover:bg-muted font-black gap-3">
                <Sparkles className="h-4 w-4 text-accent" />
                Explore Tools
              </Button>
            </Link>
          </div>
        </div>

        <div className="mt-16 flex items-center justify-center gap-2 opacity-30">
          <div className="h-[1px] w-8 bg-muted-foreground" />
          <span className="text-[9px] font-black uppercase tracking-[0.3em]">System IntelligenceLayer v4.0.2</span>
          <div className="h-[1px] w-8 bg-muted-foreground" />
        </div>
      </div>
    </div>
  );
};

export default NotFound;
