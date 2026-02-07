import React, { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { useAuth } from "@/hooks/useAuth";
import { useNavigate } from 'react-router-dom';
import { API_BASE_URL } from '@/utils/api';
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
            const res = await fetch(`${API_BASE_URL}/admin/system-stats`, { credentials: 'include' });
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
        <div className="space-y-10 pb-16">
            <header className="flex flex-col lg:flex-row lg:items-end justify-between gap-6">
                <div className="space-y-3">
                    <div className="flex items-center gap-2">
                        <div className="h-1.5 w-1.5 rounded-full bg-primary animate-pulse shadow-[0_0_8px_rgba(var(--primary),0.5)]" />
                        <span className="text-[9px] font-black uppercase tracking-[0.3em] text-primary/70">Terminal // Live Telemetry</span>
                    </div>
                    <h1 className="text-2xl md:text-3xl font-black tracking-tight leading-none text-foreground">
                        System <span className="text-gradient italic font-black">Intelligence</span>
                    </h1>
                    <p className="text-muted-foreground/70 font-medium tracking-tight text-sm max-w-xl">
                        Global bio-informatics and administrative governance nodes.
                        Status: <span className="text-foreground font-semibold px-2 py-0.5 bg-primary/5 rounded border border-primary/10 ml-1">NOMINAL</span>
                    </p>
                </div>

                <div className="flex items-center gap-3">
                    <Button
                        onClick={fetchStats}
                        className="rounded-xl h-10 px-5 font-bold uppercase tracking-[0.1em] text-[9px] bg-primary/10 hover:bg-primary/20 text-primary border border-primary/20 transition-all active:scale-95 group"
                    >
                        Sync Data <Activity className="ml-2 h-3 w-3 group-hover:rotate-180 transition-transform duration-700" />
                    </Button>
                </div>
            </header>

            {/* Quick Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                <Card
                    className="admin-card-premium group cursor-pointer p-6"
                    onClick={() => navigate('/admin/users')}
                >
                    <div className="space-y-4">
                        <div className="flex items-center justify-between">
                            <span className="text-[9px] font-black uppercase tracking-[0.2em] text-muted-foreground/50">Personnel Cluster</span>
                            <div className="h-8 w-8 rounded-lg bg-primary/10 flex items-center justify-center border border-primary/10 group-hover:scale-110 transition-transform">
                                <Users className="h-4 w-4 text-primary" />
                            </div>
                        </div>
                        <div>
                            <div className="text-3xl font-black tracking-tighter text-white mb-1">{stats.users}</div>
                            <div className="flex items-center gap-2 text-[8px] font-black uppercase tracking-widest text-green-500/80">
                                <div className="h-1 w-1 rounded-full bg-green-500 animate-pulse" />
                                Active Nodes
                            </div>
                        </div>
                    </div>
                </Card>

                <Card className="admin-card-premium group p-6">
                    <div className="space-y-4">
                        <div className="flex items-center justify-between">
                            <span className="text-[9px] font-black uppercase tracking-[0.2em] text-muted-foreground/50">Genomic Arrays</span>
                            <div className="h-8 w-8 rounded-lg bg-accent/10 flex items-center justify-center border border-accent/10 group-hover:scale-110 transition-transform">
                                <FolderKanban className="h-4 w-4 text-accent" />
                            </div>
                        </div>
                        <div>
                            <div className="text-3xl font-black tracking-tighter text-white mb-1">{stats.projects}</div>
                            <div className="text-[8px] font-black uppercase tracking-widest text-muted-foreground/40">
                                Total Processed
                            </div>
                        </div>
                    </div>
                </Card>

                <Card
                    className="admin-card-premium border-primary/20 bg-primary/5 group cursor-pointer p-6"
                    onClick={() => navigate('/admin/ai')}
                >
                    <div className="h-full flex flex-col justify-between space-y-4">
                        <div className="flex items-center justify-between">
                            <span className="text-[9px] font-black uppercase tracking-[0.2em] text-primary">Neural Core</span>
                            <Cpu className="h-4 w-4 text-primary animate-slow-pulse" />
                        </div>
                        <div className="space-y-2">
                            <h3 className="text-lg font-black tracking-tighter text-white uppercase leading-none">
                                AI Bio-Engine <span className="text-primary italic">Enabled</span>
                            </h3>
                            <div className="flex items-center gap-2 text-[8px] font-black uppercase tracking-widest text-primary/60 group-hover:translate-x-1 transition-transform">
                                System Access <ArrowUpRight className="h-3 w-3" />
                            </div>
                        </div>
                    </div>
                </Card>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Audit Logs Stream */}
                <div className="lg:col-span-2 space-y-4">
                    <div className="flex items-center justify-between px-1">
                        <div className="space-y-0.5">
                            <h3 className="text-xl font-bold tracking-tight text-white">Activity Stream</h3>
                            <p className="text-[9px] font-bold text-muted-foreground/40 uppercase tracking-widest leading-none">Security events & system logs</p>
                        </div>
                        <Button
                            variant="ghost"
                            onClick={() => navigate('/admin/logs')}
                            className="text-[8px] font-black uppercase tracking-widest text-primary/60 hover:text-primary hover:bg-primary/5 rounded-lg h-8 px-3"
                        >
                            View All →
                        </Button>
                    </div>

                    <Card className="glass-card bg-white/[0.01] border-white/5 overflow-hidden rounded-2xl">
                        <div className="divide-y divide-white/5">
                            {stats.logs.map((log, i) => (
                                <div
                                    key={log.id}
                                    className="group flex items-center justify-between p-4 hover:bg-white/[0.02] transition-all"
                                >
                                    <div className="flex items-center gap-4">
                                        <div className="h-8 w-8 shrink-0 rounded-lg bg-white/5 border border-white/5 flex items-center justify-center font-black text-[9px] text-muted-foreground/30 group-hover:bg-primary group-hover:text-black transition-all">
                                            {log.action.substring(0, 2).toUpperCase()}
                                        </div>
                                        <div className="space-y-0.5">
                                            <div className="flex items-center gap-2">
                                                <span className="font-bold text-sm tracking-tight text-white/80">{log.action}</span>
                                                <span className="text-[8px] bg-primary/10 text-primary/80 px-1.5 py-0.5 rounded font-bold uppercase tracking-widest">
                                                    {log.user_email ? log.user_email.split('@')[0] : 'SYSTEM'}
                                                </span>
                                            </div>
                                            <p className="text-muted-foreground/50 text-[10px] font-medium tracking-tight">
                                                {log.details || "Inbound administrative event processed."}
                                            </p>
                                        </div>
                                    </div>
                                    <div className="text-right flex flex-col items-end">
                                        <span className="text-[8px] font-mono font-bold text-muted-foreground/10 group-hover:text-primary/30 transition-colors">{log.ip}</span>
                                        <span className="text-[8px] font-black uppercase tracking-widest text-muted-foreground/30">
                                            {new Date(log.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                        </span>
                                    </div>
                                </div>
                            ))}
                            {stats.logs.length === 0 && (
                                <div className="py-12 text-center space-y-2 opacity-10">
                                    <History className="h-8 w-8 mx-auto text-muted-foreground" />
                                    <p className="text-[8px] font-black uppercase tracking-widest">No telemetry detected</p>
                                </div>
                            )}
                        </div>
                    </Card>
                </div>

                {/* Cyber Security Module */}
                <div className="space-y-8">
                    <Card className="admin-card-premium border-primary/20 p-1 group relative overflow-hidden">
                        <div className="absolute inset-0 bg-primary/5 opacity-0 group-hover:opacity-100 transition-opacity duration-1000" />
                        <div className="p-6 space-y-6 relative">
                            <div className="flex items-center gap-4">
                                <div className="h-12 w-12 rounded-xl bg-card border border-border/10 flex items-center justify-center glow-primary-sm overflow-hidden p-1">
                                    <img src="/admin/os-icon.png" className="h-full w-full object-contain" alt="Security Node" />
                                </div>
                                <div className="flex flex-col">
                                    <span className="text-lg font-black tracking-tighter text-foreground">Core Protocol</span>
                                    <span className="text-[8px] font-black uppercase tracking-[0.3em] text-primary animate-pulse">Encryption Level: 10</span>
                                </div>
                            </div>

                            <div className="space-y-2">
                                <Button className="w-full h-12 rounded-xl bg-white text-black font-black uppercase tracking-[0.2em] text-[9px] hover:bg-white/90 active:scale-95 transition-all">
                                    Cycle System Keys
                                </Button>
                                <Button variant="ghost" className="w-full h-12 rounded-xl bg-white/5 hover:bg-destructive/20 text-destructive font-black uppercase tracking-[0.2em] text-[9px] border border-white/5 transition-all">
                                    Emergency Lockdown
                                </Button>
                            </div>
                        </div>
                    </Card>

                    <div className="px-2 space-y-6">
                        <h4 className="text-[10px] font-black uppercase tracking-[0.4em] text-muted-foreground/40">Service Pulse</h4>
                        <div className="space-y-4">
                            {[
                                { label: 'Auth Gateway', status: 'Optimal', icon: Lock, color: 'text-primary' },
                                { label: 'Inbound Socket', status: 'Encrypted', icon: Zap, color: 'text-accent' },
                                { label: 'Neural Matrix', status: 'Ready', icon: Activity, color: 'text-green-400' }
                            ].map((service, i) => (
                                <div key={i} className="flex items-center gap-4 group cursor-pointer">
                                    <div className="h-11 w-11 rounded-xl bg-white/[0.03] border border-white/5 flex items-center justify-center group-hover:border-primary/50 transition-all duration-500">
                                        <service.icon className={`h-4 w-4 ${service.color}`} />
                                    </div>
                                    <div className="flex-1 space-y-0.5">
                                        <p className="text-xs font-black text-white/80 group-hover:text-primary transition-colors">{service.label}</p>
                                        <div className="flex items-center gap-2">
                                            <div className="h-1 w-1 rounded-full bg-green-500 animate-pulse" />
                                            <span className="text-[9px] font-bold text-muted-foreground/30 uppercase tracking-widest">{service.status}</span>
                                        </div>
                                    </div>
                                    <ArrowUpRight className="h-3 w-3 text-white/10 group-hover:text-primary group-hover:translate-x-1 group-hover:-translate-y-1 transition-all" />
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AdminDashboard;


