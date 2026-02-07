import React, { useState, useEffect } from 'react';
import {
    Dialog,
    DialogContent,
    DialogFooter,
    DialogHeader,
    DialogTitle
} from './ui/dialog';
import { Button } from './ui/button';
import { ShieldAlert, AlertTriangle, Scale, Lock } from 'lucide-react';

const ComplianceOverlay: React.FC = () => {
    const [open, setOpen] = useState(false);

    useEffect(() => {
        const acknowledged = localStorage.getItem('geneforge_compliance_ack');
        if (!acknowledged) {
            setOpen(true);
        }
    }, []);

    const handleAcknowledge = () => {
        localStorage.setItem('geneforge_compliance_ack', 'true');
        setOpen(false);
    };

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogContent className="glass-card border-none shadow-2xl max-w-2xl sm:rounded-[2rem]">
                <DialogHeader>
                    <div className="flex items-center gap-3 mb-4">
                        <div className="p-3 rounded-2xl bg-amber-500/10 text-amber-500">
                            <ShieldAlert className="h-6 w-6" />
                        </div>
                        <div>
                            <DialogTitle className="text-2xl font-black tracking-tight">Ethical & Security Compliance</DialogTitle>
                            <p className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground mt-1">Responsible AI & Genomic Research Policy</p>
                        </div>
                    </div>
                </DialogHeader>
                <div className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="glass p-4 rounded-2xl border-white/5 space-y-2">
                            <div className="flex items-center gap-2 text-amber-500">
                                <AlertTriangle className="h-4 w-4" />
                                <span className="text-[10px] font-black uppercase tracking-widest">No Medical Diagnosis</span>
                            </div>
                            <p className="text-[11px] leading-relaxed text-muted-foreground/80">
                                GeneForge is strictly for **computational research only**. It must NOT be used for clinical diagnostics or medical decision-making.
                            </p>
                        </div>
                        <div className="glass p-4 rounded-2xl border-white/5 space-y-2">
                            <div className="flex items-center gap-2 text-primary">
                                <Scale className="h-4 w-4" />
                                <span className="text-[10px] font-black uppercase tracking-widest">Ethical Use</span>
                            </div>
                            <p className="text-[11px] leading-relaxed text-muted-foreground/80">
                                Users agree to comply with all local and international bioethics regulations regarding genomic data processing.
                            </p>
                        </div>
                    </div>

                    <div className="glass p-4 rounded-2xl border-white/5 space-y-3">
                        <div className="flex items-center gap-2 text-emerald-500">
                            <Lock className="h-4 w-4" />
                            <span className="text-[10px] font-black uppercase tracking-widest">Data Privacy & Security</span>
                        </div>
                        <p className="text-[11px] leading-relaxed text-muted-foreground/80">
                            All genomic data is encrypted at rest using **AES-256-GCM**. We maintain detailed audit logs of all sensitive operations. You retain full rights to delete your data at any time (Right to be Forgotten).
                        </p>
                        <div className="p-3 bg-muted/20 rounded-xl border border-dashed border-white/10">
                            <p className="text-[9px] font-bold text-muted-foreground uppercase tracking-widest text-center">
                                By proceeding, you acknowledge that you are authorized to analyze this data and accept all liability.
                            </p>
                        </div>
                    </div>
                </div>
                <DialogFooter className="mt-6">
                    <Button
                        onClick={handleAcknowledge}
                        className="w-full h-12 rounded-xl bg-primary text-primary-foreground font-black uppercase tracking-widest text-xs hover:scale-[1.02] transition-all"
                    >
                        Accept & Initialize Research Environment
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
};

export default ComplianceOverlay;
