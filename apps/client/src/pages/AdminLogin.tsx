import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from '@/components/ui/use-toast';
import { ShieldAlert, Lock, Mail, Loader2 } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { useNavigate } from 'react-router-dom';

const AdminLogin = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [view, setView] = useState<'login' | 'reset-request' | 'reset-confirm' | 'change-password'>('login');
    const [resetCode, setResetCode] = useState('');
    const [newPassword, setNewPassword] = useState('');

    const { loginWithPassword } = useAuth();
    const navigate = useNavigate();

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
            const API_URL = '/api';
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
            const API_URL = '/api';
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
            const API_URL = '/api';
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
        <div className="min-h-screen flex items-center justify-center p-4">
            <Card className="glass-card w-full max-w-md border-primary/20 shadow-2xl">
                <CardHeader className="text-center space-y-4">
                    <div className="mx-auto p-4 bg-primary/10 rounded-full w-fit">
                        <ShieldAlert className="h-8 w-8 text-primary" />
                    </div>
                    <div>
                        <CardTitle className="text-2xl font-black tracking-tighter">Site Owner Access</CardTitle>
                        <CardDescription className="text-xs uppercase tracking-widest font-bold mt-2">
                            Secure Administrative Gateway
                        </CardDescription>
                    </div>
                </CardHeader>
                <CardContent>
                    {view === 'login' && (
                        <form onSubmit={handleLogin} className="space-y-4">
                            <div className="space-y-2">
                                <Label>Admin Email</Label>
                                <div className="relative">
                                    <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                                    <Input
                                        type="email"
                                        placeholder="admin@geneforge.com"
                                        className="pl-10 bg-background/50"
                                        value={email}
                                        onChange={e => setEmail(e.target.value)}
                                        required
                                    />
                                </div>
                            </div>
                            <div className="space-y-2">
                                <div className="flex justify-between items-center">
                                    <Label>Secure Password</Label>
                                    <div className="flex gap-3">
                                        <span
                                            onClick={() => setView('reset-request')}
                                            className="text-[10px] font-bold uppercase tracking-widest text-primary cursor-pointer hover:underline"
                                        >
                                            Forgot?
                                        </span>
                                        <span
                                            onClick={() => setView('change-password')}
                                            className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground cursor-pointer hover:underline"
                                        >
                                            Update
                                        </span>
                                    </div>
                                </div>
                                <div className="relative">
                                    <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                                    <Input
                                        type="password"
                                        placeholder="••••••••••••"
                                        className="pl-10 bg-background/50"
                                        value={password}
                                        onChange={e => setPassword(e.target.value)}
                                        required
                                    />
                                </div>
                            </div>
                            <Button type="submit" className="w-full font-bold uppercase tracking-widest" disabled={loading}>
                                {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                                Authenticate
                            </Button>
                        </form>
                    )}

                    {view === 'reset-request' && (
                        <form onSubmit={handleResetRequest} className="space-y-4 animate-in fade-in slide-in-from-right-4">
                            <div className="mb-4">
                                <p className="text-sm text-muted-foreground">Enter your verified admin email. A secure OTP will be sent to this address.</p>
                            </div>
                            <div className="space-y-2">
                                <Label>Admin Email</Label>
                                <Input
                                    type="email"
                                    placeholder="admin@geneforge.com"
                                    value={email}
                                    onChange={e => setEmail(e.target.value)}
                                    required
                                />
                            </div>
                            <Button type="submit" className="w-full" disabled={loading}>
                                {loading ? <Loader2 className="animate-spin" /> : "Send Reset Code (OTP)"}
                            </Button>
                            <Button variant="ghost" className="w-full" onClick={() => setView('login')}>Back to Login</Button>
                        </form>
                    )}

                    {view === 'reset-confirm' && (
                        <form onSubmit={handleResetConfirm} className="space-y-4 animate-in fade-in slide-in-from-right-4">
                            <div className="space-y-2">
                                <Label>OTP Code</Label>
                                <Input
                                    placeholder="Enter 6-digit code"
                                    value={resetCode}
                                    onChange={e => setResetCode(e.target.value)}
                                    required
                                />
                            </div>
                            <div className="space-y-2">
                                <Label>New Secure Password</Label>
                                <Input
                                    type="password"
                                    value={newPassword}
                                    onChange={e => setNewPassword(e.target.value)}
                                    required
                                />
                            </div>
                            <Button type="submit" className="w-full" disabled={loading}>
                                {loading ? <Loader2 className="animate-spin" /> : "Update Credentials"}
                            </Button>
                        </form>
                    )}

                    {view === 'change-password' && (
                        <form onSubmit={handleChangePassword} className="space-y-4 animate-in fade-in slide-in-from-right-4">
                            <div className="space-y-2">
                                <Label>Admin Email</Label>
                                <Input
                                    type="email"
                                    value={email}
                                    onChange={e => setEmail(e.target.value)}
                                    required
                                />
                            </div>
                            <div className="space-y-2">
                                <Label>Old Password</Label>
                                <Input
                                    type="password"
                                    value={password}
                                    onChange={e => setPassword(e.target.value)}
                                    required
                                />
                            </div>
                            <div className="space-y-2">
                                <Label>New Password</Label>
                                <Input
                                    type="password"
                                    value={newPassword}
                                    onChange={e => setNewPassword(e.target.value)}
                                    required
                                />
                            </div>
                            <Button type="submit" className="w-full" disabled={loading}>
                                {loading ? <Loader2 className="animate-spin" /> : "Set New Password"}
                            </Button>
                            <Button variant="ghost" className="w-full" onClick={() => setView('login')}>Back to Login</Button>
                        </form>
                    )}
                </CardContent>
            </Card>
        </div>
    );
};

export default AdminLogin;
