import React from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import {
    LayoutDashboard,
    Cpu,
    ShieldAlert,
    LogOut,
    User,
    ChevronRight,
    Search
} from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { Button } from '../ui/button';
import { ThemeToggle } from '../ThemeToggle';
import { Input } from '../ui/input';

const AdminLayout = ({ children }: { children: React.ReactNode }) => {
    const location = useLocation();
    const navigate = useNavigate();
    const { user, logout } = useAuth();

    const menuItems = [
        { icon: LayoutDashboard, label: 'Dashboard', path: '/admin/dashboard' },
        { icon: Cpu, label: 'AI Gateway', path: '/admin/ai' },
        { icon: User, label: 'User Management', path: '/admin/users' },
        { icon: ShieldAlert, label: 'Audit Logs', path: '/admin/logs' },
    ];

    const handleLogout = async () => {
        await logout();
        navigate('/admin/login');
    };

    return (
        <div className="flex min-h-screen bg-background font-sans">
            {/* Sidebar */}
            <aside className="w-64 admin-sidebar hidden lg:flex flex-col fixed inset-y-0 z-50">
                <div className="p-8">
                    <Link to="/" className="flex items-center gap-3">
                        <img src="/logo.svg" alt="Logo" className="h-8 w-auto dark:invert" />
                        <span className="font-black tracking-tighter text-xl">GENE<span className="text-primary">FORGE</span></span>
                    </Link>
                </div>

                <nav className="flex-1 px-4 space-y-2 mt-4">
                    <p className="px-4 text-[10px] font-black uppercase tracking-widest text-muted-foreground mb-4">Main Menu</p>
                    {menuItems.map((item) => (
                        <Link
                            key={item.path}
                            to={item.path}
                            className={`admin-nav-item ${location.pathname === item.path ? 'active' : ''}`}
                        >
                            <item.icon className="h-5 w-5" />
                            <span className="text-sm font-bold">{item.label}</span>
                            {location.pathname === item.path && <ChevronRight className="ml-auto h-4 w-4" />}
                        </Link>
                    ))}
                </nav>

                <div className="p-4 mt-auto">
                    <div className="glass-card p-4 rounded-2xl border-primary/20 bg-primary/5">
                        <p className="text-[10px] font-black uppercase tracking-widest text-primary mb-1">System Status</p>
                        <div className="flex items-center gap-2">
                            <div className="h-2 w-2 rounded-full bg-green-500 animate-pulse" />
                            <span className="text-xs font-bold">All Systems Operational</span>
                        </div>
                    </div>
                    <Button
                        variant="ghost"
                        className="w-full justify-start mt-4 text-destructive hover:bg-destructive/10"
                        onClick={handleLogout}
                    >
                        <LogOut className="mr-2 h-4 w-4" />
                        <span className="text-sm font-bold uppercase tracking-widest italic">Terminate Session</span>
                    </Button>
                </div>
            </aside>

            {/* Main Content Area */}
            <main className="flex-1 lg:ml-64 min-h-screen flex flex-col">
                {/* Navbar */}
                <header className="h-20 glass border-b border-border/50 sticky top-0 z-40 px-8 flex items-center justify-between">
                    <div className="flex items-center gap-4 flex-1">
                        <div className="relative w-full max-w-md hidden md:block">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                            <Input
                                placeholder="Search telemetry..."
                                className="pl-10 bg-muted/20 border-border/50 focus:bg-background transition-all"
                            />
                        </div>
                    </div>

                    <div className="flex items-center gap-6">
                        <ThemeToggle />
                        <div className="h-10 w-[1px] bg-border/50" />
                        <div className="flex items-center gap-3">
                            <div className="text-right hidden sm:block">
                                <p className="text-sm font-black tracking-tight">{user?.email?.split('@')[0]}</p>
                                <p className="text-[10px] uppercase font-bold text-primary tracking-widest">{user?.role}</p>
                            </div>
                            <div className="h-10 w-10 rounded-full bg-gradient-to-br from-primary to-accent p-[2px]">
                                <div className="h-full w-full rounded-full bg-background flex items-center justify-center">
                                    <User className="h-5 w-5 text-primary" />
                                </div>
                            </div>
                        </div>
                    </div>
                </header>

                {/* Body */}
                <div className="flex-1 p-8 bg-zinc-50/50 dark:bg-black/20">
                    <div className="max-w-7xl mx-auto animate-in fade-in slide-in-from-bottom-4 duration-700">
                        {children}
                    </div>
                </div>

                {/* Footer */}
                <footer className="p-8 border-t border-border/50 text-center">
                    <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-muted-foreground">
                        Gene Forge Analyzer &copy; 2026 • Secure Administrative Layer
                    </p>
                </footer>
            </main>
        </div>
    );
};

export default AdminLayout;
