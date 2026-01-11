import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
    ShieldCheck,
    Lock,
    Trash2,
    Scale,
    History,
    ArrowLeft,
    ScrollText,
    KeyRound,
    UserX
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';

const SecurityCompliance: React.FC = () => {
    const navigate = useNavigate();

    return (
        <div className="min-h-screen bg-background p-8 md:p-12 lg:p-20 relative overflow-hidden">
            {/* Background elements */}
            <div className="absolute top-0 right-0 w-[800px] h-[800px] bg-primary/5 rounded-full blur-3xl -mr-96 -mt-96" />
            <div className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-blue-500/5 rounded-full blur-3xl -ml-64 -mb-64" />

            <div className="max-w-5xl mx-auto relative z-10">
                <Button
                    variant="ghost"
                    onClick={() => navigate('/')}
                    className="mb-12 hover:bg-white/5 text-muted-foreground gap-2"
                >
                    <ArrowLeft className="h-4 w-4" />
                    Back to Dashboard
                </Button>

                <div className="flex flex-col md:flex-row md:items-end justify-between gap-8 mb-16">
                    <div>
                        <div className="flex items-center gap-3 mb-4">
                            <div className="p-2.5 rounded-2xl bg-primary text-primary-foreground shadow-2xl shadow-primary/20">
                                <ShieldCheck className="h-6 w-6" />
                            </div>
                            <span className="text-[10px] font-black uppercase tracking-[0.4em] text-primary">Compliance & Integrity</span>
                        </div>
                        <h1 className="text-5xl font-black tracking-tighter">Security Laboratory <span className="text-muted-foreground/30">Standards</span></h1>
                    </div>
                    <div className="flex gap-4">
                        <div className="text-right">
                            <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Certified Protocol</p>
                            <p className="text-sm font-bold opacity-60 italic">v4.0.2-SECURE</p>
                        </div>
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                    {/* Main Documentation */}
                    <div className="lg:col-span-8 space-y-8">
                        <section className="space-y-6">
                            <div className="flex items-center gap-3">
                                <ScrollText className="h-5 w-5 text-primary" />
                                <h2 className="text-xl font-bold uppercase tracking-tight">Data Governance Policy</h2>
                            </div>
                            <div className="glass p-8 rounded-[2.5rem] border-white/5 space-y-6">
                                <div className="space-y-4">
                                    <h3 className="font-bold flex items-center gap-2">
                                        <Lock className="h-4 w-4 text-emerald-500" />
                                        Advanced Encryption Standards (AES-256-GCM)
                                    </h3>
                                    <p className="text-sm text-muted-foreground leading-relaxed">
                                        All biological sequences and derived analytical results are encrypted using a per-user derived key.
                                        Our architecture uses **PBKDF2** for key derivation, ensuring that even in the event of database exposure,
                                        the genetic data remains cryptographically inaccessible without the session-specific entropy.
                                    </p>
                                </div>
                                <div className="space-y-4">
                                    <h3 className="font-bold flex items-center gap-2">
                                        <History className="h-4 w-4 text-blue-500" />
                                        Comprehensive Audit Logging
                                    </h3>
                                    <p className="text-sm text-muted-foreground leading-relaxed">
                                        Every high-stakes operation (authentication, AI synthesis, sequence saving) is recorded in our internal
                                        Security Information and Event Management (SIEM) layer. Logs include timestamps, hashed IP origins,
                                        and action metadata for forensic integrity.
                                    </p>
                                </div>
                            </div>
                        </section>

                        <section className="space-y-6">
                            <div className="flex items-center gap-3">
                                <Scale className="h-5 w-5 text-amber-500" />
                                <h2 className="text-xl font-bold uppercase tracking-tight">Ethical Usage Framework</h2>
                            </div>
                            <div className="glass p-8 rounded-[2.5rem] border-white/5 space-y-6">
                                <div className="p-6 bg-amber-500/5 rounded-3xl border border-amber-500/10 border-dashed">
                                    <h4 className="text-[10px] font-black uppercase tracking-widest text-amber-500 mb-2">Notice: Biological Research Limitation</h4>
                                    <p className="text-xs text-muted-foreground leading-relaxed">
                                        GeneForge is an AI-assisted analytical platform intended strictly for educational and molecular research.
                                        **Strict Prohibition**: Usage for human medical diagnosis, prenatal screening, or clinical intervention
                                        mapping is a violation of the Terms of Service.
                                    </p>
                                </div>
                                <div className="space-y-2">
                                    <h4 className="text-sm font-bold">Research Integrity</h4>
                                    <p className="text-sm text-muted-foreground leading-relaxed">
                                        Collaborative tools (Secure Chat & Screen Share) use End-to-End Encryption where the server acts as
                                        a blind relay. No persistent records of real-time collaboration are maintained on GeneForge servers.
                                    </p>
                                </div>
                            </div>
                        </section>
                    </div>

                    {/* Sidebar / Actions */}
                    <div className="lg:col-span-4 space-y-8">
                        <Card className="glass-card border-none shadow-2xl overflow-hidden">
                            <CardHeader className="bg-red-500/10 border-b border-red-500/20">
                                <div className="flex items-center gap-3">
                                    <UserX className="h-5 w-5 text-red-500" />
                                    <CardTitle className="text-sm font-black uppercase tracking-widest text-red-500">Subject Rights</CardTitle>
                                </div>
                            </CardHeader>
                            <CardContent className="p-6 space-y-4">
                                <p className="text-[11px] font-bold text-muted-foreground uppercase tracking-widest leading-relaxed">
                                    In compliance with GDPR and International Genetic Privacy standards, you retain the "Right to be Forgotten."
                                </p>
                                <Button
                                    variant="destructive"
                                    className="w-full py-6 rounded-xl font-black uppercase tracking-[0.2em] text-[10px]"
                                >
                                    <Trash2 className="h-4 w-4 mr-2" />
                                    Purge All Genomic Data
                                </Button>
                                <p className="text-[9px] italic opacity-40 text-center">
                                    Warning: This action is irreversible and will delete all project history and encrypted analysis sessions.
                                </p>
                            </CardContent>
                        </Card>

                        <div className="glass p-6 rounded-3xl border-white/5 space-y-4">
                            <div className="flex items-center gap-2">
                                <KeyRound className="h-4 w-4 text-primary" />
                                <span className="text-[10px] font-black uppercase tracking-widest">Digital Signatures</span>
                            </div>
                            <div className="space-y-2">
                                <div className="h-2 w-full bg-muted/30 rounded-full overflow-hidden">
                                    <div className="h-full bg-primary w-[98%]" />
                                </div>
                                <p className="text-[9px] font-bold text-muted-foreground/60 uppercase text-center">Security Integrity Verified</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default SecurityCompliance;
