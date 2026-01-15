import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import {
    LayoutDashboard,
    Cpu,
    ShieldAlert,
    LogOut,
    User,
    ChevronRight,
    Search,
    Bell,
    Settings,
    Command,
    Activity
} from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { Button } from '../ui/button';
import { ThemeToggle } from '../ThemeToggle';
import { Input } from '../ui/input';

const AdminLayout = ({ children }: { children: React.ReactNode }) => {
    const location = useLocation();
    const navigate = useNavigate();
    const { user, logout } = useAuth();
    const [isSearchFocused, setIsSearchFocused] = useState(false);

    const menuItems = [
        { icon: LayoutDashboard, label: 'Control Center', path: '/admin/dashboard' },
        { icon: Cpu, label: 'AI Intelligence', path: '/admin/ai' },
        { icon: User, label: 'Personnel', path: '/admin/users' },
        { icon: ShieldAlert, label: 'Security Logs', path: '/admin/logs' },
    ];

    const handleLogout = async () => {
        await logout();
        navigate('/admin/login');
    };

    return (
        <div className="flex min-h-screen bg-background font-sans selection:bg-primary/20">
            {/* Sidebar */}
            <aside className="w-72 admin-sidebar hidden lg:flex flex-col fixed inset-y-0 z-50">
                <div className="p-8 pb-4">
                    <Link to="/" className="flex items-center gap-3 group">
                        <div className="h-10 w-10 rounded-xl bg-primary flex items-center justify-center shadow-lg shadow-primary/20 group-hover:scale-110 transition-transform duration-500">
                            <Activity className="h-6 w-6 text-primary-foreground" />
                        </div>
                        <div className="flex flex-col">
                            <span className="font-black tracking-tighter text-xl leading-none">GENE<span className="text-primary">FORGE</span></span>
                            <span className="text-[10px] font-black uppercase tracking-[0.3em] text-muted-foreground">Admin OS v1.0</span>
                        </div>
                    </Link>
                </div>

                <div className="px-6 py-4">
                    <div className="h-[1px] w-full bg-gradient-to-r from-transparent via-border/50 to-transparent" />
                </div>

                <nav className="flex-1 px-4 space-y-1.5 overflow-y-auto py-4">
                    <p className="px-4 text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground/50 mb-4">Core Modules</p>
                    {menuItems.map((item) => (
                        <Link
                            key={item.path}
                            to={item.path}
                            className={`admin-nav-item ${location.pathname === item.path ? 'active' : ''}`}
                        >
                            <item.icon className="h-5 w-5" />
                            <span className="text-sm font-bold tracking-tight">{item.label}</span>
                            {location.pathname === item.path && (
                                <div className="ml-auto h-1.5 w-1.5 rounded-full bg-primary shadow-[0_0_10px_rgba(var(--primary),0.5)]" />
                            )}
                        </Link>
                    ))}

                    <p className="px-4 text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground/50 mt-8 mb-4">Support & Tools</p>
                    <Link to="/admin/settings" className="admin-nav-item">
                        <Settings className="h-5 w-5" />
                        <span className="text-sm font-bold tracking-tight">System Config</span>
                    </Link>
                </nav>

                {/* Sidebar User Card */}
                <div className="p-4 bg-muted/20 border-t border-border/40">
                    <div className="glass-card p-4 rounded-2xl border-primary/20 bg-primary/5 mb-4 group cursor-pointer hover:bg-primary/10 transition-colors">
                        <div className="flex items-center gap-3">
                            <div className="h-10 w-10 rounded-xl bg-gradient-to-br from-primary/20 to-accent/20 flex items-center justify-center border border-primary/20">
                                <User className="h-5 w-5 text-primary" />
                            </div>
                            <div className="flex-1 overflow-hidden">
                                <p className="text-xs font-black truncate">{user?.email?.split('@')[0]}</p>
                                <p className="text-[9px] uppercase font-bold text-primary tracking-widest truncate">{user?.role}</p>
                            </div>
                            <ChevronRight className="h-4 w-4 text-muted-foreground group-hover:translate-x-1 transition-transform" />
                        </div>
                    </div>
                    
                    <Button
                        variant="ghost"
                        className="w-full justify-start text-muted-foreground hover:text-destructive hover:bg-destructive/5 transition-all rounded-xl"
                        onClick={handleLogout}
                    >
                        <LogOut className="mr-3 h-4 w-4" />
                        <span className="text-xs font-black uppercase tracking-widest italic">Terminate Session</span>
                    </Button>
                </div>
            </aside>

            {/* Main Content Area */}
            <main className="flex-1 lg:ml-72 min-h-screen flex flex-col relative overflow-x-hidden">
                {/* Background Pattern */}
                <div className="fixed inset-0 bg-dot-premium opacity-100 pointer-events-none" />

                {/* Navbar */}
                <header className="h-20 admin-header-glass px-8 flex items-center justify-between">
                    <div className="flex items-center gap-6 flex-1">
                        <div className={`relative w-full max-w-md hidden md:block transition-all duration-500 ${isSearchFocused ? 'max-w-lg' : 'max-w-md'}`}>
                            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                <Search className={`h-4 w-4 transition-colors duration-300 ${isSearchFocused ? 'text-primary' : 'text-muted-foreground'}`} />
                            </div>
                            <Input
                                placeholder="Search system resources..."
                                className="pl-11 admin-search-input h-11"
                                onFocus={() => setIsSearchFocused(true)}
                                onBlur={() => setIsSearchFocused(false)}
                            />
                            <div className="absolute inset-y-0 right-3 flex items-center gap-1.5">
                                <kbd className="hidden sm:inline-flex h-5 select-none items-center gap-1 rounded border border-border/50 bg-muted/50 px-1.5 font-mono text-[10px] font-medium text-muted-foreground opacity-100">
                                    <span className="text-xs"><Command className="h-3 w-3" /></span>K
                                </kbd>
                            </div>
                        </div>
                    </div>

                    <div className="flex items-center gap-4">
                        <div className="flex items-center gap-2 mr-2">
                            <Button variant="ghost" size="icon" className="rounded-xl relative hover:bg-primary/5 transition-colors group">
                                <Bell className="h-5 w-5 text-muted-foreground group-hover:text-primary transition-colors" />
                                <span className="absolute top-2 right-2 h-2 w-2 rounded-full bg-primary shadow-[0_0_8px_rgba(var(--primary),0.5)]" />
                            </Button>
                        </div>
                        
                        <div className="h-8 w-[1px] bg-border/50 mx-2" />
                        
                        <ThemeToggle />
                        
                        <div className="flex items-center gap-3 pl-2">
                            <div className="h-10 w-10 rounded-xl bg-gradient-to-br from-primary to-accent p-[1px] shadow-lg shadow-primary/10">
                                <div className="h-full w-full rounded-xl bg-background flex items-center justify-center overflow-hidden">
                                    <User className="h-5 w-5 text-primary" />
                                </div>
                            </div>
                        </div>
                    </div>
                </header>

                {/* Content Body */}
                <div className="flex-1 p-8 relative">
                    {/* Floating Decorative Elements */}
                    <div className="absolute top-20 right-[-10%] w-96 h-96 bg-primary/5 rounded-full blur-[120px] pointer-events-none animate-pulse" />
                    <div className="absolute bottom-20 left-[-5%] w-72 h-72 bg-accent/5 rounded-full blur-[100px] pointer-events-none animate-slow-pulse" />

                    <div className="max-w-7xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-8 duration-1000 ease-out">
                        {children}
                    </div>
                </div>

                {/* Footer */}
                <footer className="px-8 py-6 border-t border-border/40 bg-muted/5 relative z-10">
                    <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
                        <p className="text-[10px] font-black uppercase tracking-[0.3em] text-muted-foreground/60">
                            Gene Forge <span className="text-primary">Admin OS</span> &copy; 2026
                        </p>
                        <div className="flex items-center gap-6">
                            <div className="flex items-center gap-2">
                                <div className="h-1.5 w-1.5 rounded-full bg-green-500 animate-pulse" />
                                <span className="text-[9px] font-black uppercase tracking-widest text-muted-foreground/80">Systems: Nominal</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <Activity className="h-3 w-3 text-primary" />
                                <span className="text-[9px] font-black uppercase tracking-widest text-muted-foreground/80">Latency: 14ms</span>
                            </div>
                        </div>
                    </div>
                </footer>
            </main>
        </div>
    );
};

export default AdminLayout;

