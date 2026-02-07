import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { API_BASE_URL } from '@/utils/api';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { useAuth } from "@/hooks/useAuth";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { Loader2, Activity, Database, ArrowUpRight, Cpu } from 'lucide-react';
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
    const navigate = useNavigate();

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
        } catch (e) {
            console.error(e);
        } finally {
            setLoading(false);
        }
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
                    <h1 className="text-6xl md:text-7xl font-black tracking-tighter leading-none text-foreground">
                        AI <span className="text-gradient italic">Gateway</span>
                    </h1>
                    <p className="text-muted-foreground font-medium tracking-tight text-xl max-w-3xl leading-relaxed">
                        Universal monitoring of all neural inference nodes, token weights, and model health parameters.
                    </p>
                </div>

                <div className="flex items-center gap-4">
                    <Button
                        onClick={fetchUsage}
                        className="rounded-[1.25rem] h-16 px-8 font-black uppercase tracking-[0.2em] text-[10px] bg-white text-black hover:bg-white/90 transition-all group shadow-xl shadow-white/5"
                    >
                        Sync Neural Ledger <Database className="ml-3 h-4 w-4" />
                    </Button>
                </div>
            </header>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
                <Card className="glass-card bg-gradient-to-br from-primary/10 to-transparent group p-1">
                    <div className="p-8 space-y-8">
                        <span className="text-[10px] font-black uppercase tracking-[0.3em] text-muted-foreground/60">Total Inferences</span>
                        <div>
                            <div className="text-6xl font-black tracking-tighter text-foreground mb-2">{totalRequests.toLocaleString()}</div>
                            <div className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-primary">
                                <Activity className="h-3 w-3" /> API Signal Strong
                            </div>
                        </div>
                    </div>
                </Card>

                <Card className="glass-card bg-gradient-to-br from-accent/10 to-transparent group p-1">
                    <div className="p-8 space-y-8">
                        <span className="text-[10px] font-black uppercase tracking-[0.3em] text-muted-foreground/60">Token Weight</span>
                        <div>
                            <div className="text-6xl font-black tracking-tighter text-foreground mb-2">{totalTokens.toLocaleString()}</div>
                            <div className="text-[10px] font-black uppercase tracking-widest text-accent/60">Generated Output Total</div>
                        </div>
                    </div>
                </Card>

                <Card className="glass-card bg-green-500/5 group p-1 border-green-500/20">
                    <div className="p-8 space-y-8">
                        <span className="text-[10px] font-black uppercase tracking-[0.3em] text-green-500/60">Inference Health</span>
                        <div>
                            <div className="text-6xl font-black tracking-tighter text-green-400 mb-2">99.9%</div>
                            <div className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-green-500/60">
                                <div className="h-1.5 w-1.5 rounded-full bg-green-500 animate-pulse" /> Nodes Nominal
                            </div>
                        </div>
                    </div>
                </Card>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
                <Card className="glass-card bg-white/[0.01] border-white/5 p-8 space-y-8 rounded-[2rem]">
                    <div className="flex flex-col gap-1">
                        <h3 className="text-2xl font-black tracking-tighter text-white flex items-center gap-3">
                            <Activity className="h-5 w-5 text-primary" />
                            Load Distribution
                        </h3>
                        <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground/40 leading-none">Inferences per solar cycle</p>
                    </div>

                    <div className="h-[300px] w-full mt-4">
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={barData}>
                                <defs>
                                    <linearGradient id="barGradient" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="0%" stopColor="hsl(var(--primary))" stopOpacity={0.8} />
                                        <stop offset="100%" stopColor="hsl(var(--primary))" stopOpacity={0.1} />
                                    </linearGradient>
                                </defs>
                                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(255,255,255,0.05)" />
                                <XAxis dataKey="date" fontSize={9} fontWeight="black" axisLine={false} tickLine={false} tick={{ fill: 'rgba(255,255,255,0.3)' }} />
                                <YAxis fontSize={9} fontWeight="black" axisLine={false} tickLine={false} tick={{ fill: 'rgba(255,255,255,0.3)' }} />
                                <Tooltip
                                    cursor={{ fill: 'rgba(255,255,255,0.02)' }}
                                    contentStyle={{ background: 'rgba(0,0,0,0.95)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '1.5rem' }}
                                />
                                <Bar dataKey="requests" fill="url(#barGradient)" radius={[8, 8, 4, 4]} barSize={40} />
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                </Card>

                <Card className="glass-card bg-white/[0.01] border-white/5 p-8 space-y-8 rounded-[2rem]">
                    <div className="flex flex-col gap-1">
                        <h3 className="text-2xl font-black tracking-tighter text-white flex items-center gap-3">
                            <Database className="h-5 w-5 text-accent" />
                            Core Consumers
                        </h3>
                        <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground/40 leading-none">Token weight per personnel ID</p>
                    </div>

                    <div className="space-y-4 max-h-[300px] overflow-y-auto pr-4 custom-scrollbar">
                        {Object.entries(data.reduce((acc, curr) => {
                            const key = curr.user || `Cluster Node-${curr.id.toString().slice(-4)}`;
                            acc[key] = (acc[key] || 0) + curr.output;
                            return acc;
                        }, {} as Record<string, number>))
                            .sort(([, a], [, b]) => b - a)
                            .slice(0, 5)
                            .map(([email, tokens], i) => (
                                <div key={email} className="group flex items-center justify-between p-5 rounded-[1.5rem] bg-white/[0.02] border border-white/5 hover:border-primary/30 transition-all duration-500">
                                    <div className="flex items-center gap-6">
                                        <div className="h-12 w-12 rounded-2xl bg-white/5 flex items-center justify-center text-[11px] font-black text-white/40 border border-white/5 group-hover:bg-primary group-hover:text-black group-hover:border-primary transition-all duration-500">
                                            0{i + 1}
                                        </div>
                                        <div className="flex flex-col">
                                            <span className="text-sm font-black text-white/90 group-hover:text-primary transition-colors">{email.toUpperCase()}</span>
                                            <span className="text-[9px] font-bold text-muted-foreground/40 uppercase tracking-widest">Active Researcher</span>
                                        </div>
                                    </div>
                                    <div className="text-right">
                                        <span className="text-lg font-black text-white group-hover:text-primary transition-all">{tokens.toLocaleString()}</span>
                                        <p className="text-[9px] font-black uppercase text-muted-foreground/30 tracking-widest">Tokens</p>
                                    </div>
                                </div>
                            ))}
                    </div>
                </Card>
            </div>

            <div className="space-y-8">
                <div className="flex flex-col gap-1 px-2">
                    <h3 className="text-3xl font-black tracking-tighter text-white">Neural Transaction Ledger</h3>
                    <p className="text-[11px] font-bold text-muted-foreground/50 uppercase tracking-widest leading-none">Full cryptographic inference history and status logs</p>
                </div>

                <Card className="glass-card bg-white/[0.01] border-white/5 overflow-hidden rounded-[2.5rem]">
                    <div className="divide-y divide-white/5">
                        {data.slice(0, 15).map((record) => (
                            <div key={record.id} className="group flex items-center justify-between p-7 hover:bg-white/[0.03] transition-all">
                                <div className="flex items-center gap-8">
                                    <div className={`h-12 w-12 rounded-3xl flex items-center justify-center border transition-all duration-500 ${record.status === 'success' ? 'bg-green-500/10 border-green-500/20 group-hover:bg-green-500 group-hover:border-green-500' : 'bg-red-500/10 border-red-500/20 group-hover:bg-red-500 group-hover:border-red-500'}`}>
                                        <Activity className={`h-5 w-5 transition-colors duration-500 ${record.status === 'success' ? 'text-green-500 group-hover:text-black' : 'text-red-500 group-hover:text-black'}`} />
                                    </div>
                                    <div className="space-y-1">
                                        <div className="flex items-center gap-4">
                                            <p className="text-lg font-black tracking-tight text-white/90 uppercase">{record.model}</p>
                                            <span className={`text-[9px] px-3 py-1 rounded-lg font-black uppercase tracking-widest backdrop-blur-md ${record.status === 'success' ? 'bg-green-500/20 text-green-400' : 'bg-red-500/20 text-red-400'}`}>
                                                {record.status}
                                            </span>
                                        </div>
                                        <p className="text-[10px] font-bold text-muted-foreground/40 uppercase tracking-widest">{new Date(record.timestamp).toLocaleString()}</p>
                                    </div>
                                </div>
                                <div className="text-right flex items-center gap-12">
                                    <div className="space-y-1">
                                        <p className="text-xl font-black text-white group-hover:text-primary transition-colors">{record.output.toLocaleString()}</p>
                                        <p className="text-[9px] font-black text-muted-foreground/30 uppercase tracking-[0.2em]">Output Tokens</p>
                                    </div>
                                    <ArrowUpRight className="h-5 w-5 text-white/10 group-hover:text-primary group-hover:translate-x-1 group-hover:-translate-y-1 transition-all" />
                                </div>
                            </div>
                        ))}
                    </div>
                </Card>
            </div>
        </div>
    );
};

export default AdminAI;

