import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from '@/components/ui/use-toast';
import { ShieldAlert, Lock, Mail, Loader2, ArrowRight } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { useNavigate } from 'react-router-dom';
import { API_BASE_URL } from '@/utils/api';

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
        // Normalize email for case-insensitive production checks
        const normalizedEmail = email.trim().toLowerCase();
        try {
            await loginWithPassword(normalizedEmail, password);
            // Force adjustment for cookie latency or state updates
            setTimeout(() => {
                navigate('/admin/dashboard');
            }, 100);
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
            await fetch(`${API_BASE_URL}/auth/admin/reset-password-request`, {
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
            const res = await fetch(`${API_BASE_URL}/auth/admin/reset-password-confirm`, {
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
            const res = await fetch(`${API_BASE_URL}/auth/admin/change-password`, {
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
        <div className="min-h-screen flex items-center justify-center p-4 bg-background transition-colors duration-500">
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_40%,rgba(0,255,242,0.05)_0%,transparent_60%)]" />
            <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.01)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.01)_1px,transparent_1px)] bg-[size:100px_100px] [mask-image:radial-gradient(ellipse_at_center,black,transparent_80%)]" />

            <Card className="glass-card bg-card backdrop-blur-3xl border-border/10 w-full max-w-md rounded-[3rem] shadow-[0_0_100px_rgba(0,0,0,0.8)] relative overflow-hidden p-2">
                <div className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-primary/50 to-transparent" />

                <CardHeader className="text-center space-y-8 pt-14 pb-12">
                    <div className="mx-auto p-1 bg-gradient-to-br from-primary via-accent to-primary rounded-[2rem] w-32 h-32 border border-primary/20 animate-float glow-primary-sm relative group overflow-hidden">
                        <div className="absolute inset-0 bg-primary/20 rounded-[2rem] blur-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-1000" />
                        <div className="w-full h-full bg-card rounded-[1.8rem] flex items-center justify-center overflow-hidden border border-border/10 relative z-10">
                            <img src="/admin/logo.png" className="w-full h-full object-cover animate-pulse-soft" alt="Gene Forge Logo" />
                        </div>
                    </div>
                    <div className="space-y-3">
                        <CardTitle className="text-3xl font-black tracking-tighter uppercase italic text-foreground leading-none">
                            Secure <span className="text-gradient not-italic">Uplink</span>
                        </CardTitle>
                        <CardDescription className="text-[11px] uppercase tracking-[0.5em] font-black text-primary/60">
                            Command Terminal // 0xGF
                        </CardDescription>
                    </div>
                </CardHeader>

                <CardContent className="px-8 pb-14 space-y-8">
                    {view === 'login' && (
                        <form onSubmit={handleLogin} className="space-y-10 animate-in fade-in zoom-in-95 duration-700">
                            <div className="space-y-4">
                                <Label className="text-[10px] font-black uppercase tracking-[0.4em] text-muted-foreground/40 ml-1">Personnel ID</Label>
                                <div className="relative group">
                                    <Mail className="absolute left-5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground/30 group-focus-within:text-primary transition-all duration-500" />
                                    <Input
                                        type="email"
                                        placeholder="terminal@geneforge.ai"
                                        className="pl-14 h-15 bg-white/[0.03] border-white/5 focus:bg-white/[0.05] focus:border-primary/30 transition-all font-bold rounded-2xl text-white placeholder:text-muted-foreground/20"
                                        value={email}
                                        onChange={e => setEmail(e.target.value)}
                                        required
                                    />
                                </div>
                            </div>
                            <div className="space-y-4">
                                <div className="flex justify-between items-center px-1">
                                    <Label className="text-[10px] font-black uppercase tracking-[0.4em] text-muted-foreground/40 ml-1">Access Passkey</Label>
                                    <div className="flex gap-6">
                                        <span
                                            onClick={() => setView('reset-request')}
                                            className="text-[10px] font-black uppercase tracking-[0.2em] text-primary/40 cursor-pointer hover:text-primary transition-all underline-offset-4 hover:underline"
                                        >
                                            Reset
                                        </span>
                                        <span
                                            onClick={() => setView('change-password')}
                                            className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground/30 cursor-pointer hover:text-white transition-all underline-offset-4 hover:underline"
                                        >
                                            Rotate
                                        </span>
                                    </div>
                                </div>
                                <div className="relative group">
                                    <Lock className="absolute left-5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground/30 group-focus-within:text-primary transition-all duration-500" />
                                    <Input
                                        type="password"
                                        placeholder="••••••••••••"
                                        className="pl-14 h-15 bg-white/[0.03] border-white/5 focus:bg-white/[0.05] focus:border-primary/30 transition-all font-bold rounded-2xl text-white placeholder:text-muted-foreground/20"
                                        value={password}
                                        onChange={e => setPassword(e.target.value)}
                                        required
                                    />
                                </div>
                            </div>
                            <Button type="submit" className="w-full h-16 font-black uppercase tracking-[0.4em] text-[11px] bg-primary text-black hover:brightness-110 shadow-2xl shadow-primary/20 transition-all active:scale-[0.98] rounded-2xl border-none" disabled={loading}>
                                {loading ? (
                                    <Loader2 className="h-5 w-5 animate-spin" />
                                ) : (
                                    <>
                                        Establish Connection
                                        <ArrowRight className="ml-4 h-4 w-4" />
                                    </>
                                )}
                            </Button>
                        </form>
                    )}

                    {view === 'reset-request' && (
                        <form onSubmit={handleResetRequest} className="space-y-10 animate-in fade-in slide-in-from-right-6 duration-700">
                            <div className="p-6 bg-primary/10 rounded-2xl border border-primary/10">
                                <p className="text-[10px] font-bold text-muted-foreground/60 leading-relaxed uppercase tracking-[0.3em]">Initiate authorized emergency recovery protocol for administrative nodes.</p>
                            </div>
                            <div className="space-y-4">
                                <Label className="text-[10px] font-black uppercase tracking-[0.4em] text-muted-foreground/40 ml-1">Terminal Registry Email</Label>
                                <Input
                                    type="email"
                                    placeholder="terminal@geneforge.ai"
                                    className="h-15 bg-white/[0.03] border-white/5 focus:bg-white/[0.05] rounded-2xl font-bold px-6 text-white"
                                    value={email}
                                    onChange={e => setEmail(e.target.value)}
                                    required
                                />
                            </div>
                            <div className="space-y-4 pt-2">
                                <Button type="submit" className="w-full h-16 font-black uppercase tracking-[0.3em] text-[11px] bg-white text-black hover:bg-white/90 rounded-2xl" disabled={loading}>
                                    {loading ? <Loader2 className="animate-spin h-5 w-5" /> : "Transmit Recovery Link"}
                                </Button>
                                <Button variant="ghost" className="w-full text-[10px] font-black uppercase tracking-[0.3em] text-muted-foreground/40 hover:text-white" onClick={() => setView('login')}>Abort Protocol</Button>
                            </div>
                        </form>
                    )}

                    {view === 'reset-confirm' && (
                        <form onSubmit={handleResetConfirm} className="space-y-10 animate-in fade-in slide-in-from-right-6 duration-700">
                            <div className="space-y-4">
                                <Label className="text-[10px] font-black uppercase tracking-[0.4em] text-muted-foreground/40 ml-1">Encrypted OTP</Label>
                                <Input
                                    placeholder="XXXXXX"
                                    className="h-16 bg-white/[0.05] border-primary/30 text-center text-2xl tracking-[0.8em] font-black rounded-2xl text-primary"
                                    value={resetCode}
                                    onChange={e => setResetCode(e.target.value)}
                                    required
                                />
                            </div>
                            <div className="space-y-4">
                                <Label className="text-[10px] font-black uppercase tracking-[0.4em] text-muted-foreground/40 ml-1">New Terminal Passkey</Label>
                                <Input
                                    type="password"
                                    placeholder="••••••••••••"
                                    className="h-16 bg-white/[0.03] border-white/5 rounded-2xl px-6 text-white"
                                    value={newPassword}
                                    onChange={e => setNewPassword(e.target.value)}
                                    required
                                />
                            </div>
                            <Button type="submit" className="w-full h-16 font-black uppercase tracking-[0.3em] text-[11px] bg-primary text-black rounded-2xl shadow-xl shadow-primary/20" disabled={loading}>
                                {loading ? <Loader2 className="animate-spin h-5 w-5" /> : "Override Access Logic"}
                            </Button>
                        </form>
                    )}

                    {view === 'change-password' && (
                        <form onSubmit={handleChangePassword} className="space-y-8 animate-in fade-in slide-in-from-right-6 duration-700">
                            <div className="space-y-4">
                                <Label className="text-[10px] font-black uppercase tracking-[0.4em] text-muted-foreground/40 ml-1">Terminal ID</Label>
                                <Input
                                    type="email"
                                    className="h-14 bg-white/[0.03] border-white/5 rounded-2xl px-6 text-white"
                                    value={email}
                                    onChange={e => setEmail(e.target.value)}
                                    required
                                />
                            </div>
                            <div className="space-y-4">
                                <Label className="text-[10px] font-black uppercase tracking-[0.4em] text-muted-foreground/40 ml-1">Legacy Passkey</Label>
                                <Input
                                    type="password"
                                    className="h-14 bg-white/[0.03] border-white/5 rounded-2xl px-6 text-white"
                                    value={password}
                                    onChange={e => setPassword(e.target.value)}
                                    required
                                />
                            </div>
                            <div className="space-y-4">
                                <Label className="text-[10px] font-black uppercase tracking-[0.4em] text-muted-foreground/40 ml-1">New Passkey Logic</Label>
                                <Input
                                    type="password"
                                    className="h-14 bg-white/[0.03] border-white/5 rounded-2xl px-6 text-white"
                                    value={newPassword}
                                    onChange={e => setNewPassword(e.target.value)}
                                    required
                                />
                            </div>
                            <div className="space-y-4 pt-4">
                                <Button type="submit" className="w-full h-16 font-black uppercase tracking-[0.3em] text-[11px] bg-white text-black rounded-2xl" disabled={loading}>
                                    {loading ? <Loader2 className="animate-spin h-5 w-5" /> : "Reconfigure Node Authorization"}
                                </Button>
                                <Button variant="ghost" className="w-full text-[10px] font-black uppercase tracking-[0.3em] text-muted-foreground/40 hover:text-white" onClick={() => setView('login')}>Return To Terminal</Button>
                            </div>
                        </form>
                    )}
                </CardContent>
            </Card>
        </div>
    );
};

export default AdminLogin;

