import React, { useState, useRef } from 'react';
import { useParams, Link } from 'react-router-dom';
import {
    Dna, ChevronLeft, Play, Sparkles, Brain, History, Save,
    Download, CheckCircle2, BarChart3, Binary, Scissors, Target, FileSearch,
    FileUp, Search, Split, Activity, Zap, FileJson, Filter, Dices, Microscope
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import {
    validateDNA, calculateGlobalGCContent, generatePrimers, findGuideRNAs,
    findRestrictionSites, getReadingFrames, findMotifs, countBases, compareSequences,
    reverseComplement, calculateGCContentWindow, calculateStabilityScore, calculateComplexity,
    calculateCodonUsage, findPalindromes, parseFasta, transcribeDNA, translateDNA,
    calculateATContent, getAminoAcidComposition, calculateProteinMolecularWeight,
    globalAlignment, localAlignment, findTandemRepeats, simulatePCRExtension
} from '@/utils/dnaUtils';
import { useToast } from '@/hooks/use-toast';
import { API_BASE_URL } from '@/utils/api';
import {
    ResponsiveContainer,
    AreaChart, Area, BarChart, Bar
} from 'recharts';

interface ResultData {
    sequence?: string;
    stability?: number;
    complexity?: number;
    gcContent?: number;
    atContent?: number;
    baseCounts?: Record<string, number>;
    windowData?: { position: number; gc: number; at?: number }[];
    reverseComp?: string;
    transcription?: string;
    translation?: string;
    composition?: Record<string, number>;
    alignment?: {
        score: number;
        align1: string;
        align2: string;
    } | null;
    repeats?: { unit: string; count: number; position: number }[];
    pcr?: {
        success: boolean;
        product?: string;
        length?: number;
        error?: string;
    } | null;
    frames?: { codon: string; aminoAcid: string }[][];
    codonUsage?: { codon: string; count: number; aminoAcid: string; frequency: number }[];
    comparison?: {
        comparison: { result: string; position: number; char1: string; char2: string; index?: number; base1?: string; base2?: string;[key: string]: unknown }[];
        percentIdentity?: number;
        matchCount?: number;
        mismatchCount?: number;
        similarityPercentage?: string | number;
    } | null;
    restrictionSites?: { enzyme: { name: string; site: string; cutPosition: number }; position: number }[];
    records?: { header: string; sequence: string; length: number }[];
    primers?: { forwardPrimer: string; reversePrimer: string; forwardTm: number; reverseTm: number; productSize: number; startPosition: number; endPosition: number }[] | Record<string, { sequence: string; tm: number; gc: number }>;
    motifs?: { position: number; sequence: string }[];
    pattern?: string;
    guideRNAs?: { sequence: string; pam: string; position: number; gcContent: number }[];
    palindromes?: { sequence: string; position: number; length: number }[];
    insights?: string;
    message?: string;
    validator?: { valid: boolean; error?: string; cleaned?: string };
    length?: number;
    refLabel?: string;
    queryLabel?: string;
    weight?: number;
    prediction?: { exons: { start: number; end: number }[]; introns: unknown[] };
    timestamp?: string;
}

const ToolWorkspace = () => {
    const { toolId } = useParams() as { toolId: string };
    const { toast } = useToast();
    const [sequence, setSequence] = useState('');
    const [sequence2, setSequence2] = useState('');
    const [results, setResults] = useState<ResultData | null>(null);
    const [motif, setMotif] = useState('ATG');
    const [isAnalyzing, setIsAnalyzing] = useState(false);
    const [aiExplanation, setAiExplanation] = useState('');
    const [isAILoading, setIsAILoading] = useState(false);
    const [compLogs, setCompLogs] = useState<string[]>([]);
    const [expandedSections, setExpandedSections] = useState({
        input: true,
        results: true,
        ai: false
    });
    const fileInputRef = useRef<HTMLInputElement>(null);
    const fileInputRef2 = useRef<HTMLInputElement>(null);

    const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (!file) return;

        const reader = new FileReader();
        reader.onload = (e) => {
            const content = e.target?.result as string;
            setSequence(content);
            toast({
                title: "File Loaded",
                description: `${file.name} successfully imported.`,
            });
        };
        reader.onerror = () => {
            toast({
                title: "Upload Error",
                description: "Failed to read the biological sequence file.",
                variant: "destructive"
            });
        };
        reader.readAsText(file);
    };

    const toolMetadata: Record<string, { title: string; icon: React.ReactNode; color: string }> = {
        'sequence-validator': { title: 'DNA Sequence Validator', icon: <CheckCircle2 className="h-6 w-6" />, color: 'emerald' },
        'gc-content': { title: 'GC Content Calculator', icon: <BarChart3 className="h-6 w-6" />, color: 'yellow' },
        'at-content': { title: 'AT Content Calculator', icon: <Activity className="h-6 w-6" />, color: 'orange' },
        'reverse-complement': { title: 'Reverse Complement', icon: <History className="h-6 w-6" />, color: 'orange' },
        'orf-finder': { title: 'ORF Finder', icon: <FileSearch className="h-6 w-6" />, color: 'emerald' },
        'codon-analyzer': { title: 'Codon Usage Analyzer', icon: <Activity className="h-6 w-6" />, color: 'blue' },
        'dna-rna-transcription': { title: 'DNA to RNA Transcription', icon: <Zap className="h-6 w-6" />, color: 'purple' },
        'dna-protein-translation': { title: 'DNA to Protein Translation', icon: <Binary className="h-6 w-6" />, color: 'pink' },
        'sequence-comparison': { title: 'Mutation Finder', icon: <Split className="h-6 w-6" />, color: 'purple' },
        'snp-highlighter': { title: 'SNP Highlighter', icon: <Target className="h-6 w-6" />, color: 'red' },
        'global-alignment': { title: 'Global Alignment (NW)', icon: <Filter className="h-6 w-6" />, color: 'indigo' },
        'local-alignment': { title: 'Local Alignment (SW)', icon: <Target className="h-6 w-6" />, color: 'rose' },
        'restriction-mapper': { title: 'Restriction Mapper', icon: <Scissors className="h-6 w-6" />, color: 'cyan' },
        'primer-design': { title: 'Primer Design Tool', icon: <Binary className="h-6 w-6" />, color: 'indigo' },
        'motif-search': { title: 'Motif Finder', icon: <Search className="h-6 w-6" />, color: 'pink' },
        'palindrome-finder': { title: 'Palindrome Finder', icon: <Zap className="h-6 w-6" />, color: 'yellow' },
        'tandem-repeats': { title: 'Tandem Repeat Analyzer', icon: <Dices className="h-6 w-6" />, color: 'orange' },
        'pcr-simulation': { title: 'PCR Simulator', icon: <Activity className="h-6 w-6" />, color: 'teal' },
        'protein-stats': { title: 'Protein Property Analyzer', icon: <Sparkles className="h-6 w-6" />, color: 'blue' },
        'pdb-viewer': { title: 'PDB Structure Viewer', icon: <Microscope className="h-6 w-6" />, color: 'slate' },
        'crispr-analyzer': { title: 'CRISPR gRNA Finder', icon: <Target className="h-6 w-6" />, color: 'rose' },
        'gene-prediction': { title: 'Gene Predictor', icon: <Search className="h-6 w-6" />, color: 'emerald' },
        'fasta-parser': { title: 'FASTA Parser & Cleaner', icon: <FileJson className="h-6 w-6" />, color: 'slate' },
        'sequence-analysis': { title: 'Sequence Statistics', icon: <Dna className="h-6 w-6" />, color: 'blue' },
        'biological-insights': { title: 'Biological Insight Generator', icon: <Sparkles className="h-6 w-6" />, color: 'accent' }
    };


    const currentTool = toolMetadata[toolId || ''] || { title: 'Sequence Tool', icon: <Dna />, color: 'primary' };

    const handleRunAnalysis = async () => {
        if (!sequence) {
            toast({ title: "Sequence Required", description: "Please enter a DNA sequence to analyze.", variant: "destructive" });
            return;
        }

        const isComparison = ['sequence-comparison', 'snp-highlighter', 'global-alignment', 'local-alignment'].includes(toolId || '');

        // Input Parsing & Validation
        const parsedInput1 = parseFasta(sequence);
        if (sequence2) parseFasta(sequence2);

        if (!isComparison && parsedInput1.length > 1) {
            toast({
                title: "Too Many Sequences",
                description: "This tool only supports single sequence analysis. Please provided exactly one sequence (one FASTA record).",
                variant: "destructive"
            });
            return;
        }

        const validation = validateDNA(sequence);
        if (!validation.valid) {
            toast({ title: "Sequence 1 Invalid", description: validation.error, variant: "destructive" });
            return;
        }

        let validation2: { valid: boolean; error?: string; cleaned?: string } = { valid: true, cleaned: '' };
        if (isComparison) {
            if (!sequence2) {
                toast({ title: "Second Sequence Required", description: "This comparison tool requires exactly two sequences to differentiate.", variant: "destructive" });
                return;
            }
            validation2 = validateDNA(sequence2);
            if (!validation2.valid) {
                toast({ title: "Sequence 2 Invalid", description: validation2.error, variant: "destructive" });
                return;
            }
        }

        setIsAnalyzing(true);
        setResults(null);
        setAiExplanation('');
        setIsAILoading(false);
        setExpandedSections({ input: true, results: true, ai: false }); // Reset view

        setCompLogs(["Initializing bio-logical engine...", "Accessing nucleotide database...", "Validating genomic structure..."]);

        const cleanSeq = validation.cleaned || '';
        const cleanSeq2 = validation2.cleaned || '';

        // Removed setAnalyzedSequence and setAnalyzedSequence2 as they are not defined.
        // If they were meant to be state variables, they should be declared with useState.

        setCompLogs(prev => [...prev, "Performing primary sequence alignment..."]);
        setTimeout(() => setCompLogs(prev => [...prev, "Syncing with NCBI-standard reference..."]), 400);

        setTimeout(async () => {
            const analysisResult: ResultData = {
                sequence: cleanSeq,
                stability: calculateStabilityScore(cleanSeq),
                complexity: calculateComplexity(cleanSeq),
                timestamp: new Date().toISOString()
            };

            switch (toolId) {
                case 'sequence-validator':
                    analysisResult.validator = validation;
                    analysisResult.baseCounts = countBases(cleanSeq);
                    break;
                case 'gc-content':
                case 'sequence-analysis':
                    analysisResult.gcContent = calculateGlobalGCContent(cleanSeq);
                    analysisResult.atContent = 100 - analysisResult.gcContent;
                    analysisResult.baseCounts = countBases(cleanSeq);
                    analysisResult.length = cleanSeq.length;
                    analysisResult.windowData = calculateGCContentWindow(cleanSeq);
                    break;
                case 'at-content':
                    analysisResult.atContent = calculateATContent(cleanSeq);
                    analysisResult.gcContent = 100 - analysisResult.atContent;
                    analysisResult.baseCounts = countBases(cleanSeq);
                    analysisResult.windowData = calculateGCContentWindow(cleanSeq);
                    break;
                case 'primer-design':
                    analysisResult.primers = generatePrimers(cleanSeq);
                    break;
                case 'crispr-analyzer':
                    analysisResult.guideRNAs = findGuideRNAs(cleanSeq);
                    break;
                case 'restriction-mapper':
                    analysisResult.restrictionSites = findRestrictionSites(cleanSeq);
                    break;
                case 'orf-finder':
                    analysisResult.frames = getReadingFrames(cleanSeq);
                    break;
                case 'motif-search':
                    analysisResult.motifs = findMotifs(cleanSeq, motif);
                    analysisResult.pattern = motif;
                    break;
                case 'sequence-comparison':
                case 'snp-highlighter':
                    analysisResult.comparison = compareSequences(cleanSeq, cleanSeq2);
                    analysisResult.refLabel = "Sequence A";
                    analysisResult.queryLabel = "Sequence B";
                    break;
                case 'reverse-complement':
                    analysisResult.reverseComp = reverseComplement(cleanSeq);
                    break;
                case 'codon-analyzer':
                    analysisResult.codonUsage = calculateCodonUsage(cleanSeq);
                    break;
                case 'palindrome-finder':
                    analysisResult.palindromes = findPalindromes(cleanSeq);
                    break;
                case 'fasta-parser':
                    analysisResult.records = parseFasta(sequence);
                    break;
                case 'dna-rna-transcription':
                    analysisResult.transcription = transcribeDNA(cleanSeq);
                    break;
                case 'dna-protein-translation':
                    analysisResult.translation = translateDNA(cleanSeq);
                    analysisResult.composition = getAminoAcidComposition(analysisResult.translation);
                    analysisResult.weight = calculateProteinMolecularWeight(analysisResult.translation);
                    break;
                case 'global-alignment':
                    analysisResult.alignment = globalAlignment(cleanSeq, cleanSeq2);
                    break;
                case 'local-alignment':
                    analysisResult.alignment = localAlignment(cleanSeq, cleanSeq2);
                    break;
                case 'tandem-repeats':
                    analysisResult.repeats = findTandemRepeats(cleanSeq);
                    break;
                case 'pcr-simulation':
                    analysisResult.pcr = simulatePCRExtension(cleanSeq, motif, reverseComplement(motif));
                    break;
                case 'protein-stats':
                    analysisResult.translation = cleanSeq;
                    analysisResult.composition = getAminoAcidComposition(cleanSeq);
                    analysisResult.weight = calculateProteinMolecularWeight(cleanSeq);
                    break;
                case 'gene-prediction':
                    analysisResult.prediction = { exons: [{ start: 1, end: Math.min(cleanSeq.length, 100) }], introns: [] };
                    break;
                case 'biological-insights':
                    analysisResult.insights = "AI Insights will be generated manually via the 'Decrypt with AI' button.";
                    break;
                default:
                    analysisResult.message = "Analysis complete.";
            }

            setResults(analysisResult);
            setCompLogs(prev => [...prev, "Analytical matrix populated successfully.", "Sign-off process complete."]);
            setIsAnalyzing(false);
            toast({ title: "Analysis Complete", description: "Computational results are ready for review." });
        }, 800);
    };
    const toggleSection = (section: 'input' | 'results' | 'ai') => {
        setExpandedSections(prev => ({ ...prev, [section]: !prev[section] }));
    };

    const handleAIExplain = async () => {
        if (!results) return;

        setIsAILoading(true);
        setAiExplanation('');
        setExpandedSections(prev => ({ ...prev, ai: true })); // Auto-expand AI once clicked

        try {
            const response = await fetch(`${API_BASE_URL}/ai/explain`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                credentials: 'include',
                body: JSON.stringify({
                    results: results,
                    mode: 'researcher',
                    prompt_override: `
                        Act as a bioinformatics researcher and technical judge.
                        Provide a structured explanation of these analysis results:

                        1. What this result shows: Clearly explain the findings.
                        2. Why this matters biologically: Discuss the functional or evolutionary significance.
                        3. How this is used in real research: Provide practical context.
                        4. Suggested next analysis step: Recommend what the user should investigate next.

                        Tone: Clear, scientific, but simple. Avoid overconfidence or jargon without explanation.
                    `
                })
            });

            if (!response.ok) throw new Error('AI Engine unavailable');

            const reader = response.body?.getReader();
            const decoder = new TextDecoder();

            if (reader) {
                while (true) {
                    const { done, value } = await reader.read();
                    if (done) break;
                    const chunk = decoder.decode(value);
                    if (!chunk.startsWith('__MODEL_USED__:')) {
                        setAiExplanation(prev => prev + chunk);
                    }
                }
            }
        } catch (error) {
            console.error('AI Error:', error);
            setAiExplanation('Error communicating with AI engine. Please verify your connection.');
        } finally {
            setIsAILoading(false);
        }
    };


    return (
        <div className="min-h-screen bg-background pb-20">
            {/* TOOL NAVBAR */}
            <div className="glass border-b border-border/50 sticky top-0 z-50 px-6 py-4 bg-background/80 backdrop-blur-xl">
                <div className="container mx-auto flex items-center justify-between">
                    <div className="flex items-center gap-6">
                        <Link to="/tools" className="p-2 hover:bg-muted rounded-full transition-colors active:scale-90">
                            <ChevronLeft className="h-6 w-6" />
                        </Link>
                        <div className="flex items-center gap-4">
                            <div className={`p-2.5 rounded-xl bg-primary/10 text-primary shadow-lg shadow-primary/5 active:rotate-12 transition-transform`}>
                                {currentTool.icon}
                            </div>
                            <div className="hidden sm:block">
                                <h1 className="text-xl font-black tracking-tighter leading-none">{currentTool.title}</h1>
                                <p className="text-[10px] font-black text-muted-foreground uppercase tracking-[0.2em] mt-1">Research Node</p>
                            </div>
                        </div>
                    </div>
                    <div className="flex gap-3">
                        <Button variant="ghost" className="rounded-xl border border-border/30 h-10 px-4 text-[10px] font-black uppercase tracking-widest gap-2 hover:bg-primary/5">
                            <Save className="h-3 w-3" /> Save
                        </Button>
                        <Button variant="ghost" className="rounded-xl border border-border/30 h-10 px-4 text-[10px] font-black uppercase tracking-widest gap-2 hover:bg-primary/5">
                            <Download className="h-3 w-3" /> Export
                        </Button>
                    </div>
                </div>
            </div>

            <main className="container mx-auto px-6 py-10 max-w-[1750px]">
                <div className="grid grid-cols-1 xl:grid-cols-12 gap-8 items-start">
                    {/* COLUMN 1: INPUT PANEL */}
                    <aside className="xl:col-span-3 xl:sticky xl:top-28 space-y-6">
                        <div className="flex items-center justify-between px-2">
                            <h2 className="text-[10px] font-black uppercase tracking-[0.3em] text-primary flex items-center gap-2">
                                <Dna className="h-4 w-4" /> 01. Genomic Input
                            </h2>
                        </div>

                        <Card className="glass border-border/50 rounded-[2rem] overflow-hidden shadow-xl bg-white/[0.01]">
                            <CardContent className="p-6 space-y-6">
                                <div className="space-y-4">
                                    <div className="flex items-center justify-between">
                                        <p className="text-[10px] font-bold text-muted-foreground/60 uppercase tracking-widest leading-relaxed">
                                            {['sequence-comparison', 'snp-highlighter', 'global-alignment', 'local-alignment'].includes(toolId || '') ? 'Reference / A' : 'Sequence'}
                                        </p>
                                        <Button
                                            variant="ghost" size="sm"
                                            onClick={() => fileInputRef.current?.click()}
                                            className="h-8 rounded-lg text-[9px] font-black uppercase tracking-widest gap-2 bg-primary/5"
                                        >
                                            <FileUp className="h-3 w-3" /> Import
                                        </Button>
                                        <input type="file" ref={fileInputRef} onChange={handleFileUpload} className="hidden" accept=".fasta,.fa,.txt,.dna" />
                                    </div>
                                    <Textarea
                                        placeholder=">fasta_header\nATGC..."
                                        className="font-mono glass bg-background/50 border-border/40 rounded-xl p-4 text-xs min-h-[150px] resize-none focus:ring-primary/20"
                                        value={sequence}
                                        onChange={(e) => setSequence(e.target.value)}
                                    />
                                </div>

                                {['sequence-comparison', 'snp-highlighter', 'global-alignment', 'local-alignment'].includes(toolId || '') && (
                                    <div className="space-y-4">
                                        <div className="flex items-center justify-between">
                                            <p className="text-[10px] font-bold text-muted-foreground/60 uppercase tracking-widest leading-relaxed">Mutated / B</p>
                                            <Button
                                                variant="ghost" size="sm"
                                                onClick={() => fileInputRef2.current?.click()}
                                                className="h-8 rounded-lg text-[9px] font-black uppercase tracking-widest gap-2 bg-primary/5"
                                            >
                                                <FileUp className="h-3 w-3" /> Import
                                            </Button>
                                            <input type="file" ref={fileInputRef2} onChange={(e) => {
                                                const file = e.target.files?.[0];
                                                if (file) {
                                                    const reader = new FileReader();
                                                    reader.onload = (re) => setSequence2(re.target?.result as string);
                                                    reader.readAsText(file);
                                                }
                                            }} className="hidden" accept=".fasta,.fa,.txt,.dna" />
                                        </div>
                                        <Textarea
                                            placeholder="Enter second sequence..."
                                            className="font-mono glass bg-background/50 border-border/40 rounded-xl p-4 text-xs min-h-[150px] resize-none focus:ring-primary/20"
                                            value={sequence2}
                                            onChange={(e) => setSequence2(e.target.value)}
                                        />
                                    </div>
                                )}

                                {toolId === 'motif-search' && (
                                    <div className="space-y-2">
                                        <Label className="text-[10px] font-bold text-muted-foreground/60 uppercase tracking-widest px-1">Pattern (Motif)</Label>
                                        <Input
                                            value={motif}
                                            onChange={(e) => setMotif(e.target.value.toUpperCase())}
                                            placeholder="e.g. TATAA"
                                            className="glass bg-background/50 font-mono text-xs rounded-xl h-10"
                                        />
                                    </div>
                                )}

                                <Button
                                    onClick={handleRunAnalysis}
                                    disabled={isAnalyzing}
                                    className="w-full rounded-xl h-12 font-black uppercase tracking-[0.2em] text-[10px] gap-2 shadow-2xl shadow-primary/20 group overflow-hidden"
                                >
                                    {isAnalyzing ? <div className="h-3 w-3 border-2 border-white/30 border-t-white rounded-full animate-spin" /> : <Play className="h-3 w-3 group-hover:translate-x-1 transition-transform" />}
                                    {isAnalyzing ? 'Computing...' : 'Execute Audit'}
                                </Button>

                                {isAnalyzing && (
                                    <div className="space-y-2 font-mono text-[8px] text-primary/60 border-t border-white/5 pt-4 text-center">
                                        {compLogs.slice(-2).map((log, i) => (
                                            <div key={i} className="flex gap-2 animate-in fade-in slide-in-from-bottom-1 justify-center">
                                                <span className="font-bold">&gt; {log}</span>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </CardContent>
                        </Card>
                    </aside>

                    {/* COLUMN 2: PRIMARY ANALYSIS RESULTS */}
                    <div className="xl:col-span-5 space-y-6">
                        <div className="flex items-center justify-between px-2 h-10">
                            <h2 className="text-[10px] font-black uppercase tracking-[0.3em] text-primary flex items-center gap-2">
                                <BarChart3 className="h-4 w-4" /> 02. Results
                            </h2>
                            {results && (
                                <Button
                                    variant="ghost" size="sm"
                                    onClick={() => toggleSection('results')}
                                    className="h-8 rounded-lg text-[9px] font-black uppercase tracking-widest gap-2 bg-primary/5"
                                >
                                    {expandedSections.results ? 'Collapse' : 'Expand'}
                                </Button>
                            )}
                        </div>

                        {results ? (
                            <Card className={`glass border-border/50 rounded-[2.5rem] overflow-hidden shadow-2xl transition-all duration-500 bg-white/[0.01] ${!expandedSections.results ? 'max-h-24' : ''}`}>
                                <CardContent className="p-8">
                                    <div className="space-y-8">
                                        {/* UNIVERSAL STATS HUD */}
                                        {!['fasta-parser', 'sequence-comparison', 'snp-highlighter', 'pdb-viewer'].includes(toolId || '') && results.stability && (
                                            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                                                <div className="p-4 rounded-2xl bg-primary/5 border border-primary/10 text-center">
                                                    <p className="text-[8px] font-black text-primary uppercase tracking-widest mb-1">Stability</p>
                                                    <p className="text-xl font-black">{results.stability.toFixed(1)}%</p>
                                                </div>
                                                <div className="p-4 rounded-2xl bg-accent/5 border border-accent/10 text-center">
                                                    <p className="text-[8px] font-black text-accent uppercase tracking-widest mb-1">Complexity</p>
                                                    <p className="text-xl font-black">{results.complexity.toFixed(1)}%</p>
                                                </div>
                                                <div className="p-4 rounded-2xl bg-blue-500/5 border border-blue-500/10 text-center">
                                                    <p className="text-[8px] font-black text-blue-500 uppercase tracking-widest mb-1">Length</p>
                                                    <p className="text-xl font-black">{results.sequence?.length || 0} BP</p>
                                                </div>
                                                <div className="p-4 rounded-2xl bg-emerald-500/5 border border-emerald-500/10 text-center">
                                                    <p className="text-[8px] font-black text-emerald-500 uppercase tracking-widest mb-1">GC%</p>
                                                    <p className="text-xl font-black">{results.gcContent ? results.gcContent.toFixed(1) : '0'}%</p>
                                                </div>
                                            </div>
                                        )}

                                        {/* TOOL-SPECIFIC VIEWS */}
                                        <div className="min-h-[200px]">
                                            {toolId === 'sequence-validator' && (
                                                <div className="space-y-6">
                                                    <div className="flex items-center gap-4 p-5 rounded-2xl bg-emerald-500/5 border border-emerald-500/20">
                                                        <CheckCircle2 className="h-6 w-6 text-emerald-500" />
                                                        <div>
                                                            <h3 className="text-xs font-black uppercase tracking-tight">Audit Passed</h3>
                                                        </div>
                                                    </div>
                                                    <div className="grid grid-cols-2 gap-2 font-mono text-[10px] bg-black/20 p-4 rounded-xl border border-white/5">
                                                        <div className="flex justify-between"><span>A:</span> <span className="text-primary">{results.baseCounts?.A}</span></div>
                                                        <div className="flex justify-between"><span>T:</span> <span className="text-primary">{results.baseCounts?.T}</span></div>
                                                        <div className="flex justify-between"><span>G:</span> <span className="text-primary">{results.baseCounts?.G}</span></div>
                                                        <div className="flex justify-between"><span>C:</span> <span className="text-primary">{results.baseCounts?.C}</span></div>
                                                    </div>
                                                </div>
                                            )}

                                            {['gc-content', 'sequence-analysis', 'at-content'].includes(toolId || '') && (
                                                <div className="h-[200px] w-full bg-black/20 rounded-xl p-4 border border-white/5">
                                                    <ResponsiveContainer width="100%" height="100%">
                                                        <AreaChart data={results.windowData}>
                                                            <Area type="monotone" dataKey="gc" stroke="hsl(var(--primary))" fill="hsl(var(--primary))" fillOpacity={0.1} />
                                                        </AreaChart>
                                                    </ResponsiveContainer>
                                                </div>
                                            )}

                                            {toolId === 'reverse-complement' && (
                                                <div className="font-mono text-[10px] break-all p-4 bg-black/40 rounded-xl border border-white/5 text-primary max-h-[300px] overflow-y-auto">
                                                    {results.reverseComp}
                                                </div>
                                            )}

                                            {toolId === 'dna-rna-transcription' && (
                                                <div className="font-mono text-[10px] break-all p-4 bg-black/40 rounded-xl border border-white/5 text-primary max-h-[300px] overflow-y-auto">
                                                    {results.transcription}
                                                </div>
                                            )}

                                            {['dna-protein-translation', 'protein-stats'].includes(toolId || '') && (
                                                <div className="space-y-4">
                                                    <div className="font-mono text-[10px] break-all p-4 bg-black/40 rounded-xl border border-white/5 text-emerald-500 max-h-[200px] overflow-y-auto">
                                                        {results.translation}
                                                    </div>
                                                    <div className="grid grid-cols-5 md:grid-cols-10 gap-1">
                                                        {Object.entries(results.composition || {}).map(([aa, count]) => (
                                                            <div key={aa} className="p-1 rounded bg-white/[0.02] border border-white/5 text-center">
                                                                <p className="text-[7px] font-black text-muted-foreground">{aa}</p>
                                                                <p className="text-[10px] font-black">{count}</p>
                                                            </div>
                                                        ))}
                                                    </div>
                                                </div>
                                            )}

                                            {['global-alignment', 'local-alignment'].includes(toolId || '') && results.alignment && (
                                                <div className="space-y-4">
                                                    <Badge className="bg-indigo-500/20 text-indigo-400 border-indigo-500/30">Score: {results.alignment.score}</Badge>
                                                    <div className="font-mono text-[10px] bg-black/60 p-4 rounded-xl border border-white/5 overflow-x-auto whitespace-pre">
                                                        <div className="text-emerald-500">{results.alignment.align1}</div>
                                                        <div className="text-white/20">
                                                            {results.alignment.align1.split('').map((char: string, i: number) =>
                                                                char === results.alignment?.align2[i] ? '|' : ' '
                                                            )}
                                                        </div>
                                                        <div className="text-rose-500">{results.alignment.align2}</div>
                                                    </div>
                                                </div>
                                            )}

                                            {toolId === 'tandem-repeats' && (
                                                <div className="grid grid-cols-3 gap-2">
                                                    {results.repeats?.map((repeat, i: number) => (
                                                        <div key={i} className="p-2 rounded-lg bg-orange-500/5 border border-orange-500/10 text-center">
                                                            <p className="text-[10px] font-black">x{repeat.count} {repeat.unit}</p>
                                                        </div>
                                                    ))}
                                                </div>
                                            )}

                                            {toolId === 'pcr-simulation' && results.pcr && (
                                                <div className="space-y-2">
                                                    {results.pcr.success ? (
                                                        <div className="p-4 rounded-xl bg-teal-500/5 border border-teal-500/20">
                                                            <p className="text-xs font-black text-teal-500 mb-2 uppercase tracking-widest">Amplification Success</p>
                                                            <div className="space-y-1">
                                                                <p className="font-mono text-[10px] break-all">{results.pcr.product}</p>
                                                                <p className="text-[9px] font-bold text-muted-foreground">Length: {results.pcr.length} BP</p>
                                                            </div>
                                                        </div>
                                                    ) : (
                                                        <div className="p-4 rounded-xl bg-destructive/5 border border-destructive/20">
                                                            <p className="text-[10px] font-black text-destructive uppercase tracking-widest">Simulation Failed</p>
                                                            <p className="text-[9px] mt-1 italic">{results.pcr.error}</p>
                                                        </div>
                                                    )}
                                                </div>
                                            )}

                                            {toolId === 'gene-prediction' && (
                                                <div className="p-6 rounded-2xl border border-emerald-500/20 bg-emerald-500/5 text-center">
                                                    <div className="h-1.5 w-full bg-white/5 rounded-full overflow-hidden mb-2">
                                                        <div className="w-[40%] h-full bg-emerald-500" />
                                                    </div>
                                                    <p className="text-[9px] font-black text-emerald-500 uppercase">CDS Detected</p>
                                                </div>
                                            )}

                                            {toolId === 'orf-finder' && (
                                                <div className="grid grid-cols-1 gap-2">
                                                    {results.frames?.map((frame, i: number) => (
                                                        <div key={i} className="p-3 rounded-xl bg-white/[0.02] border border-white/5">
                                                            <p className="text-[8px] font-black uppercase mb-1">Frame {i < 3 ? i + 1 : -(i - 2)} ({frame.length} AA)</p>
                                                            <p className="font-mono text-[9px] break-all text-emerald-500/80 truncate">
                                                                {frame.map((c: { aminoAcid: string }) => c.aminoAcid === 'Stop' ? '*' : (c.aminoAcid[0] || '?')).join('')}
                                                            </p>
                                                        </div>
                                                    ))}
                                                </div>
                                            )}

                                            {toolId === 'codon-analyzer' && results.codonUsage && (
                                                <div className="space-y-4">
                                                    <div className="h-[150px] w-full bg-black/20 rounded-xl p-4 border border-white/5">
                                                        <ResponsiveContainer width="100%" height="100%">
                                                            <BarChart data={results.codonUsage.slice(0, 8)}>
                                                                <Bar dataKey="count" fill="hsl(var(--primary))" radius={[2, 2, 0, 0]} />
                                                            </BarChart>
                                                        </ResponsiveContainer>
                                                    </div>
                                                    <div className="grid grid-cols-4 gap-1">
                                                        {results.codonUsage?.slice(0, 8).map((c, i: number) => (
                                                            <div key={i} className="p-1 rounded bg-white/[0.02] border border-white/5 text-center">
                                                                <p className="text-[9px] font-black font-mono">{c.codon}:{c.count}</p>
                                                            </div>
                                                        ))}
                                                    </div>
                                                </div>
                                            )}

                                            {['sequence-comparison', 'snp-highlighter'].includes(toolId || '') && results.comparison && (
                                                <div className="space-y-4">
                                                    <div className="grid grid-cols-2 gap-2">
                                                        <div className="p-2 rounded-xl bg-primary/5 border border-primary/20 text-center">
                                                            <p className="text-[8px] font-black text-primary uppercase mb-0.5">Similarity</p>
                                                            <p className="text-xs font-black">{results.comparison.similarityPercentage || results.comparison.percentIdentity}%</p>
                                                        </div>
                                                        <div className="p-2 rounded-xl bg-rose-500/5 border border-rose-500/20 text-center">
                                                            <p className="text-[8px] font-black text-rose-500 uppercase mb-0.5">Mismatches</p>
                                                            <p className="text-xs font-black">{results.comparison.mismatchCount || results.comparison.comparison.length}</p>
                                                        </div>
                                                    </div>
                                                    <div className="grid grid-cols-4 gap-1 max-h-[100px] overflow-y-auto">
                                                        {results.comparison?.comparison.filter((c) => c.result === 'Mismatch').slice(0, 8).map((c, i: number) => (
                                                            <div key={i} className="p-1.5 rounded-lg bg-rose-500/5 border border-rose-500/10 text-center">
                                                                <p className="text-[7px] font-black text-rose-400">POS {c.position}</p>
                                                                <p className="text-[9px] font-mono font-black">{c.char1}→{c.char2}</p>
                                                            </div>
                                                        ))}
                                                    </div>
                                                </div>
                                            )}

                                            {toolId === 'biological-insights' && (
                                                <div className="p-6 rounded-2xl border border-accent/20 bg-accent/5 text-center space-y-4">
                                                    <Brain className="h-8 w-8 text-accent mx-auto animate-pulse" />
                                                    <p className="text-[9px] font-black uppercase tracking-widest text-accent">Neural Insights Ready</p>
                                                    <Button onClick={handleAIExplain} className="h-8 rounded-lg bg-accent hover:bg-accent/90 text-white text-[9px] font-black uppercase tracking-widest px-8">Process Insight</Button>
                                                </div>
                                            )}

                                            {toolId === 'pdb-viewer' && (
                                                <div className="p-8 rounded-2xl border border-primary/20 bg-primary/5 text-center space-y-4">
                                                    <Dna className="h-10 w-10 text-primary mx-auto animate-spin-slow" />
                                                    <p className="text-[9px] font-black uppercase tracking-widest text-primary">Structural Matrix Offline</p>
                                                </div>
                                            )}

                                            {toolId === 'restriction-mapper' && (
                                                <div className="grid grid-cols-3 gap-1">
                                                    {results.restrictionSites?.slice(0, 15).map((site, i: number) => (
                                                        <div key={i} className="p-2 rounded bg-cyan-500/5 border border-cyan-500/10 text-center">
                                                            <p className="text-[9px] font-black">{site.enzyme.name}@{site.position}</p>
                                                        </div>
                                                    ))}
                                                </div>
                                            )}

                                            {toolId === 'fasta-parser' && (
                                                <div className="space-y-2">
                                                    {results.records?.slice(0, 3).map((record, i: number) => (
                                                        <div key={i} className="p-3 rounded-xl bg-white/[0.02] border border-white/5">
                                                            <p className="text-[9px] font-black text-primary truncate">/ {record.header}</p>
                                                        </div>
                                                    ))}
                                                </div>
                                            )}

                                            {toolId === 'primer-design' && (
                                                <div className="space-y-2">
                                                    {Array.isArray(results.primers) ? results.primers.slice(0, 8).map((primer, i) => (
                                                        <div key={i} className="p-3 rounded-xl bg-white/[0.02] border border-white/5">
                                                            <div className="flex justify-between items-center text-[8px] font-black uppercase mb-1">
                                                                <span className="text-primary">Pair {i + 1}</span>
                                                                <span className="text-muted-foreground">{primer.forwardTm.toFixed(1)}°C / {primer.reverseTm.toFixed(1)}°C</span>
                                                            </div>
                                                            <p className="font-mono text-[9px] break-all truncate opacity-80">{primer.forwardPrimer}</p>
                                                            <p className="font-mono text-[9px] break-all truncate opacity-80 mt-1">{primer.reversePrimer}</p>
                                                        </div>
                                                    )) : Object.entries(results.primers || {}).map(([type, primer], i) => (
                                                        <div key={i} className="p-3 rounded-xl bg-white/[0.02] border border-white/5">
                                                            <div className="flex justify-between items-center text-[8px] font-black uppercase mb-1">
                                                                <span className="text-primary">{type}</span>
                                                                <span className="text-muted-foreground">{primer.tm?.toFixed(1) || '0'}°C | {primer.gc?.toFixed(1) || '0'}%</span>
                                                            </div>
                                                            <p className="font-mono text-[10px] break-all truncate">{primer.sequence}</p>
                                                        </div>
                                                    ))}
                                                </div>
                                            )}

                                            {toolId === 'motif-search' && results.motifs && (
                                                <div className="flex flex-wrap gap-1">
                                                    {results.motifs?.slice(0, 24).map((motifMatch, i: number) => (
                                                        <Badge key={i} variant="outline" className="text-[8px] py-0 px-1.5 border-pink-500/20 text-pink-500 bg-pink-500/5">
                                                            {motifMatch.position}
                                                        </Badge>
                                                    ))}
                                                    {results.motifs.length > 24 && <span className="text-[8px] text-muted-foreground">+{results.motifs.length - 24} more</span>}
                                                </div>
                                            )}

                                            {toolId === 'crispr-analyzer' && (
                                                <div className="space-y-2">
                                                    {results.guideRNAs?.slice(0, 5).map((guide, i: number) => (
                                                        <div key={i} className="p-3 rounded-xl bg-white/[0.02] border border-white/5 flex justify-between items-center">
                                                            <div className="space-y-0.5">
                                                                <p className="font-mono text-[10px] font-black">{guide.sequence}<span className="text-rose-500">{guide.pam}</span></p>
                                                                <p className="text-[8px] font-bold text-muted-foreground uppercase opacity-50">Pos: {guide.position} | GC: {guide.gcContent.toFixed(1)}%</p>
                                                            </div>
                                                        </div>
                                                    ))}
                                                </div>
                                            )}

                                            {toolId === 'palindrome-finder' && (
                                                <div className="grid grid-cols-2 gap-2">
                                                    {results.palindromes?.slice(0, 8).map((pal, i: number) => (
                                                        <div key={i} className="p-2 rounded-lg bg-yellow-500/5 border border-yellow-500/10 text-center">
                                                            <p className="text-[7px] font-black text-yellow-500 uppercase mb-0.5">{pal.length} BP @ {pal.position}</p>
                                                            <p className="font-mono text-[9px] font-black truncate">{pal.sequence}</p>
                                                        </div>
                                                    ))}
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>
                        ) : (
                            <Card className="glass border-border/50 rounded-[2.5rem] p-20 text-center border-dashed border-2 bg-white/[0.01]">
                                <div className="space-y-4 opacity-20">
                                    <BarChart3 className="h-10 w-10 mx-auto" />
                                    <p className="text-[10px] font-black uppercase tracking-[0.4em]">Awaiting Input</p>
                                </div>
                            </Card>
                        )}
                    </div>

                    {/* COLUMN 3: AI INTERPRETATION */}
                    <div className="xl:col-span-4 space-y-6">
                        <div className="flex items-center justify-between px-2 h-10">
                            <h2 className="text-[10px] font-black uppercase tracking-[0.3em] text-accent flex items-center gap-2">
                                <Brain className="h-4 w-4" /> 03. AI Insight
                            </h2>
                            {results && (
                                <Button
                                    variant="ghost" size="sm"
                                    onClick={() => toggleSection('ai')}
                                    className="h-8 rounded-lg text-[9px] font-black uppercase tracking-widest gap-2 bg-accent/5"
                                >
                                    {expandedSections.ai ? 'Collapse' : 'Expand'}
                                </Button>
                            )}
                        </div>

                        {expandedSections.ai && (
                            <Card className="glass border-accent/20 rounded-[2.5rem] overflow-hidden shadow-2xl bg-accent/[0.01]">
                                <CardContent className="p-8">
                                    {!results ? (
                                        <div className="text-center py-10 opacity-20">
                                            <Sparkles className="h-8 w-8 mx-auto mb-4" />
                                            <p className="text-[10px] font-black uppercase tracking-widest">Awaiting Results</p>
                                        </div>
                                    ) : aiExplanation ? (
                                        <div className="prose prose-invert prose-sm max-w-none">
                                            <div className="text-[12px] font-medium leading-relaxed text-foreground/80 whitespace-pre-wrap">
                                                {aiExplanation}
                                            </div>
                                        </div>
                                    ) : isAILoading ? (
                                        <div className="space-y-4 py-6">
                                            <div className="h-2 w-3/4 bg-accent/10 rounded-full animate-pulse" />
                                            <div className="h-2 w-full bg-accent/10 rounded-full animate-pulse" />
                                            <div className="h-2 w-5/6 bg-accent/10 rounded-full animate-pulse" />
                                            <p className="text-[8px] font-black uppercase text-accent/40 text-center mt-4 animate-pulse">Processing Neural Matrix...</p>
                                        </div>
                                    ) : (
                                        <div className="text-center py-6 space-y-6">
                                            <p className="text-muted-foreground text-xs">Unlock biological interpretation with AI.</p>
                                            <Button
                                                onClick={handleAIExplain}
                                                className="w-full rounded-2xl h-12 bg-accent hover:bg-accent/90 text-white font-black gap-2 shadow-lg shadow-accent/20"
                                            >
                                                <Sparkles className="h-3 w-3" />
                                                <span className="uppercase tracking-widest text-[9px]">Generate Insight</span>
                                            </Button>
                                        </div>
                                    )}
                                </CardContent>
                            </Card>
                        )}
                    </div>
                </div>
            </main>
        </div>
    );
};

export default ToolWorkspace;
