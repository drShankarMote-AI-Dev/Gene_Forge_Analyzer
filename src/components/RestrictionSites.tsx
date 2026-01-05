import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import {
  findRestrictionSites,
  RestrictionSite,
  COMMON_RESTRICTION_ENZYMES,
  getBaseClass
} from '@/utils/dnaUtils';
import { Scissors, Sparkles, Activity, Info } from 'lucide-react';

interface RestrictionSitesProps {
  sequence: string;
}

const RestrictionSites: React.FC<RestrictionSitesProps> = ({ sequence }) => {
  const [sites, setSites] = useState<RestrictionSite[]>([]);
  const [showAll, setShowAll] = useState(true);
  const [selectedEnzymes, setSelectedEnzymes] = useState<string[]>(
    COMMON_RESTRICTION_ENZYMES.map(e => e.name)
  );

  useEffect(() => {
    if (sequence) {
      const filteredEnzymes = showAll
        ? COMMON_RESTRICTION_ENZYMES
        : COMMON_RESTRICTION_ENZYMES.filter(e => selectedEnzymes.includes(e.name));

      const foundSites = findRestrictionSites(sequence, filteredEnzymes);
      setSites(foundSites);
    }
  }, [sequence, showAll, selectedEnzymes]);

  const toggleEnzyme = (enzymeName: string) => {
    setSelectedEnzymes(prev =>
      prev.includes(enzymeName)
        ? prev.filter(name => name !== enzymeName)
        : [...prev, enzymeName]
    );
  };

  const uniqueEnzymes = [...new Set(sites.map(site => site.enzyme.name))];

  return (
    <Card className="glass-card border-none shadow-xl transition-all duration-500 overflow-hidden">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-xl bg-primary/10 text-primary">
              <Scissors className="h-5 w-5" />
            </div>
            <div>
              <CardTitle>Restriction Endonuclease Scan</CardTitle>
              <p className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground mt-1">Enzymatic Recognition Sites</p>
            </div>
          </div>
          <div className="bg-primary/10 px-3 py-1 rounded-full border border-primary/20">
            <span className="text-xs font-black text-primary tracking-widest">{sites.length} HITS</span>
          </div>
        </div>
      </CardHeader>

      <CardContent>
        <div className="space-y-6">
          <div className="flex items-center justify-between p-4 glass rounded-2xl border border-border/50">
            <div className="flex items-center gap-2">
              <Switch
                id="show-all"
                checked={showAll}
                onCheckedChange={setShowAll}
                className="data-[state=checked]:bg-primary"
              />
              <Label htmlFor="show-all" className="text-xs font-black uppercase tracking-[0.1em] cursor-pointer">Global Enzyme Library</Label>
            </div>
            {!showAll && (
              <p className="text-[10px] font-bold text-muted-foreground uppercase">{selectedEnzymes.length} Selected</p>
            )}
          </div>

          {!showAll && (
            <ScrollArea className="h-32 glass rounded-2xl border border-border/50 p-4">
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3">
                {COMMON_RESTRICTION_ENZYMES.map((enzyme) => (
                  <div
                    key={enzyme.name}
                    className={`flex items-center gap-2 p-2 rounded-lg border transition-all cursor-pointer ${selectedEnzymes.includes(enzyme.name)
                      ? 'border-primary/40 bg-primary/5 text-primary'
                      : 'border-transparent text-muted-foreground hover:bg-muted/50'
                      }`}
                    onClick={() => toggleEnzyme(enzyme.name)}
                  >
                    <div className={`w-2 h-2 rounded-full ${selectedEnzymes.includes(enzyme.name) ? 'bg-primary' : 'bg-muted-foreground'}`} />
                    <span className="text-xs font-bold">{enzyme.name}</span>
                  </div>
                ))}
              </div>
            </ScrollArea>
          )}

          {sites.length > 0 ? (
            <div className="space-y-6">
              <ScrollArea className="h-64 glass rounded-2xl border border-border/50">
                <table className="w-full text-left text-xs">
                  <thead className="glass border-b border-border/50 sticky top-0 z-10">
                    <tr>
                      <th className="px-6 py-4 font-black uppercase tracking-widest text-muted-foreground">Enzyme</th>
                      <th className="px-6 py-4 font-black uppercase tracking-widest text-muted-foreground">Recognition Site</th>
                      <th className="px-6 py-4 font-black uppercase tracking-widest text-muted-foreground">Genomic Position</th>
                      <th className="px-6 py-4 font-black uppercase tracking-widest text-muted-foreground text-right pr-8">Cleavage</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border/10">
                    {sites.map((site, index) => (
                      <tr key={index} className="hover:bg-primary/5 transition-colors group">
                        <td className="px-6 py-4 font-black text-foreground">{site.enzyme.name}</td>
                        <td className="px-6 py-4 font-mono font-black text-sm">
                          {site.enzyme.site.split('').map((base, i) => (
                            <span key={i} className={getBaseClass(base)}>{base}</span>
                          ))}
                        </td>
                        <td className="px-6 py-4 font-mono font-bold text-muted-foreground">{site.position.toLocaleString()}</td>
                        <td className="px-6 py-4 text-right pr-8">
                          <Badge className="bg-emerald-500/10 text-emerald-500 border-none font-black text-[10px]">
                            @{site.position + site.enzyme.cutPosition - 1} BP
                          </Badge>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </ScrollArea>

              <div className="space-y-3">
                <h4 className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground ml-1">Composition Summary</h4>
                <div className="flex flex-wrap gap-2">
                  {uniqueEnzymes.map(enzyme => (
                    <Badge key={enzyme} className="bg-primary/5 border-primary/20 text-primary font-bold px-3 py-1 rounded-lg">
                      {enzyme}: {sites.filter(site => site.enzyme.name === enzyme).length} Sites
                    </Badge>
                  ))}
                </div>
              </div>
            </div>
          ) : (
            <div className="glass p-12 rounded-[2.5rem] text-center border-dashed">
              <p className="text-muted-foreground font-medium">No enzymatic cleavage sites detected for the current selection.</p>
            </div>
          )}

          <div className="glass p-4 rounded-2xl border-l-4 border-l-amber-500 flex gap-4 bg-amber-500/5">
            <Info className="h-5 w-5 text-amber-500 shrink-0" />
            <p className="text-[11px] text-muted-foreground font-medium leading-relaxed">
              Cleavage sites are calculated based on <span className="text-foreground font-bold italic">Type II</span> restriction enzyme patterns.
              The cleave position indicates the <span className="text-amber-500 font-bold">actual break site</span> on the phosphodiester backbone.
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default RestrictionSites;
