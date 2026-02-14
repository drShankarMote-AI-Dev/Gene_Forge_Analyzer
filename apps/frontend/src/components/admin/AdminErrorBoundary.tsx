import React, { Component, ErrorInfo, ReactNode } from 'react';
import { AlertTriangle } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface Props {
    children: ReactNode;
    fallbackTitle?: string;
    fallbackMessage?: string;
}

interface State {
    hasError: boolean;
    error?: Error;
}

class AdminErrorBoundary extends Component<Props, State> {
    public state: State = {
        hasError: false
    };

    public static getDerivedStateFromError(error: Error): State {
        return { hasError: true, error };
    }

    public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
        console.error('Admin Module Error:', error, errorInfo);
    }

    private handleRetry = () => {
        this.setState({ hasError: false, error: undefined });
        window.location.reload();
    };

    public render() {
        if (this.state.hasError) {
            const isDark = localStorage.getItem('admin-theme') === 'admin-dark';

            return (
                <div className={`min-h-screen flex items-center justify-center p-8 ${isDark ? 'bg-zinc-950' : 'bg-slate-50'}`}>
                    <div className={`max-w-lg w-full p-10 rounded-[2.5rem] border text-center space-y-8 ${isDark ? 'bg-zinc-900/40 border-white/5' : 'bg-white border-black/5 shadow-xl'}`}>
                        <div className="flex justify-center">
                            <div className={`h-20 w-20 rounded-2xl flex items-center justify-center ${isDark ? 'bg-destructive/10' : 'bg-destructive/5'}`}>
                                <AlertTriangle className="h-10 w-10 text-destructive" />
                            </div>
                        </div>

                        <div className="space-y-4">
                            <h1 className={`text-3xl font-black tracking-tighter ${isDark ? 'text-white' : 'text-slate-900'}`}>
                                {this.props.fallbackTitle || 'Module Failed to Load'}
                            </h1>
                            <p className={`text-base font-medium ${isDark ? 'text-muted-foreground' : 'text-slate-600'}`}>
                                {this.props.fallbackMessage || 'Personnel sequence could not be initialized.'}
                            </p>

                            {this.state.error && (
                                <div className={`mt-6 p-4 rounded-xl border text-left ${isDark ? 'bg-white/[0.02] border-white/5' : 'bg-slate-50 border-black/5'}`}>
                                    <p className={`text-xs font-mono ${isDark ? 'text-muted-foreground/60' : 'text-slate-500'}`}>
                                        {this.state.error.message}
                                    </p>
                                </div>
                            )}
                        </div>

                        <div className="flex gap-4 justify-center">
                            <Button
                                onClick={this.handleRetry}
                                className={`h-12 px-8 rounded-2xl font-black uppercase tracking-[0.2em] text-[10px] ${isDark ? 'bg-white text-black hover:bg-white/90' : 'bg-slate-900 text-white hover:bg-slate-800'}`}
                            >
                                Retry Initialization
                            </Button>
                            <Button
                                variant="outline"
                                onClick={() => window.location.href = '/admin/dashboard'}
                                className={`h-12 px-8 rounded-2xl font-black uppercase tracking-[0.2em] text-[10px] ${isDark ? 'border-white/10 hover:bg-white/5' : 'border-black/10 hover:bg-slate-50'}`}
                            >
                                Return to Dashboard
                            </Button>
                        </div>
                    </div>
                </div>
            );
        }

        return this.props.children;
    }
}

export default AdminErrorBoundary;
