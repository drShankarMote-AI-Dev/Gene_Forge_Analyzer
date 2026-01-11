import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Slider } from '@/components/ui/slider';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { calculateGCContent } from '@/utils/dnaUtils';
import { generatePDFReport } from '@/utils/reportUtils';
import { toast } from '@/components/ui/use-toast';
import { FileDown, Activity, Info, BarChart3 } from 'lucide-react';
import {
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  ReferenceLine,
  Area,
  AreaChart,
  Label as ChartLabel
} from 'recharts';

interface GCContentAnalysisProps {
  sequence: string;
}

const GCContentAnalysis: React.FC<GCContentAnalysisProps> = ({ sequence }) => {
  const [windowSize, setWindowSize] = useState(100);
  const [gcContent, setGcContent] = useState<number[]>([]);
  const [averageGC, setAverageGC] = useState(0);
  const [isGeneratingPDF, setIsGeneratingPDF] = useState(false);

  useEffect(() => {
    if (sequence && sequence.length >= windowSize) {
      const content = calculateGCContent(sequence, windowSize);
      setGcContent(content);

      const upperSeq = sequence.toUpperCase();
      const gcCount = upperSeq.split('').filter(base => base === 'G' || base === 'C').length;
      setAverageGC((gcCount / upperSeq.length) * 100);
    }
  }, [sequence, windowSize]);

  const chartData = gcContent.map((value, index) => ({
    position: index + 1,
    gcContent: parseFloat(value.toFixed(2))
  }));

  const handleDownloadPDF = async () => {
    setIsGeneratingPDF(true);
    try {
      const success = await generatePDFReport(
        "GC Content Analysis Report",
        "gc-content-report"
      );

      if (success) {
        toast({
          title: "Report Downloaded",
          description: "Your GC Content report has been downloaded successfully.",
        });
      } else {
        throw new Error("Failed to generate PDF");
      }
    } catch {
      toast({
        title: "Download Failed",
        description: "There was an error generating your report. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsGeneratingPDF(false);
    }
  };

  return (
    <Card className="glass-card border-none shadow-xl transition-all duration-500">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-xl bg-primary/10 text-primary">
              <BarChart3 className="h-5 w-5" />
            </div>
            <div>
              <CardTitle>Genomic GC Density Profile</CardTitle>
              <p className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground mt-1">Sliding Window Analysis</p>
            </div>
          </div>
          <div className="text-right">
            <span className="text-3xl font-black text-primary tracking-tighter">{averageGC.toFixed(1)}%</span>
            <p className="text-[9px] font-black uppercase tracking-widest text-muted-foreground">Mean Ratio</p>
          </div>
        </div>
      </CardHeader>

      <CardContent>
        <div className="space-y-8">
          <div className="space-y-4">
            <div className="flex justify-between items-center px-1">
              <Label htmlFor="window-size" className="text-xs font-bold uppercase tracking-widest text-muted-foreground">Resolution (Window Size: {windowSize} BP)</Label>
            </div>
            <Slider
              id="window-size"
              min={20}
              max={Math.min(500, sequence.length)}
              step={10}
              value={[windowSize]}
              onValueChange={(value) => setWindowSize(value[0])}
              className="py-2"
            />
          </div>

          {sequence.length < windowSize ? (
            <div className="glass p-8 rounded-3xl text-center border-dashed border-destructive/20 bg-destructive/5">
              <p className="text-destructive font-bold">Sequence threshold not met.</p>
              <p className="text-xs text-muted-foreground mt-1 italic">Input length ({sequence.length} bp) must exceed window size ({windowSize} bp).</p>
            </div>
          ) : gcContent.length > 0 ? (
            <div className="h-72 glass rounded-2xl border border-border/50 p-6 bg-background/20 overflow-hidden relative group">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={chartData} margin={{ top: 10, right: 10, left: 10, bottom: 0 }}>
                  <defs>
                    <linearGradient id="colorGC" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="hsl(var(--primary))" stopOpacity={0.3} />
                      <stop offset="95%" stopColor="hsl(var(--primary))" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(255,255,255,0.05)" />
                  <XAxis
                    dataKey="position"
                    hide
                  />
                  <YAxis
                    domain={[0, 100]}
                    axisLine={false}
                    tickLine={false}
                    tick={{ fill: 'currentColor', opacity: 0.4, fontSize: 10 }}
                  />
                  <Tooltip
                    content={({ active, payload }) => {
                      if (active && payload && payload.length) {
                        return (
                          <div className="glass p-3 rounded-xl border-border/50 shadow-2xl">
                            <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground mb-1">Index {payload[0].payload.position}</p>
                            <p className="text-lg font-black text-primary">{payload[0].value}% GC</p>
                          </div>
                        );
                      }
                      return null;
                    }}
                  />
                  <ReferenceLine y={averageGC} stroke="hsl(var(--accent))" strokeDasharray="5 5" strokeOpacity={0.5}>
                    <ChartLabel position="right" fill="hsl(var(--accent))" style={{ fontSize: '10px', fontWeight: 'bold' }}>AVG</ChartLabel>
                  </ReferenceLine>
                  <Area
                    type="monotone"
                    dataKey="gcContent"
                    stroke="hsl(var(--primary))"
                    strokeWidth={2}
                    fillOpacity={1}
                    fill="url(#colorGC)"
                    isAnimationActive={true}
                  />
                </AreaChart>
              </ResponsiveContainer>
              <div className="absolute top-4 right-10 flex items-center gap-2 opacity-40">
                <Activity className="h-3 w-3 text-primary animate-pulse" />
                <span className="text-[8px] font-black uppercase tracking-[0.2em]">Real-time Density</span>
              </div>
            </div>
          ) : null}

          <div className="glass p-4 rounded-2xl border-l-4 border-l-primary flex gap-4 bg-primary/5">
            <Info className="h-5 w-5 text-primary shrink-0" />
            <div className="space-y-1">
              <p className="text-xs font-bold uppercase tracking-widest text-primary">Biometric Significance</p>
              <p className="text-[11px] text-muted-foreground font-medium leading-relaxed">
                High GC density regions typically indicate <span className="text-foreground font-bold">CpG islands</span> or structural stability.
                The profile is generated via a sliding window of <span className="text-primary font-bold">{windowSize} BP</span> to identify regulatory variance.
              </p>
            </div>
          </div>
        </div>
      </CardContent>
      <CardFooter className="pt-2">
        <Button
          onClick={handleDownloadPDF}
          disabled={isGeneratingPDF || gcContent.length === 0}
          className="ml-auto btn-premium py-6 rounded-xl bg-primary hover:bg-primary/90 font-bold"
        >
          <FileDown className="mr-2 h-4 w-4" />
          {isGeneratingPDF ? 'Compiling Dossier...' : 'Export Synthetic Report'}
        </Button>
      </CardFooter>
    </Card>
  );
};

export default GCContentAnalysis;
