import React, { useState, useEffect, useCallback } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Badge } from '@/components/ui/badge';
import { findSNPs, SNP, getBaseClass } from '@/utils/dnaUtils';
import ColoredSequence from './ColoredSequence';
import { Microscope, Search, Info, CheckCircle2, ChevronRight } from 'lucide-react';

const SNPDetection: React.FC<{ referenceSequence: string }> = ({ referenceSequence }) => {
  const [sampleSequence, setSampleSequence] = useState('');
  const [snps, setSnps] = useState<SNP[]>([]);
  const [hasAnalyzed, setHasAnalyzed] = useState(false);

  const handleAnalyze = useCallback(() => {
    const ref = referenceSequence.trim().toUpperCase();
    const samp = sampleSequence.trim().toUpperCase();
    if (samp.length > 0) {
      const detectedSNPs = findSNPs(ref, samp);
      setSnps(detectedSNPs);
      setHasAnalyzed(true);
    }
  }, [referenceSequence, sampleSequence]);

  useEffect(() => {
    if (sampleSequence.trim().length > 0) {
      handleAnalyze();
    }
  }, [sampleSequence, handleAnalyze]);

  return (
    <Card className="glass-card border-none shadow-xl">
      <CardHeader>
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-xl bg-primary/10 text-primary">
            <Microscope className="h-5 w-5" />
          </div>
          <div>
            <CardTitle>SNP Discovery Engine</CardTitle>
            <p className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground mt-1">Variant Identification</p>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          <div className="space-y-3">
            <Label className="text-xs font-bold uppercase tracking-widest text-muted-foreground ml-1">Reference Core</Label>
            <div className="p-4 glass rounded-2xl border border-border/50 bg-background/20 overflow-x-auto relative group">
              <ColoredSequence
                sequence={referenceSequence.slice(0, 150)}
                className="whitespace-pre-wrap break-all font-mono text-sm tracking-widest"
              />
              {referenceSequence.length > 150 && (
                <div className="absolute inset-y-0 right-0 w-24 bg-gradient-to-l from-background/80 to-transparent flex items-center justify-end pr-4">
                  <span className="text-[10px] font-black text-muted-foreground">+{referenceSequence.length - 150} BP</span>
                </div>
              )}
            </div>
          </div>

          <div className="space-y-3">
            <Label htmlFor="sample" className="text-xs font-bold uppercase tracking-widest text-muted-foreground ml-1">Sample Variant Stream</Label>
            <Textarea
              id="sample"
              placeholder="Paste mutated or sample sequence for comparative scan..."
              value={sampleSequence}
              onChange={(e) => setSampleSequence(e.target.value)}
              className="font-mono h-32 glass bg-background/50 border-border/50 rounded-2xl p-4 text-sm resize-none focus:ring-primary/20"
            />
          </div>

          <Button
            onClick={handleAnalyze}
            className="w-full btn-premium py-6 rounded-xl bg-primary hover:bg-primary/90 shadow-lg shadow-primary/20 font-bold"
            disabled={!sampleSequence.trim()}
          >
            <Search className="mr-2 h-4 w-4" />
            Initialize Variant Scan
          </Button>

          {hasAnalyzed && (
            <div className="space-y-4 animate-in fade-in slide-in-from-bottom-4">
              <div className="flex justify-between items-center bg-muted/30 p-4 rounded-2xl border border-border/50">
                <div className="flex items-center gap-3">
                  <h3 className="font-bold text-sm">Scan Results</h3>
                  <Badge className={`bg-primary/10 text-primary border-primary/20`}>{snps.length} SNPs Identified</Badge>
                </div>
                {snps.length === 0 && (
                  <div className="flex items-center gap-2 text-emerald-500 font-bold text-xs">
                    <CheckCircle2 className="h-4 w-4" />
                    Perfect Match
                  </div>
                )}
              </div>

              {snps.length > 0 && (
                <ScrollArea className="h-64 glass rounded-2xl border border-border/50 overflow-hidden">
                  <table className="w-full text-left text-xs border-collapse">
                    <thead className="sticky top-0 glass z-10 border-b border-border/50">
                      <tr>
                        <th className="px-6 py-4 font-black uppercase tracking-widest text-muted-foreground">Index</th>
                        <th className="px-6 py-4 font-black uppercase tracking-widest text-muted-foreground">Ref</th>
                        <th className="px-6 py-4 flex items-center gap-2 font-black uppercase tracking-widest text-muted-foreground">
                          Alt <ChevronRight className="h-3 w-3" />
                        </th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-border/10">
                      {snps.map((snp, index) => (
                        <tr key={index} className="hover:bg-primary/5 transition-colors">
                          <td className="px-6 py-3 font-mono font-bold text-muted-foreground">{snp.position.toLocaleString()}</td>
                          <td className="px-6 py-3">
                            <span className={`font-mono font-black text-lg ${getBaseClass(snp.referenceBase)}`}>
                              {snp.referenceBase}
                            </span>
                          </td>
                          <td className="px-6 py-3">
                            <span className={`font-mono font-black text-lg ${getBaseClass(snp.alternateBase)}`}>
                              {snp.alternateBase}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </ScrollArea>
              )}

              <div className="glass p-4 rounded-2xl border-l-4 border-l-accent flex gap-4 bg-accent/5">
                <Info className="h-5 w-5 text-accent shrink-0" />
                <p className="text-[11px] text-muted-foreground font-medium leading-relaxed">
                  SNP detection uses exact position matching across aligned genomic coordinates. <br />
                  <span className="text-foreground font-bold">Ref:</span> represents the sequence uploaded in the main dashboard.
                </p>
              </div>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default SNPDetection;
