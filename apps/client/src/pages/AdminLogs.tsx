import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
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
            const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';
            const res = await fetch(`${API_URL}/admin/logs?page=${page}&per_page=50`, { credentials: 'include' });
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
        <div className="space-y-10">
            <header className="flex flex-col gap-2">
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                        <div className="p-3 bg-primary/10 rounded-2xl">
                            <ShieldAlert className="h-6 w-6 text-primary" />
                        </div>
                        <div>
                            <h1 className="text-4xl font-black tracking-tighter">Forensic <span className="text-primary italic">Audit Logs</span></h1>
                            <p className="text-muted-foreground font-medium text-sm italic">Universal telemetry stream for all administrative and user events</p>
                        </div>
                    </div>
                    <Button variant="outline" className="border-white/10 text-[10px] font-black uppercase tracking-widest px-6 hover:bg-white/5 hidden md:flex">
                        <Download className="mr-2 h-4 w-4" /> Export Ledger
                    </Button>
                </div>
            </header>

            <Card className="glass-card border-white/5 overflow-hidden">
                <CardHeader className="bg-white/5 border-b border-white/5">
                    <div className="flex items-center justify-between gap-6">
                        <div className="relative flex-1 max-w-md mt-4 mb-4">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                            <Input
                                placeholder="Filter ledger by action or ID..."
                                className="pl-10 bg-black/20 border-white/10 font-bold"
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                            />
                        </div>
                        <div className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-muted-foreground">
                            <Wifi className="h-3 w-3 text-green-500 animate-pulse" />
                            Live Stream Active
                        </div>
                    </div>
                </CardHeader>
                <CardContent className="p-0">
                    <div className="min-h-[400px] relative">
                        {loading ? (
                            <div className="absolute inset-0 bg-background/50 backdrop-blur-sm z-10 flex flex-col items-center justify-center gap-4">
                                <Loader2 className="animate-spin h-8 w-8 text-primary" />
                                <p className="text-[10px] font-black uppercase tracking-widest italic">Decrypting Stream...</p>
                            </div>
                        ) : null}

                        <div className="divide-y divide-white/5">
                            {logs.map((log) => (
                                <div key={log.id} className="p-4 flex items-start justify-between hover:bg-primary/[0.02] transition-colors group">
                                    <div className="flex gap-6">
                                        <div className="min-w-[140px] pt-1">
                                            <div className="text-[10px] font-black uppercase tracking-widest text-muted-foreground opacity-50">{new Date(log.timestamp).toLocaleDateString()}</div>
                                            <div className="text-xs font-black tracking-tighter opacity-80">{new Date(log.timestamp).toLocaleTimeString()}</div>
                                        </div>

                                        <div className="space-y-1">
                                            <div className="flex items-center gap-3">
                                                <div className={`px-2 py-0.5 rounded border flex items-center gap-1.5 text-[9px] font-black uppercase tracking-widest ${getActionColor(log.action)}`}>
                                                    {getActionIcon(log.action)}
                                                    {log.action}
                                                </div>
                                                <span className="text-[10px] bg-white/5 px-2 py-0.5 rounded italic font-bold">Node: {log.user_email}</span>
                                            </div>
                                            <p className="text-sm font-medium tracking-tight text-white/90 group-hover:text-white transition-colors">
                                                {log.details || "No supplementary telemetry available."}
                                            </p>
                                        </div>
                                    </div>

                                    <div className="text-right hidden sm:block">
                                        <div className="text-[10px] font-mono text-muted-foreground/60 font-bold tracking-tight">{log.ip}</div>
                                        <div className="text-[9px] font-black uppercase tracking-widest text-primary/40 opacity-0 group-hover:opacity-100 transition-opacity">Traceable</div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </CardContent>
                <div className="p-6 bg-white/5 border-t border-white/5 flex items-center justify-between">
                    <div className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground">
                        Page {pagination.current_page} of {pagination.pages} • {pagination.total} Records Indexed
                    </div>
                    <div className="flex gap-2">
                        <Button
                            variant="outline"
                            size="icon"
                            className="bg-black/20 border-white/10 h-8 w-8 hover:bg-primary/20 hover:border-primary/50"
                            onClick={() => fetchLogs(pagination.current_page - 1)}
                            disabled={pagination.current_page === 1}
                        >
                            <ChevronLeft className="h-4 w-4" />
                        </Button>
                        <Button
                            variant="outline"
                            size="icon"
                            className="bg-black/20 border-white/10 h-8 w-8 hover:bg-primary/20 hover:border-primary/50"
                            onClick={() => fetchLogs(pagination.current_page + 1)}
                            disabled={pagination.current_page === pagination.pages}
                        >
                            <ChevronRight className="h-4 w-4" />
                        </Button>
                    </div>
                </div>
            </Card>
        </div>
    );
};

export default AdminLogs;
