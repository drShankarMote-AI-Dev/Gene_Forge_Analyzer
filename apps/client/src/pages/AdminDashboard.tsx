import React, { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { useAuth } from "@/hooks/useAuth";
import { useNavigate } from 'react-router-dom';
import { ShieldAlert, Users, FolderKanban, Cpu, Lock, ArrowUpRight, History, Activity, Zap, Server } from 'lucide-react';
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
            <div className="h-12 w-12 border-4 border-primary/20 border-t-primary rounded-full animate-spin" />
            <p className="text-sm font-black uppercase tracking-[0.2em] animate-pulse text-primary">Inbound Data Stream...</p>
        </div>
    );

    return (
        <div className="space-y-12">
            <header className="flex flex-col md:flex-row md:items-end justify-between gap-6 transition-all">
                <div className="space-y-2">
                    <div className="flex items-center gap-2 mb-2">
                        <div className="h-2 w-2 rounded-full bg-primary animate-pulse shadow-[0_0_10px_rgba(var(--primary),0.8)]" />
                        <span className="text-[10px] font-black uppercase tracking-[0.4em] text-primary">Command Shell active</span>
                    </div>
                    <h1 className="text-5xl font-black tracking-tighter leading-none">
                        Administrative <span className="text-gradient italic">Intelligence</span>
                    </h1>
                    <p className="text-muted-foreground font-bold tracking-tight text-lg max-w-2xl">
                        Universal system telemetry and node management uplink.
                    </p>
                </div>

                <div className="flex items-center gap-4">
                    <Button className="rounded-2xl h-12 px-6 font-black uppercase tracking-widest text-xs shadow-xl shadow-primary/20 group">
                        System Sync <Activity className="ml-2 h-4 w-4 group-hover:rotate-180 transition-transform duration-500" />
                    </Button>
                </div>
            </header>

            {/* Quick Stats */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                <Card
                    className="admin-card-premium stat-glow-premium group cursor-pointer hover:scale-[1.02] transition-all relative overflow-hidden"
                    onClick={() => navigate('/admin/users')}
                >
                    <CardHeader className="pb-2">
                        <div className="flex items-center justify-between">
                            <CardTitle className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground">Active Personnel</CardTitle>
                            <div className="p-2 bg-primary/10 rounded-xl">
                                <Users className="h-4 w-4 text-primary" />
                            </div>
                        </div>
                    </CardHeader>
                    <CardContent>
                        <div className="text-6xl font-black tracking-tighter mb-4">{stats.users.toLocaleString()}</div>
                        <div className="flex items-center justify-between text-xs font-black">
                            <div className="flex items-center gap-2 text-green-500 bg-green-500/10 px-3 py-1.5 rounded-full">
                                <Zap className="h-3 w-3" />
                                <span className="uppercase tracking-widest">Live Nodes</span>
                            </div>
                            <span className="text-primary group-hover:translate-x-1 transition-transform">Inspect Cluster →</span>
                        </div>
                    </CardContent>
                </Card>

                <Card className="admin-card-premium group relative overflow-hidden">
                    <div className="absolute top-0 right-0 p-8 opacity-[0.03] group-hover:opacity-[0.08] transition-opacity">
                        <FolderKanban className="h-32 w-32" />
                    </div>
                    <CardHeader className="pb-2">
                        <div className="flex items-center justify-between">
                            <CardTitle className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground">Genomic Pipelines</CardTitle>
                            <div className="p-2 bg-accent/10 rounded-xl">
                                <FolderKanban className="h-4 w-4 text-accent" />
                            </div>
                        </div>
                    </CardHeader>
                    <CardContent>
                        <div className="text-6xl font-black tracking-tighter mb-4">{stats.projects.toLocaleString()}</div>
                        <div className="flex items-center gap-2 text-xs font-black text-muted-foreground/60 uppercase tracking-widest">
                            <Server className="h-3 w-3" />
                            <span>Global Distribution</span>
                        </div>
                    </CardContent>
                </Card>

                <Card
                    className="admin-card-premium group cursor-pointer hover:border-primary/40 transition-all border-dashed"
                    onClick={() => navigate('/admin/ai')}
                >
                    <CardHeader className="pb-2">
                        <div className="flex items-center justify-between">
                            <CardTitle className="text-[10px] font-black uppercase tracking-[0.2em] text-primary">Core Intelligence</CardTitle>
                            <Cpu className="h-4 w-4 text-primary animate-slow-pulse" />
                        </div>
                    </CardHeader>
                    <CardContent>
                        <div className="text-3xl font-black tracking-tighter group-hover:text-primary transition-colors leading-tight mb-4">Neural Gateway <br />Operational</div>
                        <p className="text-[10px] font-black uppercase tracking-[0.3em] text-muted-foreground/50 flex items-center gap-2 group-hover:text-primary transition-colors">
                            Enter Subsystem <ArrowUpRight className="h-3 w-3 group-hover:-translate-y-1 group-hover:translate-x-1 transition-transform" />
                        </p>
                    </CardContent>
                </Card>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
                {/* Audit Logs */}
                <Card className="admin-card-premium lg:col-span-2 relative">
                    <CardHeader className="flex flex-row items-center justify-between pb-8">
                        <div>
                            <CardTitle className="flex items-center gap-3 text-2xl font-black tracking-tighter">
                                <ShieldAlert className="h-6 w-6 text-primary" />
                                Neural Activity Stream
                            </CardTitle>
                            <CardDescription className="font-bold text-muted-foreground/60 tracking-tight">Real-time forensic telemetry and event recording.</CardDescription>
                        </div>
                        <Button
                            variant="outline"
                            size="sm"
                            className="rounded-xl border-border/40 font-black uppercase tracking-widest text-[9px] hover:bg-primary/5 hover:text-primary"
                            onClick={() => navigate('/admin/logs')}
                        >
                            Access Full Ledger
                        </Button>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-4">
                            {stats.logs.map((log, i) => (
                                <div
                                    key={log.id}
                                    className="group flex items-center justify-between p-4 rounded-2xl hover:bg-primary/5 transition-all border border-transparent hover:border-primary/10 animate-in fade-in slide-in-from-left-4"
                                    style={{ animationDelay: `${i * 100}ms` }}
                                >
                                    <div className="flex items-center gap-5">
                                        <div className="h-10 w-10 shrink-0 rounded-xl bg-muted/30 flex items-center justify-center font-black text-xs group-hover:bg-primary group-hover:text-primary-foreground transition-all">
                                            {log.action.substring(0, 2).toUpperCase()}
                                        </div>
                                        <div>
                                            <div className="font-black text-sm tracking-tight flex items-center gap-3">
                                                {log.action}
                                                <span className="text-[9px] bg-primary/10 text-primary px-2.5 py-1 rounded-full flex items-center gap-1.5 font-black uppercase tracking-widest">
                                                    <Users className="h-2.5 w-2.5" />
                                                    {log.user_email ? log.user_email.split('@')[0] : 'System'}
                                                </span>
                                            </div>
                                            <p className="text-muted-foreground text-xs mt-1 font-bold tracking-tight opacity-70 group-hover:opacity-100 transition-opacity">
                                                {log.details || "Inbound administrative event registered and verified."}
                                            </p>
                                        </div>
                                    </div>
                                    <div className="text-right shrink-0">
                                        <div className="text-[10px] font-mono font-bold text-muted-foreground/40 group-hover:text-primary transition-colors mb-1">{log.ip}</div>
                                        <div className="text-[10px] font-black uppercase tracking-widest text-muted-foreground/60">
                                            {new Date(log.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })}
                                        </div>
                                    </div>
                                </div>
                            ))}
                            {stats.logs.length === 0 && (
                                <div className="text-center py-12 text-muted-foreground font-bold italic opacity-30">
                                    No neural activity recorded in current cycle.
                                </div>
                            )}
                        </div>
                    </CardContent>
                </Card>

                {/* Quick Actions & Modules */}
                <div className="space-y-10">
                    <Card className="admin-card-premium bg-zinc-950 dark:bg-zinc-900 border-none relative overflow-hidden group">
                        <div className="absolute inset-0 bg-gradient-to-br from-primary/30 to-accent/20 opacity-40 group-hover:scale-110 transition-transform duration-1000" />
                        <CardHeader className="relative">
                            <CardTitle className="text-xl font-black tracking-tighter text-white flex items-center gap-3">
                                <div className="p-2 bg-primary rounded-xl shadow-[0_0_20px_rgba(var(--primary),0.5)]">
                                    <Lock className="h-5 w-5 text-white" />
                                </div>
                                Protocol Zero
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="relative space-y-4">
                            <button className="w-full bg-primary text-white font-black uppercase tracking-[0.2em] text-[10px] py-4 rounded-2xl hover:brightness-110 active:scale-[0.98] transition-all shadow-xl shadow-primary/20">
                                Rotate System Keys
                            </button>
                            <button className="w-full bg-white/5 hover:bg-white/10 text-white font-black uppercase tracking-[0.15em] text-[10px] py-4 rounded-2xl transition-all border border-white/10">
                                Initiate Lockdown
                            </button>
                        </CardContent>
                    </Card>

                    <Card className="admin-card-premium border-none shadow-none bg-transparent">
                        <CardHeader className="px-0 pt-0 pb-6">
                            <CardTitle className="text-[10px] font-black uppercase tracking-[0.3em] text-muted-foreground">Network Map</CardTitle>
                        </CardHeader>
                        <CardContent className="px-0 space-y-5">
                            {[
                                { label: 'Identity Core', status: 'Operational', icon: Users, color: 'text-primary' },
                                { label: 'Neural Uplink', status: 'Encrypted', icon: Activity, color: 'text-accent' },
                                { label: 'Storage Cluster', status: 'Optimal', icon: Server, color: 'text-green-500' }
                            ].map((module, i) => (
                                <div key={i} className="flex items-center gap-4 group cursor-pointer hover:translate-x-1 transition-transform">
                                    <div className={`h-12 w-12 rounded-2xl bg-muted/20 flex items-center justify-center border border-border/40 group-hover:bg-primary/5 transition-colors`}>
                                        <module.icon className={`h-5 w-5 ${module.color}`} />
                                    </div>
                                    <div className="flex-1">
                                        <p className="text-sm font-black tracking-tight">{module.label}</p>
                                        <div className="flex items-center gap-1.5 mt-0.5">
                                            <div className="h-1.5 w-1.5 rounded-full bg-green-500 animate-pulse" />
                                            <p className="text-[9px] font-black uppercase tracking-widest text-muted-foreground/60">{module.status}</p>
                                        </div>
                                    </div>
                                    <ArrowUpRight className="h-4 w-4 opacity-0 group-hover:opacity-100 transition-opacity text-primary" />
                                </div>
                            ))}
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    );
};

export default AdminDashboard;


