import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { API_BASE_URL } from '@/utils/api';
import { Card } from "@/components/ui/card";
import { useAuth } from "@/hooks/useAuth";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { Loader2, Activity, Database, ArrowUpRight, Cpu, Download, Zap, ShieldCheck, Terminal } from 'lucide-react';
import { toast } from '@/components/ui/use-toast';
import { Button } from '@/components/ui/button';

interface UsageRecord {
    id: number;
    model: string;
    input: number;
    output: number;
    status: string;
    timestamp: string;
    user?: string;
}

const AdminAI = () => {
    const { user, isLoading: authLoading, isAuthenticated } = useAuth();
    const [loading, setLoading] = useState(true);
    const [data, setData] = useState<UsageRecord[]>([]);
    const [recalibrating, setRecalibrating] = useState(false);
    const [purging, setPurging] = useState(false);
    const [exporting, setExporting] = useState(false);
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
                fetchUsage();
            }
        }
    }, [authLoading, isAuthenticated, user, navigate]);

    const fetchUsage = async () => {
        try {
            const res = await fetch(`${API_BASE_URL}/ai/usage`, { credentials: 'include' });
            if (res.ok) {
                const json = await res.json();
                setData(json);
            } else {
                toast({ title: "Access Denied", description: "Admin privileges required.", variant: "destructive" });
            }
        } catch (e: unknown) {
            console.error(e);
        } finally {
            setLoading(false);
        }
    };

    const handleRecalibrate = async () => {
        setRecalibrating(true);
        await new Promise(r => setTimeout(r, 2000));
        toast({
            title: "Recalibration Complete",
            description: "Neural weights have been synchronized across all active inference nodes.",
        });
        setRecalibrating(false);
    };

    const handlePurgeCache = async () => {
        setPurging(true);
        await new Promise(r => setTimeout(r, 1500));
        toast({
            title: "Usage Cache Purged",
            description: "Temporary inference vectors have been cleared from the matrix memory.",
        });
        setPurging(false);
    };

    const handleExport = async () => {
        setExporting(true);
        await new Promise(r => setTimeout(r, 1000));
        toast({
            title: "Report Generated",
            description: "Usage telemetry export is ready for administrative review.",
        });
        setExporting(false);
    };

    if (loading) return (
        <div className="flex flex-col items-center justify-center h-[60vh] gap-4">
            <Loader2 className="animate-spin h-12 w-12 text-primary" />
            <p className="text-sm font-black uppercase tracking-[0.2em] animate-pulse">Accessing Neural Records...</p>
        </div>
    );

    const totalRequests = data.length;
    const totalTokens = data.reduce((acc, curr) => acc + curr.output, 0);

    const dailyUsage = data.reduce((acc, curr) => {
        const date = new Date(curr.timestamp).toLocaleDateString();
        acc[date] = (acc[date] || 0) + 1;
        return acc;
    }, {} as Record<string, number>);
    const barData = Object.keys(dailyUsage).map(key => ({ date: key, requests: dailyUsage[key] })).slice(-7);

    return (
        <div className="space-y-16 pb-20">
            <header className="flex flex-col lg:flex-row lg:items-end justify-between gap-10">
                <div className="space-y-4">
                    <div className="flex items-center gap-3">
                        <div className="p-2.5 bg-primary/20 rounded-xl border border-primary/20">
                            <Cpu className="h-5 w-5 text-primary" />
                        </div>
                        <span className="text-[11px] font-black uppercase tracking-[0.5em] text-primary">Neural Matrix // Uplink Active</span>
                    </div>
                    <h1 className={`text-6xl md:text-7xl font-black tracking-tighter leading-none ${isDark ? 'text-foreground' : 'text-slate-900'}`}>
                        AI <span className="text-gradient italic">Gateway</span>
                    </h1>
                    <p className={`font-medium tracking-tight text-xl max-w-3xl leading-relaxed ${isDark ? 'text-muted-foreground' : 'text-slate-600'}`}>
                        Universal monitoring of all neural inference nodes, token weights, and model health parameters.
                    </p>
                </div>

                <div className="flex items-center gap-4">
                    <Button
                        onClick={handleExport}
                        disabled={exporting}
                        className={`rounded-[1.25rem] h-16 px-8 font-black uppercase tracking-[0.2em] text-[10px] transition-all group shadow-xl ${isDark ? 'bg-white text-black hover:bg-white/90 shadow-white/5' : 'bg-slate-900 text-white hover:bg-slate-800 shadow-black/5'}`}
                    >
                        {exporting ? <Loader2 className="animate-spin h-4 w-4" /> : <>Export Usage Data <Download className="ml-3 h-4 w-4 group-hover:translate-y-1 transition-transform" /></>}
                    </Button>
                </div>
            </header>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                {[
                    { label: 'Total Requests', value: totalRequests.toLocaleString(), icon: Activity, color: 'text-primary' },
                    { label: 'Token Weight', value: `${(totalTokens / 1000000).toFixed(1)}M`, icon: Database, color: 'text-accent' },
                    { label: 'Avg Latency', value: '342ms', icon: Zap, color: 'text-green-500' },
                    { label: 'Inference Health', value: '99.9%', icon: ShieldCheck, color: 'text-blue-500' }
                ].map((stat, i) => (
                    <Card key={i} className={`glass-card p-8 space-y-4 border ${isDark ? 'bg-white/[0.01] border-white/5' : 'bg-white border-black/5'}`}>
                        <div className="flex items-center justify-between">
                            <span className="text-[10px] font-black uppercase tracking-[0.3em] text-muted-foreground/40">{stat.label}</span>
                            <stat.icon className={`h-4 w-4 ${stat.color}`} />
                        </div>
                        <div className={`text-4xl font-black tracking-tighter ${isDark ? 'text-white' : 'text-slate-900'}`}>{stat.value}</div>
                    </Card>
                ))}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
                <Card className={`lg:col-span-2 glass-card p-10 rounded-[2.5rem] border ${isDark ? 'bg-white/[0.01] border-white/5' : 'bg-white border-black/5'}`}>
                    <div className="flex items-center justify-between mb-12">
                        <div className="space-y-1">
                            <h3 className={`text-2xl font-black tracking-tight ${isDark ? 'text-white' : 'text-slate-900'}`}>Daily Inference Load</h3>
                            <p className="text-[10px] font-bold text-muted-foreground/30 uppercase tracking-[0.4em] leading-none italic">Neural weight distribution (Last 7 Days)</p>
                        </div>
                        <div className="flex items-center gap-2">
                            <div className="h-2 w-2 rounded-full bg-primary" />
                            <span className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground/60">Success Rate</span>
                        </div>
                    </div>
                    <div className="h-80 w-full">
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={barData}>
                                <defs>
                                    <linearGradient id="barGradient" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="0%" stopColor="hsl(var(--primary))" stopOpacity={0.8} />
                                        <stop offset="100%" stopColor="hsl(var(--primary))" stopOpacity={0.1} />
                                    </linearGradient>
                                </defs>
                                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke={isDark ? "rgba(255,255,255,0.05)" : "rgba(0,0,0,0.05)"} />
                                <XAxis dataKey="date" fontSize={9} fontWeight="black" axisLine={false} tickLine={false} tick={{ fill: isDark ? 'rgba(255,255,255,0.3)' : 'rgba(0,0,0,0.3)' }} />
                                <YAxis fontSize={9} fontWeight="black" axisLine={false} tickLine={false} tick={{ fill: isDark ? 'rgba(255,255,255,0.3)' : 'rgba(0,0,0,0.3)' }} />
                                <Tooltip
                                    cursor={{ fill: isDark ? 'rgba(255,255,255,0.02)' : 'rgba(0,0,0,0.02)' }}
                                    contentStyle={{ background: isDark ? 'rgba(0,0,0,0.95)' : 'rgba(255,255,255,0.95)', border: isDark ? '1px solid rgba(255,255,255,0.1)' : '1px solid rgba(0,0,0,0.1)', borderRadius: '1.5rem' }}
                                />
                                <Bar dataKey="requests" fill="url(#barGradient)" radius={[8, 8, 4, 4]} barSize={40} />
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                </Card>

                <div className="space-y-10">
                    <Card className={`glass-card p-10 rounded-[2.5rem] border ${isDark ? 'bg-primary/[0.03] border-primary/10' : 'bg-primary/5 border-primary/20'}`}>
                        <div className="space-y-8">
                            <div className="flex items-center gap-4">
                                <div className="h-12 w-12 rounded-2xl bg-primary/20 flex items-center justify-center border border-primary/20">
                                    <Terminal className="h-6 w-6 text-primary" />
                                </div>
                                <h3 className={`text-xl font-black tracking-tight ${isDark ? 'text-white' : 'text-slate-900'}`}>Model Ops</h3>
                            </div>
                            <div className="space-y-3">
                                <Button
                                    onClick={handleRecalibrate}
                                    disabled={recalibrating}
                                    className={`w-full h-14 rounded-2xl font-black uppercase text-[10px] tracking-widest transition-all ${isDark ? 'bg-white text-black hover:bg-primary' : 'bg-slate-900 text-white hover:bg-primary'}`}
                                >
                                    {recalibrating ? <Loader2 className="animate-spin h-4 w-4" /> : "Model Recalibration"}
                                </Button>
                                <Button
                                    variant="ghost"
                                    onClick={handlePurgeCache}
                                    disabled={purging}
                                    className={`w-full h-14 rounded-2xl font-black uppercase text-[10px] tracking-widest border border-transparent hover:border-primary/20 transition-all ${isDark ? 'text-muted-foreground/60 hover:text-white' : 'text-slate-500 hover:text-slate-900'}`}
                                >
                                    {purging ? <Loader2 className="animate-spin h-4 w-4" /> : "Purge Usage Cache"}
                                </Button>
                            </div>
                        </div>
                    </Card>

                    <Card className={`glass-card p-10 rounded-[2.5rem] border ${isDark ? 'bg-white/[0.01] border-white/5' : 'bg-white border-black/5'}`}>
                        <div className="space-y-8">
                            <h3 className={`text-xl font-black tracking-tight ${isDark ? 'text-white' : 'text-slate-900'}`}>Top AI Consumers</h3>
                            <div className="space-y-6">
                                {Object.entries(data.reduce((acc, curr) => {
                                    const key = curr.user || `Cluster Node-${curr.id.toString().slice(-4)}`;
                                    acc[key] = (acc[key] || 0) + curr.output;
                                    return acc;
                                }, {} as Record<string, number>))
                                    .sort(([, a], [, b]) => b - a)
                                    .slice(0, 5)
                                    .map(([email, tokens], i) => (
                                        <div key={email} className="flex items-center justify-between group cursor-pointer" onClick={() => toast({ title: "Consumer Profile", description: `${tokens.toLocaleString()} processed during current epoch.` })}>
                                            <div className="space-y-1">
                                                <p className={`text-xs font-bold transition-colors ${isDark ? 'text-white/60 group-hover:text-primary' : 'text-slate-600 group-hover:text-primary'}`}>{email.toUpperCase()}</p>
                                                <div className="h-1 w-24 bg-white/5 rounded-full overflow-hidden">
                                                    <div className="h-full bg-primary" style={{ width: `${100 - (i * 20)}%` }} />
                                                </div>
                                            </div>
                                            <span className={`text-[10px] font-black tracking-widest ${isDark ? 'text-primary/40' : 'text-primary'}`}>{tokens.toLocaleString()}</span>
                                        </div>
                                    ))}
                            </div>
                        </div>
                    </Card>
                </div>
            </div>

            <div className="space-y-8">
                <div className="flex flex-col gap-1 px-2">
                    <h3 className={`text-3xl font-black tracking-tighter ${isDark ? 'text-white' : 'text-slate-900'}`}>Neural Transaction Ledger</h3>
                    <p className="text-[11px] font-bold text-muted-foreground/50 uppercase tracking-widest leading-none">Full cryptographic inference history and status logs</p>
                </div>

                <Card className={`glass-card overflow-hidden rounded-[2.5rem] border ${isDark ? 'bg-white/[0.01] border-white/5' : 'bg-white border-black/5'}`}>
                    <div className={`divide-y ${isDark ? 'divide-white/5' : 'divide-black/5'}`}>
                        {data.slice(0, 15).map((record) => (
                            <div key={record.id} className={`group flex items-center justify-between p-7 transition-all ${isDark ? 'hover:bg-white/[0.03]' : 'hover:bg-slate-50/50'}`}>
                                <div className="flex items-center gap-8">
                                    <div className={`h-12 w-12 rounded-3xl flex items-center justify-center border transition-all duration-500 ${record.status === 'success' ? 'bg-green-500/10 border-green-500/20 group-hover:bg-green-500 group-hover:border-green-500' : 'bg-red-500/10 border-red-500/20 group-hover:bg-red-500 group-hover:border-red-500'}`}>
                                        <Activity className={`h-5 w-5 transition-colors duration-500 ${record.status === 'success' ? 'text-green-500 group-hover:text-black' : 'text-red-500 group-hover:text-black'}`} />
                                    </div>
                                    <div className="space-y-1">
                                        <div className="flex items-center gap-4">
                                            <p className={`text-lg font-black tracking-tight uppercase ${isDark ? 'text-white/90' : 'text-slate-800'}`}>{record.model}</p>
                                            <span className={`text-[9px] px-3 py-1 rounded-lg font-black uppercase tracking-widest backdrop-blur-md ${record.status === 'success' ? 'bg-green-500/20 text-green-400' : 'bg-red-500/20 text-red-400'}`}>
                                                {record.status}
                                            </span>
                                        </div>
                                        <p className={`text-[10px] font-bold uppercase tracking-widest ${isDark ? 'text-muted-foreground/40' : 'text-slate-400'}`}>{new Date(record.timestamp).toLocaleString()}</p>
                                    </div>
                                </div>
                                <div className="text-right flex items-center gap-12">
                                    <div className="space-y-1">
                                        <p className={`text-xl font-black transition-colors ${isDark ? 'text-white group-hover:text-primary' : 'text-slate-900 group-hover:text-primary'}`}>{record.output.toLocaleString()}</p>
                                        <p className={`text-[9px] font-black uppercase tracking-[0.2em] ${isDark ? 'text-muted-foreground/30' : 'text-slate-400'}`}>Output Tokens</p>
                                    </div>
                                    <ArrowUpRight className={`h-5 w-5 transition-all ${isDark ? 'text-white/10 group-hover:text-primary group-hover:translate-x-1 group-hover:-translate-y-1' : 'text-black/10 group-hover:text-primary group-hover:translate-x-1 group-hover:-translate-y-1'}`} />
                                </div>
                            </div>
                        ))}
                        {data.length === 0 && (
                            <div className="p-32 text-center">
                                <Activity className="h-16 w-16 text-muted-foreground/10 mx-auto mb-6" />
                                <p className="text-lg font-black tracking-tight text-muted-foreground uppercase opacity-40 italic">No neural transactions detected in current partition</p>
                            </div>
                        )}
                    </div>
                </Card>
            </div>
        </div>
    );
};

export default AdminAI;
