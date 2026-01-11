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

export function LoginDialog() {
    const [email, setEmail] = useState('');
    const [otp, setOtp] = useState('');
    const [step, setStep] = useState<'email' | 'otp'>('email');
    const [loading, setLoading] = useState(false);
    const { sendOtp, login, googleLogin } = useAuth();
    const [open, setOpen] = useState(false);

    const handleSendOtp = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        try {
            await sendOtp(email);
            setStep('otp');
        } catch {
            // toast handled in hook
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
        } catch {
            // toast handled in hook
        } finally {
            setLoading(false);
        }
    };

    const reset = () => {
        setEmail('');
        setOtp('');
        setStep('email');
    };

    return (
        <Dialog open={open} onOpenChange={(val) => { setOpen(val); if (!val) reset(); }}>
            <DialogTrigger asChild>
                <Button variant="outline" className="rounded-full px-6 font-bold uppercase tracking-widest text-[10px] glass border-primary/20 hover:bg-primary/10">
                    Sign In
                </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px] glass-card border-primary/20 shadow-2xl">
                <DialogHeader>
                    <div className="flex justify-center mb-8">
                        <img src="/logo.svg" className="h-14 w-auto dark:hidden" alt="Logo" />
                        <img src="/logo-dark.svg" className="h-14 w-auto hidden dark:block" alt="Logo" />
                    </div>
                    <DialogTitle className="text-2xl font-black text-center tracking-tight">
                        {step === 'email' ? 'Secure Access' : 'Verify Identity'}
                    </DialogTitle>
                    <DialogDescription className="text-center font-medium">
                        {step === 'email'
                            ? 'Enter your email to receive a secure one-time passcode.'
                            : `We've sent a 6-digit code to ${email}`}
                    </DialogDescription>
                </DialogHeader>

                <div className="py-6">
                    {step === 'email' ? (
                        <form onSubmit={handleSendOtp} className="space-y-4">
                            <div className="space-y-2">
                                <Label htmlFor="email" className="text-xs font-bold uppercase tracking-widest opacity-70">Professional Email</Label>
                                <Input
                                    id="email"
                                    type="email"
                                    placeholder="name@institute.edu"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    className="rounded-xl glass border-primary/20 h-12"
                                    required
                                />
                            </div>
                            <Button type="submit" className="w-full h-12 rounded-xl bg-primary hover:bg-primary/90 font-bold" disabled={loading}>
                                {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                                Send Passcode
                            </Button>
                        </form>
                    ) : (
                        <div className="space-y-6 flex flex-col items-center">
                            <div className="space-y-2 w-full text-center">
                                <Label className="text-xs font-bold uppercase tracking-widest opacity-70">One-Time Passcode</Label>
                                <div className="flex justify-center pt-2">
                                    <InputOTP
                                        maxLength={6}
                                        value={otp}
                                        onChange={(value) => setOtp(value)}
                                        pattern={REGEXP_ONLY_DIGITS_AND_CHARS}
                                    >
                                        <InputOTPGroup className="gap-2">
                                            <InputOTPSlot index={0} className="rounded-xl glass border-primary/20 w-12 h-14 text-lg font-bold" />
                                            <InputOTPSlot index={1} className="rounded-xl glass border-primary/20 w-12 h-14 text-lg font-bold" />
                                            <InputOTPSlot index={2} className="rounded-xl glass border-primary/20 w-12 h-14 text-lg font-bold" />
                                            <InputOTPSlot index={3} className="rounded-xl glass border-primary/20 w-12 h-14 text-lg font-bold" />
                                            <InputOTPSlot index={4} className="rounded-xl glass border-primary/20 w-12 h-14 text-lg font-bold" />
                                            <InputOTPSlot index={5} className="rounded-xl glass border-primary/20 w-12 h-14 text-lg font-bold" />
                                        </InputOTPGroup>
                                    </InputOTP>
                                </div>
                            </div>
                            <Button
                                onClick={handleVerifyOtp}
                                className="w-full h-12 rounded-xl bg-primary hover:bg-primary/90 font-bold"
                                disabled={loading || otp.length !== 6}
                            >
                                {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                                Verify & Initialize
                            </Button>
                            <Button variant="link" onClick={() => setStep('email')} className="text-xs font-bold text-muted-foreground uppercase tracking-widest">
                                Use different email
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
