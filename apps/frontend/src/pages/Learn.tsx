import React from 'react';
import { BookOpen, Dna, Microscope, Lightbulb, Rocket, ShieldCheck, ArrowRight, Sparkles, Brain } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';

const Learn = () => {
    const sections = [
        {
            title: "What is Bioinformatics? 🧬",
            icon: <Microscope className="h-8 w-8 text-blue-500" />,
            content: "Bioinformatics is the powerful intersection of biology and computer science. It involves using computing, AI, and data science to analyze biological data—like DNA, RNA, and proteins. In the real world, it's used to discover new drugs, understand genetic diseases, and even track the evolution of viruses.",
            color: "blue"
        },
        {
            title: "What is DNA? 🧬",
            icon: <Dna className="h-8 w-8 text-emerald-500" />,
            content: "Think of DNA as the 'instruction manual' for all living things. It's composed of four chemical bases: Adenine (A), Thymine (T), Guanine (G), and Cytosine (C). The specific order of these bases determines everything about an organism, from the color of your eyes to how your body fights disease.",
            color: "emerald"
        },
        {
            title: "Why Analysis Tools Matter 🖥️",
            icon: <Lightbulb className="h-8 w-8 text-orange-500" />,
            content: "Human DNA is massive—about 3 billion base pairs long! Analyzing this much data manually is impossible. Computational tools like Gene Forge Analyzer allow scientists to scan billions of sequences in seconds, finding patterns and mutations that would otherwise remain hidden.",
            color: "orange"
        }
    ];

    const toolsEducation = [
        {
            id: "gc-content",
            title: "GC Content Analyzer",
            meaning: "Calculates the percentage of G and C bases in a DNA sequence.",
            importance: "High GC content often indicates more stable DNA structures and can identify gene-rich regions.",
            usage: "Paste a sequence and click analyze to see its stability profile.",
            application: "PCR primers design and genome assembly."
        },
        {
            id: "primer-design",
            title: "Primer Design Tool",
            meaning: "Creates short DNA strands (primers) needed for PCR amplification.",
            importance: "Accurate primers are essential for mimicking DNA replication in a lab setting.",
            usage: "Enter your target sequence to generate optimal forward and reverse primers.",
            application: "Forensics, medical testing, and research."
        },
        {
            id: "crispr-analyzer",
            title: "CRISPR Analyzer",
            meaning: "Identifies optimal PAM sites for gene editing using CRISPR-Cas9.",
            importance: "Ensures precision in gene editing by finding the best 'cutting' locations.",
            usage: "Input a sequence to locate potential target sites for gRNA.",
            application: "Genetic therapy and agricultural engineering."
        },
        {
            id: "restriction-mapper",
            title: "Restriction Enzyme Mapper",
            meaning: "Finds where specific 'molecular scissors' (enzymes) will cut DNA.",
            importance: "Crucial for cloning and moving genes between different organisms.",
            usage: "Search for specific enzyme recognition sites across your sequence.",
            application: "Creating GMOs and insulin production."
        },
        {
            id: "orf-finder",
            title: "ORF Finder",
            meaning: "Identifies 'Open Reading Frames'—sections that could potentially code for proteins.",
            importance: "The first step in discovering new genes within a genomic sequence.",
            usage: "Analyze sequences in all 6 reading frames to find possible start/stop codons.",
            application: "Predicting protein functions and gene discovery."
        },
        {
            id: "motif-search",
            title: "Motif Discovery",
            meaning: "Finds short, recurring patterns in DNA that have biological significance.",
            importance: "Identifies regulatory elements like promoter sites where proteins bind to DNA.",
            usage: "Search for specific sequence patterns across the entire genome.",
            application: "Understanding gene regulation and disease mechanisms."
        },
        {
            id: "sequence-comparison",
            title: "Mutation Analysis",
            meaning: "Compares different DNA sequences to find changes or mutations.",
            importance: "Critical for identifying SNPs (Single Nucleotide Polymorphisms) linked to diseases.",
            usage: "Align multiple sequences to highlight differences and variants.",
            application: "Personalized medicine and evolutionary biology."
        }
    ];


    return (
        <div className="min-h-screen bg-background py-20 relative overflow-hidden">
            {/* Background Decorations */}
            <div className="absolute inset-0 pointer-events-none">
                <div className="absolute top-[10%] right-[-5%] w-[40%] h-[40%] bg-blue-500/5 blur-[120px] rounded-full animate-float" />
                <div className="absolute bottom-[10%] left-[-5%] w-[40%] h-[40%] bg-emerald-500/5 blur-[120px] rounded-full animate-float" style={{ animationDelay: '-3s' }} />
            </div>

            <div className="container mx-auto px-6 relative z-10">
                {/* Hero Section */}
                <div className="max-w-4xl mx-auto text-center mb-24 space-y-6">
                    <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass border-primary/20 text-primary text-xs font-black uppercase tracking-[0.2em] mb-4 animate-in fade-in slide-in-from-bottom-4">
                        <BookOpen className="h-3.5 w-3.5" />
                        Bio-Education Portal
                    </div>
                    <h1 className="text-5xl md:text-7xl font-black tracking-tighter leading-tight animate-in fade-in slide-in-from-bottom-8 duration-700">
                        Master the <span className="text-gradient">Language of Life</span>.
                    </h1>
                    <p className="text-muted-foreground text-lg md:text-xl font-medium max-w-2xl mx-auto animate-in fade-in slide-in-from-bottom-8 duration-1000">
                        New to bioinformatics? Explore our beginner-friendly guide to DNA analysis and discover how AI is revolutionizing genomic research.
                    </p>
                </div>

                {/* Basics Grid */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-32">
                    {sections.map((section, index) => (
                        <div
                            key={index}
                            className="glass-card rounded-[2.5rem] p-8 space-y-6 hover:translate-y-[-8px] transition-all duration-500 group border-t border-white/10"
                        >
                            <div className={`p-4 rounded-2xl bg-${section.color}-500/10 inline-block group-hover:scale-110 transition-transform duration-500`}>
                                {section.icon}
                            </div>
                            <h3 className="text-2xl font-black tracking-tight">{section.title}</h3>
                            <p className="text-muted-foreground leading-relaxed font-medium">
                                {section.content}
                            </p>
                        </div>
                    ))}
                </div>

                {/* AI & Differentiation Section */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mb-32 items-center">
                    <div className="space-y-8 animate-in slide-in-from-left duration-1000">
                        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 text-primary text-[10px] font-black uppercase tracking-widest">
                            <Sparkles className="h-3 w-3" />
                            The Gene Forge Advantage
                        </div>
                        <h2 className="text-4xl md:text-5xl font-black tracking-tighter">Why Gene Forge Analyzer is Different.</h2>
                        <p className="text-lg text-muted-foreground font-medium leading-relaxed">
                            Unlike generic AI chatbots that simply guess answers, Gene Forge Analyzer combines <span className="text-primary font-bold">real biological computation</span> with <span className="text-accent font-bold">AI interpretation</span>.
                        </p>
                        <ul className="space-y-4">
                            {[
                                { icon: <Rocket className="h-5 w-5 text-blue-500" />, text: "Real bioinformatics computation engines." },
                                { icon: <Brain className="h-5 w-5 text-purple-500" />, text: "AI-assisted result explanations in plain English." },
                                { icon: <ShieldCheck className="h-5 w-5 text-emerald-500" />, text: "Secure, research-oriented workflows." }
                            ].map((item, i) => (
                                <li key={i} className="flex items-center gap-4 text-muted-foreground font-semibold">
                                    <div className="p-2 rounded-lg bg-background/50 glass">{item.icon}</div>
                                    {item.text}
                                </li>
                            ))}
                        </ul>
                    </div>
                    <div className="glass rounded-[3rem] p-8 md:p-12 relative overflow-hidden group border-white/5 animate-in slide-in-from-right duration-1000">
                        <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-transparent to-accent/10 opacity-50" />
                        <div className="relative z-10 space-y-6">
                            <h3 className="text-2xl font-black">Role of AI in Gene Forge</h3>
                            <p className="text-muted-foreground leading-relaxed font-medium">
                                Our AI isn't just a chatbot; it's a co-pilot for your research. It helps by:
                            </p>
                            <div className="grid grid-cols-1 gap-4">
                                <div className="p-4 rounded-2xl bg-background/40 border border-white/5 backdrop-blur-xl">
                                    <p className="text-sm font-bold text-primary mb-1">Explaining Results</p>
                                    <p className="text-xs text-muted-foreground">Turning complex numbers into biological insights.</p>
                                </div>
                                <div className="p-4 rounded-2xl bg-background/40 border border-white/5 backdrop-blur-xl">
                                    <p className="text-sm font-bold text-accent mb-1">Guiding Discovery</p>
                                    <p className="text-xs text-muted-foreground">Suggesting the next logical analysis steps.</p>
                                </div>
                                <div className="p-4 rounded-2xl bg-background/40 border border-white/5 backdrop-blur-xl">
                                    <p className="text-sm font-bold text-emerald-500 mb-1">Preventing Errors</p>
                                    <p className="text-xs text-muted-foreground">Highlighting common mistakes in sequence handling.</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Tools Detailed Guide */}
                <div className="space-y-12">
                    <div className="text-center max-w-2xl mx-auto space-y-4">
                        <h2 className="text-4xl font-black tracking-tighter">Tools Breakdown</h2>
                        <p className="text-muted-foreground font-medium">Learn exactly what each tool does and how to use it in your research.</p>
                    </div>

                    <div className="grid grid-cols-1 gap-6">
                        {toolsEducation.map((tool, index) => (
                            <div key={index} className="glass rounded-[2rem] p-8 md:p-10 border-white/10 hover:border-primary/30 transition-all duration-300 group">
                                <div className="flex flex-col md:flex-row md:items-center justify-between gap-8">
                                    <div className="space-y-4 flex-1">
                                        <div className="flex items-center gap-3">
                                            <h3 className="text-2xl font-black">{tool.title}</h3>
                                            <span className="px-2 py-1 rounded bg-muted text-[8px] font-black uppercase tracking-tighter text-muted-foreground">Core Tool</span>
                                        </div>
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pb-4">
                                            <div className="space-y-1">
                                                <p className="text-[10px] uppercase font-black text-primary tracking-widest">What it is</p>
                                                <p className="text-sm font-medium text-muted-foreground">{tool.meaning}</p>
                                            </div>
                                            <div className="space-y-1">
                                                <p className="text-[10px] uppercase font-black text-accent tracking-widest">Why it matters</p>
                                                <p className="text-sm font-medium text-muted-foreground">{tool.importance}</p>
                                            </div>
                                        </div>
                                        <div className="pt-4 border-t border-white/5 flex flex-wrap gap-4">
                                            <div className="flex items-center gap-2 text-xs font-bold text-muted-foreground">
                                                <div className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                                                Usage: {tool.usage}
                                            </div>
                                            <div className="flex items-center gap-2 text-xs font-bold text-muted-foreground">
                                                <div className="w-1.5 h-1.5 rounded-full bg-blue-500" />
                                                App: {tool.application}
                                            </div>
                                        </div>
                                    </div>
                                    <div className="shrink-0">
                                        <Link to={`/tools/${tool.id}`}>
                                            <Button className="rounded-2xl px-8 py-6 h-auto font-black flex items-center gap-2 group/btn shadow-xl shadow-primary/20">
                                                Try This Tool
                                                <ArrowRight className="h-4 w-4 group-hover/btn:translate-x-1 transition-transform" />
                                            </Button>
                                        </Link>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                <div className="mt-32 glass rounded-[4rem] p-12 md:p-20 text-center border-primary/10 relative overflow-hidden group shadow-2xl">
                    <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-accent/5 animate-pulse" />
                    <div className="relative z-10 max-w-2xl mx-auto space-y-10">
                        <div className="space-y-4">
                            <h2 className="text-4xl md:text-5xl font-black tracking-tighter leading-tight">Ready to start analyzing?</h2>
                            <p className="text-muted-foreground text-lg font-medium">
                                Head over to our tools section and try your first sequence analysis today.
                            </p>
                        </div>
                        <Link
                            to="/tools"
                            className="inline-flex items-center gap-4 px-10 py-5 bg-primary text-primary-foreground rounded-full font-black shadow-2xl shadow-primary/30 hover:shadow-primary/50 hover:scale-105 active:scale-95 transition-all duration-500 group"
                        >
                            Explore All Tools
                            <ArrowRight className="h-5 w-5 group-hover:translate-x-1 transition-transform" />
                        </Link>
                    </div>
                </div>
            </div>

            <footer className="mt-32 py-12 border-t border-border/50 text-center">
                <p className="text-[10px] font-black uppercase tracking-[0.3em] text-muted-foreground/40">
                    Educational Intelligence Layer v1.0.0
                </p>
            </footer>
        </div>
    );
};

export default Learn;
