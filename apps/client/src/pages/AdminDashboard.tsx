import React, { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { useAuth } from "@/hooks/useAuth";
import { useNavigate } from 'react-router-dom';
import { ShieldAlert, Users, FolderKanban, Cpu, Lock, ArrowUpRight, History } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface AuditLog {
    id: number;
    action: string;
    details: string;
    ip: string;
    timestamp: string;
    user_email: string;
}

const AdminDashboard = () => {
    const { user, isAuthenticated, isLoading: authLoading } = useAuth();
    const navigate = useNavigate();
    const [stats, setStats] = useState({ users: 0, projects: 0, logs: [] as AuditLog[] });
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (!authLoading) {
            if (!isAuthenticated || user?.role !== 'admin') {
                navigate('/admin/login');
            } else {
                fetchStats();
            }
        }
    }, [authLoading, isAuthenticated, user, navigate]);

    const fetchStats = async () => {
        try {
            const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';
            const res = await fetch(`${API_URL}/admin/system-stats`, { credentials: 'include' });
            if (res.ok) {
                const json = await res.json();
                setStats(json);
            }
        } catch (e) {
            console.error(e);
        } finally {
            setLoading(false);
        }
    };

    if (authLoading || loading) return (
        <div className="flex flex-col items-center justify-center h-[60vh] gap-4">
            <div className="h-12 w-12 border-4 border-primary border-t-transparent rounded-full animate-spin" />
            <p className="text-sm font-black uppercase tracking-[0.2em] animate-pulse">Synchronizing Data...</p>
        </div>
    );

    return (
        <div className="space-y-10">
            <header className="flex flex-col gap-2">
                <h1 className="text-4xl font-black tracking-tighter">System <span className="text-primary italic">Intelligence</span> Dashboard</h1>
                <p className="text-muted-foreground font-medium text-sm">Welcome back, Commander. Here's what's happening across the network.</p>
            </header>

            {/* Quick Stats */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                <Card
                    className="glass-card stat-glow admin-card-gradient overflow-hidden border-none group cursor-pointer hover:ring-1 hover:ring-primary/30 transition-all"
                    onClick={() => navigate('/admin/users')}
                >
                    <CardHeader className="pb-2">
                        <div className="flex items-center justify-between">
                            <CardTitle className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Total Personnel</CardTitle>
                            <Users className="h-4 w-4 text-primary opacity-50 group-hover:opacity-100 transition-opacity" />
                        </div>
                    </CardHeader>
                    <CardContent>
                        <div className="text-5xl font-black tracking-tighter">{stats.users.toLocaleString()}</div>
                        <div className="mt-4 flex items-center justify-between text-xs font-bold">
                            <div className="flex items-center gap-2 text-green-500">
                                <ArrowUpRight className="h-3 w-3" />
                                <span>Active Node Cluster</span>
                            </div>
                            <span className="text-primary hidden group-hover:inline opacity-0 group-hover:opacity-100 transition-opacity">Manage Nodes →</span>
                        </div>
                    </CardContent>
                </Card>

                <Card className="glass-card stat-glow admin-card-gradient overflow-hidden border-none group">
                    <CardHeader className="pb-2">
                        <div className="flex items-center justify-between">
                            <CardTitle className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Genomic Pipelines</CardTitle>
                            <FolderKanban className="h-4 w-4 text-primary opacity-50 group-hover:opacity-100 transition-opacity" />
                        </div>
                    </CardHeader>
                    <CardContent>
                        <div className="text-5xl font-black tracking-tighter">{stats.projects.toLocaleString()}</div>
                        <div className="mt-4 flex items-center gap-2 text-xs font-bold text-primary">
                            <History className="h-3 w-3" />
                            <span>Across Global Regions</span>
                        </div>
                    </CardContent>
                </Card>

                <Card className="glass-card stat-glow admin-card-gradient overflow-hidden border-none cursor-pointer group hover:ring-1 hover:ring-primary/30 transition-all" onClick={() => navigate('/admin/ai')}>
                    <CardHeader className="pb-2">
                        <div className="flex items-center justify-between">
                            <CardTitle className="text-[10px] font-black uppercase tracking-widest text-primary">Neural Health</CardTitle>
                            <Cpu className="h-4 w-4 text-primary animate-slow-pulse" />
                        </div>
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-black tracking-tighter group-hover:text-primary transition-colors">AI Core Active</div>
                        <p className="text-xs text-muted-foreground mt-4 font-bold flex items-center gap-2">
                            Enter Gateway <ArrowUpRight className="h-3 w-3" />
                        </p>
                    </CardContent>
                </Card>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Audit Logs */}
                <Card className="glass-card lg:col-span-2 border-white/5 relative overflow-hidden">
                    <div className="absolute top-0 right-0 w-64 h-64 bg-primary/5 rounded-full blur-[100px] -mr-32 -mt-32" />
                    <CardHeader className="relative flex flex-row items-center justify-between">
                        <div>
                            <CardTitle className="flex items-center gap-3 text-xl font-black tracking-tight">
                                <div className="p-2 bg-primary/10 rounded-lg">
                                    <ShieldAlert className="h-5 w-5 text-primary" />
                                </div>
                                Neural Activity Stream
                            </CardTitle>
                            <CardDescription className="text-xs font-bold uppercase tracking-widest opacity-60">Recent forensic telemetry</CardDescription>
                        </div>
                        <Button
                            variant="ghost"
                            size="sm"
                            className="text-[10px] font-black uppercase tracking-widest border border-white/5 bg-white/5 hover:bg-primary/20"
                            onClick={() => navigate('/admin/logs')}
                        >
                            View Full Ledger
                        </Button>
                    </CardHeader>
                    <CardContent className="relative">
                        <div className="space-y-1">
                            {stats.logs.map((log) => (
                                <div key={log.id} className="group flex items-center justify-between p-4 rounded-xl hover:bg-white/5 border border-transparent hover:border-white/5 transition-all">
                                    <div className="flex items-center gap-4">
                                        <div className="h-2 w-2 rounded-full bg-primary/40 group-hover:bg-primary transition-colors" />
                                        <div>
                                            <div className="font-bold text-sm tracking-tight flex items-center gap-2">
                                                {log.action}
                                                <span className="text-[9px] bg-primary/10 text-primary px-2 py-0.5 rounded flex items-center gap-1 font-black uppercase">
                                                    <Users className="h-2 w-2" />
                                                    {log.user_email ? log.user_email.split('@')[0] : 'System'}
                                                </span>
                                            </div>
                                            <p className="text-muted-foreground text-xs mt-0.5 opacity-70 group-hover:opacity-100 transition-opacity font-medium">{log.details || "Administrative event registered"}</p>
                                        </div>
                                    </div>
                                    <div className="text-right">
                                        <div className="text-[10px] font-mono opacity-40 group-hover:opacity-100 transition-opacity">{log.ip}</div>
                                        <div className="text-[9px] font-black uppercase tracking-tighter text-muted-foreground">
                                            {new Date(log.timestamp).toLocaleTimeString()}
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </CardContent>
                </Card>

                {/* Quick Actions */}
                <div className="space-y-8">
                    <Card className="glass-card border-none bg-zinc-900 text-white overflow-hidden relative">
                        <div className="absolute inset-0 bg-gradient-to-br from-primary/20 to-accent/20 opacity-50" />
                        <CardHeader className="relative">
                            <CardTitle className="text-lg font-black tracking-tight flex items-center gap-2">
                                <Lock className="h-5 w-5 text-primary" />
                                Cryptographic Control
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="relative space-y-3">
                            <button className="w-full bg-primary text-primary-foreground font-black uppercase tracking-widest text-[10px] py-3 rounded-lg hover:scale-[1.02] active:scale-95 transition-all shadow-[0_0_20px_rgba(var(--primary),0.3)]">
                                Rotate System Keys
                            </button>
                            <button className="w-full bg-white/10 hover:bg-white/20 text-white font-black uppercase tracking-widest text-[10px] py-3 rounded-lg transition-all border border-white/5">
                                Protocol Lockdown
                            </button>
                        </CardContent>
                    </Card>

                    <Card className="glass-card border-dashed border-muted-foreground/20 bg-transparent overflow-hidden">
                        <CardHeader>
                            <CardTitle className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Active Modules</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="flex items-center gap-3 group cursor-pointer" onClick={() => navigate('/admin/users')}>
                                <div className="h-10 w-10 rounded-xl bg-primary/10 flex items-center justify-center border border-primary/20 group-hover:bg-primary group-hover:text-primary-foreground transition-all">
                                    <Users className="h-4 w-4" />
                                </div>
                                <div className="flex-1">
                                    <p className="text-xs font-black">Identity Orchestrator</p>
                                    <p className="text-[9px] font-bold text-primary uppercase tracking-widest">Operational</p>
                                </div>
                                <ArrowUpRight className="h-3 w-3 opacity-20 group-hover:opacity-100 transition-opacity" />
                            </div>

                            <div className="flex items-center gap-3 group cursor-pointer" onClick={() => navigate('/admin/ai')}>
                                <div className="h-10 w-10 rounded-xl bg-accent/10 flex items-center justify-center border border-accent/20 group-hover:bg-accent group-hover:text-accent-foreground transition-all">
                                    <Cpu className="h-4 w-4" />
                                </div>
                                <div className="flex-1">
                                    <p className="text-xs font-black">Neural Gateway</p>
                                    <p className="text-[9px] font-bold text-accent uppercase tracking-widest">Live Telemetry</p>
                                </div>
                                <ArrowUpRight className="h-3 w-3 opacity-20 group-hover:opacity-100 transition-opacity" />
                            </div>

                            <div className="flex items-center gap-3 opacity-40">
                                <div className="h-10 w-10 rounded-xl bg-muted flex items-center justify-center border border-transparent">
                                    <ShieldAlert className="h-4 w-4" />
                                </div>
                                <div>
                                    <p className="text-xs font-black">Compliance Monitor</p>
                                    <p className="text-[9px] font-bold uppercase tracking-widest">Awaiting Sync</p>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    );
};

export default AdminDashboard;

