import React, { useState } from 'react';
import { GoogleLogin } from '@react-oauth/google';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useAuth } from "@/hooks/useAuth";
import {
    REGEXP_ONLY_DIGITS_AND_CHARS,
} from "input-otp";
import {
    InputOTP,
    InputOTPGroup,
    InputOTPSlot,
} from "../ui/input-otp";
import { Loader2 } from "lucide-react";

import { Tabs, TabsList, TabsTrigger, TabsContent } from "../ui/tabs";

export function LoginDialog() {
    const [email, setEmail] = useState('');
    const [otp, setOtp] = useState('');
    const [step, setStep] = useState<'email' | 'otp'>('email');
    const [mode, setMode] = useState<'login' | 'register'>('login');
    const [loading, setLoading] = useState(false);
    const { sendOtp, login, googleLogin } = useAuth();
    const [open, setOpen] = useState(false);

    const handleSendOtp = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        try {
            await sendOtp(email);
            setStep('otp');
        } catch (error) {
            console.error("OTP send failed:", error);
        } finally {
            setLoading(false);
        }
    };

    const handleVerifyOtp = async () => {
        setLoading(true);
        try {
            await login(email, otp);
            setOpen(false);
            reset();
        } catch (error) {
            console.error("OTP verification failed:", error);
        } finally {
            setLoading(false);
        }
    };

    const reset = () => {
        setEmail('');
        setOtp('');
        setStep('email');
        setMode('login');
    };

    return (
        <Dialog open={open} onOpenChange={(val) => { setOpen(val); if (!val) reset(); }}>
            <DialogTrigger asChild>
                <div className="flex items-center gap-2">
                    <Button variant="outline" className="rounded-full px-6 font-bold uppercase tracking-widest text-[10px] glass border-primary/20 hover:bg-primary/10">
                        Sign In
                    </Button>
                    <Button className="rounded-full px-6 font-bold uppercase tracking-widest text-[10px] bg-primary hover:bg-primary/90 shadow-lg shadow-primary/20 hidden sm:flex">
                        Register
                    </Button>
                </div>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px] glass-card border-primary/20 shadow-2xl overflow-hidden">
                <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-primary to-transparent opacity-50" />
                <DialogHeader className="space-y-4">
                    <div className="flex justify-center mb-2">
                        <img src="/logo.svg" className="h-10 w-auto dark:hidden" alt="Logo" />
                        <img src="/logo-dark.svg" className="h-10 w-auto hidden dark:block" alt="Logo" />
                    </div>
                    <div>
                        <DialogTitle className="text-2xl font-black text-center tracking-tight uppercase italic">
                            {mode === 'login' ? 'Secure <span className="text-primary not-italic">Access</span>' : 'Cluster <span className="text-primary not-italic">Registry</span>'}
                        </DialogTitle>
                        <DialogDescription className="text-center font-black text-[10px] uppercase tracking-[0.2em] opacity-60 mt-2">
                            {step === 'email'
                                ? 'Establish Terminal Connection'
                                : 'Awaiting Cryptographic Verification'}
                        </DialogDescription>
                    </div>
                </DialogHeader>

                <div className="py-2">
                    {step === 'email' && (
                        <Tabs defaultValue="login" className="w-full" onValueChange={(val) => setMode(val as 'login' | 'register')}>
                            <TabsList className="grid w-full grid-cols-2 bg-black/40 border border-white/5 rounded-xl h-11 p-1">
                                <TabsTrigger value="login" className="rounded-lg font-black text-[10px] uppercase tracking-widest data-[state=active]:bg-primary data-[state=active]:text-white transition-all">Connect</TabsTrigger>
                                <TabsTrigger value="register" className="rounded-lg font-black text-[10px] uppercase tracking-widest data-[state=active]:bg-primary data-[state=active]:text-white transition-all">Enlist</TabsTrigger>
                            </TabsList>
                            <TabsContent value="login" className="mt-6">
                                <form onSubmit={handleSendOtp} className="space-y-4">
                                    <div className="space-y-2">
                                        <Label htmlFor="email" className="text-[10px] font-black uppercase tracking-widest opacity-70 ml-1">Credential ID (Email)</Label>
                                        <Input
                                            id="email"
                                            type="email"
                                            placeholder="researcher@institute.edu"
                                            value={email}
                                            onChange={(e) => setEmail(e.target.value)}
                                            className="rounded-xl bg-black/40 border-white/10 h-12 font-bold focus:border-primary/50 transition-all"
                                            required
                                        />
                                    </div>
                                    <Button type="submit" className="w-full h-12 rounded-xl bg-primary hover:bg-primary/90 font-black uppercase tracking-widest text-[10px] shadow-lg shadow-primary/20" disabled={loading}>
                                        {loading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : "Request Access Key"}
                                    </Button>
                                </form>
                            </TabsContent>
                            <TabsContent value="register" className="mt-6">
                                <form onSubmit={handleSendOtp} className="space-y-4">
                                    <div className="space-y-2 text-center mb-6">
                                        <p className="text-[10px] font-bold text-muted-foreground leading-relaxed uppercase tracking-widest">Registering a new node will grant you access to the analytical intelligence layer. Verified credentials required.</p>
                                    </div>
                                    <div className="space-y-2">
                                        <Label htmlFor="reg-email" className="text-[10px] font-black uppercase tracking-widest opacity-70 ml-1">Registration Email</Label>
                                        <Input
                                            id="reg-email"
                                            type="email"
                                            placeholder="new.node@institute.edu"
                                            value={email}
                                            onChange={(e) => setEmail(e.target.value)}
                                            className="rounded-xl bg-black/40 border-white/10 h-12 font-bold focus:border-primary/50 transition-all"
                                            required
                                        />
                                    </div>
                                    <Button type="submit" className="w-full h-12 rounded-xl bg-primary hover:bg-primary/90 font-black uppercase tracking-widest text-[10px] shadow-lg shadow-primary/20" disabled={loading}>
                                        {loading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : "Initialize Registry"}
                                    </Button>
                                </form>
                            </TabsContent>
                        </Tabs>
                    )}

                    {step === 'otp' && (
                        <div className="space-y-6 flex flex-col items-center animate-in fade-in zoom-in-95 duration-500 pt-4">
                            <div className="space-y-2 w-full text-center">
                                <Label className="text-[10px] font-black uppercase tracking-widest opacity-70">Transmission Code</Label>
                                <div className="flex justify-center pt-2">
                                    <InputOTP
                                        maxLength={6}
                                        value={otp}
                                        onChange={(value) => setOtp(value)}
                                        pattern={REGEXP_ONLY_DIGITS_AND_CHARS}
                                    >
                                        <InputOTPGroup className="gap-2">
                                            {[0, 1, 2, 3, 4, 5].map((i) => (
                                                <InputOTPSlot key={i} index={i} className="rounded-xl bg-black/40 border-white/10 w-12 h-14 text-lg font-black text-primary" />
                                            ))}
                                        </InputOTPGroup>
                                    </InputOTP>
                                </div>
                                <p className="text-[9px] font-bold text-muted-foreground uppercase tracking-widest mt-4">Code sent to: {email}</p>
                            </div>
                            <Button
                                onClick={handleVerifyOtp}
                                className="w-full h-12 rounded-xl bg-primary hover:bg-primary/90 font-black uppercase tracking-widest text-[10px] shadow-lg shadow-primary/20"
                                disabled={loading || otp.length !== 6}
                            >
                                {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                                Complete Synchronization
                            </Button>
                            <Button variant="ghost" onClick={() => setStep('email')} className="text-[10px] font-black text-muted-foreground uppercase tracking-widest transition-colors hover:text-white">
                                Abandon Signal
                            </Button>
                        </div>
                    )}

                    <div className="relative my-4">
                        <div className="absolute inset-0 flex items-center">
                            <span className="w-full border-t border-primary/10"></span>
                        </div>
                        <div className="relative flex justify-center text-xs uppercase">
                            <span className="bg-background px-2 text-muted-foreground font-bold tracking-widest">Or continue with</span>
                        </div>
                    </div>

                    <div className="flex flex-col items-center w-full gap-4">
                        <GoogleLogin
                            onSuccess={async (credentialResponse) => {
                                if (credentialResponse.credential) {
                                    setLoading(true);
                                    try {
                                        await googleLogin(credentialResponse.credential);
                                        setOpen(false);
                                    } catch {
                                        // toast handled in hook
                                    } finally {
                                        setLoading(false);
                                    }
                                }
                            }}
                            onError={() => {
                                console.log('Login Failed');
                            }}
                            useOneTap
                            theme="filled_blue"
                            shape="pill"
                            width="280px"
                        />

                        {(!import.meta.env.VITE_GOOGLE_CLIENT_ID ||
                            import.meta.env.VITE_GOOGLE_CLIENT_ID.includes('google-client-id') ||
                            import.meta.env.VITE_GOOGLE_CLIENT_ID.includes('PASTE_YOUR')) && (
                                <p className="text-[9px] text-muted-foreground animate-pulse text-center max-w-[200px]">
                                    ⚠️ Note: Google Login requires a valid Client ID in your .env file to function.
                                </p>
                            )}
                    </div>

                </div>
            </DialogContent>
        </Dialog>
    );
}
