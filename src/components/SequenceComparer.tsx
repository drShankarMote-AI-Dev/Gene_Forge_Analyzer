import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { toast } from '@/components/ui/use-toast';
import { compareSequences, getBaseClass } from '@/utils/dnaUtils';
import { Badge } from '@/components/ui/badge';
import { Split, CheckCircle2, XCircle, ArrowRightLeft, Info } from 'lucide-react';

const SequenceComparer = () => {
  const [sequence1, setSequence1] = useState('');
  const [sequence2, setSequence2] = useState('');
  const [comparisonResult, setComparisonResult] = useState<{
    comparison: Array<{ index: number; base1: string; base2: string; result: string }>;
    matchCount: number;
    mismatchCount: number;
    similarityPercentage: string;
  } | null>(null);

  const handleCompare = () => {
    const seq1 = sequence1.replace(/\s/g, '').toUpperCase();
    const seq2 = sequence2.replace(/\s/g, '').toUpperCase();

    if (seq1.length === 0 || seq2.length === 0) {
      toast({
        title: "Input Required",
        description: "Please provide both sequences for alignment.",
        variant: "destructive"
      });
      return;
    }

    const result = compareSequences(seq1, seq2);
    setComparisonResult(result);

    toast({
      title: "Alignment Successful",
      description: `Detected ${result.similarityPercentage}% similarity across strings.`
    });
  };

  return (
    <Card className="glass-card border-none shadow-xl">
      <CardHeader>
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-xl bg-primary/10 text-primary">
            <Split className="h-5 w-5" />
          </div>
          <div>
            <CardTitle>Sequence Alignment Terminal</CardTitle>
            <p className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground mt-1">Comparative Genomics</p>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <Label htmlFor="sequence1" className="text-xs font-bold uppercase tracking-widest text-muted-foreground ml-1">Reference Stream (A)</Label>
            <Textarea
              id="sequence1"
              placeholder="Enter first DNA sequence..."
              value={sequence1}
              onChange={(e) => setSequence1(e.target.value)}
              className="font-mono h-32 glass bg-background/50 border-border/50 rounded-2xl p-4 text-sm resize-none focus:ring-primary/20"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="sequence2" className="text-xs font-bold uppercase tracking-widest text-muted-foreground ml-1">Comparison Stream (B)</Label>
            <Textarea
              id="sequence2"
              placeholder="Enter second DNA sequence..."
              value={sequence2}
              onChange={(e) => setSequence2(e.target.value)}
              className="font-mono h-32 glass bg-background/50 border-border/50 rounded-2xl p-4 text-sm resize-none focus:ring-primary/20"
            />
          </div>
        </div>

        <Button
          onClick={handleCompare}
          className="w-full btn-premium py-6 rounded-xl bg-primary hover:bg-primary/90 shadow-lg shadow-primary/20 font-bold"
          disabled={!sequence1.trim() || !sequence2.trim()}
        >
          <ArrowRightLeft className="mr-2 h-4 w-4" />
          Cross-Reference Alignments
        </Button>

        {comparisonResult && (
          <div className="mt-8 space-y-6 animate-in fade-in slide-in-from-bottom-4">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="glass p-4 rounded-2xl border-border/50 flex flex-col items-center">
                <span className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground mb-1">Similarity</span>
                <span className="text-2xl font-black text-primary">{comparisonResult.similarityPercentage}%</span>
              </div>
              <div className="glass p-4 rounded-2xl border-border/50 flex flex-col items-center">
                <span className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground mb-1">Matches</span>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="h-4 w-4 text-emerald-500" />
                  <span className="text-2xl font-black text-emerald-500">{comparisonResult.matchCount}</span>
                </div>
              </div>
              <div className="glass p-4 rounded-2xl border-border/50 flex flex-col items-center">
                <span className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground mb-1">Variations</span>
                <div className="flex items-center gap-2">
                  <XCircle className="h-4 w-4 text-destructive" />
                  <span className="text-2xl font-black text-destructive">{comparisonResult.mismatchCount}</span>
                </div>
              </div>
            </div>

            <div className="glass rounded-2xl border border-border/50 overflow-hidden">
              <table className="w-full text-left text-xs">
                <thead className="glass border-b border-border/50">
                  <tr>
                    <th className="px-6 py-4 font-black uppercase tracking-widest text-muted-foreground">Index</th>
                    <th className="px-6 py-4 font-black uppercase tracking-widest text-muted-foreground">Stream A</th>
                    <th className="px-6 py-4 font-black uppercase tracking-widest text-muted-foreground">Stream B</th>
                    <th className="px-6 py-4 font-black uppercase tracking-widest text-muted-foreground">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border/10">
                  {comparisonResult.comparison.slice(0, 15).map((item, index) => (
                    <tr key={index} className={`hover:bg-primary/5 transition-colors ${item.result === 'Match' ? 'text-emerald-500/80' : 'text-destructive/80'}`}>
                      <td className="px-6 py-3 font-mono font-bold text-muted-foreground">{item.index}</td>
                      <td className={`px-6 py-3 font-mono font-black ${getBaseClass(item.base1)}`}>{item.base1}</td>
                      <td className={`px-6 py-3 font-mono font-black ${getBaseClass(item.base2)}`}>{item.base2}</td>
                      <td className="px-6 py-3">
                        {item.result === 'Match' ? (
                          <Badge className="bg-emerald-500/10 text-emerald-500 border-emerald-500/20 text-[10px] px-2 py-0">MATCH</Badge>
                        ) : (
                          <Badge className="bg-destructive/10 text-destructive border-destructive/20 text-[10px] px-2 py-0">SNP</Badge>
                        )}
                      </td>
                    </tr>
                  ))}
                  {comparisonResult.comparison.length > 15 && (
                    <tr>
                      <td colSpan={4} className="px-6 py-4 text-center text-[10px] font-bold text-muted-foreground uppercase tracking-widest">
                        + {comparisonResult.comparison.length - 15} more genomic variants identified
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>

            <div className="bg-primary/5 p-4 rounded-2xl flex gap-4 items-start border border-primary/10">
              <Info className="h-5 w-5 text-primary shrink-0 mt-0.5" />
              <p className="text-[11px] text-muted-foreground font-medium leading-relaxed">
                Global alignment detects point mutations and conserved regions.
                Similarity percentages are calculated via <span className="text-primary font-bold">Base Match Ratio</span> over total input string length.
              </p>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default SequenceComparer;
