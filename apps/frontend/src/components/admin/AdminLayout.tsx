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
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

    // Simulate system health
    const [latency, setLatency] = useState(14);
    React.useEffect(() => {
        const interval = setInterval(() => {
            setLatency(Math.floor(Math.random() * (18 - 12 + 1)) + 12);
        }, 3000);
        return () => clearInterval(interval);
    }, []);

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
        <div className="flex min-h-screen bg-background text-foreground font-sans selection:bg-primary/20 overflow-x-hidden transition-colors duration-500 bg-dot-premium bg-grain">
            {/* Ambient Background Glows */}
            <div className="fixed top-[-10%] left-[-10%] w-[60%] h-[60%] bg-primary/10 rounded-full blur-[140px] pointer-events-none animate-pulse" />
            <div className="fixed bottom-[-10%] right-[-10%] w-[60%] h-[60%] bg-accent/10 rounded-full blur-[140px] pointer-events-none animate-pulse" />
            <div className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[80%] h-[80%] bg-blue-500/5 rounded-full blur-[180px] pointer-events-none" />

            {/* Sidebar Overlay for Mobile */}
            {isMobileMenuOpen && (
                <div
                    className="fixed inset-0 bg-black/60 backdrop-blur-xl z-[60] lg:hidden transition-all duration-700 ease-in-out"
                    onClick={() => setIsMobileMenuOpen(false)}
                />
            )}

            {/* Floating Sidebar */}
            <aside className={`w-64 admin-sidebar flex flex-col fixed inset-y-0 z-[70] transition-all duration-500 ease-in-out lg:translate-x-0 ${isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full'}`}>
                <div className="p-8 pb-4 text-center">
                    <Link to="/" className="inline-flex flex-col items-center gap-3 group">
                        <div className="h-10 w-10 rounded-xl bg-gradient-to-br from-primary via-accent to-primary flex items-center justify-center shadow-xl shadow-primary/10 group-hover:scale-110 transition-all duration-500 p-[1px]">
                            <div className="w-full h-full bg-card rounded-xl flex items-center justify-center border border-border/10 overflow-hidden">
                                <img src="/admin/logo.png" className="h-full w-full object-cover animate-pulse-soft" alt="Gene Forge Logo" />
                            </div>
                        </div>
                        <div className="flex flex-col items-center">
                            <span className="font-black tracking-tight text-lg leading-none">GENE<span className="text-primary">FORGE</span></span>
                            <span className="text-[8px] font-black uppercase tracking-[0.3em] text-muted-foreground/40 mt-1">Admin OS v2.0</span>
                        </div>
                    </Link>
                </div>

                <div className="px-8 mb-6">
                    <div className="h-[1px] w-full bg-gradient-to-r from-transparent via-white/10 to-transparent" />
                </div>

                <nav className="flex-1 px-4 space-y-2 overflow-y-auto py-2">
                    <p className="px-6 text-[10px] font-black uppercase tracking-[0.3em] text-muted-foreground/40 mb-4">Core Modules</p>
                    {menuItems.map((item) => (
                        <Link
                            key={item.path}
                            to={item.path}
                            onClick={() => setIsMobileMenuOpen(false)}
                            className={`admin-nav-item group ${location.pathname === item.path ? 'active' : ''}`}
                        >
                            <item.icon className="h-5 w-5" />
                            <span className="text-sm font-bold tracking-tight">{item.label}</span>
                        </Link>
                    ))}

                    <p className="px-6 text-[10px] font-black uppercase tracking-[0.3em] text-muted-foreground/40 mt-10 mb-4">Support & Tools</p>
                    <Link to="/admin/settings" className="admin-nav-item group" onClick={() => setIsMobileMenuOpen(false)}>
                        <Settings className="h-5 w-5" />
                        <span className="text-sm font-bold tracking-tight">System Config</span>
                    </Link>
                </nav>

                {/* Sidebar User Card */}
                <div className="p-6 mt-auto">
                    <div className="glass-card p-5 bg-white/5 border-white/5 mb-6 group cursor-pointer hover:bg-white/10 transition-all rounded-[1.75rem] border border-primary/5">
                        <div className="flex items-center gap-4">
                            <div className="h-12 w-12 rounded-2xl bg-gradient-to-br from-primary/20 to-accent/20 flex items-center justify-center border border-white/10 relative">
                                <User className="h-5 w-5 text-primary" />
                                <div className="absolute -top-1 -right-1 h-3 w-3 bg-green-500 rounded-full border-2 border-background animate-pulse" />
                            </div>
                            <div className="flex-1 overflow-hidden">
                                <p className="text-[11px] font-black truncate text-white tracking-tight">{user?.email?.split('@')[0].toUpperCase()}</p>
                                <p className="text-[8px] uppercase font-black text-primary tracking-[0.2em] truncate">{user?.role} CLEARANCE</p>
                            </div>
                            <ChevronRight className="h-4 w-4 text-muted-foreground/40 group-hover:text-primary group-hover:translate-x-1 transition-all" />
                        </div>
                    </div>

                    <Button
                        variant="ghost"
                        className="w-full justify-start text-muted-foreground/40 hover:text-destructive hover:bg-destructive/5 transition-all rounded-2xl h-14 group"
                        onClick={handleLogout}
                    >
                        <div className="h-8 w-8 rounded-xl bg-white/5 flex items-center justify-center mr-3 group-hover:bg-destructive/10 transition-colors">
                            <LogOut className="h-4 w-4" />
                        </div>
                        <span className="text-[10px] font-black uppercase tracking-[0.3em] italic">De-Auth Session</span>
                    </Button>
                </div>
            </aside>

            {/* Main Content Area */}
            <main className="flex-1 lg:ml-64 min-h-screen flex flex-col relative">
                {/* Navbar */}
                <header className="h-24 admin-header-glass px-8 lg:px-12 flex items-center justify-between sticky top-0 z-50">
                    <div className="flex items-center gap-6 flex-1">
                        <Button
                            variant="ghost"
                            size="icon"
                            className="lg:hidden rounded-2xl bg-white/5 hover:bg-white/10 h-12 w-12"
                            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                        >
                            <div className="flex flex-col gap-1.5 w-5">
                                <div className={`h-[2px] w-full bg-primary transition-all duration-500 ${isMobileMenuOpen ? 'rotate-45 translate-y-[8px]' : ''}`} />
                                <div className={`h-[2px] w-full bg-primary transition-all duration-300 ${isMobileMenuOpen ? 'opacity-0 scale-x-0' : ''}`} />
                                <div className={`h-[2px] w-full bg-primary transition-all duration-500 ${isMobileMenuOpen ? '-rotate-45 -translate-y-[8px]' : ''}`} />
                            </div>
                        </Button>

                        <div className={`relative w-full max-w-lg hidden md:block transition-all duration-700 ${isSearchFocused ? 'max-w-xl' : 'max-w-lg'}`}>
                            <div className="absolute inset-y-0 left-0 pl-5 flex items-center pointer-events-none">
                                <Search className={`h-4 w-4 transition-colors duration-300 ${isSearchFocused ? 'text-primary' : 'text-muted-foreground/50'}`} />
                            </div>
                            <Input
                                placeholder="Universal system search..."
                                className="pl-12 admin-search-input h-14 bg-white/5 border-none focus:ring-0 text-sm"
                                onFocus={() => setIsSearchFocused(true)}
                                onBlur={() => setIsSearchFocused(false)}
                            />
                            <div className="absolute inset-y-0 right-4 flex items-center gap-2">
                                <kbd className="hidden sm:inline-flex h-6 select-none items-center gap-1 rounded-lg border border-white/10 bg-white/5 px-2 font-mono text-[9px] font-bold text-muted-foreground/60">
                                    <Command className="h-3 w-3" />K
                                </kbd>
                            </div>
                        </div>
                    </div>

                    <div className="flex items-center gap-4">
                        <div className="hidden sm:flex items-center gap-3 bg-white/5 p-1 rounded-2xl border border-white/5">
                            <Button variant="ghost" size="icon" className="rounded-xl relative hover:bg-white/10 h-10 w-10 group">
                                <Bell className="h-5 w-5 text-muted-foreground/60 group-hover:text-primary transition-colors" />
                                <span className="absolute top-2.5 right-2.5 h-1.5 w-1.5 rounded-full bg-primary glow-primary-xs" />
                            </Button>
                            <div className="h-6 w-[1px] bg-white/10" />
                            <ThemeToggle />
                        </div>

                        <div className="flex items-center gap-3 pl-2 group cursor-pointer">
                            <div className="flex flex-col items-end hidden lg:flex">
                                <span className="text-[10px] font-black text-white">GENE ADMIN</span>
                                <span className="text-[8px] font-bold text-primary tracking-widest animate-pulse">SYSTEM SECURED</span>
                            </div>
                            <div className="h-10 w-10 rounded-xl bg-gradient-to-br from-primary to-accent p-[1px] shadow-2xl shadow-primary/20 rotate-3 group-hover:rotate-0 transition-all duration-500">
                                <div className="h-full w-full rounded-xl bg-card flex items-center justify-center overflow-hidden border border-border/10">
                                    <img src="/admin/os-icon.png" className="h-full w-full object-cover" alt="Admin OS" />
                                </div>
                            </div>
                        </div>
                    </div>
                </header>

                {/* Content Body */}
                <div className="flex-1 p-8 lg:p-12 relative overflow-visible">
                    <div className="max-w-7xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-12 duration-1000 ease-out">
                        {children}
                    </div>
                </div>

                {/* Status Bar Footer */}
                <footer className="px-12 py-6 border-t border-white/5 bg-white/[0.02] mt-auto">
                    <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6">
                        <div className="flex items-center gap-6">
                            <div className="flex flex-col">
                                <p className="text-[9px] font-black uppercase tracking-[0.4em] text-white/30">
                                    Gene Forge <span className="text-primary italic font-black">Admin OS</span>
                                </p>
                                <p className="text-[8px] font-bold text-muted-foreground/30 mt-1 uppercase tracking-widest">Copyright &copy; 2026 Bio-Sec Systems</p>
                            </div>
                        </div>
                        <div className="flex items-center gap-6">
                            <div className="flex items-center gap-3 px-4 py-2 bg-white/5 rounded-2xl border border-white/5">
                                <div className="h-1.5 w-1.5 rounded-full bg-green-500 animate-pulse glow-success-xs" />
                                <span className="text-[8px] font-black uppercase tracking-widest text-muted-foreground/40">Stable</span>
                            </div>
                            <div className="flex items-center gap-3 px-4 py-2 bg-white/5 rounded-2xl border border-white/5">
                                <Activity className="h-3 w-3 text-primary/60" />
                                <span className="text-[8px] font-black uppercase tracking-widest text-muted-foreground/40">{latency}ms</span>
                            </div>
                        </div>
                    </div>
                </footer>
            </main>
        </div >
    );
};

export default AdminLayout;

