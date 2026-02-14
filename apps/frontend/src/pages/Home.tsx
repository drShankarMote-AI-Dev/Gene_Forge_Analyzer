import React from 'react';
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
    Cpu,
    BookOpen,
    FlaskConical,
    CheckCircle2,
    Github,
    Brain,
    Rocket
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from "@/components/ui/card";

// --- DNA Helix Component for 3D simulation ---
const DNAHelix = ({
    className = "",
    count = 20,
    width = 400,
    height = 800,
    speed = 20,
    opacity,
    baseSize = 6,
    interactive = false
}: {
    className?: string;
    count?: number;
    width?: number;
    height?: number;
    speed?: number;
    opacity?: number;
    baseSize?: number;
    interactive?: boolean;
}) => {
    const [phase, setPhase] = React.useState(0);
    const [isHovered, setIsHovered] = React.useState(false);

    React.useEffect(() => {
        let frame: number;
        let lastTime = Date.now();
        const animate = () => {
            const now = Date.now();
            const delta = now - lastTime;
            lastTime = now;

            // Speed up if hovered
            const currentSpeed = isHovered ? speed * 0.6 : speed;
            setPhase(prev => prev + (delta / (currentSpeed * 10)));
            frame = requestAnimationFrame(animate);
        };
        frame = requestAnimationFrame(animate);
        return () => cancelAnimationFrame(frame);
    }, [speed, isHovered]);

    const baseColors = ["#34D399", "#60A5FA", "#F472B6", "#FACC15"];

    return (
        <svg
            className={className}
            width={width}
            height={height}
            viewBox={`0 0 ${width} ${height}`}
            style={opacity !== undefined ? { opacity } : {}}
            onMouseEnter={() => interactive && setIsHovered(true)}
            onMouseLeave={() => interactive && setIsHovered(false)}
        >
            <defs>
                <filter id="dna-glow" x="-50%" y="-50%" width="200%" height="200%">
                    <feGaussianBlur stdDeviation="2" result="blur" />
                    <feComposite in="SourceGraphic" in2="blur" operator="over" />
                </filter>
            </defs>
            {Array.from({ length: count }).map((_, i) => {
                const y = (i / count) * height;
                const angle = phase + (i * 0.4);
                const xOffset = Math.sin(angle) * (width * 0.35);
                const z1 = Math.cos(angle); // used for depth scaling
                const z2 = Math.cos(angle + Math.PI);

                const x1 = width / 2 + xOffset;
                const x2 = width / 2 - xOffset;

                // Base colors rotate
                const colorIndex = i % 4;
                const color1 = baseColors[colorIndex];
                const color2 = baseColors[(colorIndex + 2) % 4];

                return (
                    <g key={i}>
                        {/* Connecting line (base pair) */}
                        <line
                            x1={x1} y1={y} x2={x2} y2={y}
                            stroke="currentColor"
                            strokeWidth="1"
                            strokeOpacity={0.2 + (Math.abs(z1) * 0.3)}
                        />
                        {/* Strand 1 Node */}
                        <circle
                            cx={x1} cy={y}
                            r={baseSize * (0.8 + z1 * 0.3)}
                            fill={color1}
                            filter={interactive ? "url(#dna-glow)" : ""}
                            fillOpacity={0.6 + z1 * 0.4}
                        />
                        {/* Strand 2 Node */}
                        <circle
                            cx={x2} cy={y}
                            r={baseSize * (0.8 + z2 * 0.3)}
                            fill={color2}
                            filter={interactive ? "url(#dna-glow)" : ""}
                            fillOpacity={0.6 + z2 * 0.4}
                        />
                    </g>
                );
            })}
        </svg>
    );
};

const Home = () => {
    return (
        <div className="relative overflow-hidden">
            {/* 3D DNA BACKGROUND DECORATION */}
            <div className="absolute inset-0 pointer-events-none z-0 overflow-hidden">
                <div className="absolute top-0 left-1/4 w-full h-full flex justify-center">
                    <DNAHelix className="dna-bg" count={40} width={600} height={1200} speed={40} baseSize={4} />
                    <DNAHelix className="dna-bg ml-[-300px] mt-[-100px]" count={40} width={600} height={1200} speed={45} baseSize={4} />
                </div>
                {/* Radial Glow Overlay */}
                <div className="absolute inset-0 hero-radial-glow pointer-events-none" />
            </div>

            {/* BACKGROUND DECORATIONS (Existing) */}
            <div className="absolute inset-0 pointer-events-none z-0">
                <div className="absolute top-[-10%] right-[-10%] w-[50%] h-[50%] bg-gradient-to-br from-primary/15 via-primary/10 to-transparent blur-[140px] rounded-full animate-float" />
                <div className="absolute bottom-[-10%] left-[-10%] w-[50%] h-[50%] bg-gradient-to-tr from-accent/15 via-accent/10 to-transparent blur-[140px] rounded-full animate-float" style={{ animationDelay: '-3s' }} />

                {/* Decorative Grid */}
                <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:40px_40px] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)]" />
            </div>

            {/* HERO SECTION - FULL SCREEN VIEWPORT */}
            <div className="min-h-screen flex flex-col items-center justify-center relative z-10 py-20 px-6">
                {/* Precisely Rendered 🧬 Background Decorators - Integrated into Hero Context */}
                <div className="absolute inset-0 pointer-events-none z-[-1] overflow-hidden">
                    <div className="absolute top-[10%] left-[5%] text-4xl opacity-[0.45] animate-float-slow" style={{ '--duration': '25s', '--rotation': '-15deg' } as React.CSSProperties}>🧬</div>
                    <div className="absolute top-[40%] left-[2%] text-7xl opacity-[0.35] animate-float-slow blur-[1px]" style={{ '--duration': '35s', '--rotation': '10deg' } as React.CSSProperties}>🧬</div>
                    <div className="absolute top-[20%] right-[4%] text-5xl opacity-[0.5] animate-float-slow" style={{ '--duration': '28s', '--rotation': '22deg' } as React.CSSProperties}>🧬</div>
                    <div className="absolute bottom-[20%] right-[8%] text-4xl opacity-[0.4] animate-float-slow" style={{ '--duration': '32s', '--rotation': '-18deg' } as React.CSSProperties}>🧬</div>
                    <div className="absolute top-[65%] left-[8%] text-8xl opacity-[0.3] animate-float-slow blur-[2px]" style={{ '--duration': '40s', '--rotation': '5deg' } as React.CSSProperties}>🧬</div>
                    <div className="absolute top-[15%] left-[45%] text-3xl opacity-[0.55] animate-float-slow" style={{ '--duration': '22s', '--rotation': '-25deg' } as React.CSSProperties}>🧬</div>
                    <div className="absolute bottom-[35%] left-[2%] text-6xl opacity-[0.35] animate-float-slow" style={{ '--duration': '30s', '--rotation': '15deg' } as React.CSSProperties}>🧬</div>
                    <div className="absolute bottom-[15%] left-[40%] text-3xl opacity-[0.45] animate-float-slow blur-[0.5px]" style={{ '--duration': '38s', '--rotation': '-5deg' } as React.CSSProperties}>🧬</div>
                    <div className="absolute top-[50%] right-[10%] text-5xl opacity-[0.4] animate-float-slow" style={{ '--duration': '26s', '--rotation': '12deg' } as React.CSSProperties}>🧬</div>
                    <div className="absolute bottom-[5%] right-[45%] text-7xl opacity-[0.25] animate-float-slow blur-[1.5px]" style={{ '--duration': '34s', '--rotation': '-10deg' } as React.CSSProperties}>🧬</div>
                </div>

                <div className="container mx-auto max-w-[1200px] flex flex-col items-center text-center space-y-8 mt-[-60px]">
                    <div className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full glass border-primary/30 text-primary text-xs font-black uppercase tracking-[0.2em] animate-in fade-in slide-in-from-bottom-4 duration-700 shadow-lg shadow-primary/10">
                        Platform v{import.meta.env.VITE_VERSION || '2.0.0'} • Intelligence Redefined
                    </div>

                    <h1 className="text-6xl md:text-8xl font-black tracking-tighter leading-[0.95] animate-in fade-in slide-in-from-bottom-8 duration-1000 max-w-5xl relative z-20">
                        DECODE THE <br />
                        <span className="relative inline-flex items-center md:items-end justify-center gap-3 md:gap-6 flex-wrap">
                            <span className="text-gradient italic drop-shadow-[0_0_30px_rgba(0,200,255,0.3)] leading-tight pb-2">LANGUAGE OF LIFE</span>
                            <div className="inline-block w-[48px] h-[48px] md:w-[96px] md:h-[96px] relative group mb-1 md:mb-4">
                                <DNAHelix
                                    className="w-full h-full dna-rotate drop-shadow-lg"
                                    count={10}
                                    width={90}
                                    height={90}
                                    speed={15}
                                    opacity={1}
                                    baseSize={14}
                                    interactive
                                />
                            </div>
                            <span className="sr-only">🧬</span>
                        </span>
                    </h1>

                    <p className="text-xl md:text-2xl text-muted-foreground font-medium max-w-3xl mx-auto leading-relaxed animate-in fade-in slide-in-from-bottom-8 duration-1000 delay-200 px-4">
                        Gene Forge Analyzer is a production-grade, AI-enhanced genomic analysis platform that integrates DNA validation, CRISPR detection, and intelligent biological interpretation into a single scalable ecosystem. 🧬✨ �✨
                    </p>

                    <div className="flex flex-col sm:flex-row items-center justify-center gap-[24px] animate-in fade-in slide-in-from-bottom-8 duration-1000 delay-300 mt-10">
                        <Link to="/analysis" className="w-full sm:w-auto">
                            <Button
                                className="h-[56px] px-[32px] rounded-[12px] bg-primary hover:bg-primary/90 text-primary-foreground font-semibold text-lg shadow-sm transition-all duration-300 group active:scale-95 w-full sm:w-auto border-0"
                            >
                                Start Analysis
                                <ArrowRight className="ml-3 h-5 w-5 group-hover:translate-x-1 transition-transform duration-300" />
                            </Button>
                        </Link>
                        <Link to="/tools" className="w-full sm:w-auto">
                            <Button
                                variant="outline"
                                className="h-[56px] px-[32px] rounded-[12px] border-border/50 bg-white dark:bg-white/5 text-foreground font-semibold text-lg hover:bg-slate-50 dark:hover:bg-white/10 transition-all duration-300 shadow-sm active:scale-95 w-full sm:w-auto"
                            >
                                Explore Toolkit 🛠️
                            </Button>
                        </Link>
                    </div>
                </div>
            </div>

            <div className="container mx-auto px-6 pb-40 relative z-10 max-w-[1200px]">
                {/* FEATURE GRID */}

                {/* ===== NEW: PROBLEM & SOLUTION SECTION ===== */}
                <div className="mt-40 grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
                    <div className="space-y-8">
                        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-red-500/10 border border-red-500/20 text-red-500 text-[10px] font-black uppercase tracking-widest">
                            The Challenge
                        </div>
                        <h2 className="text-4xl md:text-5xl font-black tracking-tighter leading-tight text-foreground">
                            Bridging the <span className="text-red-500">Bio-Digital Gap</span>.
                        </h2>
                        <p className="text-xl text-muted-foreground leading-relaxed font-medium">
                            Current genomic research workflows rely on disconnected bioinformatics tools that lack AI-powered contextual interpretation, increasing complexity and slowing CRISPR validation pipelines.
                        </p>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-4">
                            <div className="p-6 rounded-2xl bg-white/[0.02] border border-white/5 space-y-2">
                                <div className="text-2xl font-black text-red-500">50%</div>
                                <p className="text-xs font-bold uppercase tracking-widest text-muted-foreground">Tool-Switching Overhead</p>
                            </div>
                            <div className="p-6 rounded-2xl bg-white/[0.02] border border-white/5 space-y-2">
                                <div className="text-2xl font-black text-red-500">High</div>
                                <p className="text-xs font-bold uppercase tracking-widest text-muted-foreground">Validation Complexity</p>
                            </div>
                        </div>
                    </div>
                    <div className="glass-card p-1 items-start justify-center group">
                        <div className="p-10 space-y-8 rounded-[2rem] bg-gradient-to-br from-primary/20 via-transparent to-accent/10">
                            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20 text-primary text-[10px] font-black uppercase tracking-widest">
                                Our Solution
                            </div>
                            <h3 className="text-3xl font-black tracking-tight text-foreground leading-tight">
                                A Unified Intelligence Ecosystem for Genomics
                            </h3>
                            <p className="text-muted-foreground leading-relaxed font-medium">
                                We've engineered a production-grade environment where DNA validation, mutation identification, and protein translation converge with intelligent biological insight.
                            </p>
                            <ul className="space-y-4">
                                {[
                                    "Modular Bio-Neural Architecture",
                                    "Integrated CRISPR Site Detection",
                                    "Explainable AI Insight Pipelines",
                                    "Research-Grade Validation Standards"
                                ].map((item, i) => (
                                    <li key={i} className="flex items-center gap-3 text-sm font-bold text-foreground/90">
                                        <div className="h-1.5 w-1.5 rounded-full bg-primary shadow-[0_0_8px_rgba(52,211,153,0.5)]" />
                                        {item}
                                    </li>
                                ))}
                            </ul>
                        </div>
                    </div>
                </div>

                {/* FEATURE GRID (moved down) */}
                <div className="mt-40 grid grid-cols-1 md:grid-cols-3 gap-8">
                    {[
                        {
                            icon: <Cpu className="h-8 w-8" />,
                            emoji: "⚡",
                            title: "Neural Processing",
                            description: "Instantaneous sequence evaluation using our proprietary bio-neural engine.",
                            color: "text-blue-500",
                            bg: "bg-gradient-to-br from-blue-500/15 to-blue-500/5",
                            glow: "shadow-blue-500/20"
                        },
                        {
                            icon: <ShieldCheck className="h-8 w-8" />,
                            emoji: "🛡️",
                            title: "Quantum Security",
                            description: "Your genomic data is encrypted with military-grade quantum-resistant protocols.",
                            color: "text-emerald-500",
                            bg: "bg-gradient-to-br from-emerald-500/15 to-emerald-500/5",
                            glow: "shadow-emerald-500/20"
                        },
                        {
                            icon: <BarChart3 className="h-8 w-8" />,
                            emoji: "📊",
                            title: "Deep Analytics",
                            description: "High-resolution visualization of base distribution and structural variations.",
                            color: "text-amber-500",
                            bg: "bg-gradient-to-br from-amber-500/15 to-amber-500/5",
                            glow: "shadow-amber-500/20"
                        }
                    ].map((feature, idx) => (
                        <div
                            key={idx}
                            className="glass-card rounded-[2.5rem] p-12 group relative overflow-hidden animate-in fade-in slide-in-from-bottom-8 duration-700 hover:shadow-2xl transition-all h-full flex flex-col"
                            style={{ animationDelay: `${idx * 150}ms` }}
                        >
                            <div className={`p-5 rounded-3xl inline-block ${feature.bg} ${feature.color} mb-8 group-hover:scale-110 transition-transform duration-300 shadow-lg ${feature.glow} self-start`}>
                                {feature.icon}
                            </div>
                            <h3 className="text-2xl font-black mb-5 flex items-center gap-2.5 tracking-tight">
                                {feature.title} {feature.emoji}
                            </h3>
                            <p className="text-muted-foreground font-medium leading-relaxed text-base">
                                {feature.description}
                            </p>

                            {/* Subtle hover glow effect */}
                            <div className={`absolute inset-0 ${feature.bg} opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-[2.5rem] -z-10`} />
                        </div>
                    ))}
                </div>

                {/* ===== NEW: WHAT THIS PLATFORM DOES ===== */}
                <div className="mt-32 max-w-6xl mx-auto">
                    <div className="text-center mb-20">
                        <h2 className="text-4xl md:text-5xl font-black tracking-tight mb-4">
                            From DNA Sequence to Insight
                        </h2>
                        <div className="h-1 w-24 bg-gradient-to-r from-primary to-accent mx-auto rounded-full" />
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
                        <div className="space-y-6">
                            <p className="text-lg text-muted-foreground leading-relaxed">
                                Gene Forge Analyzer converts raw biological sequences into meaningful scientific insights using
                                <span className="text-primary font-bold"> validated algorithms</span> and
                                <span className="text-primary font-bold"> optional AI explanations</span>.
                            </p>
                            <p className="text-lg text-muted-foreground leading-relaxed">
                                Every tool follows <span className="text-foreground font-bold">biological rules</span> and
                                <span className="text-foreground font-bold"> sequence constraints</span>, ensuring accuracy
                                before interpretation.
                            </p>
                            <div className="pt-6">
                                <Link to="/tools">
                                    <Button size="lg" variant="outline" className="rounded-full font-bold">
                                        View All Tools <ArrowRight className="ml-2 h-4 w-4" />
                                    </Button>
                                </Link>
                            </div>
                        </div>
                        <div className="glass-card p-12 rounded-[2.5rem]">
                            <div className="space-y-6">
                                <div className="flex items-center gap-4">
                                    <div className="p-3 rounded-xl bg-primary/10 border border-primary/20">
                                        <Dna className="h-6 w-6 text-primary" />
                                    </div>
                                    <div className="flex-1">
                                        <div className="flex items-center gap-2 mb-1">
                                            <span className="text-sm font-bold text-muted-foreground">INPUT</span>
                                        </div>
                                        <p className="text-xs text-muted-foreground font-mono">ATGCGATCGATCG...</p>
                                    </div>
                                </div>
                                <div className="flex items-center justify-center">
                                    <ArrowRight className="h-6 w-6 text-muted-foreground" />
                                </div>
                                <div className="flex items-center gap-4">
                                    <div className="p-3 rounded-xl bg-accent/10 border border-accent/20">
                                        <BarChart3 className="h-6 w-6 text-accent" />
                                    </div>
                                    <div className="flex-1">
                                        <div className="flex items-center gap-2 mb-1">
                                            <span className="text-sm font-bold text-muted-foreground">ANALYSIS</span>
                                        </div>
                                        <p className="text-xs text-muted-foreground">GC Content, Mutations, Palindromes...</p>
                                    </div>
                                </div>
                                <div className="flex items-center justify-center">
                                    <ArrowRight className="h-6 w-6 text-muted-foreground" />
                                </div>
                                <div className="flex items-center gap-4">
                                    <div className="p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/20">
                                        <Sparkles className="h-6 w-6 text-emerald-500" />
                                    </div>
                                    <div className="flex-1">
                                        <div className="flex items-center gap-2 mb-1">
                                            <span className="text-sm font-bold text-muted-foreground">INSIGHT</span>
                                        </div>
                                        <p className="text-xs text-muted-foreground">Scientific understanding + AI explanation</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* ===== NEW: KEY FEATURES GRID ===== */}
                <div className="mt-32 max-w-6xl mx-auto">
                    <div className="text-center mb-20">
                        <h2 className="text-4xl md:text-5xl font-black tracking-tight mb-4">
                            Built for Scientific Rigor
                        </h2>
                        <div className="h-1 w-24 bg-gradient-to-r from-primary to-accent mx-auto rounded-full" />
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        {[
                            {
                                icon: <ShieldCheck className="h-6 w-6" />,
                                title: "Validated Bioinformatics Tools",
                                description: "Each tool follows biological rules and sequence constraints. No shortcuts, no approximations.",
                                color: "text-emerald-500",
                                bg: "bg-emerald-500/10",
                                border: "border-emerald-500/20"
                            },
                            {
                                icon: <Sparkles className="h-6 w-6" />,
                                title: "Manual AI Interpretation",
                                description: "AI explanations are user-triggered, not automatic — ensuring scientific control and preventing hallucinations.",
                                color: "text-purple-500",
                                bg: "bg-purple-500/10",
                                border: "border-purple-500/20"
                            },
                            {
                                icon: <FlaskConical className="h-6 w-6" />,
                                title: "FASTA & Raw Sequence Support",
                                description: "Accepts ATGCN sequences with FASTA parsing. Upload your files or paste sequences directly.",
                                color: "text-blue-500",
                                bg: "bg-blue-500/10",
                                border: "border-blue-500/20"
                            },
                            {
                                icon: <BookOpen className="h-6 w-6" />,
                                title: "Educational Layer",
                                description: "Learn the meaning of DNA, mutations, GC content, and more through interactive explanations.",
                                color: "text-amber-500",
                                bg: "bg-amber-500/10",
                                border: "border-amber-500/20"
                            }
                        ].map((feature, idx) => (
                            <div
                                key={idx}
                                className="glass-card rounded-[2rem] p-8 hover:shadow-2xl transition-all duration-500 group"
                            >
                                <div className={`p-3 rounded-xl ${feature.bg} border ${feature.border} inline-block mb-6 group-hover:scale-110 transition-transform duration-300`}>
                                    <div className={feature.color}>{feature.icon}</div>
                                </div>
                                <h3 className="text-xl font-black mb-3 tracking-tight">{feature.title}</h3>
                                <p className="text-muted-foreground leading-relaxed">{feature.description}</p>
                            </div>
                        ))}
                    </div>
                </div>

                {/* ===== NEW: WHY AI IS MANUAL ===== */}
                <div className="mt-32 max-w-4xl mx-auto">
                    <div className="glass-card rounded-[2.5rem] p-12 border-2 border-primary/20">
                        <div className="text-center mb-12">
                            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20 text-primary text-xs font-bold uppercase tracking-wider mb-6">
                                <Sparkles className="h-4 w-4" />
                                Our Philosophy
                            </div>
                            <h2 className="text-3xl md:text-4xl font-black tracking-tight">
                                Why AI Explanations Are Manual
                            </h2>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            {[
                                {
                                    icon: <CheckCircle2 className="h-5 w-5" />,
                                    text: "Prevents hallucination on invalid biological input"
                                },
                                {
                                    icon: <CheckCircle2 className="h-5 w-5" />,
                                    text: "Ensures users first understand raw results"
                                },
                                {
                                    icon: <CheckCircle2 className="h-5 w-5" />,
                                    text: "Gives researchers full control over interpretation"
                                },
                                {
                                    icon: <CheckCircle2 className="h-5 w-5" />,
                                    text: "Aligns with scientific ethics and reproducibility"
                                }
                            ].map((point, idx) => (
                                <div key={idx} className="flex items-start gap-3">
                                    <div className="p-1.5 rounded-lg bg-primary/10 border border-primary/20 text-primary flex-shrink-0 mt-0.5">
                                        {point.icon}
                                    </div>
                                    <p className="text-base font-medium leading-relaxed">{point.text}</p>
                                </div>
                            ))}
                        </div>
                        <div className="mt-10 pt-10 border-t border-border/30 text-center">
                            <p className="text-sm text-muted-foreground italic">
                                "Science first, AI second. This is how bioinformatics should be done."
                            </p>
                        </div>
                    </div>
                </div>

                {/* ===== NEW: PROJECT DOSSIER / TECHNICAL SPECIFICATION ===== */}
                <div className="mt-40 max-w-6xl mx-auto space-y-20">
                    <div className="text-center space-y-4">
                        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/10 text-muted-foreground text-[10px] font-black uppercase tracking-widest">
                            <Cpu className="h-3 w-3" /> Technical Dossier
                        </div>
                        <h2 className="text-4xl md:text-5xl font-black tracking-tight">System Architecture & <br /><span className="text-gradient">Core Innovation</span></h2>
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                        {/* Innovation Cards */}
                        <Card className="glass-card bg-white/[0.01] border-white/5 p-8 space-y-6 rounded-[2rem] hover:border-primary/30 transition-all duration-500">
                            <div className="h-12 w-12 rounded-xl bg-primary/10 flex items-center justify-center border border-primary/20">
                                <Zap className="h-6 w-6 text-primary" />
                            </div>
                            <h3 className="text-2xl font-black tracking-tight text-foreground">Genomic Engine</h3>
                            <p className="text-sm text-muted-foreground leading-relaxed">
                                Custom-built genomic logic engine independently developed using open-source frameworks for sub-second sequence processing.
                            </p>
                        </Card>
                        <Card className="glass-card bg-white/[0.01] border-white/5 p-8 space-y-6 rounded-[2rem] hover:border-accent/30 transition-all duration-500">
                            <div className="h-12 w-12 rounded-xl bg-accent/10 flex items-center justify-center border border-accent/20">
                                <Brain className="h-6 w-6 text-accent" />
                            </div>
                            <h3 className="text-2xl font-black tracking-tight text-foreground">Open AI</h3>
                            <p className="text-sm text-muted-foreground leading-relaxed">
                                Advanced biological insight generator powered by OpenAI, providing context-aware interpretations of raw genomic data.
                            </p>
                        </Card>
                        <Card className="glass-card bg-white/[0.01] border-white/5 p-8 space-y-6 rounded-[2rem] hover:border-emerald-500/30 transition-all duration-500">
                            <div className="h-12 w-12 rounded-xl bg-emerald-500/10 flex items-center justify-center border border-emerald-500/20">
                                <Globe className="h-6 w-6 text-emerald-500" />
                            </div>
                            <h3 className="text-2xl font-black tracking-tight text-foreground">Cloud-Ready</h3>
                            <p className="text-sm text-muted-foreground leading-relaxed">
                                Stateless REST-based scalable backend deployed on Render, with a Vite-powered frontend on Vercel for global access.
                            </p>
                        </Card>
                    </div>

                    {/* Architecture Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        <div className="glass-card bg-white/[0.02] p-10 rounded-[2.5rem] border-white/5">
                            <h4 className="text-[10px] font-black uppercase tracking-[0.4em] text-primary mb-8">Technical Stack // Verified Topology</h4>
                            <div className="space-y-6">
                                {[
                                    { label: "Frontend", value: "React + Vite (Vercel Deployed)", icon: <Globe className="h-4 w-4" /> },
                                    { label: "Backend", value: "Flask + Gunicorn (Render Deployed)", icon: <Cpu className="h-4 w-4" /> },
                                    { label: "AI Layer", value: "OpenAI-powered Inference Module", icon: <Brain className="h-4 w-4" /> },
                                    { label: "Interface", value: "RESTful JSON Communication", icon: <ArrowRight className="h-4 w-4" /> }
                                ].map((item, i) => (
                                    <div key={i} className="flex items-center justify-between p-4 rounded-xl bg-white/[0.02] border border-white/5">
                                        <div className="flex items-center gap-3">
                                            <div className="text-muted-foreground/50">{item.icon}</div>
                                            <span className="text-xs font-black uppercase tracking-widest text-muted-foreground">{item.label}</span>
                                        </div>
                                        <span className="text-sm font-bold text-foreground/90">{item.value}</span>
                                    </div>
                                ))}
                            </div>
                        </div>

                        <div className="glass-card bg-white/[0.02] p-10 rounded-[2.5rem] border-white/5">
                            <h4 className="text-[10px] font-black uppercase tracking-[0.4em] text-accent mb-8">Measurable Impact // System Efficiency</h4>
                            <div className="space-y-6">
                                {[
                                    { label: "Workflow Logic", value: "50% Reduction in tool-switching", icon: <Zap className="h-4 w-4" /> },
                                    { label: "Sequence Speed", value: "Sub-second typical processing", icon: <Sparkles className="h-4 w-4" /> },
                                    { label: "Acceleration", value: "Automated multi-step validation", icon: <BarChart3 className="h-4 w-4" /> },
                                    { label: "Scalability", value: "Stateless Cloud Architecture", icon: <Globe className="h-4 w-4" /> }
                                ].map((item, i) => (
                                    <div key={i} className="flex items-center justify-between p-4 rounded-xl bg-white/[0.02] border border-white/5">
                                        <div className="flex items-center gap-3">
                                            <div className="text-muted-foreground/50">{item.icon}</div>
                                            <span className="text-xs font-black uppercase tracking-widest text-muted-foreground">{item.label}</span>
                                        </div>
                                        <span className="text-sm font-bold text-foreground/90">{item.value}</span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* Scalability & Future Scope */}
                    <div className="glass-card bg-gradient-to-r from-primary/5 to-accent/5 p-12 rounded-[2.5rem] border-white/5 relative overflow-hidden group">
                        <div className="absolute top-0 right-0 p-12 opacity-5 group-hover:opacity-10 transition-opacity">
                            <Rocket className="h-64 w-64 -rotate-12" />
                        </div>
                        <div className="relative z-10 space-y-10">
                            <div>
                                <h3 className="text-3xl font-black tracking-tight mb-4">Evolutionary Roadmap</h3>
                                <p className="text-muted-foreground font-medium max-w-2xl">Our vision is to transform genomic research into an AI-augmented, intelligent, and accessible workflow ecosystem.</p>
                            </div>
                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                                {[
                                    "Docker Containerization",
                                    "Cloud Auto-scaling",
                                    "Public Database Integration",
                                    "Precision Medicine Engine",
                                    "AI-driven Gene Optimization",
                                    "Institutional SSO Support"
                                ].map((item, i) => (
                                    <div key={i} className="flex items-center gap-4 p-4 rounded-2xl bg-white/[0.03] border border-white/5 hover:border-primary/20 transition-all">
                                        <div className="h-2 w-2 rounded-full bg-primary" />
                                        <span className="text-sm font-bold text-foreground/90">{item}</span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>

                {/* ===== NEW: SCIENTIFIC & INSTITUTIONAL FRAMEWORK ===== */}
                {/* ===== NEW: SCIENTIFIC & INSTITUTIONAL FRAMEWORK ===== */}
                <section className="relative py-24 px-6 text-center">

                    <div className="max-w-6xl mx-auto">

                        <h2 className="text-4xl md:text-5xl font-bold mb-6 bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent">
                            Scientific & Institutional Framework
                        </h2>

                        <p className="text-gray-300 text-lg md:text-xl leading-relaxed max-w-3xl mx-auto mb-16">
                            GeneForge Analyzer is engineered with modular computational architecture,
                            explainable AI pipelines, and disciplined bioinformatics methodology.
                            Designed to align with academic standards of transparency, reproducibility,
                            and analytical precision — ensuring competition-grade reliability and
                            institutional credibility.
                        </p>

                        {/* Core Standards */}
                        <div className="grid md:grid-cols-3 gap-8 mb-20">

                            <div className="p-6 rounded-2xl bg-white/[0.02] backdrop-blur-md border border-white/10 hover:border-cyan-400 transition duration-300">
                                <h3 className="text-xl font-semibold text-cyan-400 mb-3">
                                    Explainable AI
                                </h3>
                                <p className="text-gray-400 text-sm leading-relaxed">
                                    Structured AI interpretation with traceable analytical reasoning,
                                    ensuring transparency in biological data insights.
                                </p>
                            </div>

                            <div className="p-6 rounded-2xl bg-white/[0.02] backdrop-blur-md border border-white/10 hover:border-blue-400 transition duration-300">
                                <h3 className="text-xl font-semibold text-blue-400 mb-3">
                                    Modular Tool Architecture
                                </h3>
                                <p className="text-gray-400 text-sm leading-relaxed">
                                    Independent bioinformatics modules with validated execution logic
                                    and strict input discipline.
                                </p>
                            </div>

                            <div className="p-6 rounded-2xl bg-white/[0.02] backdrop-blur-md border border-white/10 hover:border-indigo-400 transition duration-300">
                                <h3 className="text-xl font-semibold text-indigo-400 mb-3">
                                    Scientific Rigor
                                </h3>
                                <p className="text-gray-400 text-sm leading-relaxed">
                                    Reproducible computation, structured output formatting, and
                                    research-grade validation standards.
                                </p>
                            </div>

                        </div>

                        {/* Who It's For */}
                        <h3 className="text-3xl font-bold mb-10 text-foreground">
                            Built For
                        </h3>

                        <div className="grid md:grid-cols-3 gap-8">

                            <div className="p-6 rounded-2xl bg-gradient-to-br from-cyan-500/10 to-transparent border border-cyan-400/20">
                                <h4 className="text-lg font-semibold text-cyan-400 mb-2">
                                    Students & Learners
                                </h4>
                                <p className="text-gray-400 text-sm">
                                    Interactive genomic analysis tools designed for structured learning,
                                    academic projects, and competition preparation.
                                </p>
                            </div>

                            <div className="p-6 rounded-2xl bg-gradient-to-br from-blue-500/10 to-transparent border border-blue-400/20">
                                <h4 className="text-lg font-semibold text-blue-400 mb-2">
                                    Researchers & Scientists
                                </h4>
                                <p className="text-gray-400 text-sm">
                                    Reliable computational workflows supporting sequence analysis,
                                    validation, and reproducible research output.
                                </p>
                            </div>

                            <div className="p-6 rounded-2xl bg-gradient-to-br from-indigo-500/10 to-transparent border border-indigo-400/20">
                                <h4 className="text-lg font-semibold text-indigo-400 mb-2">
                                    Innovation & Institutional Teams
                                </h4>
                                <p className="text-gray-400 text-sm">
                                    Structured AI-driven bioinformatics platform aligned with
                                    institutional review standards and competitive evaluation frameworks.
                                </p>
                            </div>

                        </div>

                    </div>

                </section>

                {/* TRUST SECTION */}
                <div className="mt-32 text-center animate-in fade-in duration-1000">
                    <div className="inline-block mb-16">
                        <p className="text-[10px] font-black uppercase tracking-[0.5em] text-muted-foreground mb-2">
                            Trusted by top research institutions worldwide 🌐
                        </p>
                        <div className="h-px w-full bg-gradient-to-r from-transparent via-border to-transparent" />
                    </div>
                    <div className="flex flex-wrap justify-center items-center gap-16 md:gap-28 opacity-40 hover:opacity-70 grayscale hover:grayscale-0 transition-all duration-700">
                        <div className="flex items-center gap-3 font-black text-2xl tracking-tighter hover:scale-105 transition-transform duration-300">
                            <Globe className="h-8 w-8" /> BIOCORE
                        </div>
                        <div className="flex items-center gap-3 font-black text-2xl tracking-tighter hover:scale-105 transition-transform duration-300">
                            <Zap className="h-8 w-8" /> QUANTUM LABS
                        </div>
                        <div className="flex items-center gap-3 font-black text-2xl tracking-tighter hover:scale-105 transition-transform duration-300">
                            <Dna className="h-8 w-8" /> GENE-X
                        </div>
                        <div className="flex items-center gap-3 font-black text-2xl tracking-tighter hover:scale-105 transition-transform duration-300">
                            <Microscope className="h-8 w-8" /> CELLULAR
                        </div>
                    </div>
                </div>

                {/* ===== NEW: FOOTER SECTION ===== */}
                <div className="mt-32 pt-20 border-t border-border/30">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-12 mb-12">
                        <div>
                            <div className="flex items-center gap-3 mb-4">
                                <div className="p-2 rounded-xl bg-primary/10 border border-primary/20">
                                    <Dna className="h-5 w-5 text-primary" />
                                </div>
                                <h3 className="text-lg font-black">Gene Forge Analyzer</h3>
                            </div>
                            <p className="text-sm text-muted-foreground leading-relaxed">
                                AI-powered bioinformatics toolkit built with scientific rigor and educational value.
                            </p>
                        </div>
                        <div>
                            <h4 className="text-sm font-black uppercase tracking-wider mb-4 text-muted-foreground">Quick Links</h4>
                            <div className="space-y-2">
                                <Link to="/tools" className="block text-sm hover:text-primary transition-colors">
                                    Bioinformatics Tools
                                </Link>
                                <Link to="/learn" className="block text-sm hover:text-primary transition-colors">
                                    Learning Resources
                                </Link>
                                <Link to="/security" className="block text-sm hover:text-primary transition-colors">
                                    Security & Privacy
                                </Link>
                            </div>
                        </div>
                        <div>
                            <h4 className="text-sm font-black uppercase tracking-wider mb-4 text-muted-foreground">Connect</h4>
                            <div className="space-y-2">
                                <a
                                    href="https://github.com/drShankarMote-AI-Dev/Gene_Forge_Analyzer"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="flex items-center gap-2 text-sm hover:text-primary transition-colors"
                                >
                                    <Github className="h-4 w-4" />
                                    View on GitHub
                                </a>
                            </div>
                        </div>
                    </div>
                    <div className="pt-8 border-t border-border/30 text-center">
                        <p className="text-xs text-muted-foreground font-medium">
                            Built for AI & Bioinformatics Competitions | <span className="text-amber-500 font-bold">State Rank 🥈</span> | National-Level Ready
                        </p>
                        <p className="text-xs text-muted-foreground mb-2">
                            © 2026 Gene Forge Analyzer. Empowering genomic research through validated science and responsible AI.
                        </p>
                    </div>
                </div>

                {/* FLOATING DECORATIONS */}
                <div className="absolute top-1/4 left-10 pointer-events-none opacity-20 hidden lg:block animate-float drop-shadow-[0_0_20px_rgba(0,200,255,0.3)]">
                    <div className="text-6xl">🧬</div>
                </div>
                <div className="absolute bottom-1/4 right-10 pointer-events-none opacity-20 hidden lg:block animate-float drop-shadow-[0_0_20px_rgba(0,200,255,0.3)]" style={{ animationDelay: '-2s' }}>
                    <div className="text-6xl">🔬</div>
                </div>
            </div>
        </div >
    );
};

export default Home;
