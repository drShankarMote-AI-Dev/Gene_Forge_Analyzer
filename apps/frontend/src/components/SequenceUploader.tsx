import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { toast } from '@/components/ui/use-toast';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { UploadCloud, FileText, Keyboard, CheckCircle2, Database, ShieldCheck, Clock, Loader2 } from 'lucide-react';
import { useAuth } from '../hooks/useAuth';
import { API_BASE_URL as API_URL } from '@/utils/api';

interface SequenceUploaderProps {
  onSequenceSubmit: (sequence: string) => void;
}

interface SavedRecord {
  id: number;
  title: string;
  data_type: string;
  created_at: string;
}

const SequenceUploader: React.FC<SequenceUploaderProps> = ({ onSequenceSubmit }) => {
  const [manualSequence, setManualSequence] = useState('');
  const [file, setFile] = useState<File | null>(null);
  const [tab, setTab] = useState<'manual' | 'file' | 'saved'>('manual');
  const { isAuthenticated } = useAuth();
  const [savedRecords, setSavedRecords] = useState<SavedRecord[]>([]);
  const [loadingSaved, setLoadingSaved] = useState(false);

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

  const fetchSavedRecords = async () => {
    setLoadingSaved(true);
    try {
      const response = await fetch(`${API_URL}/genomic-data`, {
        credentials: 'include',
      });
      if (response.ok) {
        const data = await response.json();
        setSavedRecords(data);
      }
    } finally {
      setLoadingSaved(false);
    }
  };

  const loadRecord = async (id: number) => {
    try {
      const response = await fetch(`${API_URL}/genomic-data/${id}`, {
        credentials: 'include',
      });
      if (response.ok) {
        const data = await response.json();
        onSequenceSubmit(data.payload);
        toast({
          title: "Secure Data Decrypted",
          description: `Loaded "${data.title}" successfully. Data was decrypted on-the-fly.`,
        });
      }
    } catch {
      toast({
        title: "Access Denied",
        description: "Encryption key validation failed or data corrupted.",
        variant: "destructive"
      });
    }
  };

  React.useEffect(() => {
    if (tab === 'saved' && isAuthenticated) {
      fetchSavedRecords();
    }
  }, [tab, isAuthenticated]);

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
        <Tabs value={tab} onValueChange={v => setTab(v as 'manual' | 'file' | 'saved')} className="w-full">
          <TabsList className={`grid ${isAuthenticated ? 'grid-cols-3' : 'grid-cols-2'} glass border border-border/50 p-1 h-11 rounded-xl`}>
            <TabsTrigger value="manual" className="rounded-lg flex gap-2 font-bold text-xs transition-all data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
              <Keyboard className="h-4 w-4" />
              Manual
            </TabsTrigger>
            <TabsTrigger value="file" className="rounded-lg flex gap-2 font-bold text-xs transition-all data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
              <FileText className="h-4 w-4" />
              File
            </TabsTrigger>
            {isAuthenticated && (
              <TabsTrigger value="saved" className="rounded-lg flex gap-2 font-bold text-xs transition-all data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
                <Database className="h-4 w-4" />
                Vault
              </TabsTrigger>
            )}
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

            <TabsContent value="saved" className="animate-in fade-in slide-in-from-right-4 duration-300">
              <div className="space-y-4">
                <div className="flex flex-col gap-3 max-h-[250px] overflow-y-auto pr-2 scrollbar-hide">
                  {loadingSaved ? (
                    <div className="flex flex-col items-center justify-center py-10 opacity-50">
                      <Loader2 className="h-8 w-8 animate-spin mb-2" />
                      <span className="text-[10px] font-bold uppercase tracking-widest">Accessing Secure Vault...</span>
                    </div>
                  ) : savedRecords.length === 0 ? (
                    <div className="flex flex-col items-center justify-center py-10 opacity-30 text-center">
                      <ShieldCheck className="h-10 w-10 mb-2" />
                      <span className="text-[10px] font-bold uppercase tracking-widest">Vault is currently empty</span>
                    </div>
                  ) : (
                    savedRecords.map(record => (
                      <div
                        key={record.id}
                        onClick={() => loadRecord(record.id)}
                        className="p-4 rounded-2xl glass border border-primary/5 hover:border-primary/20 hover:bg-primary/5 transition-all cursor-pointer group/item"
                      >
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-3">
                            <div className="p-2 rounded-xl bg-primary/10 text-primary group-hover/item:scale-110 transition-transform">
                              <Database className="h-4 w-4" />
                            </div>
                            <div>
                              <h4 className="text-xs font-bold tracking-tight truncate max-w-[150px]">{record.title}</h4>
                              <div className="flex items-center gap-2 mt-1">
                                <span className="text-[8px] font-black uppercase tracking-widest text-primary/60">{record.data_type}</span>
                                <span className="text-[8px] text-muted-foreground">•</span>
                                <span className="text-[8px] text-muted-foreground flex items-center gap-1 font-medium">
                                  <Clock className="h-2 w-2" />
                                  {new Date(record.created_at).toLocaleDateString()}
                                </span>
                              </div>
                            </div>
                          </div>
                          <div className="opacity-0 group-hover/item:opacity-100 transition-opacity">
                            <ShieldCheck className="h-4 w-4 text-emerald-500" />
                          </div>
                        </div>
                      </div>
                    ))
                  )}
                </div>
                <p className="text-[9px] font-bold text-muted-foreground/60 text-center uppercase tracking-widest px-4">
                  All biological data in the vault is protected by AES-256-GCM encryption at rest.
                </p>
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
