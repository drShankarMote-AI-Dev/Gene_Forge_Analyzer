import React, { useState, useEffect, useCallback } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Badge } from '@/components/ui/badge';
import { findGuideRNAs, GuideRNA, getBaseClass } from '@/utils/dnaUtils';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Target, Sparkles, Activity } from 'lucide-react';

interface CRISPRFinderProps {
  sequence: string;
}

const CRISPRFinder: React.FC<CRISPRFinderProps> = ({ sequence }) => {
  const [pam, setPam] = useState('NGG');
  const [guides, setGuides] = useState<GuideRNA[]>([]);
  const [sorting, setSorting] = useState<'position' | 'gcContent'>('position');

  const commonPAMs = [
    { label: 'SpCas9 (NGG)', value: 'NGG' },
    { label: 'SaCas9 (NNGRRT)', value: 'NNGRRT' },
    { label: 'Cpf1/Cas12a (TTTV)', value: 'TTTV' },
    { label: 'NAG (non-canonical SpCas9)', value: 'NAG' },
    { label: 'Custom', value: 'custom' }
  ];

  const [customPam, setCustomPam] = useState('');
  const [selectedPamOption, setSelectedPamOption] = useState('NGG');

  const handleSearch = useCallback(() => {
    const pamToUse = selectedPamOption === 'custom' ? customPam : selectedPamOption;
    const foundGuides = findGuideRNAs(sequence, pamToUse);
    setGuides(foundGuides);
  }, [sequence, selectedPamOption, customPam]);

  useEffect(() => {
    handleSearch();
  }, [handleSearch]);

  const sortGuides = (guidesToSort: GuideRNA[]) => {
    if (sorting === 'position') {
      return [...guidesToSort].sort((a, b) => a.position - b.position);
    } else {
      return [...guidesToSort].sort((a, b) => b.gcContent - a.gcContent);
    }
  };

  const getGCColorClass = (gcContent: number) => {
    if (gcContent < 30) return 'text-destructive';
    if (gcContent >= 30 && gcContent < 45) return 'text-amber-500';
    if (gcContent >= 45 && gcContent < 60) return 'text-emerald-500';
    return 'text-destructive';
  };

  return (
    <Card className="glass-card border-none overflow-hidden">
      <CardHeader>
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-xl bg-primary/10 text-primary">
            <Target className="h-5 w-5" />
          </div>
          <div>
            <CardTitle>CRISPR Guide RNA Finder</CardTitle>
            <p className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground mt-1">Guide Design Engine</p>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label className="text-xs font-bold uppercase tracking-widest text-muted-foreground ml-1">PAM Sequence</Label>
              <Select
                value={selectedPamOption}
                onValueChange={(value) => setSelectedPamOption(value)}
              >
                <SelectTrigger className="glass border-border/50 rounded-xl py-6">
                  <SelectValue placeholder="Select PAM" />
                </SelectTrigger>
                <SelectContent className="glass border-border/50">
                  {commonPAMs.map((option) => (
                    <SelectItem key={option.value} value={option.value} className="focus:bg-primary/10 focus:text-primary transition-colors">
                      {option.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              {selectedPamOption === 'custom' && (
                <div className="mt-4 animate-in fade-in slide-in-from-top-2">
                  <Label htmlFor="custom-pam" className="text-xs font-bold uppercase tracking-widest text-muted-foreground ml-1">Custom PAM</Label>
                  <Input
                    id="custom-pam"
                    placeholder="e.g., NGA"
                    value={customPam}
                    onChange={(e) => setCustomPam(e.target.value.toUpperCase())}
                    className="font-mono glass border-border/50 rounded-xl py-6 mt-1"
                  />
                </div>
              )}
            </div>

            <div className="flex flex-col justify-end">
              <Button
                onClick={handleSearch}
                className="btn-premium h-[52px] rounded-xl bg-primary hover:bg-primary/90 shadow-lg shadow-primary/20"
              >
                Scan Global Genome
              </Button>
            </div>
          </div>

          {guides.length > 0 && (
            <div className="space-y-4 animate-in fade-in slide-in-from-bottom-4">
              <div className="flex justify-between items-center bg-muted/30 p-4 rounded-2xl border border-border/50">
                <div className="flex items-center gap-3">
                  <h3 className="font-bold text-sm">Design Candidates</h3>
                  <Badge className="bg-primary/10 text-primary border-primary/20">{guides.length} found</Badge>
                </div>

                <div className="flex items-center gap-2">
                  <span className="text-[10px] font-black uppercase tracking-widest text-muted-foreground mr-1">Sort</span>
                  <div className="flex gap-1 p-1 bg-background/50 rounded-lg border">
                    <button
                      onClick={() => setSorting('position')}
                      className={`px-3 py-1 text-[10px] font-bold rounded-md transition-all ${sorting === 'position' ? 'bg-primary text-primary-foreground' : 'hover:bg-primary/10'}`}
                    >
                      Pos
                    </button>
                    <button
                      onClick={() => setSorting('gcContent')}
                      className={`px-3 py-1 text-[10px] font-bold rounded-md transition-all ${sorting === 'gcContent' ? 'bg-primary text-primary-foreground' : 'hover:bg-primary/10'}`}
                    >
                      GC%
                    </button>
                  </div>
                </div>
              </div>

              <ScrollArea className="h-80 glass rounded-2xl border border-border/50">
                <table className="w-full text-left text-sm border-collapse">
                  <thead className="sticky top-0 glass z-10">
                    <tr className="border-b border-border/50">
                      <th className="px-6 py-4 text-[10px] font-black uppercase tracking-widest text-muted-foreground">Pos</th>
                      <th className="px-6 py-4 text-[10px] font-black uppercase tracking-widest text-muted-foreground">Guide String</th>
                      <th className="px-6 py-4 text-[10px] font-black uppercase tracking-widest text-muted-foreground">PAM</th>
                      <th className="px-6 py-4 text-[10px] font-black uppercase tracking-widest text-muted-foreground">GC Content</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border/20">
                    {sortGuides(guides).map((guide, index) => (
                      <tr key={index} className="hover:bg-primary/5 transition-colors duration-200">
                        <td className="px-6 py-4 font-mono font-bold text-muted-foreground">
                          {guide.position.toLocaleString()}
                        </td>
                        <td className="px-6 py-4 font-mono font-black">
                          {guide.sequence.split('').map((base, i) => (
                            <span key={i} className={getBaseClass(base)}>{base}</span>
                          ))}
                        </td>
                        <td className="px-6 py-4 font-mono font-bold">
                          {guide.pam.split('').map((base, i) => (
                            <span key={i} className={getBaseClass(base)}>{base}</span>
                          ))}
                        </td>
                        <td className={`px-6 py-4 font-black ${getGCColorClass(guide.gcContent)}`}>
                          {guide.gcContent.toFixed(1)}%
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </ScrollArea>

              <div className="glass p-4 rounded-2xl border-l-4 border-l-primary flex gap-4">
                <Sparkles className="h-5 w-5 text-primary shrink-0" />
                <div className="space-y-1">
                  <p className="text-xs font-bold uppercase tracking-widest text-primary">Biotech Insights</p>
                  <p className="text-[11px] text-muted-foreground font-medium leading-relaxed">
                    Targeted guides are optimized at <span className="text-foreground font-bold">40-60% GC</span>.
                    <span className="text-emerald-500 font-bold ml-1">Emerald</span> indicates high stability candidates,
                    while <span className="text-destructive font-bold ml-1">Red</span> suggests potential secondary structure risks.
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default CRISPRFinder;
