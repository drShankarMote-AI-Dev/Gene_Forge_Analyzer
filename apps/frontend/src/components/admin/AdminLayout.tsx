import React, { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import {
    LayoutDashboard,
    Cpu,
    ShieldAlert,
    LogOut,
    User,
    Settings,
    Menu,
    Search,
    Bell,
    X,
    Sun,
    Moon
} from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { Button } from '../ui/button';
import { Input } from '../ui/input';

import './admin.css';
import { useTheme } from '@/theme/ThemeContext';

const AdminLayout = ({ children }: { children: React.ReactNode }) => {
    const location = useLocation();
    const navigate = useNavigate();
    const { user, logout } = useAuth();
    const { theme: globalTheme } = useTheme();

    // Admin-specific theme state
    const [adminTheme, setAdminTheme] = useState<'admin-dark' | 'admin-light'>(() => {
        const saved = localStorage.getItem('admin-theme');
        if (saved === 'admin-dark' || saved === 'admin-light') return saved;
        return globalTheme === 'dark' ? 'admin-dark' : 'admin-light';
    });

    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const [latency, setLatency] = useState(14);
    const [isScrolled, setIsScrolled] = useState(false);

    // Persist theme choice
    useEffect(() => {
        localStorage.setItem('admin-theme', adminTheme);
    }, [adminTheme]);

    const toggleAdminTheme = () => {
        setAdminTheme(prev => prev === 'admin-dark' ? 'admin-light' : 'admin-dark');
    };

    // Track scroll for navbar transparency
    useEffect(() => {
        const handleScroll = () => {
            setIsScrolled(window.scrollY > 20);
        };
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    // Simulate system health
    useEffect(() => {
        const interval = setInterval(() => {
            setLatency(Math.floor(Math.random() * (18 - 12 + 1)) + 12);
        }, 3000);
        return () => clearInterval(interval);
    }, []);

    const menuItems = [
        { icon: LayoutDashboard, label: 'Control Center', path: '/admin/dashboard', desc: 'System overview & metrics' },
        { icon: Cpu, label: 'Neural Core', path: '/admin/ai', desc: 'AI Bio-Engine management' },
        { icon: User, label: 'Personnel', path: '/admin/users', desc: 'Secure access governance' },
        { icon: ShieldAlert, label: 'Security Logs', path: '/admin/logs', desc: 'End-to-point audit stream' },
    ];

    const handleLogout = async () => {
        await logout();
        navigate('/admin/login');
    };

    const isDark = adminTheme === 'admin-dark';

    return (
        <div className={`admin-container ${adminTheme} flex h-screen w-full font-sans overflow-hidden selection:bg-primary/30 text-foreground`}>
            {/* Immersive Background Effects */}
            <div className="fixed inset-0 z-0 pointer-events-none">
                <div className={`absolute top-0 left-1/4 w-[800px] h-[800px] bg-primary/10 rounded-full blur-[160px] animate-pulse transition-opacity duration-1000 ${isDark ? 'opacity-50' : 'opacity-10'}`} />
                <div className={`absolute bottom-0 right-1/4 w-[600px] h-[600px] bg-accent/5 rounded-full blur-[140px] animate-pulse transition-opacity duration-1000 ${isDark ? 'opacity-30' : 'opacity-5'}`} />
                <div className={`absolute inset-0 bg-grid-premium transition-opacity duration-1000 ${isDark ? 'opacity-[0.03]' : 'opacity-[0.015]'}`} />
                <div className="absolute inset-0 bg-grain opacity-[0.02]" />
            </div>

            {/* Mobile Menu Overlay */}
            {isMobileMenuOpen && (
                <div
                    className="fixed inset-0 z-[60] bg-black/80 backdrop-blur-md lg:hidden transition-all duration-500"
                    onClick={() => setIsMobileMenuOpen(false)}
                />
            )}

            {/* Sidebar - The Command Center */}
            <aside
                className={`
                    fixed inset-y-4 left-4 z-[70] w-64 flex flex-col rounded-[2.5rem] border backdrop-blur-3xl transition-all duration-500 ease-smooth shadow-2xl lg:relative lg:inset-0 lg:h-full lg:rounded-none lg:border-r lg:border-l-0 lg:border-t-0 lg:border-b-0
                    ${isDark ? 'bg-zinc-950/40 border-white/5 shadow-black/50' : 'bg-white/90 border-black/5 shadow-slate-200/50'}
                    ${isMobileMenuOpen ? 'translate-x-0' : '-translate-x-[110%] lg:translate-x-0'}
                `}
            >
                {/* Sidebar Header: Branding & OS Version */}
                <div className={`flex h-24 items-center justify-between px-6 border-b transition-colors ${isDark ? 'border-white/5' : 'border-black/5'}`}>
                    <Link to="/" className="flex items-center gap-3 group">
                        <div className="relative h-9 w-9 shrink-0">
                            <div className={`relative h-full w-full rounded-xl border flex items-center justify-center overflow-hidden p-1.5 transition-all group-hover:scale-110 ${isDark ? 'bg-zinc-900 border-white/10' : 'bg-slate-50 border-black/10'}`}>
                                <img src="/admin/logo.png" className={`h-full w-full object-contain transition-all ${isDark ? 'brightness-125' : 'brightness-100 contrast-125'}`} alt="Logo" />
                            </div>
                        </div>
                        <div className="flex flex-col">
                            <span className={`font-black tracking-tighter text-sm leading-none transition-colors ${isDark ? 'text-white' : 'text-slate-900'}`}>GENE<span className="text-primary italic">FORGE</span></span>
                            <div className="flex items-center gap-1.5 mt-1">
                                <div className="h-1 w-1 rounded-full bg-primary animate-pulse" />
                                <span className={`text-[8px] font-black uppercase tracking-[0.25em] transition-colors ${isDark ? 'text-muted-foreground/50' : 'text-slate-500'}`}>Admin OS v{import.meta.env.VITE_VERSION || '2.0.0'}</span>
                            </div>
                        </div>
                    </Link>
                    <button onClick={() => setIsMobileMenuOpen(false)} className={`lg:hidden p-2 rounded-xl transition-all ${isDark ? 'text-muted-foreground hover:text-white hover:bg-white/5' : 'text-slate-500 hover:text-slate-900 hover:bg-slate-100'}`}>
                        <X className="h-5 w-5" />
                    </button>
                </div>

                {/* Navigation Items - Core Modules */}
                <div className="flex-1 overflow-y-auto py-8 px-3 space-y-1.5 custom-scrollbar">
                    <div className="px-4 mb-4">
                        <span className={`text-[9px] font-black uppercase tracking-[0.4em] transition-colors ${isDark ? 'text-muted-foreground/30' : 'text-slate-400'}`}>Intelligence Matrix</span>
                    </div>
                    {menuItems.map((item) => {
                        const isActive = location.pathname === item.path;
                        return (
                            <Link
                                key={item.path}
                                to={item.path}
                                onClick={() => setIsMobileMenuOpen(false)}
                                className={`flex flex-col gap-1 px-4 py-3 rounded-2xl transition-all duration-300 group relative border ${isActive
                                    ? `bg-primary/10 border-primary/20 ${isDark ? 'text-white' : 'text-primary'}`
                                    : `${isDark ? 'text-muted-foreground border-transparent hover:bg-white/5 hover:text-white' : 'text-slate-600 border-transparent hover:bg-slate-50 hover:text-slate-900'}`
                                    }`}
                            >
                                <div className="flex items-center gap-3">
                                    <item.icon className={`h-4 w-4 transition-all duration-500 ${isActive ? 'text-primary scale-110' : 'group-hover:text-primary group-hover:scale-110'}`} />
                                    <span className={`text-xs font-bold tracking-tight transition-colors ${isActive ? (isDark ? 'text-white' : 'text-primary') : (isDark ? 'text-muted-foreground' : 'text-slate-700')}`}>{item.label}</span>
                                    {isActive && (
                                        <div className="ml-auto h-1 w-1 rounded-full bg-primary shadow-[0_0_10px_hsl(var(--primary))]" />
                                    )}
                                </div>
                                <span className={`text-[8px] font-medium ml-7 leading-none transition-colors ${isDark ? 'text-muted-foreground/40 group-hover:text-muted-foreground/60' : 'text-slate-500 group-hover:text-slate-700'}`}>
                                    {item.desc}
                                </span>
                            </Link>
                        );
                    })}

                    <div className="px-4 mb-4 mt-8">
                        <span className={`text-[9px] font-black uppercase tracking-[0.4em] transition-colors ${isDark ? 'text-muted-foreground/30' : 'text-slate-400'}`}>Governance</span>
                    </div>
                    <Link to="/admin/settings" className={`flex items-center gap-3 px-4 py-3 rounded-2xl border border-transparent transition-all group ${isDark ? 'text-muted-foreground hover:bg-white/5 hover:text-white' : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'}`}>
                        <div className={`h-8 w-8 rounded-xl flex items-center justify-center transition-all ${isDark ? 'bg-white/5 group-hover:bg-primary/20' : 'bg-slate-100 group-hover:bg-primary/10'}`}>
                            <Settings className="h-4 w-4 group-hover:rotate-45 transition-transform duration-700" />
                        </div>
                        <div className="flex flex-col">
                            <span className={`text-xs font-bold transition-colors ${isDark ? 'text-muted-foreground' : 'text-slate-700'}`}>Configuration</span>
                            <span className={`text-[8px] font-medium leading-none transition-colors ${isDark ? 'text-muted-foreground/40' : 'text-slate-500'}`}>Global system parameters</span>
                        </div>
                    </Link>
                </div>

                {/* Sidebar Footer - User Clearance */}
                <div className={`p-5 border-t transition-colors ${isDark ? 'border-white/5' : 'border-black/5'}`}>
                    <div className={`p-4 rounded-3xl border transition-all group cursor-pointer relative overflow-hidden ${isDark ? 'bg-white/[0.02] border-white/5 hover:bg-white/[0.04]' : 'bg-slate-50 border-black/5 hover:bg-slate-100 shadow-sm'}`}>
                        <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                        <div className="flex items-center gap-3 relative z-10">
                            <div className={`h-9 w-9 rounded-xl border flex items-center justify-center shrink-0 group-hover:border-primary/50 transition-all ${isDark ? 'bg-zinc-900 border-white/10' : 'bg-white border-black/5'}`}>
                                <User className="h-4.5 w-4.5 text-primary" />
                            </div>
                            <div className="flex flex-col min-w-0">
                                <span className={`text-[10px] font-black truncate uppercase tracking-wider group-hover:text-primary transition-colors ${isDark ? 'text-white' : 'text-slate-900'}`}>
                                    {user?.email?.split('@')[0] || 'ADMIN'}
                                </span>
                                <div className="flex items-center gap-1.5">
                                    <div className="h-1 w-1 rounded-full bg-green-500 animate-pulse shadow-[0_0_8px_rgba(34,197,94,0.4)]" />
                                    <span className={`text-[8px] font-black uppercase tracking-widest transition-colors ${isDark ? 'text-muted-foreground/60' : 'text-slate-500'}`}>
                                        Clearance Level {user?.role === 'admin' ? 'AAA' : 'B'}
                                    </span>
                                </div>
                            </div>
                        </div>
                    </div>

                    <Button
                        variant="ghost"
                        className={`w-full mt-4 justify-start text-destructive/60 hover:text-destructive hover:bg-destructive/10 transition-all rounded-2xl h-10 text-[9px] font-black uppercase tracking-[0.2em]`}
                        onClick={handleLogout}
                    >
                        <LogOut className="h-4 w-4 mr-3" />
                        Terminate Session
                    </Button>
                </div>
            </aside>

            {/* Main Content Area */}
            <main className="flex-1 flex flex-col min-w-0 relative z-10">
                {/* Navbar - Floating Capsule Design like Homepage */}
                <div className="sticky top-0 z-[55] w-full px-6 lg:px-10 pt-4 pb-2 group">
                    <header className={`h-18 flex items-center justify-between px-6 lg:px-8 xl:px-10 transition-all duration-700 rounded-[2rem] border backdrop-blur-3xl shadow-2xl ${isScrolled
                        ? (isDark ? 'bg-zinc-950/80 border-white/10 shadow-black' : 'bg-white/90 border-black/5 shadow-slate-200/50')
                        : (isDark ? 'bg-zinc-900/40 border-white/5' : 'bg-white/40 border-black/5')
                        }`}>
                        <div className="flex items-center gap-4 lg:gap-6 flex-1 min-w-0">
                            <Button
                                variant="ghost"
                                size="icon"
                                className={`lg:hidden rounded-xl transition-all ${isDark ? 'text-white bg-white/5 hover:bg-white/10' : 'text-slate-900 bg-slate-100 hover:bg-slate-200'}`}
                                onClick={() => setIsMobileMenuOpen(true)}
                            >
                                <Menu className="h-6 w-6" />
                            </Button>

                            <div className="relative max-w-[240px] lg:max-w-xs xl:max-w-md w-full hidden md:block group transition-all duration-500">
                                <Search className={`absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 transition-colors ${isDark ? 'text-muted-foreground/30 group-focus-within:text-primary' : 'text-slate-400 group-focus-within:text-primary'}`} />
                                <Input
                                    placeholder="Execute command..."
                                    className={`pl-11 border transition-all placeholder:text-muted-foreground/30 focus:ring-1 focus:ring-primary/20 rounded-2xl h-10 text-xs font-medium tracking-tight border-transparent ${isDark ? 'bg-white/[0.03] focus:bg-zinc-950/50 focus:border-primary/30' : 'bg-slate-50 focus:bg-white focus:border-primary/30'}`}
                                />
                            </div>
                        </div>

                        <div className="flex items-center gap-3 lg:gap-5 xl:gap-6 ml-4">
                            <div className={`hidden sm:flex items-center gap-3 lg:gap-5 pr-4 lg:pr-6 border-r transition-colors ${isDark ? 'border-white/5' : 'border-black/5'}`}>
                                <div className="flex flex-col items-end">
                                    <span className={`text-[8px] font-black uppercase tracking-widest transition-colors ${isDark ? 'text-muted-foreground/40' : 'text-slate-500'}`}>Neural_Lat</span>
                                    <span className={`text-[10px] font-mono font-bold transition-colors ${latency < 15 ? 'text-green-500' : 'text-amber-500'}`}>
                                        {latency}ms
                                    </span>
                                </div>
                                <div className="flex flex-col items-end">
                                    <span className={`text-[8px] font-black uppercase tracking-widest transition-colors ${isDark ? 'text-muted-foreground/40' : 'text-slate-500'}`}>Status</span>
                                    <div className="flex items-center gap-1.5">
                                        <div className="h-1 w-1 rounded-full bg-primary animate-pulse shadow-[0_0_8px_rgba(var(--primary),1)]" />
                                        <span className={`text-[10px] font-bold uppercase tracking-wider transition-colors ${isDark ? 'text-white' : 'text-slate-900'}`}>Operational</span>
                                    </div>
                                </div>
                            </div>

                            <div className="flex items-center gap-2">
                                <Button variant="ghost" size="icon" className={`h-10 w-10 rounded-xl border transition-all relative ${isDark ? 'bg-white/[0.03] border-white/5 text-muted-foreground hover:bg-primary/10 hover:text-primary' : 'bg-slate-50 border-black/10 text-slate-500 hover:bg-slate-100 hover:text-primary'}`}>
                                    <Bell className="h-4.5 w-4.5" />
                                    <span className="absolute top-2.5 right-2.5 h-2 w-2 rounded-full bg-primary border-2 border-transparent" />
                                </Button>
                                <button
                                    onClick={toggleAdminTheme}
                                    className={`h-10 w-10 flex items-center justify-center rounded-xl transition-all border ${isDark ? 'bg-white/[0.03] border-white/5 hover:bg-white/[0.08] text-white' : 'bg-slate-50 border-black/10 hover:bg-slate-100 text-slate-900 shadow-sm'}`}
                                >
                                    {isDark ? <Sun className="h-4.5 w-4.5" /> : <Moon className="h-4.5 w-4.5" />}
                                </button>
                            </div>
                        </div>
                    </header>
                </div>


                {/* Body - Deep Canvas */}
                <div className="flex-1 overflow-y-auto overflow-x-hidden p-6 lg:p-10 scroll-smooth custom-scrollbar">
                    <div className="mx-auto max-w-7xl relative">
                        {/* Page Entrance Animation Wrapper */}
                        <div className="animate-in fade-in slide-in-from-bottom-8 duration-700 ease-smooth">
                            {children}
                        </div>
                    </div>
                </div>

                {/* Status Bar - Minimal Terminal */}
                <footer className={`h-11 border-t flex items-center justify-between px-8 backdrop-blur-xl text-[9px] font-black font-mono uppercase tracking-[0.2em] transition-all ${isDark ? 'bg-zinc-950/40 border-white/5 text-muted-foreground/30' : 'bg-slate-50 border-black/5 text-slate-500'}`}>
                    <div className="flex items-center gap-6">
                        <span className="flex items-center gap-2">
                            <div className="h-1 w-1 rounded-full bg-green-500 shadow-[0_0_8px_rgba(34,197,94,0.4)]" />
                            GFA_KERNEL_STABLE
                        </span>
                        <span className="hidden sm:block">UPTIME: 14D 02H 31M</span>
                    </div>
                    <div className="flex items-center gap-4">
                        <span>PRTC: SEC_TLS_1.3</span>
                        <span className="text-primary/40">© GENE FORGE // ARCH_V{import.meta.env.VITE_VERSION || '2.0.0'}</span>
                    </div>
                </footer>
            </main>
        </div>
    );
};

export default AdminLayout;
