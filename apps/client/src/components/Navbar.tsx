import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { LogOut, User as UserIcon } from 'lucide-react';
import { ThemeToggle } from './ThemeToggle';
import { useAuth } from '@/hooks/useAuth';
import { LoginDialog } from './auth/LoginDialog';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "./ui/dropdown-menu";
import { Button } from './ui/button';

const Navbar = () => {
    const location = useLocation();
    const { user, isAuthenticated, logout } = useAuth();

    return (
        <nav className="fixed top-4 left-1/2 -translate-x-1/2 w-[95%] max-w-7xl z-50 glass border border-white/20 dark:border-white/10 rounded-[2.5rem] px-8 shadow-2xl">
            <div className="h-16 flex items-center justify-between">
                <Link to="/" className="flex items-center gap-3 active:scale-95 transition-transform">
                    <div className="relative h-10 w-auto group">
                        <img
                            src="/logo.svg"
                            alt="Gene Forge Analyzer"
                            className="h-full w-auto dark:hidden transition-all duration-300 filter-none shadow-none drop-shadow-none"
                        />
                        <img
                            src="/logo-dark.svg"
                            alt="Gene Forge Analyzer"
                            className="h-full w-auto hidden dark:block transition-all duration-300 filter-none shadow-none drop-shadow-none"
                        />
                    </div>
                </Link>

                <div className="hidden md:flex items-center gap-8">
                    <Link
                        to="/"
                        className={`text-sm font-bold tracking-wide transition-colors ${location.pathname === '/' ? 'text-primary' : 'text-muted-foreground hover:text-foreground'
                            }`}
                    >
                        Home
                    </Link>
                    <Link
                        to="/analysis"
                        className={`text-sm font-bold tracking-wide transition-colors ${location.pathname === '/analysis' ? 'text-primary' : 'text-muted-foreground hover:text-foreground'
                            }`}
                    >
                        Analysis
                    </Link>
                    <Link
                        to="/tools"
                        className={`text-sm font-bold tracking-wide transition-colors ${location.pathname === '/tools' ? 'text-primary' : 'text-muted-foreground hover:text-foreground'
                            }`}
                    >
                        Tools
                    </Link>
                </div>

                <div className="flex items-center gap-4">
                    <ThemeToggle />
                    {isAuthenticated ? (
                        <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                                <Button variant="ghost" className="relative h-10 w-10 rounded-full bg-primary/10 border border-primary/20">
                                    <UserIcon className="h-5 w-5 text-primary" />
                                </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent className="w-56 glass-card border-primary/20" align="end" forceMount>
                                <DropdownMenuLabel className="font-normal">
                                    <div className="flex flex-col space-y-1">
                                        <p className="text-sm font-bold leading-none">{user?.email}</p>
                                        <p className="text-xs leading-none text-muted-foreground uppercase tracking-widest">{user?.role}</p>
                                    </div>
                                </DropdownMenuLabel>
                                <DropdownMenuSeparator />
                                <DropdownMenuItem onClick={() => logout()} className="text-destructive focus:text-destructive cursor-pointer font-bold uppercase tracking-widest text-[10px]">
                                    <LogOut className="mr-2 h-4 w-4" />
                                    <span>Log out</span>
                                </DropdownMenuItem>
                            </DropdownMenuContent>
                        </DropdownMenu>
                    ) : (
                        <LoginDialog />
                    )}
                </div>
            </div>
        </nav>
    );
};

export default Navbar;
