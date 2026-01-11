import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { useAuth } from "@/hooks/useAuth";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { Loader2, Activity, Database, ArrowUpRight, Cpu } from 'lucide-react';
import { toast } from '@/components/ui/use-toast';

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
            const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';
            const res = await fetch(`${API_URL}/ai/usage`, { credentials: 'include' });
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
        <div className="space-y-10">
            <header className="flex flex-col gap-2">
                <div className="flex items-center gap-4">
                    <div className="p-3 bg-primary/10 rounded-2xl">
                        <Cpu className="h-6 w-6 text-primary" />
                    </div>
                    <div>
                        <h1 className="text-4xl font-black tracking-tighter">AI Gateway <span className="text-primary italic">Telemetry</span></h1>
                        <p className="text-muted-foreground font-medium text-sm italic">Real-time inference tracking & usage analytics</p>
                    </div>
                </div>
            </header>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <Card className="glass-card stat-glow admin-card-gradient border-none overflow-hidden">
                    <CardHeader className="pb-2">
                        <CardTitle className="text-[10px] font-black uppercase tracking-widest text-muted-foreground font-mono">Total Inferences</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="text-5xl font-black tracking-tighter">{totalRequests.toLocaleString()}</div>
                        <p className="text-[10px] font-bold text-primary mt-4 uppercase tracking-widest">Lifetime API Calls</p>
                    </CardContent>
                </Card>
                <Card className="glass-card stat-glow admin-card-gradient border-none overflow-hidden">
                    <CardHeader className="pb-2">
                        <CardTitle className="text-[10px] font-black uppercase tracking-widest text-muted-foreground font-mono">Token Output</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="text-5xl font-black tracking-tighter">{totalTokens.toLocaleString()}</div>
                        <p className="text-[10px] font-bold text-accent mt-4 uppercase tracking-widest">Generated Tokens</p>
                    </CardContent>
                </Card>
                <Card className="glass-card stat-glow border-none overflow-hidden bg-green-500/5">
                    <CardHeader className="pb-2">
                        <CardTitle className="text-[10px] font-black uppercase tracking-widest text-green-500 font-mono">System Health</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="text-5xl font-black tracking-tighter text-green-500">99.9%</div>
                        <p className="text-[10px] font-bold text-green-600/50 mt-4 uppercase tracking-widest flex items-center gap-2">
                            <div className="h-2 w-2 rounded-full bg-green-500 animate-pulse" />
                            Uptime Nominal
                        </p>
                    </CardContent>
                </Card>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <Card className="glass-card border-white/5 relative overflow-hidden">
                    <CardHeader>
                        <CardTitle className="flex items-center gap-3 text-xl font-black tracking-tight">
                            <Activity className="h-5 w-5 text-primary" />
                            Load Distribution
                        </CardTitle>
                        <CardDescription className="text-[10px] font-black uppercase tracking-widest opacity-50">Requests per solar cycle</CardDescription>
                    </CardHeader>
                    <CardContent className="h-[300px]">
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={barData}>
                                <defs>
                                    <linearGradient id="barGradient" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="0%" stopColor="hsl(var(--primary))" stopOpacity={0.8} />
                                        <stop offset="100%" stopColor="hsl(var(--primary))" stopOpacity={0.2} />
                                    </linearGradient>
                                </defs>
                                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="hsl(var(--muted-foreground))" opacity={0.1} />
                                <XAxis dataKey="date" fontSize={9} fontWeight="black" axisLine={false} tickLine={false} />
                                <YAxis fontSize={9} fontWeight="black" axisLine={false} tickLine={false} />
                                <Tooltip
                                    cursor={{ fill: 'rgba(255,255,255,0.05)' }}
                                    contentStyle={{ background: 'rgba(0,0,0,0.9)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '12px', color: '#fff' }}
                                />
                                <Bar dataKey="requests" fill="url(#barGradient)" radius={[6, 6, 0, 0]} barSize={40} />
                            </BarChart>
                        </ResponsiveContainer>
                    </CardContent>
                </Card>

                <Card className="glass-card border-white/5">
                    <CardHeader>
                        <CardTitle className="flex items-center gap-3 text-xl font-black tracking-tight">
                            <Database className="h-5 w-5 text-primary" />
                            Core Consumers
                        </CardTitle>
                        <CardDescription className="text-[10px] font-black uppercase tracking-widest opacity-50">Token weight per researcher</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-3 max-h-[300px] overflow-y-auto pr-2 custom-scrollbar">
                            {Object.entries(data.reduce((acc, curr) => {
                                const key = curr.user || `Node ${curr.id.toString().slice(-4)}`;
                                acc[key] = (acc[key] || 0) + curr.output;
                                return acc;
                            }, {} as Record<string, number>))
                                .sort(([, a], [, b]) => b - a)
                                .slice(0, 5)
                                .map(([email, tokens], i) => (
                                    <div key={email} className="group flex items-center justify-between p-4 rounded-xl bg-white/5 border border-transparent hover:border-primary/20 transition-all">
                                        <div className="flex items-center gap-4">
                                            <div className="h-8 w-8 rounded-lg bg-primary/10 flex items-center justify-center text-[10px] font-black text-primary border border-primary/20">
                                                0{i + 1}
                                            </div>
                                            <span className="text-xs font-bold tracking-tight">{email}</span>
                                        </div>
                                        <div className="text-right">
                                            <span className="text-xs font-black text-primary">{tokens.toLocaleString()}</span>
                                            <p className="text-[8px] font-black uppercase text-muted-foreground">Tokens</p>
                                        </div>
                                    </div>
                                ))}
                        </div>
                    </CardContent>
                </Card>
            </div>

            <Card className="glass-card border-white/5 overflow-hidden">
                <CardHeader className="bg-primary/5 border-b border-white/5">
                    <CardTitle className="flex items-center gap-3 text-xl font-black tracking-tight">
                        <Activity className="h-5 w-5 text-primary" />
                        Live Transaction Ledger
                    </CardTitle>
                </CardHeader>
                <CardContent className="p-0">
                    <div className="divide-y divide-white/5">
                        {data.slice(0, 10).map((record) => (
                            <div key={record.id} className="flex items-center justify-between p-6 hover:bg-primary/[0.02] transition-colors">
                                <div className="flex items-center gap-6">
                                    <div className={`w-3 h-3 rounded-full ${record.status === 'success' ? 'bg-green-500 shadow-[0_0_10px_rgba(34,197,94,0.5)]' : 'bg-red-500 shadow-[0_0_10px_rgba(239,44,44,0.5)]'}`} />
                                    <div>
                                        <p className="text-sm font-black tracking-tight">{record.model}</p>
                                        <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">{new Date(record.timestamp).toLocaleString()}</p>
                                    </div>
                                </div>
                                <div className="text-right flex items-center gap-8">
                                    <div>
                                        <p className="text-xs font-black">{record.output.toLocaleString()}</p>
                                        <p className="text-[9px] font-bold text-muted-foreground uppercase">Output</p>
                                    </div>
                                    <div className="hidden sm:block">
                                        <p className="text-xs font-black uppercase italic text-primary">{record.status}</p>
                                        <p className="text-[9px] font-bold text-muted-foreground uppercase">Status</p>
                                    </div>
                                    <ArrowUpRight className="h-4 w-4 text-muted-foreground opacity-20" />
                                </div>
                            </div>
                        ))}
                    </div>
                </CardContent>
            </Card>
        </div >
    );
};

export default AdminAI;

