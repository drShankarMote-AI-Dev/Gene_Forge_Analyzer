import React, { useEffect, useState } from 'react';
import { Card } from "@/components/ui/card";
import { useAuth } from "@/hooks/useAuth";
import { useNavigate } from 'react-router-dom';
import { API_BASE_URL, apiFetch } from '@/utils/api';
import { Users, FolderKanban, Cpu, Lock, ArrowUpRight, History, Activity, Zap, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useToast } from "@/hooks/use-toast";

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
    const { toast } = useToast();
    const [stats, setStats] = useState({ users: 0, projects: 0, logs: [] as AuditLog[] });
    const [loading, setLoading] = useState(true);
    const [isRotatingKeys, setIsRotatingKeys] = useState(false);
    const [isLockingDown, setIsLockingDown] = useState(false);

    // Detect admin theme for local styling
    const [adminTheme, setAdminTheme] = useState(() => localStorage.getItem('admin-theme') || 'admin-dark');
    const isDark = adminTheme === 'admin-dark';

    useEffect(() => {
        const handleStorageChange = () => {
            setAdminTheme(localStorage.getItem('admin-theme') || 'admin-dark');
        };
        window.addEventListener('storage', handleStorageChange);
        // Also listen for local updates if necessary
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
                fetchStats();
            }
        }
    }, [authLoading, isAuthenticated, user, navigate]);

    const fetchStats = async () => {
        setLoading(true);
        try {
            const json = await apiFetch('/admin/system-stats');
            setStats(json);
        } catch (e: unknown) {
            console.error(e);
        } finally {
            setLoading(false);
        }
    };

    const handleRotateKeys = async () => {
        setIsRotatingKeys(true);
        try {
            const data = await apiFetch('/admin/rotate-keys', {
                method: 'POST'
            });
            toast({ title: "Cryptographic Success", description: data.msg });
        } catch {
            toast({ title: "Rotation Failed", description: "Communication error with neural core", variant: "destructive" });
        } finally {
            setIsRotatingKeys(false);
        }
    };

    const handleEmergencyLockdown = async () => {
        if (!confirm("INITIATE TOTAL SYSTEM LOCKDOWN? This will suspend all non-administrative node access.")) return;
        setIsLockingDown(true);
        try {
            const data = await apiFetch('/admin/lockdown', {
                method: 'POST'
            });
            toast({ title: "LOCKDOWN ACTIVE", description: data.msg, variant: "destructive" });
        } catch {
            toast({ title: "Lockdown Failed", description: "System core bypass attempt detected", variant: "destructive" });
        } finally {
            setIsLockingDown(false);
        }
    };

    if (authLoading || loading) return (
        <div className="flex flex-col items-center justify-center h-[60vh] gap-6">
            <div className="relative">
                <div className="h-16 w-16 border-4 border-primary/10 border-t-primary rounded-full animate-spin" />
                <div className="absolute inset-0 h-16 w-16 border-4 border-transparent border-b-accent/30 rounded-full animate-spin [animation-duration:1.5s]" />
            </div>
            <p className="text-[10px] font-black uppercase tracking-[0.4em] animate-pulse text-primary/70">Syncing Intelligence Nodes...</p>
        </div>
    );

    return (
        <div className="space-y-12 pb-20">
            {/* Perspective Header */}
            <header className="flex flex-col lg:flex-row lg:items-end justify-between gap-8 relative">
                <div className="space-y-4 relative z-10">
                    <div className="flex items-center gap-3">
                        <div className="h-2 w-2 rounded-full bg-primary animate-ping" />
                        <span className="text-[10px] font-black uppercase tracking-[0.4em] text-primary/60">Operational Status // Live Feed</span>
                    </div>
                    <h1 className={`text-4xl md:text-5xl font-black tracking-tighter leading-none ${isDark ? 'text-white' : 'text-slate-900'}`}>
                        System <span className="text-gradient italic">Intelligence</span>
                    </h1>
                    <p className="text-muted-foreground/60 font-medium tracking-tight text-base max-w-2xl leading-relaxed">
                        Bio-informatics governance and administrative control nodes.
                        Global sequence analysis operations are <span className={`font-bold px-2 py-0.5 rounded border mx-1 ${isDark ? 'text-white bg-primary/20 border-primary/30' : 'text-primary bg-primary/10 border-primary/20'}`}>STABLE</span>.
                    </p>
                </div>

                <div className="flex items-center gap-4 relative z-10">
                    <Button
                        onClick={fetchStats}
                        disabled={loading}
                        className={`rounded-2xl h-12 px-6 font-black uppercase tracking-[0.2em] text-[10px] border transition-all active:scale-95 group overflow-hidden relative ${isDark ? 'bg-white/[0.03] hover:bg-white/[0.08] text-white border-white/10' : 'bg-slate-100 hover:bg-slate-200 text-slate-900 border-black/5'}`}
                    >
                        <div className="absolute inset-0 bg-gradient-to-tr from-primary/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                        <span className="relative flex items-center gap-2">
                            {loading ? <Loader2 className="animate-spin h-3 w-3" /> : <>Refresh Data <Activity className="h-3 w-3 group-hover:rotate-180 transition-transform duration-700" /></>}
                        </span>
                    </Button>
                </div>
            </header>

            {/* Futuristic Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                <Card
                    className={`admin-card-premium group cursor-pointer relative overflow-hidden p-8 transition-all duration-500 border ${isDark ? 'border-white/5 bg-zinc-900/20 hover:bg-zinc-900/40' : 'border-black/5 bg-slate-50 hover:bg-slate-100'}`}
                    onClick={() => navigate('/admin/users')}
                >
                    <div className="absolute -right-10 -top-10 h-40 w-40 bg-primary/5 rounded-full blur-3xl group-hover:bg-primary/10 transition-colors" />
                    <div className="relative space-y-6">
                        <div className="flex items-center justify-between">
                            <span className={`text-[10px] font-black uppercase tracking-[0.3em] italic ${isDark ? 'text-muted-foreground/40' : 'text-slate-400'}`}>Personnel Matrix</span>
                            <div className="h-10 w-10 rounded-xl bg-primary/10 flex items-center justify-center border border-primary/20 group-hover:border-primary/50 transition-all group-hover:scale-110 shadow-lg shadow-primary/10">
                                <Users className="h-5 w-5 text-primary" />
                            </div>
                        </div>
                        <div className="space-y-1">
                            <div className={`text-5xl font-black tracking-tighter transition-transform group-hover:translate-x-1 ${isDark ? 'text-white' : 'text-slate-900'}`}>{stats.users}</div>
                            <div className="flex items-center gap-2 text-[9px] font-black uppercase tracking-[0.3em] text-green-500/80">
                                <div className="h-1.5 w-1.5 rounded-full bg-green-500 animate-pulse shadow-[0_0_8px_rgba(34,197,94,0.5)]" />
                                Active Bio-Nodes
                            </div>
                        </div>
                    </div>
                </Card>

                <Card className={`admin-card-premium group relative overflow-hidden p-8 transition-all duration-500 border ${isDark ? 'border-white/5 bg-zinc-900/20 hover:bg-zinc-900/40' : 'border-black/5 bg-slate-50 hover:bg-slate-100'}`}>
                    <div className="absolute -right-10 -top-10 h-40 w-40 bg-accent/5 rounded-full blur-3xl group-hover:bg-accent/10 transition-colors" />
                    <div className="relative space-y-6">
                        <div className="flex items-center justify-between">
                            <span className={`text-[10px] font-black uppercase tracking-[0.3em] italic ${isDark ? 'text-muted-foreground/40' : 'text-slate-400'}`}>Genomic Arrays</span>
                            <div className="h-10 w-10 rounded-xl bg-accent/10 flex items-center justify-center border border-accent/20 group-hover:border-accent/50 transition-all group-hover:scale-110 shadow-lg shadow-accent/10">
                                <FolderKanban className="h-5 w-5 text-accent" />
                            </div>
                        </div>
                        <div className="space-y-1">
                            <div className={`text-5xl font-black tracking-tighter transition-transform group-hover:translate-x-1 ${isDark ? 'text-white' : 'text-slate-900'}`}>{stats.projects}</div>
                            <div className={`text-[9px] font-black uppercase tracking-[0.3em] ${isDark ? 'text-muted-foreground/30' : 'text-slate-400'}`}>
                                Sequences Processed
                            </div>
                        </div>
                    </div>
                </Card>

                <Card
                    className={`admin-card-premium group cursor-pointer relative overflow-hidden p-8 transition-all duration-500 border ${isDark ? 'border-primary/10 bg-primary/[0.03] hover:bg-primary/[0.08]' : 'border-primary/20 bg-primary/5 hover:bg-primary/10'}`}
                    onClick={() => navigate('/admin/ai')}
                >
                    <div className="absolute inset-0 bg-gradient-to-br from-primary/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                    <div className="relative h-full flex flex-col justify-between space-y-8">
                        <div className="flex items-center justify-between">
                            <span className="text-[10px] font-black uppercase tracking-[0.3em] text-primary">Neural Matrix</span>
                            <Cpu className="h-5 w-5 text-primary animate-slow-pulse" />
                        </div>
                        <div className="space-y-3">
                            <h3 className={`text-2xl font-black tracking-tighter uppercase leading-none group-hover:translate-x-1 transition-transform ${isDark ? 'text-white' : 'text-slate-900'}`}>
                                AI Bio-Engine <span className="text-primary italic">ONLINE</span>
                            </h3>
                            <div className="flex items-center gap-2 text-[9px] font-black uppercase tracking-[0.3em] text-primary/60 group-hover:translate-x-2 transition-transform">
                                System Core Access <ArrowUpRight className="h-3 w-3" />
                            </div>
                        </div>
                    </div>
                </Card>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-5 gap-10">
                {/* Advanced Activity Stream */}
                <div className="lg:col-span-3 space-y-6">
                    <div className="flex items-center justify-between px-2">
                        <div className="space-y-1">
                            <h3 className={`text-2xl font-black tracking-tight ${isDark ? 'text-white' : 'text-slate-900'}`}>Activity Stream</h3>
                            <p className="text-[10px] font-bold text-muted-foreground/30 uppercase tracking-[0.4em] leading-none italic">Security events & protocol logs</p>
                        </div>
                        <Button
                            variant="ghost"
                            onClick={() => navigate('/admin/logs')}
                            className="text-[10px] font-black uppercase tracking-[0.3em] text-primary/50 hover:text-primary hover:bg-primary/5 rounded-xl h-10 px-4 transition-all"
                        >
                            View Audit History →
                        </Button>
                    </div>

                    <Card className={`glass-card overflow-hidden rounded-[2rem] shadow-2xl border ${isDark ? 'bg-white/[0.01] border-white/5' : 'bg-white border-black/5'}`}>
                        <div className={`divide-y ${isDark ? 'divide-white/5' : 'divide-black/5'}`}>
                            {stats.logs.map((log) => (
                                <div
                                    key={log.id}
                                    className={`group flex items-center justify-between p-6 transition-all duration-300 relative ${isDark ? 'hover:bg-white/[0.03]' : 'hover:bg-slate-50'}`}
                                >
                                    <div className="absolute left-0 top-0 bottom-0 w-1 bg-primary scale-y-0 group-hover:scale-y-100 transition-transform origin-top duration-500" />
                                    <div className="flex items-center gap-5">
                                        <div className={`h-10 w-10 shrink-0 rounded-xl border flex items-center justify-center font-black text-[10px] transition-all group-hover:bg-primary group-hover:text-black group-hover:rotate-12 ${isDark ? 'bg-white/[0.03] border-white/5 text-muted-foreground/30' : 'bg-slate-100 border-black/5 text-slate-400'}`}>
                                            {log.action.substring(0, 2).toUpperCase()}
                                        </div>
                                        <div className="space-y-1">
                                            <div className="flex items-center gap-3">
                                                <span className={`font-bold text-base tracking-tight transition-colors ${isDark ? 'text-white/90 group-hover:text-white' : 'text-slate-800 group-hover:text-slate-900'}`}>{log.action}</span>
                                                <span className="text-[9px] bg-primary/10 text-primary/80 px-2 py-0.5 rounded-lg font-black uppercase tracking-[0.2em] border border-primary/20">
                                                    {log.user_email ? log.user_email.split('@')[0] : 'SYSTEM'}
                                                </span>
                                            </div>
                                            <p className={`text-xs font-medium tracking-tight transition-colors italic ${isDark ? 'text-muted-foreground/40 group-hover:text-muted-foreground/60' : 'text-slate-500/70 group-hover:text-slate-600'}`}>
                                                {log.details || "Administrative event processed by neural node cluster."}
                                            </p>
                                        </div>
                                    </div>
                                    <div className="text-right flex flex-col items-end gap-1">
                                        <span className={`text-[9px] font-mono font-bold transition-colors uppercase tracking-widest ${isDark ? 'text-muted-foreground/10 group-hover:text-primary/40' : 'text-slate-300 group-hover:text-primary/60'}`}>{log.ip}</span>
                                        <div className="flex items-center gap-2">
                                            <Activity className="h-2.5 w-2.5 text-primary/20" />
                                            <span className={`text-[9px] font-black uppercase tracking-[0.2em] transition-colors ${isDark ? 'text-muted-foreground/20 group-hover:text-muted-foreground/40' : 'text-slate-400/50 group-hover:text-slate-500'}`}>
                                                {new Date(log.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })}
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            ))}
                            {stats.logs.length === 0 && (
                                <div className="py-20 text-center space-y-4 opacity-10">
                                    <History className="h-12 w-12 mx-auto text-muted-foreground animate-pulse" />
                                    <p className="text-[10px] font-black uppercase tracking-[0.5em]">No Inbound Telemetry</p>
                                </div>
                            )}
                        </div>
                    </Card>
                </div>

                {/* High-Tech Security & Services */}
                <div className="lg:col-span-2 space-y-10">
                    <Card className={`admin-card-premium p-1 group relative overflow-hidden rounded-[2.5rem] shadow-primary/5 border ${isDark ? 'border-primary/20 bg-zinc-950/40' : 'border-primary/30 bg-white'}`}>
                        <div className="absolute inset-0 bg-primary/5 opacity-0 group-hover:opacity-100 transition-opacity duration-1000 animate-pulse" />
                        <div className="p-8 space-y-8 relative z-10">
                            <div className="flex items-center gap-5">
                                <div className={`h-14 w-14 rounded-2xl border flex items-center justify-center glow-primary-sm overflow-hidden p-2 transition-transform group-hover:scale-105 group-hover:rotate-3 ${isDark ? 'bg-zinc-950 border-white/10' : 'bg-slate-100 border-black/5'}`}>
                                    <img src="/admin/os-icon.png" className={`h-full w-full object-contain ${isDark ? 'brightness-150' : 'brightness-100'}`} alt="Security Node" />
                                </div>
                                <div className="flex flex-col">
                                    <span className={`text-xl font-black tracking-tighter ${isDark ? 'text-white' : 'text-slate-900'}`}>Core Protocol</span>
                                    <span className="text-[9px] font-black uppercase tracking-[0.4em] text-primary animate-pulse">Encryption Level: ULTRA</span>
                                </div>
                            </div>

                            <div className="space-y-3">
                                <Button
                                    onClick={handleRotateKeys}
                                    disabled={isRotatingKeys}
                                    className={`w-full h-14 rounded-2xl font-black uppercase tracking-[0.3em] text-[10px] transition-all active:scale-95 shadow-xl ${isDark ? 'bg-white text-black hover:bg-primary shadow-white/5' : 'bg-slate-900 text-white hover:bg-primary shadow-black/5'}`}
                                >
                                    {isRotatingKeys ? <Loader2 className="animate-spin h-4 w-4" /> : "Rotate Access Keys"}
                                </Button>
                                <Button
                                    variant="ghost"
                                    onClick={handleEmergencyLockdown}
                                    disabled={isLockingDown}
                                    className={`w-full h-14 rounded-2xl font-black uppercase tracking-[0.3em] text-[10px] border transition-all ${isDark ? 'bg-white/5 hover:bg-destructive/10 text-destructive/70 hover:text-destructive border-white/5' : 'bg-slate-100 hover:bg-destructive/10 text-destructive/80 hover:text-destructive border-black/5'}`}
                                >
                                    {isLockingDown ? <Loader2 className="animate-spin h-4 w-4" /> : "Emergency Lockdown"}
                                </Button>
                            </div>
                        </div>
                    </Card>

                    <div className="px-4 space-y-8">
                        <div className="flex items-center gap-4">
                            <div className={`h-[1px] flex-1 ${isDark ? 'bg-white/5' : 'bg-black/5'}`} />
                            <h4 className="text-[10px] font-black uppercase tracking-[0.5em] text-muted-foreground/30 italic whitespace-nowrap">Node Pulse</h4>
                            <div className={`h-[1px] flex-1 ${isDark ? 'bg-white/5' : 'bg-black/5'}`} />
                        </div>

                        <div className="space-y-6">
                            {[
                                { label: 'Auth Gateway', status: 'Optimal', icon: Lock, color: 'text-primary' },
                                { label: 'Inbound Socket', status: 'Encrypted', icon: Zap, color: 'text-accent' },
                                { label: 'Neural Matrix', status: 'Ready', icon: Activity, color: 'text-green-500' }
                            ].map((service, i) => (
                                <div key={i} className="flex items-center gap-5 group cursor-pointer" onClick={() => toast({ title: "Module Health", description: `${service.label} is operating at ${service.status} capacity.` })}>
                                    <div className={`h-12 w-12 rounded-2xl border flex items-center justify-center group-hover:scale-110 transition-all duration-500 group-hover:rotate-6 ${isDark ? 'bg-white/[0.02] border-white/5 group-hover:border-primary/40 group-hover:bg-primary/5' : 'bg-slate-100 border-black/5 group-hover:border-primary/50 group-hover:bg-primary/10'}`}>
                                        <service.icon className={`h-5 w-5 ${service.color} transition-all duration-500 group-hover:scale-110`} />
                                    </div>
                                    <div className="flex-1 space-y-1">
                                        <p className={`text-[14px] font-black transition-colors tracking-tight ${isDark ? 'text-white/70 group-hover:text-white' : 'text-slate-800 group-hover:text-slate-950'}`}>{service.label}</p>
                                        <div className="flex items-center gap-2">
                                            <div className="h-1.5 w-1.5 rounded-full bg-green-500 animate-pulse shadow-[0_0_8px_rgba(34,197,94,0.5)]" />
                                            <span className={`text-[9px] font-black uppercase tracking-[0.2em] transition-colors ${isDark ? 'text-muted-foreground/20 group-hover:text-muted-foreground/40' : 'text-slate-400 group-hover:text-slate-500'}`}>{service.status}</span>
                                        </div>
                                    </div>
                                    <ArrowUpRight className={`h-4 w-4 transition-all ${isDark ? 'text-white/5 group-hover:text-primary group-hover:translate-x-1 group-hover:-translate-y-1' : 'text-black/5 group-hover:text-primary group-hover:translate-x-1 group-hover:-translate-y-1'}`} />
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


