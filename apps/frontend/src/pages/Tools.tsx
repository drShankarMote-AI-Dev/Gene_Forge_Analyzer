import React, { useState } from 'react';
import { Dna, Dices, Split, Microscope, Search, Scissors, BarChart3, Target, FileDiff, Sparkles, ArrowRight, Filter, Activity, Zap, CheckCircle2, FileJson, Binary } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';

const Tools = () => {
    const [searchQuery, setSearchQuery] = useState('');
    const [activeCategory, setActiveCategory] = useState('All');

    const categories = [
        "All",
        "DNA/RNA Analysis",
        "Comparison & Alignment",
        "Motif & Pattern",
        "Restriction & PCR",
        "Protein Analysis",
        "Genome & Advanced",
        "File Utilities",
        "AI-Assisted"
    ];

    const toolList = [
        // DNA/RNA Analysis
        {
            id: "sequence-validator",
            category: "DNA/RNA Analysis",
            title: "DNA Sequence Validator ✅",
            description: "Validate characters A,T,G,C,N and FASTA headers according to standards.",
            icon: <CheckCircle2 className="h-7 w-7" />,
            color: "bg-emerald-500/10 text-emerald-500",
            tags: ["validate", "ncbi", "fasta", "standard"]
        },
        {
            id: "gc-content",
            category: "DNA/RNA Analysis",
            title: "GC Content Calculator 📊",
            description: "Calculate GC percentage and evaluate biological significance.",
            icon: <BarChart3 className="h-7 w-7" />,
            color: "bg-yellow-500/10 text-yellow-500",
            tags: ["stability", "window", "base", "significance"]
        },
        {
            id: "at-content",
            category: "DNA/RNA Analysis",
            title: "AT Content Calculator 📉",
            description: "Calculate AT percentage and distribution for AT-rich regions.",
            icon: <Activity className="h-7 w-7" />,
            color: "bg-orange-500/10 text-orange-500",
            tags: ["at", "rich", "content"]
        },
        {
            id: "reverse-complement",
            category: "DNA/RNA Analysis",
            title: "Reverse Complement 🔁",
            description: "Generate the reverse complement strand for genomic orientation.",
            icon: <Dices className="h-7 w-7" />,
            color: "bg-orange-500/10 text-orange-500",
            tags: ["orientation", "strand", "complement"]
        },
        {
            id: "orf-finder",
            category: "DNA/RNA Analysis",
            title: "ORF Finder 🔭",
            description: "Detect start and stop codons across frames to find open reading frames.",
            icon: <Microscope className="h-7 w-7" />,
            color: "bg-emerald-500/10 text-emerald-500",
            tags: ["protein", "amino", "rna", "frames"]
        },
        {
            id: "codon-analyzer",
            category: "DNA/RNA Analysis",
            title: "Codon Usage Analyzer 🧬",
            description: "Analyze codon frequency and distribution across the sequence.",
            icon: <Activity className="h-7 w-7" />,
            color: "bg-blue-500/10 text-blue-500",
            tags: ["codon", "frequency", "translation"]
        },
        {
            id: "dna-rna-transcription",
            category: "DNA/RNA Analysis",
            title: "DNA to RNA Transcription ⚗️",
            description: "Convert DNA sequence to RNA for transcription simulation.",
            icon: <Zap className="h-7 w-7" />,
            color: "bg-purple-500/10 text-purple-500",
            tags: ["transcription", "rna", "uracil"]
        },
        {
            id: "dna-protein-translation",
            category: "DNA/RNA Analysis",
            title: "DNA to Protein Translation 🧪",
            description: "Translate genomic sequences into primary amino acid structures.",
            icon: <Binary className="h-7 w-7" />,
            color: "bg-pink-500/10 text-pink-500",
            tags: ["translation", "protein", "amino"]
        },
        {
            id: "sequence-stats",
            category: "DNA/RNA Analysis",
            title: "Sequence Stats 📈",
            description: "Comprehensive nucleotide distribution and granular statistics.",
            icon: <Dna className="h-7 w-7" />,
            color: "bg-blue-500/10 text-blue-500",
            tags: ["stats", "nucleotide", "count"]
        },

        // Comparison & Alignment
        {
            id: "sequence-comparison",
            category: "Comparison & Alignment",
            title: "Sequence Comparison 🔄",
            description: "Detect mismatches, insertions, and deletions between two sequences.",
            icon: <Split className="h-7 w-7" />,
            color: "bg-purple-500/10 text-purple-500",
            tags: ["align", "mutation", "diff"]
        },
        {
            id: "snp-highlighter",
            category: "Comparison & Alignment",
            title: "SNP Highlighter 📍",
            description: "Identify and visualize single nucleotide changes between sequences.",
            icon: <Target className="h-7 w-7" />,
            color: "bg-red-500/10 text-red-500",
            tags: ["snp", "variant", "base-change"]
        },
        {
            id: "global-alignment",
            category: "Comparison & Alignment",
            title: "Global Alignment (NW) 🌍",
            description: "Align two sequences from end-to-end using Needleman-Wunsch.",
            icon: <Filter className="h-7 w-7" />,
            color: "bg-indigo-500/10 text-indigo-500",
            tags: ["alignment", "global", "nw"]
        },
        {
            id: "local-alignment",
            category: "Comparison & Alignment",
            title: "Local Alignment (SW) 🎯",
            description: "Identify small regions of high similarity using Smith-Waterman.",
            icon: <Target className="h-7 w-7" />,
            color: "bg-rose-500/10 text-rose-500",
            tags: ["alignment", "local", "sw"]
        },

        // Motif & Pattern
        {
            id: "motif-search",
            category: "Motif & Pattern",
            title: "Motif Finder 🔍",
            description: "Detect repeated short patterns and regulatory elements.",
            icon: <Search className="h-7 w-7" />,
            color: "bg-pink-500/10 text-pink-500",
            tags: ["pattern", "match", "regulatory"]
        },
        {
            id: "palindrome-finder",
            category: "Motif & Pattern",
            title: "Palindrome Finder ⚡",
            description: "Identify palindromic regions and inverted repeats in DNA.",
            icon: <Zap className="h-7 w-7" />,
            color: "bg-yellow-400/10 text-yellow-600",
            tags: ["palindrome", "repeat", "structure"]
        },
        {
            id: "tandem-repeats",
            category: "Motif & Pattern",
            title: "Tandem Repeat Analyzer 🔁",
            description: "Scan for multi-unit repetitive elements in sequence topology.",
            icon: <Dices className="h-7 w-7" />,
            color: "bg-orange-500/10 text-orange-500",
            tags: ["repeat", "tandem", "microsatellite"]
        },

        // Restriction & PCR
        {
            id: "restriction-mapper",
            category: "Restriction & PCR",
            title: "Restriction Mapper ✂️",
            description: "Scan for known enzyme recognition sites and calculate fragments.",
            icon: <Scissors className="h-7 w-7" />,
            color: "bg-cyan-500/10 text-cyan-500",
            tags: ["enzyme", "cut", "vector", "map"]
        },
        {
            id: "primer-design",
            category: "Restriction & PCR",
            title: "Primer Design Tool 📍",
            description: "Design PCR primers with GC and Tm calculation (Wallace Rule).",
            icon: <FileDiff className="h-7 w-7" />,
            color: "bg-indigo-500/10 text-indigo-500",
            tags: ["pcr", "tm", "oligo"]
        },
        {
            id: "pcr-simulation",
            category: "Restriction & PCR",
            title: "PCR Simulator 🧪",
            description: "Predict PCR product outcome from defined primer sets.",
            icon: <Activity className="h-7 w-7" />,
            color: "bg-teal-500/10 text-teal-500",
            tags: ["pcr", "simulation", "amplicon"]
        },

        // Protein Analysis
        {
            id: "protein-stats",
            category: "Protein Analysis",
            title: "Protein Property Analyzer 🧬",
            description: "Calculate molecular weight, pI, and amino acid distribution.",
            icon: <Sparkles className="h-7 w-7" />,
            color: "bg-blue-600/10 text-blue-600",
            tags: ["protein", "mass", "pi", "weight"]
        },
        {
            id: "pdb-viewer",
            category: "Protein Analysis",
            title: "PDB Structure Viewer 🏛️",
            description: "Visualize 3D macromolecular structures from PDB identifiers.",
            icon: <Microscope className="h-7 w-7" />,
            color: "bg-slate-700/10 text-slate-700",
            tags: ["3d", "pdb", "structure"]
        },

        // Genome & Advanced
        {
            id: "crispr-analyzer",
            category: "Genome & Advanced",
            title: "CRISPR gRNA Finder 🎯",
            description: "Identify PAM sites and guide RNA regions for gene editing.",
            icon: <Target className="h-7 w-7" />,
            color: "bg-rose-500/10 text-rose-500",
            tags: ["guide", "pam", "edit", "crispr"]
        },
        {
            id: "gene-prediction",
            category: "Genome & Advanced",
            title: "Gene Predictor 🔭",
            description: "Scan genomic regions for exons, introns, and start sites.",
            icon: <Search className="h-7 w-7" />,
            color: "bg-emerald-600/10 text-emerald-600",
            tags: ["exons", "introns", "gene", "predict"]
        },

        // File Utilities
        {
            id: "fasta-parser",
            category: "File Utilities",
            title: "FASTA Parser & Cleaner 📄",
            description: "Extract headers and clean biological sequences from FASTA files.",
            icon: <FileJson className="h-7 w-7" />,
            color: "bg-slate-500/10 text-slate-500",
            tags: ["fasta", "clean", "parse", "header"]
        },

        // AI-Assisted
        {
            id: "biological-insights",
            category: "AI-Assisted",
            title: "Biological Insight Generator 🧠",
            description: "AI-driven analysis of results for research significance.",
            icon: <Sparkles className="h-7 w-7" />,
            color: "bg-accent/10 text-accent",
            tags: ["ai", "insight", "significance"]
        }
    ];


    const filteredTools = toolList.filter(tool => {
        const matchesSearch = tool.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
            tool.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
            tool.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()));

        const matchesCategory = activeCategory === 'All' || tool.category === activeCategory;

        return matchesSearch && matchesCategory;
    });


    return (
        <div className="min-h-screen bg-background py-20 relative overflow-hidden">
            {/* Background Decorations */}
            <div className="absolute inset-0 pointer-events-none">
                <div className="absolute top-[20%] left-[-5%] w-[40%] h-[40%] bg-primary/5 blur-[120px] rounded-full animate-float" />
                <div className="absolute bottom-[20%] right-[-5%] w-[40%] h-[40%] bg-accent/5 blur-[120px] rounded-full animate-float" style={{ animationDelay: '-3s' }} />
            </div>



            <div className="container mx-auto px-6 relative z-10">
                <div className="max-w-4xl mx-auto text-center mb-24 space-y-6">
                    <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass border-primary/20 text-primary text-xs font-black uppercase tracking-[0.2em] mb-4 animate-in fade-in slide-in-from-bottom-4">
                        <Sparkles className="h-3.5 w-3.5" />
                        Bio-Intelligence Toolkit
                    </div>
                    <h1 className="text-5xl md:text-7xl font-black tracking-tighter leading-tight animate-in fade-in slide-in-from-bottom-8 duration-700">
                        Specialized <span className="text-gradient">Bioinformatics</span> Capabilities.
                    </h1>
                    <p className="text-muted-foreground text-lg md:text-xl font-medium max-w-2xl mx-auto animate-in fade-in slide-in-from-bottom-8 duration-1000">
                        Our suite of tools is designed to handle complex genomic data with precision, providing researchers with the insights needed for next-gen discoveries.
                    </p>

                    <div className="pt-12 max-w-xl mx-auto relative animate-in zoom-in duration-700 delay-300">
                        <div className="absolute inset-y-0 left-5 flex items-center pointer-events-none text-muted-foreground">
                            <Search className="h-5 w-5" />
                        </div>
                        <Input
                            type="text"
                            placeholder="Find specialized analytical tools..."
                            className="w-full glass bg-background/50 border-border/50 rounded-2xl py-8 pl-14 pr-6 text-lg font-medium shadow-2xl focus:ring-primary/20 transition-all placeholder:text-muted-foreground/50"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                        />
                        <div className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center gap-2 pr-2">
                            <div className="px-2 py-1 rounded-md bg-muted text-[10px] font-black uppercase tracking-widest text-muted-foreground border">Search</div>
                        </div>
                    </div>

                    <div className="flex flex-wrap justify-center gap-3 mt-12 animate-in fade-in slide-in-from-bottom-4 duration-1000 delay-500">
                        {categories.map(category => (
                            <button
                                key={category}
                                onClick={() => setActiveCategory(category)}
                                className={`px-6 py-2.5 rounded-full text-[10px] font-black uppercase tracking-[0.15em] transition-all duration-300 border ${activeCategory === category
                                    ? "bg-primary text-primary-foreground border-primary shadow-[0_0_20px_rgba(var(--primary),0.3)] scale-105"
                                    : "glass text-muted-foreground border-border/50 hover:border-primary/30 hover:text-primary"
                                    }`}
                            >
                                {category}
                            </button>
                        ))}
                    </div>
                </div>

                {filteredTools.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {filteredTools.map((tool, index) => (
                            <Link
                                key={index}
                                to={`/tools/${tool.id}`}
                                className="glass-card rounded-[2.5rem] p-8 group relative overflow-hidden animate-in fade-in slide-in-from-bottom-8 duration-500 block hover:border-primary/50 transition-colors"
                                style={{ animationDelay: `${index * 50}ms` }}
                            >
                                <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 rounded-bl-[4rem] group-hover:bg-primary/10 transition-colors duration-500" />

                                <div className="relative z-10 space-y-6">
                                    <div className={`p-4 rounded-3xl inline-block ${tool.color} shadow-inner group-hover:scale-110 transition-transform duration-500`}>
                                        {tool.icon}
                                    </div>

                                    <div className="space-y-3">
                                        <h3 className="text-2xl font-black tracking-tight group-hover:text-primary transition-colors duration-300">
                                            {tool.title}
                                        </h3>
                                        <p className="text-sm text-muted-foreground font-medium leading-relaxed">
                                            {tool.description}
                                        </p>
                                    </div>

                                    <div className="pt-4 flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.2em] text-primary opacity-0 group-hover:opacity-100 transition-all duration-300 translate-y-2 group-hover:translate-y-0">
                                        Initialize Tool
                                        <ArrowRight className="h-3 w-3" />
                                    </div>
                                </div>
                            </Link>
                        ))}
                    </div>

                ) : (
                    <div className="py-20 text-center animate-in fade-in duration-500">
                        <div className="inline-block p-6 rounded-full bg-muted/30 mb-6">
                            <Filter className="h-12 w-12 text-muted-foreground opacity-20" />
                        </div>
                        <h3 className="text-2xl font-bold mb-2">No tools found matching "{searchQuery}"</h3>
                        <p className="text-muted-foreground font-medium">Try broadening your search or exploring our categories above.</p>
                        <Button
                            variant="link"
                            className="mt-4 text-primary font-bold"
                            onClick={() => setSearchQuery('')}
                        >
                            Reset search filter
                        </Button>
                    </div>
                )}

                <div className="mt-32 glass rounded-[4rem] p-12 md:p-20 text-center border-primary/10 relative overflow-hidden group shadow-2xl">
                    <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-accent/5 animate-pulse" />

                    <div className="relative z-10 max-w-2xl mx-auto space-y-10">
                        <div className="space-y-4">
                            <h2 className="text-4xl md:text-5xl font-black tracking-tighter leading-tight">Elevate your research with GeneForge Pro.</h2>
                            <p className="text-muted-foreground text-lg font-medium">
                                Join thousands of researchers utilizing our advanced genomic pipeline for secure, high-resolution analysis.
                            </p>
                        </div>

                        <Link
                            to="/analysis"
                            className="inline-flex items-center gap-4 px-10 py-5 bg-primary text-primary-foreground rounded-full font-black shadow-2xl shadow-primary/30 hover:shadow-primary/50 hover:scale-105 active:scale-95 transition-all duration-500 group"
                        >
                            Access Full Dashboard
                            <ArrowRight className="h-5 w-5 group-hover:translate-x-1 transition-transform" />
                        </Link>
                    </div>
                </div>

                <footer className="mt-32 py-12 border-t border-border/50 text-center">
                    <p className="text-[10px] font-black uppercase tracking-[0.3em] text-muted-foreground/40">
                        Analytical Intelligence Layer v4.0.2
                    </p>
                </footer>


            </div>
        </div>
    );
};

export default Tools;
