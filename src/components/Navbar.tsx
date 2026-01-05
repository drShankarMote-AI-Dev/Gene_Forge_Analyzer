import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Dna } from 'lucide-react';
import { ThemeToggle } from './ThemeToggle';

const Navbar = () => {
    const location = useLocation();

    return (
        <nav className="fixed top-4 left-1/2 -translate-x-1/2 w-[95%] max-w-7xl z-50 glass border border-white/20 dark:border-white/10 rounded-[2.5rem] px-8 shadow-2xl">
            <div className="h-16 flex items-center justify-between">
                <Link to="/" className="flex items-center gap-3 group">
                    <div className="relative p-2.5 rounded-2xl bg-gradient-to-tr from-primary/20 via-blue-500/20 to-accent/20 group-hover:scale-110 transition-all duration-500">
                        <div className="absolute inset-0 bg-primary/20 blur-xl rounded-full opacity-0 group-hover:opacity-100 transition-opacity" />
                        <Dna className="h-6 w-6 animate-dna-spin relative z-10" />
                    </div>
                    <div className="flex flex-col">
                        <span className="text-xl font-black tracking-tighter leading-none">GENEFORGE</span>
                        <span className="text-[10px] font-bold tracking-[0.3em] text-muted-foreground uppercase">Analyzer Pro</span>
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

                <ThemeToggle />
            </div>
        </nav>
    );
};

export default Navbar;
