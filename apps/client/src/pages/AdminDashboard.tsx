import React, { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/hooks/useAuth";
import { useNavigate } from 'react-router-dom';
import { ShieldAlert, Users, FolderKanban, Cpu, LogOut, Lock } from 'lucide-react';

interface AuditLog {
    id: number;
    action: string;
    details: string;
    ip: string;
    timestamp: string;
    user_email: string;
}

const AdminDashboard = () => {
    const { user, isAuthenticated, isLoading: authLoading, logout } = useAuth();
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

    const handleLogout = async () => {
        await logout();
        navigate('/admin/login');
    };

    if (authLoading || loading) return <div className="p-20 text-center">Loading Admin Panel...</div>;

    return (
        <div className="container mx-auto p-6 space-y-8 animate-in fade-in">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-black tracking-tighter">Admin <span className="text-primary">Control Center</span></h1>
                    <p className="text-muted-foreground uppercase tracking-widest text-xs font-bold mt-2">
                        System Overview & Security
                    </p>
                </div>
                <div className="flex gap-4">
                    <Button variant="outline" onClick={() => navigate('/admin/ai')}>
                        <Cpu className="mr-2 h-4 w-4" /> AI Monitor
                    </Button>
                    <Button variant="destructive" onClick={handleLogout}>
                        <LogOut className="mr-2 h-4 w-4" /> Logout
                    </Button>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <Card className="glass-card border-l-4 border-l-primary">
                    <CardHeader className="pb-2">
                        <CardTitle className="text-sm font-medium text-muted-foreground uppercase tracking-widest">Total Users</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="text-4xl font-black">{stats.users}</div>
                        <div className="text-xs text-muted-foreground mt-1 flex items-center">
                            <Users className="h-3 w-3 mr-1" /> Registered Accounts
                        </div>
                    </CardContent>
                </Card>

                <Card className="glass-card border-l-4 border-l-blue-500">
                    <CardHeader className="pb-2">
                        <CardTitle className="text-sm font-medium text-muted-foreground uppercase tracking-widest">Active Projects</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="text-4xl font-black">{stats.projects}</div>
                        <div className="text-xs text-muted-foreground mt-1 flex items-center">
                            <FolderKanban className="h-3 w-3 mr-1" /> Research Initiatives
                        </div>
                    </CardContent>
                </Card>

                <Card className="glass-card hover:bg-muted/5 cursor-pointer transition-colors" onClick={() => navigate('/admin/ai')}>
                    <CardHeader className="pb-2">
                        <CardTitle className="text-sm font-medium text-muted-foreground uppercase tracking-widest text-primary">AI Gateway</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="text-lg font-bold">Health Monitor</div>
                        <div className="text-xs text-muted-foreground mt-1 flex items-center">
                            <Cpu className="h-3 w-3 mr-1" /> View Usage & Costs
                        </div>
                    </CardContent>
                </Card>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <Card className="glass-card lg:col-span-2">
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <ShieldAlert className="h-5 w-5 text-primary" />
                            Recent Security Audit Logs
                        </CardTitle>
                        <CardDescription>Real-time system activity tracking</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-4">
                            {stats.logs.map((log) => (
                                <div key={log.id} className="flex items-start justify-between p-3 rounded-lg bg-muted/10 border border-white/5 text-sm">
                                    <div>
                                        <div className="font-bold flex items-center gap-2">
                                            {log.action}
                                            <span className="text-[10px] bg-primary/10 text-primary px-2 py-0.5 rounded-full capitalize">
                                                {log.user_email.split('@')[0]}
                                            </span>
                                        </div>
                                        <p className="text-muted-foreground text-xs mt-1">{log.details || "No details provided"}</p>
                                    </div>
                                    <div className="text-right">
                                        <div className="text-xs font-mono opacity-50">{log.ip}</div>
                                        <div className="text-[10px] text-muted-foreground">
                                            {new Date(log.timestamp).toLocaleTimeString()}
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </CardContent>
                </Card>

                <Card className="glass-card">
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <Lock className="h-5 w-5 text-primary" />
                            Security Quick Links
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <Button variant="outline" className="w-full justify-start" onClick={() => navigate('/security')}>
                            <ShieldAlert className="mr-2 h-4 w-4" /> Compliance Policy
                        </Button>
                        <Button variant="ghost" className="w-full justify-start text-muted-foreground" disabled>
                            <Users className="mr-2 h-4 w-4" /> User Management (Soon)
                        </Button>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
};

export default AdminDashboard;
