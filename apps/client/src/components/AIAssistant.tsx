import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Switch } from './ui/switch';
import {
    BrainCircuit,
    Sparkles,
    Zap,
    FileText,
    GraduationCap,
    Microscope,
    Loader2,
    RefreshCw,
    AlertCircle
} from 'lucide-react';
import { useAuth } from '../hooks/useAuth';
import { toast } from './ui/use-toast';
import { API_BASE_URL as API_URL } from '@/utils/api';

interface AIAssistantProps {
    analysisData: {
        sequence: string;
        base_counts: unknown;
        gc_content: number;
        crispr_guides: unknown[];
    };
}

const AIAssistant: React.FC<AIAssistantProps> = ({ analysisData }) => {
    const { isAuthenticated } = useAuth();
    const [loading, setLoading] = useState(false);
    const [explanation, setExplanation] = useState<string | null>(null);
    const [activeModel, setActiveModel] = useState<string>('Initializing...');
    const [mode, setMode] = useState<'student' | 'researcher'>('researcher');

    const generateAIInsights = async () => {
        setLoading(true);
        setExplanation('');
        setActiveModel('Routing...');

        try {
            const response = await fetch(`${API_URL}/ai/explain`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${sessionStorage.getItem('access_token')}`
                },
                credentials: 'include',
                body: JSON.stringify({
                    results: analysisData,
                    mode: mode
                })
            });

            if (!response.body) throw new Error("No response stream");

            const reader = response.body.getReader();
            const decoder = new TextDecoder();

            setExplanation(''); // Ready for stream

            while (true) {
                const { done, value } = await reader.read();
                if (done) break;

                const chunk = decoder.decode(value);

                // Parse for Model Header
                if (chunk.includes("__MODEL_USED__:")) {
                    const parts = chunk.split("__MODEL_USED__:");
                    const modelTag = parts[1].split("\n")[0];
                    setActiveModel(modelTag);
                    // Append only the non-header parts
                    const cleanChunk = parts[0] + (parts[1].split("\n").slice(1).join("\n"));
                    setExplanation(prev => (prev || '') + cleanChunk);
                } else {
                    setExplanation(prev => (prev || '') + chunk);
                }
            }

            toast({ title: "Intelligence Deployed", description: "Analysis complete." });

        } catch (error) {
            console.error("AI Insights Error:", error);
            toast({ title: "Analysis Failed", description: "AI stream interrupted.", variant: "destructive" });
        } finally {
            setLoading(false);
        }
    };

    if (!isAuthenticated) return null;

    return (
        <Card className="glass-card border-none shadow-2xl overflow-hidden group">
            <div className={`absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-blue-500 via-primary to-blue-500 opacity-50 ${loading ? 'animate-pulse' : ''}`} />
            <CardHeader className="pb-4">
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <div className="p-2 rounded-xl bg-blue-500/10 text-blue-500">
                            <BrainCircuit className="h-5 w-5" />
                        </div>
                        <div>
                            <CardTitle className="text-xl font-bold tracking-tight">Biological Intelligence</CardTitle>
                            <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-muted-foreground mt-1">
                                {loading ? 'Neural Engine Active...' : `Powered by ${activeModel.replace(/-/g, ' ')}`}
                            </p>
                        </div>
                    </div>
                    <div className="flex items-center gap-4 glass px-3 py-1.5 rounded-full border-white/5">
                        <div className="flex items-center gap-2">
                            <span className={`text-[9px] font-black uppercase tracking-widest ${mode === 'student' ? 'text-primary' : 'text-muted-foreground'}`}>Student</span>
                            <Switch
                                checked={mode === 'researcher'}
                                onCheckedChange={(checked) => setMode(checked ? 'researcher' : 'student')}
                            />
                            <span className={`text-[9px] font-black uppercase tracking-widest ${mode === 'researcher' ? 'text-primary' : 'text-muted-foreground'}`}>Researcher</span>
                        </div>
                    </div>
                </div>
            </CardHeader>

            <CardContent className="space-y-6">
                {!explanation ? (
                    <div className="flex flex-col items-center justify-center py-12 text-center space-y-4">
                        <div className="relative">
                            <Sparkles className="h-12 w-12 text-primary/20" />
                            <Zap className="h-6 w-6 text-primary absolute -bottom-1 -right-1 animate-pulse" />
                        </div>
                        <div className="max-w-[280px]">
                            <h4 className="text-sm font-bold mb-1">Synthesize Results</h4>
                            <p className="text-[10px] text-muted-foreground font-medium uppercase tracking-widest leading-relaxed">
                                Our AI will provide a structural and functional explanation of your genomic sequence.
                            </p>
                        </div>
                        <Button
                            onClick={generateAIInsights}
                            disabled={loading || !analysisData.sequence}
                            className="bg-blue-600 hover:bg-blue-700 h-11 px-8 rounded-xl font-bold text-xs uppercase tracking-widest gap-2 shadow-lg shadow-blue-500/20"
                        >
                            {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <BrainCircuit className="h-4 w-4" />}
                            Explain with AI
                        </Button>
                    </div>
                ) : (
                    <div className="space-y-4">
                        <div className="glass p-6 rounded-3xl border-white/5 bg-background/50 prose prose-invert max-w-none prose-xs">
                            <div className="flex items-center gap-2 mb-4 border-b border-white/5 pb-2">
                                {mode === 'researcher' ? <Microscope className="h-4 w-4 text-primary" /> : <GraduationCap className="h-4 w-4 text-primary" />}
                                <span className="text-[10px] font-black uppercase tracking-widest text-primary">
                                    {mode === 'researcher' ? 'Technical Research Summary' : 'Undergraduate Level Briefing'}
                                </span>
                            </div>
                            <div className="text-xs leading-relaxed font-medium text-muted-foreground whitespace-pre-wrap">
                                {explanation}
                            </div>
                        </div>
                        <div className="flex gap-2">
                            <Button
                                variant="outline"
                                onClick={() => setExplanation(null)}
                                className="flex-1 py-6 rounded-xl border-white/10 hover:bg-white/5 text-[10px] uppercase font-black"
                            >
                                <RefreshCw className="h-3.5 w-3.5 mr-2" />
                                Clear
                            </Button>
                            <Button
                                className="flex-1 py-6 rounded-xl bg-primary/20 hover:bg-primary/30 text-primary text-[10px] uppercase font-black"
                            >
                                <FileText className="h-3.5 w-3.5 mr-2" />
                                Attach to Report
                            </Button>
                        </div>
                    </div>
                )}

                <div className="p-4 bg-muted/20 rounded-2xl border border-dashed border-white/10 flex items-start gap-3">
                    <AlertCircle className="h-4 w-4 text-amber-500 shrink-0 mt-0.5" />
                    <p className="text-[9px] font-bold text-muted-foreground uppercase tracking-widest leading-relaxed">
                        AI interpretations are generated in real-time. Always cross-reference with primary literature for mission-critical findings.
                    </p>
                </div>
            </CardContent>
        </Card>
    );
};

export default AIAssistant;
