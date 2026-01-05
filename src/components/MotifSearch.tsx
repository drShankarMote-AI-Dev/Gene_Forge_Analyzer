import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Badge } from '@/components/ui/badge';
import { findMotifs, MotifMatch, getBaseClass } from '@/utils/dnaUtils';
import { Search, Info, Target } from 'lucide-react';

const MotifSearch: React.FC<{ sequence: string }> = ({ sequence }) => {
  const [motif, setMotif] = useState('');
  const [matches, setMatches] = useState<MotifMatch[]>([]);
  const [hasSearched, setHasSearched] = useState(false);

  const handleSearch = () => {
    if (motif.trim().length > 0) {
      const foundMotifs = findMotifs(sequence, motif);
      setMatches(foundMotifs);
      setHasSearched(true);
    }
  };

  return (
    <Card className="glass-card border-none shadow-xl">
      <CardHeader>
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-xl bg-primary/10 text-primary">
            <Search className="h-5 w-5" />
          </div>
          <div>
            <CardTitle>Genomic Motif Scanner</CardTitle>
            <p className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground mt-1">Pattern Recognition</p>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          <div className="space-y-3">
            <Label htmlFor="motif" className="text-xs font-bold uppercase tracking-widest text-muted-foreground ml-1">Search Pattern</Label>
            <div className="flex gap-2">
              <Input
                id="motif"
                placeholder="Enter DNA sequence (e.g., TATA)..."
                value={motif}
                onChange={(e) => setMotif(e.target.value.toUpperCase())}
                className="font-mono glass border-border/50 rounded-xl py-6"
              />
              <Button
                onClick={handleSearch}
                className="btn-premium px-8 rounded-xl bg-primary hover:bg-primary/90 font-bold"
                disabled={!motif.trim()}
              >
                Scan
              </Button>
            </div>
          </div>

          {hasSearched && (
            <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4">
              <div className="flex justify-between items-center bg-muted/30 p-4 rounded-2xl border border-border/50">
                <div className="flex items-center gap-3">
                  <h3 className="font-bold text-sm">Matches Found</h3>
                  <Badge className="bg-primary/10 text-primary border-primary/20">{matches.length}</Badge>
                </div>
              </div>

              {matches.length > 0 ? (
                <div className="space-y-6">
                  <ScrollArea className="h-48 glass rounded-2xl border border-border/50">
                    <table className="w-full text-left text-xs">
                      <thead className="glass border-b border-border/50 sticky top-0 z-10">
                        <tr>
                          <th className="px-6 py-4 font-black uppercase tracking-widest text-muted-foreground">Index</th>
                          <th className="px-6 py-4 font-black uppercase tracking-widest text-muted-foreground">Sequence Hit</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-border/10">
                        {matches.map((match, index) => (
                          <tr key={index} className="hover:bg-primary/5 transition-colors">
                            <td className="px-6 py-3 font-mono font-bold text-muted-foreground">{match.position.toLocaleString()}</td>
                            <td className="px-6 py-3 font-mono font-black">
                              {match.sequence.split('').map((base, i) => (
                                <span key={i} className={getBaseClass(base)}>{base}</span>
                              ))}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </ScrollArea>

                  <div className="space-y-3">
                    <Label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground ml-1">Spatial Distribution View</Label>
                    <div className="p-4 glass rounded-2xl border border-border/50 bg-background/20 overflow-x-auto whitespace-pre-wrap break-all font-mono text-sm leading-loose tracking-widest">
                      {sequence.split('').map((char, i) => {
                        const isMatch = matches.some(m => i >= (m.position - 1) && i < (m.position - 1 + motif.length));
                        return (
                          <span
                            key={i}
                            className={`${getBaseClass(char)} ${isMatch ? 'bg-amber-500/30 ring-1 ring-amber-500/50 rounded-sm' : ''} transition-all duration-300`}
                          >
                            {char}
                          </span>
                        );
                      })}
                    </div>
                  </div>
                </div>
              ) : (
                <div className="glass p-8 rounded-3xl text-center border-dashed">
                  <p className="text-muted-foreground font-medium">No matches found for the motif <span className="text-foreground font-bold font-mono">"{motif}"</span>.</p>
                </div>
              )}
            </div>
          )}

          <div className="glass p-4 rounded-2xl border-l-4 border-l-primary flex gap-4">
            <Info className="h-5 w-5 text-primary shrink-0" />
            <p className="text-[11px] text-muted-foreground font-medium leading-relaxed">
              Motif search identifies exact string matches. For degenerative motifs or regulatory sites,
              ensure you use canonical bases <span className="text-foreground font-bold">A, T, G, C</span>.
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default MotifSearch;
