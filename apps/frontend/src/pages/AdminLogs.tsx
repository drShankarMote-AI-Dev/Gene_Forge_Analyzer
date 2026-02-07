import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { API_BASE_URL } from '@/utils/api';
import { Card, CardContent, CardHeader } from "@/components/ui/card";
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
    Wifi,
    Loader2
} from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";

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
    const [logs, setLogs] = useState<LogRecord[]>([]);
    const [pagination, setPagination] = useState({ current_page: 1, total: 0, pages: 0 });
    const [searchTerm, setSearchTerm] = useState('');
    const navigate = useNavigate();

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
            const res = await fetch(`${API_BASE_URL}/admin/logs?page=${page}&per_page=50`, { credentials: 'include' });
            if (res.ok) {
                const json = await res.json();
                setLogs(json.logs);
                setPagination({
                    current_page: json.current_page,
                    total: json.total,
                    pages: json.pages
                });
            }
        } catch (e) {
            console.error(e);
        } finally {
            setLoading(false);
        }
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
                        <div className="h-16 w-16 bg-gradient-to-br from-primary/20 to-accent/5 rounded-[1.25rem] flex items-center justify-center border border-white/5 shadow-2xl relative group">
                            <div className="absolute inset-0 bg-primary/20 blur-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-1000" />
                            <ShieldAlert className="h-7 w-7 text-primary relative z-10" />
                        </div>
                        <div>
                            <h1 className="text-5xl font-black tracking-tighter text-foreground leading-none mb-3">Forensic <span className="text-gradient">Ledger</span></h1>
                            <p className="text-muted-foreground font-black uppercase tracking-[0.4em] text-[10px] opacity-40">System-wide Telemetry & Node Intelligence</p>
                        </div>
                    </div>
                    <Button variant="outline" className="h-14 rounded-2xl border-white/5 bg-white/[0.02] text-[10px] font-black uppercase tracking-widest px-8 hover:bg-white/5 hover:border-white/10 transition-all hidden md:flex">
                        <Download className="mr-3 h-4 w-4" /> Download Intelligence
                    </Button>
                </div>
            </header>

            <Card className="glass-card bg-white/[0.01] border-white/5 overflow-hidden rounded-[2.5rem] animate-in fade-in slide-in-from-bottom-6 duration-1000 delay-200">
                <div className="p-10 border-b border-white/5 flex flex-col md:flex-row md:items-center justify-between gap-8">
                    <div className="relative flex-1 max-w-xl group">
                        <Search className="absolute left-6 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground/40 group-focus-within:text-primary transition-colors" />
                        <Input
                            placeholder="Filter spectrum by action or personnel signature..."
                            className="pl-14 h-15 rounded-2xl bg-muted/30 border-border/10 focus:bg-muted/50 focus:border-primary/30 transition-all text-foreground placeholder:text-muted-foreground/30 font-medium"
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
                            <div className="absolute inset-0 bg-black/60 backdrop-blur-3xl z-50 flex flex-col items-center justify-center gap-6">
                                <div className="h-16 w-16 border-4 border-primary/20 border-t-primary rounded-full animate-spin glow-primary-md" />
                                <p className="text-[11px] font-black uppercase tracking-[0.5em] text-primary/80 animate-pulse">Establishing Deep Link...</p>
                            </div>
                        ) : null}

                        <div className="divide-y divide-white/5">
                            {logs.map((log, i) => (
                                <div key={log.id}
                                    className="px-10 py-8 flex items-start justify-between hover:bg-white/[0.03] transition-all group animate-in fade-in slide-in-from-left-6 duration-700"
                                    style={{ animationDelay: `${i * 30}ms` }}>
                                    <div className="flex gap-10">
                                        <div className="min-w-[160px] space-y-1">
                                            <div className="text-[10px] font-black uppercase tracking-[0.3em] text-muted-foreground/20">{new Date(log.timestamp).toLocaleDateString()}</div>
                                            <div className="text-base font-black tracking-tight text-white/90 font-mono italic">{new Date(log.timestamp).toLocaleTimeString()}</div>
                                        </div>

                                        <div className="space-y-4">
                                            <div className="flex items-center gap-4">
                                                <Badge className={`px-4 py-1.5 rounded-xl border-none text-[9px] font-black uppercase tracking-[0.3em] ${getActionColor(log.action)}`}>
                                                    <span className="mr-2 opacity-60">{getActionIcon(log.action)}</span>
                                                    {log.action}
                                                </Badge>
                                                <span className="text-[10px] font-black text-muted-foreground/40 uppercase tracking-[0.2em]">{log.user_email}</span>
                                            </div>
                                            <p className="text-lg font-black tracking-tight text-foreground/70 group-hover:text-foreground transition-colors leading-relaxed">
                                                {log.details || "No supplementary telemetry available."}
                                            </p>
                                        </div>
                                    </div>

                                    <div className="text-right hidden sm:block space-y-1">
                                        <div className="text-[11px] font-mono text-muted-foreground/30 font-black tracking-widest bg-white/[0.02] px-4 py-1 rounded-lg border border-white/5">{log.ip}</div>
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
                <div className="p-10 bg-white/[0.01] border-t border-white/5 flex items-center justify-between">
                    <div className="text-[10px] font-black uppercase tracking-[0.4em] text-muted-foreground/40 italic">
                        Matrix Page {pagination.current_page} of {pagination.pages} <span className="mx-4 opacity-20">|</span> {pagination.total} Records Synced
                    </div>
                    <div className="flex gap-4">
                        <Button
                            variant="outline"
                            className="bg-white/[0.02] border-white/5 h-12 px-6 rounded-xl hover:bg-white/5"
                            onClick={() => fetchLogs(pagination.current_page - 1)}
                            disabled={pagination.current_page === 1}
                        >
                            <ChevronLeft className="h-4 w-4 mr-2" /> <span className="text-[9px] font-black uppercase tracking-widest">Prev</span>
                        </Button>
                        <Button
                            variant="outline"
                            className="bg-white/[0.02] border-white/5 h-12 px-6 rounded-xl hover:bg-white/5"
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
