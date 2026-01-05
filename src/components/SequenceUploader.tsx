import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { toast } from '@/components/ui/use-toast';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { UploadCloud, FileText, Keyboard, CheckCircle2 } from 'lucide-react';

interface SequenceUploaderProps {
  onSequenceSubmit: (sequence: string) => void;
}

const SequenceUploader: React.FC<SequenceUploaderProps> = ({ onSequenceSubmit }) => {
  const [manualSequence, setManualSequence] = useState('');
  const [file, setFile] = useState<File | null>(null);
  const [tab, setTab] = useState<'manual' | 'file'>('manual');

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setFile(e.target.files[0]);
    }
  };

  const handleFileUpload = () => {
    if (!file) {
      toast({
        title: "No file selected",
        description: "Please select a professional sequence file (FASTA/TXT).",
        variant: "destructive"
      });
      return;
    }

    const reader = new FileReader();
    reader.onload = (e) => {
      if (e.target && typeof e.target.result === 'string') {
        const sequence = e.target.result.replace(/\s/g, '');
        if (validateSequence(sequence)) {
          onSequenceSubmit(sequence);
          toast({
            title: "Sequence Parsed Successfully",
            description: `Analyzing ${sequence.length.toLocaleString()} bases from genomic data.`,
          });
        }
      }
    };
    reader.readAsText(file);
  };

  const handleManualSubmit = () => {
    const sequence = manualSequence.replace(/\s/g, '');
    if (validateSequence(sequence)) {
      onSequenceSubmit(sequence);
      toast({
        title: "Genomic Input Validated",
        description: `Processing ${sequence.length.toLocaleString()} base pairs...`,
      });
    }
  };

  const validateSequence = (sequence: string) => {
    if (sequence.length === 0) {
      toast({
        title: "Input Required",
        description: "Please provide a valid genomic sequence for processing.",
        variant: "destructive"
      });
      return false;
    }

    const validBases = ['A', 'T', 'G', 'C', 'a', 't', 'g', 'c', 'N', 'n'];
    const invalidBases = [...new Set(sequence.split(''))].filter(
      base => !validBases.includes(base)
    );

    if (invalidBases.length > 0) {
      toast({
        title: "Sequence Validity Error",
        description: `Unrecognized nucleotides identified: ${invalidBases.join(', ')}`,
        variant: "destructive"
      });
      return false;
    }

    return true;
  };

  return (
    <Card className="glass-card border-none shadow-2xl overflow-hidden group">
      <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-primary via-accent to-primary opacity-50" />

      <CardHeader className="pb-4">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-xl bg-primary/10 text-primary">
            <UploadCloud className="h-5 w-5" />
          </div>
          <div>
            <CardTitle className="text-xl font-bold tracking-tight">Sequence Input Terminal</CardTitle>
            <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-muted-foreground mt-1">
              Genomic Data Acquisition
            </p>
          </div>
        </div>
      </CardHeader>

      <CardContent className="space-y-6">
        <Tabs value={tab} onValueChange={v => setTab(v as 'manual' | 'file')} className="w-full">
          <TabsList className="grid grid-cols-2 glass border border-border/50 p-1 h-11 rounded-xl">
            <TabsTrigger value="manual" className="rounded-lg flex gap-2 font-bold text-xs transition-all data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
              <Keyboard className="h-4 w-4" />
              Manual Entry
            </TabsTrigger>
            <TabsTrigger value="file" className="rounded-lg flex gap-2 font-bold text-xs transition-all data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
              <FileText className="h-4 w-4" />
              File Import
            </TabsTrigger>
          </TabsList>

          <div className="mt-6">
            <TabsContent value="manual" className="animate-in fade-in slide-in-from-left-4 duration-300">
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label className="text-xs font-bold uppercase tracking-widest text-muted-foreground pl-1">
                    DNA Sequence String
                  </Label>
                  <Textarea
                    value={manualSequence}
                    onChange={(e) => setManualSequence(e.target.value)}
                    placeholder="e.g. ATGC..."
                    className="min-h-[160px] glass bg-background/50 border-border/50 focus:border-primary/50 focus:ring-primary/20 transition-all font-mono text-sm leading-relaxed rounded-2xl resize-none"
                  />
                </div>
                <Button
                  onClick={handleManualSubmit}
                  className="w-full btn-premium py-7 rounded-xl bg-primary hover:bg-primary/90 text-primary-foreground font-bold shadow-lg shadow-primary/20 text-xs uppercase tracking-wider"
                >
                  <CheckCircle2 className="mr-2 h-4 w-4 shrink-0" />
                  Validate & Process
                </Button>
              </div>
            </TabsContent>

            <TabsContent value="file" className="animate-in fade-in slide-in-from-right-4 duration-300">
              <div className="space-y-6">
                <div className="space-y-2">
                  <Label className="text-xs font-bold uppercase tracking-widest text-muted-foreground pl-1">
                    Select Data Source (.fasta, .txt)
                  </Label>
                  <div className="relative group/file">
                    <Input
                      type="file"
                      onChange={handleFileChange}
                      accept=".txt,.fasta"
                      className="cursor-pointer file:cursor-pointer file:rounded-xl file:border-0 file:bg-primary/10 file:text-primary file:text-xs file:font-bold file:px-4 file:py-2 file:mr-4 glass h-16 pt-4 rounded-2xl border-border/50 hover:border-primary/30 transition-all"
                    />
                  </div>
                </div>
                <Button
                  onClick={handleFileUpload}
                  className="w-full btn-premium py-6 rounded-xl bg-accent hover:bg-accent/90 text-accent-foreground font-bold shadow-lg shadow-accent/20"
                >
                  <UploadCloud className="mr-2 h-4 w-4" />
                  Initialize File Upload
                </Button>
              </div>
            </TabsContent>
          </div>
        </Tabs>
      </CardContent>

      <div className="px-6 py-4 bg-muted/30 border-t border-border/50 flex items-center justify-between">
        <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-muted-foreground/60">
          Ready for Genomic I/O
        </span>
        <div className="flex gap-1">
          <div className="w-1 h-1 rounded-full bg-primary/40" />
          <div className="w-1 h-1 rounded-full bg-primary/40" />
          <div className="w-1 h-1 rounded-full bg-primary/40" />
        </div>
      </div>
    </Card>
  );
};

export default SequenceUploader;
