import { Link } from 'react-router-dom';
import {
    Dna,
    Sparkles,
    ArrowRight,
    Microscope,
    ShieldCheck,
    Zap,
    BarChart3,
    Globe,
    Cpu
} from 'lucide-react';
import { Button } from '@/components/ui/button';

const Home = () => {
    return (
        <div className="min-h-[calc(100vh-80px)] relative overflow-hidden">
            {/* BACKGROUND DECORATIONS */}
            <div className="absolute inset-0 pointer-events-none">
                <div className="absolute top-[-10%] right-[-10%] w-[50%] h-[50%] bg-primary/10 blur-[120px] rounded-full animate-float" />
                <div className="absolute bottom-[-10%] left-[-10%] w-[50%] h-[50%] bg-accent/10 blur-[120px] rounded-full animate-float" style={{ animationDelay: '-3s' }} />

                {/* Decorative Grid */}
                <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:40px_40px] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)]" />
            </div>

            <div className="container mx-auto px-6 pt-20 pb-32 relative z-10">
                {/* HERO SECTION */}
                <div className="max-w-5xl mx-auto text-center space-y-8">
                    <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass border-primary/20 text-primary text-xs font-black uppercase tracking-[0.2em] animate-in fade-in slide-in-from-bottom-4 duration-700">
                        <Sparkles className="h-4 w-4" />
                        Platform v4.0 • Intelligence Redefined
                    </div>

                    <h1 className="text-6xl md:text-8xl font-black tracking-tighter leading-none animate-in fade-in slide-in-from-bottom-8 duration-1000">
                        DECODE THE <br />
                        <span className="text-gradient italic">LANGUAGE OF LIFE</span> 🧬
                    </h1>

                    <p className="text-xl md:text-2xl text-muted-foreground font-medium max-w-3xl mx-auto leading-relaxed animate-in fade-in slide-in-from-bottom-8 duration-1000 delay-200">
                        Harness the power of GeneForge to visualize, analyze, and manipulate genomic sequences
                        with unprecedented precision and speed. 🧪✨
                    </p>

                    <div className="pt-8 flex flex-col md:flex-row items-center justify-center gap-6 animate-in fade-in slide-in-from-bottom-8 duration-1000 delay-300">
                        <Link to="/analysis">
                            <Button size="lg" className="h-16 px-10 rounded-2xl bg-primary hover:bg-primary/90 text-primary-foreground font-black text-lg shadow-2xl shadow-primary/20 hover:shadow-primary/40 hover:scale-105 transition-all group">
                                Start Analysis
                                <ArrowRight className="ml-3 h-5 w-5 group-hover:translate-x-1 transition-transform" />
                            </Button>
                        </Link>
                        <Link to="/tools">
                            <Button size="lg" variant="outline" className="h-16 px-10 rounded-2xl glass border-border/50 hover:bg-muted font-black text-lg hover:scale-105 transition-all">
                                Explore Toolkit 🛠️
                            </Button>
                        </Link>
                    </div>
                </div>

                {/* FEATURE GRID */}
                <div className="mt-40 grid grid-cols-1 md:grid-cols-3 gap-8">
                    {[
                        {
                            icon: <Cpu className="h-8 w-8" />,
                            emoji: "⚡",
                            title: "Neural Processing",
                            description: "Instantaneous sequence evaluation using our proprietary bio-neural engine.",
                            color: "text-blue-500",
                            bg: "bg-blue-500/10"
                        },
                        {
                            icon: <ShieldCheck className="h-8 w-8" />,
                            emoji: "🛡️",
                            title: "Quantum Security",
                            description: "Your genomic data is encrypted with military-grade quantum-resistant protocols.",
                            color: "text-emerald-500",
                            bg: "bg-emerald-500/10"
                        },
                        {
                            icon: <BarChart3 className="h-8 w-8" />,
                            emoji: "📊",
                            title: "Deep Analytics",
                            description: "High-resolution visualization of base distribution and structural variations.",
                            color: "text-amber-500",
                            bg: "bg-amber-500/10"
                        }
                    ].map((feature, idx) => (
                        <div
                            key={idx}
                            className="glass-card rounded-[2.5rem] p-10 group relative overflow-hidden animate-in fade-in slide-in-from-bottom-8 duration-700"
                            style={{ animationDelay: `${idx * 150}ms` }}
                        >
                            <div className={`p-4 rounded-3xl inline-block ${feature.bg} ${feature.color} mb-6 group-hover:scale-110 transition-transform`}>
                                {feature.icon}
                            </div>
                            <h3 className="text-2xl font-black mb-4 flex items-center gap-2">
                                {feature.title} {feature.emoji}
                            </h3>
                            <p className="text-muted-foreground font-medium leading-relaxed">
                                {feature.description}
                            </p>
                        </div>
                    ))}
                </div>

                {/* TRUST SECTION */}
                <div className="mt-40 text-center animate-in fade-in duration-1000">
                    <p className="text-[10px] font-black uppercase tracking-[0.5em] text-muted-foreground/60 mb-12">
                        Trusted by top research institutions worldwide 🌐
                    </p>
                    <div className="flex flex-wrap justify-center items-center gap-12 md:gap-24 opacity-30 grayscale hover:grayscale-0 transition-all duration-700">
                        <div className="flex items-center gap-2 font-black text-2xl tracking-tighter">
                            <Globe className="h-8 w-8" /> BIOCORE
                        </div>
                        <div className="flex items-center gap-2 font-black text-2xl tracking-tighter">
                            <Zap className="h-8 w-8" /> QUANTUM LABS
                        </div>
                        <div className="flex items-center gap-2 font-black text-2xl tracking-tighter">
                            <Dna className="h-8 w-8" /> GENE-X
                        </div>
                        <div className="flex items-center gap-2 font-black text-2xl tracking-tighter">
                            <Microscope className="h-8 w-8" /> CELLULAR
                        </div>
                    </div>
                </div>
            </div>

            {/* FLOATING DECORATIONS */}
            <div className="absolute top-1/4 left-10 pointer-events-none opacity-20 hidden lg:block animate-float">
                <div className="text-6xl">🧬</div>
            </div>
            <div className="absolute bottom-1/4 right-10 pointer-events-none opacity-20 hidden lg:block animate-float" style={{ animationDelay: '-2s' }}>
                <div className="text-6xl">🔬</div>
            </div>
        </div>
    );
};

export default Home;
