import React, { useState, useEffect, useCallback } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Badge } from '@/components/ui/badge';
import { Slider } from '@/components/ui/slider';
import { generatePrimers, PrimerPair, getBaseClass } from '@/utils/dnaUtils';
import { Copy } from 'lucide-react';
import { toast } from '@/components/ui/use-toast';

interface PrimerDesignerProps {
  sequence: string;
}

const PrimerDesigner: React.FC<PrimerDesignerProps> = ({ sequence }) => {
  const [primers, setPrimers] = useState<PrimerPair[]>([]);
  const [primerLength, setPrimerLength] = useState(20);
  const [productSizeMin, setProductSizeMin] = useState(100);
  const [productSizeMax, setProductSizeMax] = useState(1000);

  const handleDesignPrimers = useCallback((silent = false) => {
    const designedPrimers = generatePrimers(sequence, primerLength, productSizeMin, productSizeMax);
    setPrimers(designedPrimers);

    if (!silent) {
      if (designedPrimers.length === 0) {
        toast({
          title: "No suitable primers found",
          description: "Try adjusting the parameters for better results.",
          variant: "destructive"
        });
      } else {
        toast({
          title: "Primers designed successfully",
          description: `Found ${designedPrimers.length} primer pairs.`
        });
      }
    }
  }, [sequence, primerLength, productSizeMin, productSizeMax]);

  useEffect(() => {
    handleDesignPrimers(true);
  }, [handleDesignPrimers]);

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    toast({
      title: "Copied to clipboard",
      description: "Primer sequence copied successfully."
    });
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Primer Designer</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="space-y-4">
            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <Label htmlFor="primer-length">Primer Length: {primerLength} bp</Label>
              </div>
              <Slider
                id="primer-length"
                min={15}
                max={30}
                step={1}
                value={[primerLength]}
                onValueChange={(value) => setPrimerLength(value[0])}
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="min-product">Min Product Size: {productSizeMin} bp</Label>
                <Slider
                  id="min-product"
                  min={50}
                  max={500}
                  step={10}
                  value={[productSizeMin]}
                  onValueChange={(value) => setProductSizeMin(value[0])}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="max-product">Max Product Size: {productSizeMax} bp</Label>
                <Slider
                  id="max-product"
                  min={500}
                  max={2000}
                  step={100}
                  value={[productSizeMax]}
                  onValueChange={(value) => setProductSizeMax(value[0])}
                />
              </div>
            </div>
          </div>

          <Button
            onClick={() => handleDesignPrimers()}
            className="w-full"
          >
            Design Primers
          </Button>

          {primers.length > 0 ? (
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <h3 className="text-lg font-medium">Results</h3>
                <Badge variant="outline">{primers.length} primer pairs found</Badge>
              </div>

              <ScrollArea className="h-60 border rounded-md p-4">
                {primers.map((primer, index) => (
                  <div key={index} className="mb-6 p-4 border rounded-md">
                    <div className="flex justify-between items-center mb-2">
                      <h4 className="font-medium">Primer Pair {index + 1}</h4>
                      <Badge variant="outline">Product: {primer.productSize} bp</Badge>
                    </div>

                    <div className="space-y-3">
                      <div className="space-y-1">
                        <div className="flex justify-between items-center">
                          <Label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Forward Primer (5' → 3')</Label>
                          <Badge variant={primer.forwardTm < 50 || primer.forwardTm > 65 ? "destructive" : "outline"} className="text-[10px]">
                            Tm: {primer.forwardTm.toFixed(1)}°C
                          </Badge>
                        </div>
                        <div className="flex gap-2">
                          <div className="flex-1 glass bg-background/50 border-border/50 rounded-xl px-4 py-3 font-mono text-sm overflow-x-auto whitespace-nowrap">
                            {primer.forwardPrimer.split('').map((base, i) => (
                              <span key={i} className={getBaseClass(base)}>{base}</span>
                            ))}
                          </div>
                          <Button variant="ghost" size="icon" onClick={() => copyToClipboard(primer.forwardPrimer)} className="shrink-0 hover:text-primary">
                            <Copy className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>

                      <div className="space-y-1">
                        <div className="flex justify-between items-center">
                          <Label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Reverse Primer (5' → 3')</Label>
                          <Badge variant={primer.reverseTm < 50 || primer.reverseTm > 65 ? "destructive" : "outline"} className="text-[10px]">
                            Tm: {primer.reverseTm.toFixed(1)}°C
                          </Badge>
                        </div>
                        <div className="flex gap-2">
                          <div className="flex-1 glass bg-background/50 border-border/50 rounded-xl px-4 py-3 font-mono text-sm overflow-x-auto whitespace-nowrap">
                            {primer.reversePrimer.split('').map((base, i) => (
                              <span key={i} className={getBaseClass(base)}>{base}</span>
                            ))}
                          </div>
                          <Button variant="ghost" size="icon" onClick={() => copyToClipboard(primer.reversePrimer)} className="shrink-0 hover:text-primary">
                            <Copy className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>

                      <div className="grid grid-cols-2 gap-2 text-sm">
                        <div>Position: {primer.startPosition}-{primer.endPosition}</div>
                        <div>ΔTm: {Math.abs(primer.forwardTm - primer.reverseTm).toFixed(1)}°C</div>
                      </div>
                    </div>
                  </div>
                ))}
              </ScrollArea>

              <div className="bg-muted p-3 rounded-md text-sm text-muted-foreground">
                <p>Note: Optimal primers have Tm between 50-65°C with &lt;5°C difference between pairs.</p>
                <p>Red Tm values indicate suboptimal melting temperatures that may affect PCR efficiency.</p>
              </div>
            </div>
          ) : null}
        </div>
      </CardContent>
    </Card>
  );
};

export default PrimerDesigner;
