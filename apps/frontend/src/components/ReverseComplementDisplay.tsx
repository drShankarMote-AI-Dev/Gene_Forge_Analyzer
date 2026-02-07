import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import ColoredSequence from '@/components/ColoredSequence';
import { formatSequence } from '@/utils/dnaUtils';
import { Copy, RefreshCw, Layers, Info } from 'lucide-react';
import { toast } from '@/components/ui/use-toast';

interface ReverseComplementDisplayProps {
  originalSequence: string;
  reverseComplement: string;
}

const ReverseComplementDisplay: React.FC<ReverseComplementDisplayProps> = ({
  originalSequence,
  reverseComplement
}) => {
  const [showComplete, setShowComplete] = useState(false);

  const copyToClipboard = (text: string, description: string) => {
    navigator.clipboard.writeText(text);
    toast({
      title: "Copied to clipboard",
      description
    });
  };

  const displayLength = showComplete ? originalSequence.length : Math.min(150, originalSequence.length);
  const originalTruncated = originalSequence.substring(0, displayLength);
  const reverseComplementTruncated = reverseComplement.substring(0, displayLength);

  return (
    <Card className="glass-card border-none shadow-xl">
      <CardHeader>
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-xl bg-primary/10 text-primary">
            <RefreshCw className="h-5 w-5" />
          </div>
          <div>
            <CardTitle>Genomic Inversion Terminal</CardTitle>
            <p className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground mt-1">Anti-Parallel Synthesis</p>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-8">
          <div className="space-y-3">
            <div className="flex justify-between items-center px-1">
              <Label className="text-xs font-bold uppercase tracking-widest text-muted-foreground">Original Stream (5' → 3')</Label>
              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8 hover:text-primary"
                onClick={() => copyToClipboard(originalSequence, "Original sequence copied")}
              >
                <Copy className="h-4 w-4" />
              </Button>
            </div>
            <div className="p-4 glass rounded-2xl border border-border/50 bg-background/20 relative group">
              <ColoredSequence
                sequence={formatSequence(originalTruncated)}
                className="whitespace-pre-wrap break-all font-mono text-sm tracking-widest leading-relaxed"
              />
              {originalSequence.length > 150 && !showComplete && (
                <div className="absolute inset-y-0 right-0 w-32 bg-gradient-to-l from-background/90 to-transparent flex items-center justify-end pr-6">
                  <span className="text-[10px] font-black text-muted-foreground">+{originalSequence.length - 150} BP</span>
                </div>
              )}
            </div>
          </div>

          <div className="flex justify-center relative py-2">
            <div className="absolute inset-0 flex items-center justify-center opacity-10">
              <Layers className="h-12 w-12 text-primary animate-pulse" />
            </div>
            <div className="h-[1px] w-full bg-gradient-to-r from-transparent via-border to-transparent" />
          </div>

          <div className="space-y-3">
            <div className="flex justify-between items-center px-1">
              <Label className="text-xs font-bold uppercase tracking-widest text-primary">Reverse Complement (5' → 3')</Label>
              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8 hover:text-primary"
                onClick={() => copyToClipboard(reverseComplement, "Reverse complement copied")}
              >
                <Copy className="h-4 w-4" />
              </Button>
            </div>
            <div className="p-4 glass rounded-2xl border border-primary/20 bg-primary/5 relative group ring-1 ring-primary/10">
              <ColoredSequence
                sequence={formatSequence(reverseComplementTruncated)}
                className="whitespace-pre-wrap break-all font-mono text-sm tracking-widest leading-relaxed"
              />
              {reverseComplement.length > 150 && !showComplete && (
                <div className="absolute inset-y-0 right-0 w-32 bg-gradient-to-l from-primary/10 via-primary/5 to-transparent flex items-center justify-end pr-6">
                  <span className="text-[10px] font-black text-primary">+{reverseComplement.length - 150} BP</span>
                </div>
              )}
            </div>
          </div>

          {originalSequence.length > 150 && (
            <Button
              variant="outline"
              onClick={() => setShowComplete(!showComplete)}
              className="w-full rounded-xl py-6 border-border/50 hover:bg-primary/10 hover:text-primary hover:border-primary/30 transition-all font-bold"
            >
              {showComplete ? "Minimize Stream View" : "Expand Full Genomic View"}
            </Button>
          )}

          <div className="glass p-4 rounded-2xl border-l-4 border-l-primary flex gap-4 bg-primary/5">
            <Info className="h-5 w-5 text-primary shrink-0" />
            <p className="text-[11px] text-muted-foreground font-medium leading-relaxed">
              Synthesis complete. Reverse complementation accounts for <span className="text-foreground font-bold">DNA polarity</span> and Watson-Crick base pairing.
              The resulting string is oriented in the standard <span className="text-primary font-bold">5' to 3'</span> direction.
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

// Helper for labels since I used Label but didn't import it in my thought process (will fix below)
const Label = ({ children, className }: { children: React.ReactNode, className?: string }) => (
  <span className={className}>{children}</span>
);

export default ReverseComplementDisplay;
