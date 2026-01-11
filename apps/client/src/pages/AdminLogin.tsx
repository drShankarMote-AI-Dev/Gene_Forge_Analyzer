import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from '@/components/ui/use-toast';
import { ShieldAlert, Lock, Mail, Loader2, ArrowRight } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { useNavigate } from 'react-router-dom';

const AdminLogin = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [view, setView] = useState<'login' | 'reset-request' | 'reset-confirm' | 'change-password'>('login');
    const [resetCode, setResetCode] = useState('');
    const [newPassword, setNewPassword] = useState('');

    const { loginWithPassword, isAuthenticated, user, isLoading: authLoading } = useAuth();
    const navigate = useNavigate();

    React.useEffect(() => {
        if (!authLoading && isAuthenticated && user?.role === 'admin') {
            navigate('/admin/dashboard');
        }
    }, [authLoading, isAuthenticated, user, navigate]);

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        try {
            await loginWithPassword(email, password);
            navigate('/admin/dashboard');
        } catch {
            // Toast already handled in hook
        } finally {
            setLoading(false);
        }
    };

    const handleResetRequest = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        try {
            const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';
            await fetch(`${API_URL}/auth/admin/reset-password-request`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email })
            });
            toast({ title: "Request Sent", description: "If the email is valid, a code has been sent." });
            setView('reset-confirm');
        } catch {
            toast({ title: "Error", description: "Failed to send reset code", variant: "destructive" });
        } finally {
            setLoading(false);
        }
    };

    const handleResetConfirm = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        try {
            const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';
            const res = await fetch(`${API_URL}/auth/admin/reset-password-confirm`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email, code: resetCode, new_password: newPassword })
            });
            if (res.ok) {
                toast({ title: "Success", description: "Password updated. Please login." });
                setView('login');
            } else {
                toast({ title: "Failed", description: "Invalid code or request.", variant: "destructive" });
            }
        } catch {
            toast({ title: "Error", description: "Failed to reset password", variant: "destructive" });
        } finally {
            setLoading(false);
        }
    };

    const handleChangePassword = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        try {
            const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';
            const res = await fetch(`${API_URL}/auth/admin/change-password`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email, old_password: password, new_password: newPassword })
            });
            if (res.ok) {
                toast({ title: "Success", description: "Password updated. Please login." });
                setView('login');
            } else {
                toast({ title: "Failed", description: "Invalid old password or credentials.", variant: "destructive" });
            }
        } catch {
            toast({ title: "Error", description: "Failed to change password", variant: "destructive" });
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center p-4 bg-zinc-950">
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(var(--primary),0.05)_0%,transparent_50%)]" />

            <Card className="glass-card stat-glow admin-card-gradient w-full max-w-md border-primary/20 shadow-[0_0_50px_rgba(0,0,0,0.5)] relative overflow-hidden">
                <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-primary to-transparent opacity-50" />

                <CardHeader className="text-center space-y-6 pt-10">
                    <div className="mx-auto p-5 bg-primary/10 rounded-2xl w-fit border border-primary/20 animate-float">
                        <ShieldAlert className="h-10 w-10 text-primary drop-shadow-[0_0_8px_rgba(var(--primary),0.5)]" />
                    </div>
                    <div>
                        <CardTitle className="text-3xl font-black tracking-tighter uppercase italic">Secure <span className="text-primary not-italic">Access</span></CardTitle>
                        <CardDescription className="text-[10px] uppercase tracking-[0.3em] font-black text-muted-foreground mt-2">
                            Administrative Terminal • Gene Forge
                        </CardDescription>
                    </div>
                </CardHeader>

                <CardContent className="pb-10">
                    {view === 'login' && (
                        <form onSubmit={handleLogin} className="space-y-6 animate-in fade-in zoom-in-95 duration-500">
                            <div className="space-y-3">
                                <Label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground ml-1">Terminal ID (Email)</Label>
                                <div className="relative group">
                                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground group-focus-within:text-primary transition-colors" />
                                    <Input
                                        type="email"
                                        placeholder="admin@geneforge.com"
                                        className="pl-10 h-12 bg-black/40 border-white/5 focus:border-primary/50 transition-all font-bold"
                                        value={email}
                                        onChange={e => setEmail(e.target.value)}
                                        required
                                    />
                                </div>
                            </div>
                            <div className="space-y-3">
                                <div className="flex justify-between items-center px-1">
                                    <Label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground ml-1">Passkey</Label>
                                    <div className="flex gap-4">
                                        <span
                                            onClick={() => setView('reset-request')}
                                            className="text-[10px] font-black uppercase tracking-[0.2em] text-primary/60 cursor-pointer hover:text-primary transition-colors"
                                        >
                                            Recovery
                                        </span>
                                        <span
                                            onClick={() => setView('change-password')}
                                            className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground/60 cursor-pointer hover:text-white transition-colors"
                                        >
                                            Rotate
                                        </span>
                                    </div>
                                </div>
                                <div className="relative group">
                                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground group-focus-within:text-primary transition-colors" />
                                    <Input
                                        type="password"
                                        placeholder="••••••••••••"
                                        className="pl-10 h-12 bg-black/40 border-white/5 focus:border-primary/50 transition-all font-bold"
                                        value={password}
                                        onChange={e => setPassword(e.target.value)}
                                        required
                                    />
                                </div>
                            </div>
                            <Button type="submit" className="w-full h-12 font-black uppercase tracking-[0.3em] text-[10px] bg-primary hover:bg-primary/90 shadow-[0_4px_20px_rgba(var(--primary),0.3)] transition-all active:scale-[0.98]" disabled={loading}>
                                {loading ? (
                                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                ) : (
                                    <>
                                        Establish Connection
                                        <ArrowRight className="ml-2 h-4 w-4" />
                                    </>
                                )}
                            </Button>
                        </form>
                    )}

                    {view === 'reset-request' && (
                        <form onSubmit={handleResetRequest} className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-500">
                            <div className="p-4 bg-primary/5 rounded-xl border border-primary/10">
                                <p className="text-[10px] font-bold text-muted-foreground leading-relaxed uppercase tracking-widest">Provide verified administrative credentials to initiate an emergency passkey recovery protocol.</p>
                            </div>
                            <div className="space-y-3">
                                <Label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Verification Email</Label>
                                <Input
                                    type="email"
                                    placeholder="admin@geneforge.com"
                                    className="h-12 bg-black/40 border-white/5 focus:border-primary/50"
                                    value={email}
                                    onChange={e => setEmail(e.target.value)}
                                    required
                                />
                            </div>
                            <Button type="submit" className="w-full h-12 font-black uppercase tracking-widest text-[10px]" disabled={loading}>
                                {loading ? <Loader2 className="animate-spin h-5 w-5" /> : "Request Secure OTP"}
                            </Button>
                            <Button variant="ghost" className="w-full text-[10px] font-black uppercase tracking-widest" onClick={() => setView('login')}>Abort Recovery</Button>
                        </form>
                    )}

                    {view === 'reset-confirm' && (
                        <form onSubmit={handleResetConfirm} className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-500">
                            <div className="space-y-3">
                                <Label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Received OTP</Label>
                                <Input
                                    placeholder="XXXXXX"
                                    className="h-12 bg-black/40 border-primary/20 text-center text-xl tracking-[0.5em] font-black"
                                    value={resetCode}
                                    onChange={e => setResetCode(e.target.value)}
                                    required
                                />
                            </div>
                            <div className="space-y-3">
                                <Label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">New Passkey</Label>
                                <Input
                                    type="password"
                                    className="h-12 bg-black/40 border-white/5"
                                    value={newPassword}
                                    onChange={e => setNewPassword(e.target.value)}
                                    required
                                />
                            </div>
                            <Button type="submit" className="w-full h-12 font-black uppercase tracking-widest text-[10px]" disabled={loading}>
                                {loading ? <Loader2 className="animate-spin h-5 w-5" /> : "Override Access Keys"}
                            </Button>
                        </form>
                    )}

                    {view === 'change-password' && (
                        <form onSubmit={handleChangePassword} className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-500">
                            <div className="space-y-3">
                                <Label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Credential ID</Label>
                                <Input
                                    type="email"
                                    className="h-12 bg-black/40 border-white/5"
                                    value={email}
                                    onChange={e => setEmail(e.target.value)}
                                    required
                                />
                            </div>
                            <div className="space-y-3">
                                <Label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Current Passkey</Label>
                                <Input
                                    type="password"
                                    className="h-12 bg-black/40 border-white/5"
                                    value={password}
                                    onChange={e => setPassword(e.target.value)}
                                    required
                                />
                            </div>
                            <div className="space-y-3">
                                <Label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">New Passkey</Label>
                                <Input
                                    type="password"
                                    className="h-12 bg-black/40 border-white/5"
                                    value={newPassword}
                                    onChange={e => setNewPassword(e.target.value)}
                                    required
                                />
                            </div>
                            <Button type="submit" className="w-full h-12 font-black uppercase tracking-widest text-[10px]" disabled={loading}>
                                {loading ? <Loader2 className="animate-spin h-5 w-5" /> : "Update Access Logic"}
                            </Button>
                            <Button variant="ghost" className="w-full text-[10px] font-black uppercase tracking-widest" onClick={() => setView('login')}>Return to Terminal</Button>
                        </form>
                    )}
                </CardContent>
            </Card>
        </div>
    );
};

export default AdminLogin;

