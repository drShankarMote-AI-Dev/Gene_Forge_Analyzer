import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { useAuth } from "@/hooks/useAuth";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { Button } from "@/components/ui/button";
import { Loader2, ShieldAlert, Activity, Database, ArrowLeft } from 'lucide-react';
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

    if (loading) return <div className="flex justify-center p-20"><Loader2 className="animate-spin h-10 w-10 text-primary" /></div>;

    // Process Data
    const totalRequests = data.length;
    const totalTokens = data.reduce((acc, curr) => acc + curr.output, 0);


    // Group by Date (Last 7 days)
    const dailyUsage = data.reduce((acc, curr) => {
        const date = new Date(curr.timestamp).toLocaleDateString();
        acc[date] = (acc[date] || 0) + 1;
        return acc;
    }, {} as Record<string, number>);
    const barData = Object.keys(dailyUsage).map(key => ({ date: key, requests: dailyUsage[key] })).slice(-7);

    return (
        <div className="container mx-auto p-6 space-y-8 animate-in fade-in duration-500">
            <div className="flex items-center justify-between">
                <div>
                    <Button
                        variant="ghost"
                        size="sm"
                        className="mb-2 pl-0 text-muted-foreground hover:text-primary"
                        onClick={() => navigate('/admin/dashboard')}
                    >
                        <ArrowLeft className="mr-2 h-4 w-4" /> Back to Dashboard
                    </Button>
                    <h1 className="text-3xl font-black tracking-tighter">AI Gateway <span className="text-primary">Admin</span></h1>
                    <p className="text-muted-foreground uppercase tracking-widest text-xs font-bold mt-2">
                        Neural Network Telemetry & Cost Monitoring
                    </p>
                </div>
                <div className="p-3 bg-primary/10 rounded-full">
                    <ShieldAlert className="h-6 w-6 text-primary" />
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <Card className="glass-card border-l-4 border-l-blue-500">
                    <CardHeader className="pb-2">
                        <CardTitle className="text-sm font-medium text-muted-foreground uppercase tracking-widest">Total Inferences</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="text-4xl font-black">{totalRequests}</div>
                        <p className="text-xs text-muted-foreground mt-1">Lifetime API Calls</p>
                    </CardContent>
                </Card>
                <Card className="glass-card border-l-4 border-l-purple-500">
                    <CardHeader className="pb-2">
                        <CardTitle className="text-sm font-medium text-muted-foreground uppercase tracking-widest">Token Output</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="text-4xl font-black">{totalTokens.toLocaleString()}</div>
                        <p className="text-xs text-muted-foreground mt-1">Generated Tokens</p>
                    </CardContent>
                </Card>
                <Card className="glass-card border-l-4 border-l-green-500">
                    <CardHeader className="pb-2">
                        <CardTitle className="text-sm font-medium text-muted-foreground uppercase tracking-widest">System Health</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="text-4xl font-black text-green-500">99.9%</div>
                        <p className="text-xs text-muted-foreground mt-1">Uptime (Fallback Active)</p>
                    </CardContent>
                </Card>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <Card className="glass-card">
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <Activity className="h-5 w-5 text-primary" />
                            Daily Request Volume
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="h-[300px]">
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={barData}>
                                <CartesianGrid strokeDasharray="3 3" opacity={0.1} />
                                <XAxis dataKey="date" fontSize={10} />
                                <YAxis fontSize={10} />
                                <Tooltip
                                    contentStyle={{ background: 'rgba(0,0,0,0.8)', border: 'none', borderRadius: '8px', color: '#fff' }}
                                />
                                <Bar dataKey="requests" fill="#3b82f6" radius={[4, 4, 0, 0]} />
                            </BarChart>
                        </ResponsiveContainer>
                    </CardContent>
                </Card>

                <Card className="glass-card">
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <Database className="h-5 w-5 text-primary" />
                            Top Users by Consumption
                        </CardTitle>
                        <CardDescription>Token Usage per Researcher</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-4 max-h-[300px] overflow-y-auto pr-2">
                            {Object.entries(data.reduce((acc, curr) => {
                                // Default to 'Unknown' if valid user but no email, or id
                                const key = curr.user || `User ${curr.id}`;
                                acc[key] = (acc[key] || 0) + curr.output;
                                return acc;
                            }, {} as Record<string, number>))
                                .sort(([, a], [, b]) => b - a)
                                .slice(0, 5)
                                .map(([email, tokens], i) => (
                                    <div key={email} className="flex items-center justify-between p-3 rounded-lg bg-muted/10 border border-white/5">
                                        <div className="flex items-center gap-3">
                                            <div className="h-6 w-6 rounded-full bg-primary/20 flex items-center justify-center text-[10px] font-bold text-primary">
                                                {i + 1}
                                            </div>
                                            <span className="text-xs font-medium">{email}</span>
                                        </div>
                                        <span className="text-xs font-bold text-muted-foreground">{tokens.toLocaleString()} toks</span>
                                    </div>
                                ))}
                        </div>
                    </CardContent>
                </Card>
            </div>

            <Card className="glass-card">
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        <Database className="h-5 w-5 text-primary" />
                        Recent Transaction Logs
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="space-y-4">
                        {data.slice(0, 5).map((record) => (
                            <div key={record.id} className="flex items-center justify-between p-4 rounded-xl bg-muted/20 border border-white/5">
                                <div className="flex items-center gap-4">
                                    <div className={`w-2 h-2 rounded-full ${record.status === 'success' ? 'bg-green-500' : 'bg-red-500'}`} />
                                    <div>
                                        <p className="text-sm font-bold">{record.model}</p>
                                        <p className="text-[10px] text-muted-foreground">{new Date(record.timestamp).toLocaleString()}</p>
                                    </div>
                                </div>
                                <div className="text-right">
                                    <p className="text-xs font-bold">{record.output} tokens</p>
                                    <p className="text-[10px] text-muted-foreground uppercase">{record.status}</p>
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
