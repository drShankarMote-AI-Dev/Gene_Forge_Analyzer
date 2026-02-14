import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from '@/components/ui/use-toast';
import { Lock, Mail, Loader2, ArrowRight } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { useNavigate } from 'react-router-dom';
import { apiFetch } from '@/utils/api';

const AdminLogin = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [view, setView] = useState<'login' | 'reset-request' | 'reset-confirm' | 'change-password'>('login');
    const [resetCode, setResetCode] = useState('');
    const [newPassword, setNewPassword] = useState('');

    // Detect admin theme if it exists in localStorage
    const [adminTheme] = useState(() => localStorage.getItem('admin-theme') || 'admin-dark');
    const isDark = adminTheme === 'admin-dark';

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
            await apiFetch('/auth/admin/reset-password-request', {
                method: 'POST',
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
            await apiFetch('/auth/admin/reset-password-confirm', {
                method: 'POST',
                body: JSON.stringify({ email, code: resetCode, new_password: newPassword })
            });
            toast({ title: "Success", description: "Password updated. Please login." });
            setView('login');
        } catch (err: unknown) {
            toast({ title: "Error", description: err instanceof Error ? err.message : "Failed to reset password", variant: "destructive" });
        } finally {
            setLoading(false);
        }
    };

    const handleChangePassword = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        try {
            await apiFetch('/auth/admin/change-password', {
                method: 'POST',
                body: JSON.stringify({ email, old_password: password, new_password: newPassword })
            });
            toast({ title: "Success", description: "Password updated. Please login." });
            setView('login');
        } catch (err: unknown) {
            toast({ title: "Error", description: err instanceof Error ? err.message : "Failed to change password", variant: "destructive" });
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className={`min-h-screen flex items-center justify-center p-4 transition-colors duration-700 ${isDark ? 'bg-zinc-950' : 'bg-slate-50'}`}>
            <div className={`fixed inset-0 pointer-events-none transition-opacity duration-1000 ${isDark ? 'opacity-100' : 'opacity-20'}`}>
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_40%,rgba(0,255,242,0.05)_0%,transparent_60%)]" />
                <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.01)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.01)_1px,transparent_1px)] bg-[size:100px_100px] [mask-image:radial-gradient(ellipse_at_center,black,transparent_80%)]" />
            </div>

            <Card className={`glass-card backdrop-blur-3xl w-full max-w-md rounded-[3rem] shadow-2xl relative overflow-hidden p-2 border transition-all duration-500 ${isDark ? 'bg-zinc-900/40 border-white/5 shadow-black/50' : 'bg-white/90 border-black/5 shadow-slate-200/50'}`}>
                <div className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-primary/50 to-transparent" />

                <CardHeader className="text-center space-y-8 pt-14 pb-12">
                    <div className={`mx-auto p-1 bg-gradient-to-br from-primary via-accent to-primary rounded-[2rem] w-32 h-32 border border-primary/20 animate-float glow-primary-sm relative group overflow-hidden`}>
                        <div className="absolute inset-0 bg-primary/20 rounded-[2rem] blur-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-1000" />
                        <div className={`w-full h-full rounded-[1.8rem] flex items-center justify-center overflow-hidden border border-border/10 relative z-10 transition-colors ${isDark ? 'bg-zinc-900' : 'bg-slate-50'}`}>
                            <img src="/admin/logo.png" className={`w-full h-full object-cover transition-all ${isDark ? 'brightness-125' : 'brightness-100 contrast-125'}`} alt="Gene Forge Logo" />
                        </div>
                    </div>
                    <div className="space-y-3">
                        <CardTitle className={`text-3xl font-black tracking-tighter uppercase italic leading-none transition-colors ${isDark ? 'text-white' : 'text-slate-900'}`}>
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
                                    <Mail className={`absolute left-5 top-1/2 -translate-y-1/2 h-4 w-4 transition-all duration-500 ${isDark ? 'text-muted-foreground/30 group-focus-within:text-primary' : 'text-slate-400 group-focus-within:text-primary'}`} />
                                    <Input
                                        type="email"
                                        placeholder="terminal@geneforge.ai"
                                        className={`pl-14 h-15 transition-all font-bold rounded-2xl placeholder:text-muted-foreground/20 ${isDark ? 'bg-white/[0.03] border-white/5 focus:bg-white/[0.05] focus:border-primary/30 text-white' : 'bg-slate-50 border-black/5 focus:bg-white focus:border-primary/30 text-slate-900'}`}
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
                                            className={`text-[10px] font-black uppercase tracking-[0.2em] cursor-pointer transition-all underline-offset-4 hover:underline ${isDark ? 'text-muted-foreground/30 hover:text-white' : 'text-slate-400 hover:text-slate-950'}`}
                                        >
                                            Rotate
                                        </span>
                                    </div>
                                </div>
                                <div className="relative group">
                                    <Lock className={`absolute left-5 top-1/2 -translate-y-1/2 h-4 w-4 transition-all duration-500 ${isDark ? 'text-muted-foreground/30 group-focus-within:text-primary' : 'text-slate-400 group-focus-within:text-primary'}`} />
                                    <Input
                                        type="password"
                                        placeholder="••••••••••••"
                                        className={`pl-14 h-15 transition-all font-bold rounded-2xl placeholder:text-muted-foreground/20 ${isDark ? 'bg-white/[0.03] border-white/5 focus:bg-white/[0.05] focus:border-primary/30 text-white' : 'bg-slate-50 border-black/5 focus:bg-white focus:border-primary/30 text-slate-900'}`}
                                        value={password}
                                        onChange={e => setPassword(e.target.value)}
                                        required
                                    />
                                </div>
                            </div>
                            <Button type="submit" className={`w-full h-16 font-black uppercase tracking-[0.4em] text-[11px] shadow-2xl transition-all active:scale-[0.98] rounded-2xl border-none ${isDark ? 'bg-primary text-black hover:brightness-110 shadow-primary/20' : 'bg-slate-900 text-white hover:bg-slate-800 shadow-black/10'}`} disabled={loading}>
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
                            <div className={`p-6 rounded-2xl border ${isDark ? 'bg-primary/10 border-primary/10' : 'bg-primary/5 border-primary/20'}`}>
                                <p className={`text-[10px] font-bold leading-relaxed uppercase tracking-[0.3em] ${isDark ? 'text-muted-foreground/60' : 'text-slate-600'}`}>Initiate authorized emergency recovery protocol for administrative nodes.</p>
                            </div>
                            <div className="space-y-4">
                                <Label className="text-[10px] font-black uppercase tracking-[0.4em] text-muted-foreground/40 ml-1">Terminal Registry Email</Label>
                                <Input
                                    type="email"
                                    placeholder="terminal@geneforge.ai"
                                    className={`h-15 rounded-2xl font-bold px-6 border ${isDark ? 'bg-white/[0.03] border-white/5 focus:bg-white/[0.05] text-white' : 'bg-slate-50 border-black/5 focus:bg-white text-slate-900'}`}
                                    value={email}
                                    onChange={e => setEmail(e.target.value)}
                                    required
                                />
                            </div>
                            <div className="space-y-4 pt-2">
                                <Button type="submit" className={`w-full h-16 font-black uppercase tracking-[0.3em] text-[11px] rounded-2xl transition-all ${isDark ? 'bg-white text-black hover:bg-white/90' : 'bg-slate-900 text-white hover:bg-slate-800'}`} disabled={loading}>
                                    {loading ? <Loader2 className="animate-spin h-5 w-5" /> : "Transmit Recovery Link"}
                                </Button>
                                <Button variant="ghost" className={`w-full text-[10px] font-black uppercase tracking-[0.3em] transition-colors ${isDark ? 'text-muted-foreground/40 hover:text-white' : 'text-slate-400 hover:text-slate-900'}`} onClick={() => setView('login')}>Abort Protocol</Button>
                            </div>
                        </form>
                    )}

                    {view === 'reset-confirm' && (
                        <form onSubmit={handleResetConfirm} className="space-y-10 animate-in fade-in slide-in-from-right-6 duration-700">
                            <div className="space-y-4">
                                <Label className="text-[10px] font-black uppercase tracking-[0.4em] text-muted-foreground/40 ml-1">Encrypted OTP</Label>
                                <Input
                                    placeholder="XXXXXX"
                                    className={`h-16 border-primary/30 text-center text-2xl tracking-[0.8em] font-black rounded-2xl text-primary ${isDark ? 'bg-white/[0.05]' : 'bg-slate-50'}`}
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
                                    className={`h-16 rounded-2xl px-6 border ${isDark ? 'bg-white/[0.03] border-white/5 text-white' : 'bg-slate-50 border-black/5 text-slate-900'}`}
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
                                    className={`h-14 rounded-2xl px-6 border ${isDark ? 'bg-white/[0.03] border-white/5 text-white' : 'bg-slate-50 border-black/5 text-slate-900'}`}
                                    value={email}
                                    onChange={e => setEmail(e.target.value)}
                                    required
                                />
                            </div>
                            <div className="space-y-4">
                                <Label className="text-[10px] font-black uppercase tracking-[0.4em] text-muted-foreground/40 ml-1">Legacy Passkey</Label>
                                <Input
                                    type="password"
                                    className={`h-14 rounded-2xl px-6 border ${isDark ? 'bg-white/[0.03] border-white/5 text-white' : 'bg-slate-50 border-black/5 text-slate-900'}`}
                                    value={password}
                                    onChange={e => setPassword(e.target.value)}
                                    required
                                />
                            </div>
                            <div className="space-y-4">
                                <Label className="text-[10px] font-black uppercase tracking-[0.4em] text-muted-foreground/40 ml-1">New Passkey Logic</Label>
                                <Input
                                    type="password"
                                    className={`h-14 rounded-2xl px-6 border ${isDark ? 'bg-white/[0.03] border-white/5 text-white' : 'bg-slate-50 border-black/5 text-slate-900'}`}
                                    value={newPassword}
                                    onChange={e => setNewPassword(e.target.value)}
                                    required
                                />
                            </div>
                            <div className="space-y-4 pt-4">
                                <Button type="submit" className={`w-full h-16 font-black uppercase tracking-[0.3em] text-[11px] rounded-2xl transition-all ${isDark ? 'bg-white text-black hover:bg-white/90' : 'bg-slate-900 text-white hover:bg-slate-800'}`} disabled={loading}>
                                    {loading ? <Loader2 className="animate-spin h-5 w-5" /> : "Reconfigure Node Authorization"}
                                </Button>
                                <Button variant="ghost" className={`w-full text-[10px] font-black uppercase tracking-[0.3em] transition-colors ${isDark ? 'text-muted-foreground/40 hover:text-white' : 'text-slate-400 hover:text-slate-900'}`} onClick={() => setView('login')}>Return To Terminal</Button>
                            </div>
                        </form>
                    )}
                </CardContent>
            </Card>
        </div>
    );
};

export default AdminLogin;

