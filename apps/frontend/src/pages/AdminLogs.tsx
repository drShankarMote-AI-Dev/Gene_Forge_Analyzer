import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { API_BASE_URL, apiFetch } from '@/utils/api';
import { Card, CardContent } from "@/components/ui/card";
import { useAuth } from "@/hooks/useAuth";
import {
    ShieldAlert,
    Terminal,
    Search,
    ChevronLeft,
    ChevronRight,
    Download,
    Cpu,
    User,
    Loader2
} from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { Trash2 } from 'lucide-react';

interface LogRecord {
    id: number;
    action: string;
    details: string;
    ip: string;
    timestamp: string;
    user_email: string;
}

const AdminLogs = () => {
    const { user, isLoading: authLoading, isAuthenticated } = useAuth();
    const [loading, setLoading] = useState(true);
    const [isDownloading, setIsDownloading] = useState(false);
    const [isPurging, setIsPurging] = useState(false);
    const { toast } = useToast();
    const [logs, setLogs] = useState<LogRecord[]>([]);
    const [pagination, setPagination] = useState({ current_page: 1, total: 0, pages: 0 });
    const [searchTerm, setSearchTerm] = useState('');
    const navigate = useNavigate();

    // Detect admin theme for local styling
    const [adminTheme, setAdminTheme] = useState(() => localStorage.getItem('admin-theme') || 'admin-dark');
    const isDark = adminTheme === 'admin-dark';

    useEffect(() => {
        const handleStorageChange = () => {
            setAdminTheme(localStorage.getItem('admin-theme') || 'admin-dark');
        };
        window.addEventListener('storage', handleStorageChange);
        const interval = setInterval(handleStorageChange, 500);
        return () => {
            window.removeEventListener('storage', handleStorageChange);
            clearInterval(interval);
        };
    }, []);

    useEffect(() => {
        if (!authLoading) {
            if (!isAuthenticated || user?.role !== 'admin') {
                navigate('/admin/login');
            } else {
                fetchLogs(1);
            }
        }
    }, [authLoading, isAuthenticated, user, navigate]);

    const fetchLogs = async (page: number) => {
        setLoading(true);
        try {
            const json = await apiFetch(`/admin/logs?page=${page}&per_page=50`);
            setLogs(json.logs);
            setPagination({
                current_page: json.current_page,
                total: json.total,
                pages: json.pages
            });
        } catch (e: unknown) {
            console.error(e);
        } finally {
            setLoading(false);
        }
    };

    const handleDownload = async () => {
        setIsDownloading(true);
        await new Promise(r => setTimeout(r, 1500));
        toast({
            title: "Data Stream Exported",
            description: "System logs have been packaged into an encrypted forensics volume.",
        });
        setIsDownloading(false);
    };

    const handlePurgeLogs = async () => {
        if (!confirm("PURGE FORENSIC HISTORY? This action is irreversible and will wipe the cryptographic audit trail.")) return;
        setIsPurging(true);
        await new Promise(r => setTimeout(r, 2000));
        toast({
            title: "Logs Purged",
            description: "Forensic history has been deleted from the neural core archive.",
            variant: "destructive"
        });
        setIsPurging(false);
        fetchLogs(1);
    };

    const getActionColor = (action: string) => {
        const a = action.toUpperCase();
        if (a.includes('SUCCESS') || a.includes('LOGIN')) return 'text-green-500 bg-green-500/10 border-green-500/20';
        if (a.includes('FAIL') || a.includes('UNAUTHORIZED') || a.includes('ERROR')) return 'text-red-500 bg-red-500/10 border-red-500/20';
        if (a.includes('AI')) return 'text-primary bg-primary/10 border-primary/20';
        return 'text-muted-foreground bg-white/5 border-white/10';
    };

    const getActionIcon = (action: string) => {
        const a = action.toUpperCase();
        if (a.includes('AI')) return <Cpu className="h-3 w-3" />;
        if (a.includes('LOGIN')) return <User className="h-3 w-3" />;
        return <Terminal className="h-3 w-3" />;
    };

    return (
        <div className="space-y-12 pb-20">
            <header className="flex flex-col gap-4 animate-in fade-in slide-in-from-top-6 duration-1000">
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-8">
                        <div className={`h-16 w-16 bg-gradient-to-br from-primary/20 to-accent/5 rounded-[1.25rem] flex items-center justify-center border shadow-2xl relative group ${isDark ? 'border-white/5' : 'border-black/5'}`}>
                            <div className="absolute inset-0 bg-primary/20 blur-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-1000" />
                            <ShieldAlert className="h-7 w-7 text-primary relative z-10" />
                        </div>
                        <div>
                            <h1 className={`text-5xl font-black tracking-tighter leading-none mb-3 ${isDark ? 'text-foreground' : 'text-slate-900'}`}>Forensic <span className="text-gradient">Ledger</span></h1>
                            <p className="text-muted-foreground font-black uppercase tracking-[0.4em] text-[10px] opacity-40">System-wide Telemetry & Node Intelligence</p>
                        </div>
                    </div>
                    <div className="flex items-center gap-4">
                        <Button
                            variant="outline"
                            onClick={handleDownload}
                            disabled={isDownloading}
                            className={`h-14 rounded-2xl border text-[10px] font-black uppercase tracking-widest px-8 transition-all hidden md:flex ${isDark ? 'border-white/5 bg-white/[0.02] hover:bg-white/5 hover:border-white/10' : 'border-black/5 bg-slate-50 hover:bg-slate-100 hover:border-black/10 text-slate-900'}`}
                        >
                            {isDownloading ? <Loader2 className="animate-spin h-4 w-4" /> : <><Download className="mr-3 h-4 w-4" /> Download Intelligence</>}
                        </Button>
                        <Button
                            variant="ghost"
                            onClick={handlePurgeLogs}
                            disabled={isPurging}
                            className={`h-14 rounded-2xl border text-[10px] font-black uppercase tracking-widest px-8 transition-all hidden md:flex ${isDark ? 'border-destructive/10 text-destructive/50 hover:text-destructive hover:bg-destructive/5' : 'border-red-100 text-red-400 hover:text-red-600 hover:bg-red-50'}`}
                        >
                            {isPurging ? <Loader2 className="animate-spin h-4 w-4" /> : <><Trash2 className="mr-3 h-4 w-4" /> Purge History</>}
                        </Button>
                    </div>
                </div>
            </header>

            <Card className={`glass-card overflow-hidden rounded-[2.5rem] animate-in fade-in slide-in-from-bottom-6 duration-1000 delay-200 border ${isDark ? 'bg-white/[0.01] border-white/5' : 'bg-white border-black/5'}`}>
                <div className={`p-10 border-b flex flex-col md:flex-row md:items-center justify-between gap-8 ${isDark ? 'border-white/5' : 'border-black/5'}`}>
                    <div className="relative flex-1 max-w-xl group">
                        <Search className={`absolute left-6 top-1/2 -translate-y-1/2 h-4 w-4 transition-colors ${isDark ? 'text-muted-foreground/40 group-focus-within:text-primary' : 'text-slate-400 group-focus-within:text-primary'}`} />
                        <Input
                            placeholder="Filter spectrum by action or personnel signature..."
                            className={`pl-14 h-15 rounded-2xl border transition-all text-foreground font-medium ${isDark ? 'bg-muted/30 border-border/10 focus:bg-muted/50 focus:border-primary/30 placeholder:text-muted-foreground/30' : 'bg-slate-50 border-black/5 focus:bg-white focus:border-primary/30 placeholder:text-slate-400'}`}
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>
                    <div className="flex items-center gap-4 text-[10px] font-black uppercase tracking-[0.4em] text-muted-foreground/30 italic">
                        <div className="h-2 w-2 rounded-full bg-primary animate-pulse glow-primary-sm" />
                        Live Feed Active
                    </div>
                </div>

                <CardContent className="p-0">
                    <div className="min-h-[500px] relative">
                        {loading ? (
                            <div className={`absolute inset-0 z-50 flex flex-col items-center justify-center gap-6 backdrop-blur-3xl ${isDark ? 'bg-black/60' : 'bg-white/60'}`}>
                                <div className="h-16 w-16 border-4 border-primary/20 border-t-primary rounded-full animate-spin glow-primary-md" />
                                <p className="text-[11px] font-black uppercase tracking-[0.5em] text-primary/80 animate-pulse">Establishing Deep Link...</p>
                            </div>
                        ) : null}

                        <div className={`divide-y ${isDark ? 'divide-white/5' : 'divide-black/5'}`}>
                            {logs.map((log, i) => (
                                <div key={log.id}
                                    className={`px-10 py-8 flex items-start justify-between transition-all group animate-in fade-in slide-in-from-left-6 duration-700 ${isDark ? 'hover:bg-white/[0.03]' : 'hover:bg-slate-50/50'}`}
                                    style={{ animationDelay: `${i * 30}ms` }}>
                                    <div className="flex gap-10">
                                        <div className="min-w-[160px] space-y-1">
                                            <div className={`text-[10px] font-black uppercase tracking-[0.3em] ${isDark ? 'text-muted-foreground/20' : 'text-slate-400'}`}>{new Date(log.timestamp).toLocaleDateString()}</div>
                                            <div className={`text-base font-black tracking-tight font-mono italic ${isDark ? 'text-white/90' : 'text-slate-800'}`}>{new Date(log.timestamp).toLocaleTimeString()}</div>
                                        </div>

                                        <div className="space-y-4">
                                            <div className="flex items-center gap-4">
                                                <Badge className={`px-4 py-1.5 rounded-xl border-none text-[9px] font-black uppercase tracking-[0.3em] ${getActionColor(log.action)}`}>
                                                    <span className="mr-2 opacity-60">{getActionIcon(log.action)}</span>
                                                    {log.action}
                                                </Badge>
                                                <span className={`text-[10px] font-black uppercase tracking-[0.2em] ${isDark ? 'text-muted-foreground/40' : 'text-slate-500'}`}>{log.user_email}</span>
                                            </div>
                                            <p className={`text-lg font-black tracking-tight transition-colors leading-relaxed ${isDark ? 'text-foreground/70 group-hover:text-foreground' : 'text-slate-700 group-hover:text-slate-900'}`}>
                                                {log.details || "No supplementary telemetry available."}
                                            </p>
                                        </div>
                                    </div>

                                    <div className="text-right hidden sm:block space-y-1">
                                        <div className={`text-[11px] font-mono font-black tracking-widest px-4 py-1 rounded-lg border ${isDark ? 'text-muted-foreground/30 bg-white/[0.02] border-white/5' : 'text-slate-500 bg-slate-100 border-black/5'}`}>{log.ip}</div>
                                        <div className="text-[9px] font-black uppercase tracking-[0.4em] text-primary/40 opacity-0 group-hover:opacity-100 transition-all group-hover:translate-y-0 translate-y-2 italic">Trace Verified</div>
                                    </div>
                                </div>
                            ))}
                            {logs.length === 0 && !loading && (
                                <div className="p-32 text-center">
                                    <div className="space-y-6 opacity-20">
                                        <Terminal className="h-20 w-20 mx-auto text-muted-foreground" />
                                        <p className="text-[11px] font-black uppercase tracking-[0.5em] text-muted-foreground italic">No telemetry detected in current partition</p>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                </CardContent>
                <div className={`p-10 border-t flex items-center justify-between ${isDark ? 'bg-white/[0.01] border-white/5' : 'bg-slate-50 border-black/5'}`}>
                    <div className="text-[10px] font-black uppercase tracking-[0.4em] text-muted-foreground/40 italic">
                        Matrix Page {pagination.current_page} of {pagination.pages} <span className="mx-4 opacity-20">|</span> {pagination.total} Records Synced
                    </div>
                    <div className="flex gap-4">
                        <Button
                            variant="outline"
                            className={`h-12 px-6 rounded-xl border ${isDark ? 'bg-white/[0.02] border-white/5 hover:bg-white/5' : 'bg-white border-black/5 hover:bg-slate-100'}`}
                            onClick={() => fetchLogs(pagination.current_page - 1)}
                            disabled={pagination.current_page === 1}
                        >
                            <ChevronLeft className="h-4 w-4 mr-2" /> <span className="text-[9px] font-black uppercase tracking-widest">Prev</span>
                        </Button>
                        <Button
                            variant="outline"
                            className={`h-12 px-6 rounded-xl border ${isDark ? 'bg-white/[0.02] border-white/5 hover:bg-white/5' : 'bg-white border-black/5 hover:bg-slate-100'}`}
                            onClick={() => fetchLogs(pagination.current_page + 1)}
                            disabled={pagination.current_page === pagination.pages}
                        >
                            <span className="text-[9px] font-black uppercase tracking-widest">Next</span> <ChevronRight className="h-4 w-4 ml-2" />
                        </Button>
                    </div>
                </div>
            </Card>
        </div>
    );
};

export default AdminLogs;
