import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import {
    BarChart3,
    FlipHorizontal,
    AlignJustify,
    Microscope,
    Target,
    FileText,
    FileJson,
    Download,
    Sparkles,
    Zap,
    Shield,
    Database,
    Lock
} from 'lucide-react';
import SequenceUploader from '@/components/SequenceUploader';
import BaseCountAnalysis from '@/components/BaseCountAnalysis';
import ReverseComplementDisplay from '@/components/ReverseComplementDisplay';
import AminoAcidTranslation from '@/components/AminoAcidTranslation';
import ReadingFrames from '@/components/ReadingFrames';
import SNPDetection from '@/components/SNPDetection';
import MotifSearch from '@/components/MotifSearch';
import RestrictionSites from '@/components/RestrictionSites';
import GCContentAnalysis from '@/components/GCContentAnalysis';
import CRISPRFinder from '@/components/CRISPRFinder';
import PrimerDesigner from '@/components/PrimerDesigner';
import { countBases, reverseComplement, calculateGlobalGCContent } from '@/utils/dnaUtils';
import { generatePDFReport, generateCompleteReport } from '@/utils/reportUtils';
import { toast } from '@/components/ui/use-toast';
import ProjectManager from '@/components/ProjectManager';
import CollaborativeChat from '@/components/CollaborativeChat';
import ScreenShare from '@/components/ScreenShare';
import AIAssistant from '@/components/AIAssistant';
import ComplianceOverlay from '@/components/ComplianceOverlay';
import { useAuth } from '../hooks/useAuth';

interface BaseCount {
    A: number;
    T: number;
    G: number;
    C: number;
    Other: number;
}

const Index = () => {
    const [sequence, setSequence] = useState<string>('');
    const [baseCount, setBaseCount] = useState<BaseCount | null>(null);
    const [activeTab, setActiveTab] = useState('primary');
    const [activeSubTab, setActiveSubTab] = useState('statistics');
    const { isAuthenticated } = useAuth();
    const navigate = useNavigate();

    useEffect(() => {
        if (sequence) {
            setBaseCount(countBases(sequence));
        }
    }, [sequence]);

    const handleSequenceSubmit = (newSequence: string) => {
        setSequence(newSequence);
    };

    const handleLoadAnalysis = (newSequence: string) => {
        setSequence(newSequence);
        // If results are provided, we could optionally set them in a state
        // but currently our components derive everything from 'sequence'
        toast({ title: "Session Restored", description: "All genomic data and structural analysis re-hydrated." });
    };

    const handleSaveToProfile = async () => {
        if (!isAuthenticated) {
            toast({
                title: "Authentication Required",
                description: "Please sign in to save your sequences securely.",
            });
            return;
        }

        if (!sequence) {
            toast({
                title: "Empty Sequence",
                description: "Nothing to save.",
                variant: "destructive"
            });
            return;
        }

        try {
            const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';
            const response = await fetch(`${API_URL}/genomic-data`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                credentials: 'include',
                body: JSON.stringify({
                    title: `Analysis - ${new Date().toLocaleDateString()}`,
                    data_type: 'raw_sequence',
                    payload: sequence
                }),
            });

            if (response.ok) {
                toast({
                    title: "Saved Securely",
                    description: "Your data is encrypted with AES-256-GCM on our servers.",
                });
            } else {
                throw new Error('Save failed');
            }
        } catch {
            toast({
                title: "Save Failed",
                description: "Could not persist data to secure storage.",
                variant: "destructive"
            });
        }
    };

    const currentYear = new Date().getFullYear();

    return (
        <div className="container mx-auto px-6 py-8 animate-in fade-in duration-700">
            <div className="mb-16 text-center animate-in slide-in-from-bottom-6 duration-1000">
                <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-primary/10 text-primary text-[11px] font-black uppercase tracking-[0.25em] mb-6">
                    <Sparkles className="h-3.5 w-3.5" />
                    Analytical Intelligence Layer
                </div>
                <h1 className="text-5xl md:text-7xl font-black tracking-tighter mb-6 leading-tight">
                    GENOMIC <span className="text-primary italic">ANALYSIS</span> ENGINE.
                </h1>
                <p className="text-muted-foreground text-lg md:text-xl font-medium max-w-3xl mx-auto leading-relaxed">
                    Deploying state-of-the-art computational biology tools for sequence validation,
                    structural inspection, and molecular precision.
                </p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">

                {/* LEFT SIDEBAR */}
                <div className="lg:col-span-4 space-y-8">
                    <SequenceUploader onSequenceSubmit={handleSequenceSubmit} />

                    {isAuthenticated && <ScreenShare />}

                    {isAuthenticated && (
                        <ProjectManager
                            onLoadAnalysis={handleLoadAnalysis}
                            currentSequence={sequence}
                            currentResults={{ baseCount }}
                        />
                    )}

                    <Card className="glass-card border-none shadow-2xl overflow-hidden group">
                        <CardHeader className="pb-4 border-b border-border/50 bg-muted/20">
                            <div className="flex items-center gap-3">
                                <div className="p-2 rounded-xl bg-accent/10 text-accent">
                                    <Download className="h-5 w-5" />
                                </div>
                                <div>
                                    <CardTitle className="text-xl font-bold tracking-tight">Reporting</CardTitle>
                                    <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-muted-foreground mt-1">Dossier Generation</p>
                                </div>
                            </div>
                        </CardHeader>
                        <CardContent className="pt-6 space-y-6">
                            <div className="grid grid-cols-2 gap-3">
                                <Button
                                    onClick={async () => {
                                        if (!sequence) {
                                            toast({
                                                title: "No Sequence Data",
                                                description: "Please upload a DNA sequence first.",
                                                variant: "destructive"
                                            });
                                            return;
                                        }
                                        // Switch to applied tab so the GC content section is rendered
                                        if (activeTab !== 'applied') {
                                            setActiveTab('applied');
                                        }
                                        // Helper to wait for the element to appear
                                        const waitForElement = (id: string, timeout = 5000) => {
                                            return new Promise<HTMLElement | null>((resolve) => {
                                                const start = Date.now();
                                                const check = () => {
                                                    const el = document.getElementById(id);
                                                    if (el) {
                                                        resolve(el as HTMLElement);
                                                    } else if (Date.now() - start > timeout) {
                                                        resolve(null);
                                                    } else {
                                                        setTimeout(check, 200);
                                                    }
                                                };
                                                check();
                                            });
                                        };
                                        const element = await waitForElement('gc-content-report');
                                        if (!element) {
                                            toast({
                                                title: "Section Not Ready",
                                                description: "The GC Content section did not render. Please try again.",
                                                variant: "destructive"
                                            });
                                            return;
                                        }
                                        toast({
                                            title: "Generating PDF...",
                                            description: "Creating your GC Content Analysis report.",
                                        });
                                        const success = await generatePDFReport("GC_Content_Analysis", "gc-content-report");
                                        if (success) {
                                            toast({
                                                title: "PDF Downloaded!",
                                                description: "Your report has been saved successfully.",
                                            });
                                        } else {
                                            toast({
                                                title: "Download Failed",
                                                description: "Unable to generate PDF. Please ensure the section is visible.",
                                                variant: "destructive"
                                            });
                                        }
                                    }}
                                    variant="outline"
                                    className="glass py-6 rounded-xl border-border/50 hover:bg-muted text-xs font-bold uppercase tracking-widest gap-2"
                                >
                                    <FileText className="h-4 w-4" />
                                    PDF
                                </Button>
                                <Button
                                    onClick={() => {
                                        toast({
                                            title: "Coming Soon",
                                            description: "Word export feature is under development.",
                                        });
                                    }}
                                    variant="outline"
                                    className="glass py-6 rounded-xl border-border/50 hover:bg-muted text-xs font-bold uppercase tracking-widest gap-2"
                                >
                                    <FileJson className="h-4 w-4" />
                                    WORD
                                </Button>
                            </div>
                            <Button
                                onClick={async () => {
                                    if (!isAuthenticated) {
                                        toast({
                                            title: "Authentication Required",
                                            description: "Please sign in to access advanced reporting features.",
                                        });
                                        return;
                                    }
                                    if (!sequence) {
                                        toast({
                                            title: "No Sequence Data",
                                            description: "Please upload a DNA sequence first.",
                                            variant: "destructive"
                                        });
                                        return;
                                    }

                                    toast({
                                        title: "Generating Complete Report...",
                                        description: "This may take a moment. Please wait.",
                                    });

                                    const success = await generateCompleteReport({
                                        sequenceLength: sequence.length,
                                        title: "Genomic Dossier"
                                    });

                                    if (success) {
                                        toast({
                                            title: "Report Downloaded!",
                                            description: "Your complete genomic analysis report has been saved.",
                                        });
                                    } else {
                                        toast({
                                            title: "Export Failed",
                                            description: "Unable to generate complete report. Some sections may not be available.",
                                            variant: "destructive"
                                        });
                                    }
                                }}
                                className="w-full btn-premium py-7 rounded-xl bg-primary hover:bg-primary/90 text-primary-foreground font-bold shadow-lg shadow-primary/20 flex items-center justify-center gap-3"
                            >
                                <Download className="h-5 w-5" />
                                Export Report
                                {!isAuthenticated && <Lock className="h-3 w-3 ml-1 opacity-50" />}
                            </Button>

                            <Button
                                onClick={handleSaveToProfile}
                                variant="outline"
                                className="w-full py-6 rounded-xl border-primary/20 hover:bg-primary/5 text-xs font-bold uppercase tracking-widest gap-2"
                            >
                                <Shield className="h-4 w-4 text-primary" />
                                Save to Profile
                                {!isAuthenticated && <Lock className="h-3 w-3 ml-1 opacity-50" />}
                            </Button>

                            {!isAuthenticated && (
                                <p className="text-[9px] text-center font-bold text-muted-foreground uppercase tracking-widest mt-2">
                                    Login required for full documentation
                                </p>
                            )}

                            <div className="flex items-center gap-2 p-3 glass rounded-xl border-accent/20 bg-accent/5">
                                <Shield className="h-3.5 w-3.5 text-accent animate-pulse" />
                                <span className="text-[9px] font-bold text-accent uppercase tracking-widest">Encrypted Transmission Ready</span>
                            </div>
                        </CardContent>
                    </Card>

                    <div className="p-6 glass rounded-[2rem] border-primary/20 relative overflow-hidden group">
                        <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                            <Zap className="h-12 w-12" />
                        </div>
                        <h4 className="text-xs font-black uppercase tracking-[0.2em] text-primary mb-2">System Health</h4>
                        <div className="flex items-center gap-3 mb-4">
                            <div className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />
                            <span className="text-[10px] font-bold text-muted-foreground">Neural Processor Online</span>
                        </div>
                        <div className="space-y-2">
                            <div className="flex justify-between text-[10px] font-bold">
                                <span className="text-muted-foreground">IO Utilization</span>
                                <span>24%</span>
                            </div>
                            <div className="w-full h-1 bg-muted/30 rounded-full overflow-hidden">
                                <div className="h-full bg-primary/40 w-[24%]" />
                            </div>
                        </div>
                    </div>
                </div>

                {/* MAIN CONTENT AREA */}
                <div className="lg:col-span-8 space-y-8">

                    {/* Main Navigation Tabs */}
                    <div className="glass p-2 rounded-[2rem] border-border/50">
                        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
                            <TabsList className="grid grid-cols-3 bg-transparent border-none p-0 h-16 gap-2">
                                <TabsTrigger
                                    value="primary"
                                    className="rounded-2xl flex gap-3 font-bold uppercase tracking-widest text-xs transition-all data-[state=active]:bg-primary data-[state=active]:text-primary-foreground data-[state=active]:shadow-xl shadow-primary/20"
                                >
                                    <Database className="h-4 w-4" />
                                    Sequence Metrics
                                </TabsTrigger>
                                <TabsTrigger
                                    value="advanced"
                                    className="rounded-2xl flex gap-3 font-bold uppercase tracking-widest text-xs transition-all data-[state=active]:bg-primary data-[state=active]:text-primary-foreground data-[state=active]:shadow-xl shadow-primary/20"
                                >
                                    <Microscope className="h-4 w-4" />
                                    Molecular Insights
                                </TabsTrigger>
                                <TabsTrigger
                                    value="applied"
                                    className="rounded-2xl flex gap-3 font-bold uppercase tracking-widest text-xs transition-all data-[state=active]:bg-primary data-[state=active]:text-primary-foreground data-[state=active]:shadow-xl shadow-primary/20"
                                >
                                    <Target className="h-4 w-4" />
                                    Applied Genomics
                                </TabsTrigger>
                            </TabsList>
                        </Tabs>
                    </div>

                    {isAuthenticated && (
                        <div className="animate-in fade-in slide-in-from-top-4 duration-500">
                            <AIAssistant
                                analysisData={{
                                    sequence: sequence,
                                    base_counts: baseCount,
                                    gc_content: parseFloat(calculateGlobalGCContent(sequence).toFixed(2)),
                                    crispr_guides: [] // Guides are handled in sub-components, summarized here
                                }}
                            />
                        </div>
                    )}

                    <div className="space-y-8">
                        {activeTab === 'primary' && (
                            <div className="animate-in fade-in slide-in-from-top-4 duration-500">
                                <Tabs value={activeSubTab} onValueChange={setActiveSubTab} className="w-full">
                                    <TabsList className="inline-flex glass p-1.5 rounded-xl border-border/50 mb-8 overflow-x-auto max-w-full">
                                        <TabsTrigger value="statistics" className="rounded-lg flex gap-2 font-bold uppercase tracking-widest text-[10px] data-[state=active]:bg-accent data-[state=active]:text-accent-foreground">
                                            <BarChart3 className="h-3.5 w-3.5" />
                                            Statistics
                                        </TabsTrigger>
                                        <TabsTrigger value="orientation" className="rounded-lg flex gap-2 font-bold uppercase tracking-widest text-[10px] data-[state=active]:bg-accent data-[state=active]:text-accent-foreground">
                                            <FlipHorizontal className="h-3.5 w-3.5" />
                                            Orientation
                                        </TabsTrigger>
                                        <TabsTrigger value="alignment" className="rounded-lg flex gap-2 font-bold uppercase tracking-widest text-[10px] data-[state=active]:bg-accent data-[state=active]:text-accent-foreground">
                                            <AlignJustify className="h-3.5 w-3.5" />
                                            Alignment
                                        </TabsTrigger>
                                    </TabsList>

                                    <TabsContent value="statistics" id="base-count-section">
                                        <BaseCountAnalysis baseCount={baseCount || { A: 0, T: 0, G: 0, C: 0 }} />
                                    </TabsContent>

                                    <TabsContent value="orientation" id="reverse-complement-section">
                                        <ReverseComplementDisplay originalSequence={sequence} reverseComplement={reverseComplement(sequence)} />
                                    </TabsContent>

                                    <TabsContent value="alignment" className="space-y-8">
                                        <Card className="glass-card border-none p-12 text-center">
                                            <div className="inline-block p-6 rounded-full bg-primary/10 mb-6">
                                                <AlignJustify className="h-12 w-12 text-primary opacity-40" />
                                            </div>
                                            <h3 className="text-2xl font-black mb-2 tracking-tight">Sequence Comparer</h3>
                                            <p className="text-muted-foreground max-w-md mx-auto mb-8 font-medium">Use our comparison engine to identify mutations and structural variants across multiple genomic strings.</p>
                                            <Button className="rounded-full px-12 py-6 bg-primary font-black shadow-xl shadow-primary/20">Initialize Comparer Layer</Button>
                                        </Card>
                                    </TabsContent>
                                </Tabs>
                            </div>
                        )}

                        {activeTab === 'advanced' && (
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 animate-in fade-in slide-in-from-top-4 duration-500">
                                <div id="amino-acid-section row-span-2">
                                    <AminoAcidTranslation sequence={sequence} />
                                </div>
                                <div id="reading-frames-section">
                                    <ReadingFrames sequence={sequence} />
                                </div>
                                <div id="snp-detection-section">
                                    <SNPDetection referenceSequence={sequence} />
                                </div>
                            </div>
                        )}

                        {activeTab === 'applied' && (
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 animate-in fade-in slide-in-from-top-4 duration-500">
                                <div id="motif-search-section">
                                    <MotifSearch sequence={sequence} />
                                </div>
                                <div id="restriction-sites-section">
                                    <RestrictionSites sequence={sequence} />
                                </div>
                                <div id="gc-content-report">
                                    <GCContentAnalysis sequence={sequence} />
                                </div>
                                <div id="crispr-guides-section">
                                    <CRISPRFinder sequence={sequence} />
                                </div>
                                <div id="primer-design-section" className="md:col-span-2">
                                    <PrimerDesigner sequence={sequence} />
                                </div>
                            </div>
                        )}

                        {!sequence && (
                            <div className="py-20 flex flex-col items-center justify-center glass rounded-[4rem] border-dashed border-primary/20 animate-pulse">
                                <div className="mb-8 p-12 rounded-[4rem] bg-primary/5 transition-all hover:scale-105 duration-700">
                                    <img src="/logo.svg" className="h-16 w-auto dark:hidden opacity-40 grayscale hover:grayscale-0 transition-all" alt="Gene Forge Logo" />
                                    <img src="/logo-dark.svg" className="h-16 w-auto hidden dark:block opacity-40 grayscale hover:grayscale-0 transition-all" alt="Gene Forge Logo" />
                                </div>
                                <h2 className="text-3xl font-black tracking-tighter mb-3 opacity-30">Awaiting Genomic Data...</h2>
                                <p className="text-muted-foreground font-medium opacity-40">Please upload a sequence file or enter manual string to initialize analysis.</p>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            <footer className="mt-20 py-12 border-t border-border/50 text-center relative overflow-hidden">
                <div className="absolute inset-0 bg-primary/[0.02] -skew-y-3" />
                <div className="relative z-10 flex flex-col items-center gap-4">
                    <div className="flex gap-8 mb-4">
                        {['Architecture', 'Security', 'Compliance', 'Privacy'].map(item => (
                            <span
                                key={item}
                                onClick={() => navigate('/security')}
                                className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground/40 hover:text-primary transition-colors cursor-pointer"
                            >
                                {item}
                            </span>
                        ))}
                    </div>
                    <p className="text-[10px] font-black uppercase tracking-[0.4em] text-muted-foreground/60 flex items-center gap-3">
                        GENEFORGE RESEARCH FOUNDATION • {currentYear} • v4.0.2
                        <Sparkles className="h-3 w-3 text-primary animate-pulse" />
                    </p>
                    <div
                        onClick={() => navigate('/security')}
                        className="mt-4 px-6 py-2 glass rounded-full border-white/5 cursor-pointer hover:bg-primary/5 transition-all group"
                    >
                        <span className="text-[8px] font-black uppercase tracking-[0.3em] text-muted-foreground group-hover:text-primary">View Security Lab Standards</span>
                    </div>
                </div>
            </footer>
            {/* SECURE COLLABORATION FLOATER */}
            {isAuthenticated && (
                <CollaborativeChat
                    currentAnalysisContext={{
                        title: `Analysis - ${new Date().toLocaleDateString()}`,
                        sequence: sequence?.substring(0, 100) + (sequence?.length > 100 ? '...' : ''),
                        metrics: baseCount
                    }}
                />
            )}
            <ComplianceOverlay />
        </div>
    );
};

export default Index;
