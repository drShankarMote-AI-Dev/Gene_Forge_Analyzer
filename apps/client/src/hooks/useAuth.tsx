import { createContext, useContext, ReactNode } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from '@/components/ui/use-toast';
import { useNavigate } from 'react-router-dom';

const API_URL = '/api';
console.log("DEBUG: useAuth Hook API_URL:", API_URL);

interface User {
    email: string;
    role: string;
}

interface AuthContextType {
    user: User | null;
    isLoading: boolean;
    login: (email: string, code: string) => Promise<void>;
    loginWithPassword: (email: string, pass: string) => Promise<void>;
    sendOtp: (email: string) => Promise<void>;
    logout: () => Promise<void>;
    googleLogin: (token: string) => Promise<void>;
    isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
    const queryClient = useQueryClient();
    const navigate = useNavigate();

    const { data, isLoading } = useQuery({
        queryKey: ['session'],
        queryFn: async () => {
            try {
                const response = await fetch(`${API_URL}/auth/session`, {
                    headers: { 'Content-Type': 'application/json' },
                    credentials: 'include',
                });
                if (!response.ok) return { logged_in: false };
                return await response.json();
            } catch {
                return { logged_in: false };
            }
        },
        retry: false,
    });

    const sendOtpMutation = useMutation({
        mutationFn: async (email: string) => {
            const maxRetries = 2;
            let attempt = 0;

            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            const makeRequest = async (): Promise<any> => {
                const controller = new AbortController();
                const id = setTimeout(() => controller.abort(), 8000); // 8s timeout

                try {
                    const resp = await fetch(`${API_URL}/auth/otp/send`, {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        credentials: 'include',
                        body: JSON.stringify({ email }),
                        signal: controller.signal
                    });
                    clearTimeout(id);

                    if (!resp.ok) {
                        const err = await resp.json().catch(() => ({ msg: 'Server error' }));
                        throw new Error(err.msg || `Server error (${resp.status})`);
                    }
                    return resp.json();
                } catch (error) {
                    clearTimeout(id);
                    const err = error as Error;
                    if (err.name === 'AbortError' || err.message === 'Failed to fetch') {
                        if (attempt < maxRetries) {
                            attempt++;
                            console.log(`Retrying OTP send (attempt ${attempt})...`);
                            await new Promise(r => setTimeout(r, 1000 * attempt));
                            return makeRequest();
                        }
                    }
                    if (err.name === 'AbortError') throw new Error('Request timed out. Analysis server slow to respond.');
                    if (err.message === 'Failed to fetch') throw new Error('Network error: Analysis context unreachable. Ensure backend is active.');
                    throw error;
                }
            };

            return makeRequest();
        },
        onSuccess: (data) => {
            if (!data.email_sent && data.dev_code) {
                toast({
                    title: "Production Notice",
                    description: "Note: In a live environment, this code is sent to your email. For your current environment setup, check logs.",
                });
            } else {
                toast({
                    title: "Access Code Despatched",
                    description: "A secure verification code has been sent to your registered email address."
                });
            }
        },
        onError: (error) => {
            toast({
                title: "Error",
                description: error.message,
                variant: "destructive"
            });
        }
    });

    const loginMutation = useMutation({
        mutationFn: async ({ email, code }: { email: string; code: string }) => {
            const resp = await fetch(`${API_URL}/auth/otp/verify`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                credentials: 'include',
                body: JSON.stringify({ email, code }),
            });
            if (!resp.ok) {
                const err = await resp.json();
                throw new Error(err.msg || 'Invalid OTP');
            }
            return resp.json();
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['session'] });
            toast({ title: "Login Successful", description: "Welcome back!" });
            navigate('/analysis');
        },
        onError: (error) => {
            toast({
                title: "Login Failed",
                description: error.message,
                variant: "destructive"
            });
        }
    });

    const logoutMutation = useMutation({
        mutationFn: async () => {
            await fetch(`${API_URL}/auth/logout`, {
                method: 'POST',
                credentials: 'include',
            });
        },
        onSuccess: () => {
            queryClient.setQueryData(['session'], { logged_in: false });
            toast({ title: "Logged Out", description: "You have been logged out safely." });
        }
    });

    const googleLoginMutation = useMutation({
        mutationFn: async (token: string) => {
            const resp = await fetch(`${API_URL}/auth/google/verify-token`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                credentials: 'include',
                body: JSON.stringify({ token }),
            });
            if (!resp.ok) {
                const err = await resp.json();
                throw new Error(err.msg || 'Google login verification failed');
            }
            return resp.json();
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['session'] });
            toast({ title: "Google Login Successful", description: "Identity verified. Welcome!" });
            navigate('/analysis');
        },
        onError: (error) => {
            toast({
                title: "Google Login Failed",
                description: error.message,
                variant: "destructive"
            });
        }
    });

    const login = async (email: string, code: string) => {
        await loginMutation.mutateAsync({ email, code });
    };

    const sendOtp = async (email: string) => {
        await sendOtpMutation.mutateAsync(email);
    };

    const logout = async () => {
        await logoutMutation.mutateAsync();
    };

    const googleLogin = async (token: string) => {
        await googleLoginMutation.mutateAsync(token);
    };

    const loginWithPasswordMutation = useMutation({
        mutationFn: async ({ email, password }: { email: string; password: string }) => {
            const resp = await fetch(`${API_URL}/auth/admin/login`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                credentials: 'include',
                body: JSON.stringify({ email, password }),
            });
            const contentType = resp.headers.get("content-type");
            if (!resp.ok) {
                let errorMessage = 'Invalid admin credentials';
                if (contentType && contentType.includes("application/json")) {
                    const err = await resp.json();
                    errorMessage = err.msg || errorMessage;
                } else {
                    const text = await resp.text();
                    console.error("Non-JSON Error Response:", text);
                    errorMessage = `Server Error: ${resp.status}`;
                }
                throw new Error(errorMessage);
            }

            if (contentType && contentType.includes("application/json")) {
                return resp.json();
            }
            return { success: true };
        },
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        onSuccess: (data: any) => {
            queryClient.setQueryData(['session'], { logged_in: true, user: data.user });
            queryClient.invalidateQueries({ queryKey: ['session'] });
            toast({ title: "Admin Access Granted", description: "Secure session initialized." });
        },
        onError: (e) => {
            toast({ title: "Authentication Failed", description: e.message, variant: "destructive" });
            throw e;
        }
    });

    const loginWithPassword = async (email: string, pass: string) => {
        await loginWithPasswordMutation.mutateAsync({ email, password: pass });
    };

    const value = {
        user: data?.logged_in ? data.user : null,
        isLoading,
        login,
        loginWithPassword,
        sendOtp,
        logout,
        googleLogin,
        isAuthenticated: !!data?.logged_in
    };

    return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

// eslint-disable-next-line react-refresh/only-export-components
export const useAuth = () => {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};
