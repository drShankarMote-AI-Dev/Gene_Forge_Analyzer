import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { getAminoAcids, getBaseClass } from '@/utils/dnaUtils';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Microscope, Sparkles } from 'lucide-react';

interface AminoAcidTranslationProps {
  sequence: string;
}

const AminoAcidTranslation: React.FC<AminoAcidTranslationProps> = ({ sequence }) => {
  const aminoAcids = getAminoAcids(sequence.toUpperCase());

  return (
    <Card className="glass-card border-none shadow-xl transition-all duration-500 overflow-hidden">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-xl bg-emerald-500/10 text-emerald-500">
              <Microscope className="h-5 w-5" />
            </div>
            <div>
              <CardTitle>Protein Synthesis Engine</CardTitle>
              <p className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground mt-1">Exon Translation Protocol</p>
            </div>
          </div>
          <div className="bg-emerald-500/10 px-3 py-1 rounded-full border border-emerald-500/20">
            <span className="text-xs font-black text-emerald-500 tracking-widest">{aminoAcids.length} RESIDUES</span>
          </div>
        </div>
      </CardHeader>

      <CardContent>
        <div className="space-y-6">
          <div className="space-y-3">
            <Label className="text-xs font-bold uppercase tracking-widest text-muted-foreground ml-1">Synthesis Stream</Label>

            <ScrollArea className="h-72 glass rounded-[2rem] border border-border/50 p-6 bg-background/20 relative">
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
                {aminoAcids.map((item, index) => (
                  <div key={index} className="flex items-center justify-between p-3 glass rounded-xl border-border/10 group hover:border-emerald-500/30 transition-all duration-300">
                    <div className="flex flex-col">
                      <span className="text-[9px] font-black text-muted-foreground/50 uppercase">#{index + 1}</span>
                      <div className="flex font-mono text-sm font-black">
                        {item.codon.split('').map((base, i) => (
                          <span key={i} className={getBaseClass(base)}>{base}</span>
                        ))}
                      </div>
                    </div>
                    <div className="text-right">
                      <Badge variant="outline" className={`font-black text-[10px] border-none px-2 py-0 ${item.aminoAcid === 'Stop' ? 'bg-red-500/10 text-red-500' : 'bg-emerald-500/10 text-emerald-500'}`}>
                        {item.aminoAcid === 'Stop' ? 'STOP' : item.aminoAcid.substring(0, 3).toUpperCase()}
                      </Badge>
                      <p className="text-[8px] font-medium text-muted-foreground truncate max-w-[60px]">{item.aminoAcid}</p>
                    </div>
                  </div>
                ))}
              </div>
            </ScrollArea>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="glass p-4 rounded-2xl border border-border/50 flex flex-col items-center justify-center text-center space-y-1">
              <span className="text-2xl font-black text-foreground">{(aminoAcids.length / (sequence.length / 3) * 100).toFixed(0)}%</span>
              <span className="text-[9px] font-black uppercase tracking-widest text-muted-foreground">Coverage Efficiency</span>
            </div>
            <div className="glass p-4 rounded-2xl border border-border/50 flex flex-col items-center justify-center text-center space-y-1">
              <span className="text-2xl font-black text-foreground">{aminoAcids.filter(a => a.aminoAcid === 'Stop').length}</span>
              <span className="text-[9px] font-black uppercase tracking-widest text-muted-foreground">Termination Sites</span>
            </div>
          </div>

          <div className="glass p-4 rounded-2xl border-l-4 border-l-emerald-500 flex gap-4 bg-emerald-500/5">
            <Sparkles className="h-5 w-5 text-emerald-500 shrink-0" />
            <p className="text-[11px] text-muted-foreground font-medium leading-relaxed">
              Translation data provides a high-fidelity mapping of DNA to <span className="text-emerald-500 font-bold">polypeptide chains</span>.
              The synthesis engine uses the <span className="text-foreground font-bold italic">Standard Genetic Code</span> for all codon-residue assignments.
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default AminoAcidTranslation;
