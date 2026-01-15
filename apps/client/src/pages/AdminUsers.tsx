import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { useAuth } from "@/hooks/useAuth";
import {
    Users,
    Search,
    MoreHorizontal,
    ShieldCheck,
    Mail,
    Calendar,
    Loader2,
    Filter,
    Plus,
    UserPlus,
    Shield,
    Trash2,
    ExternalLink
} from 'lucide-react';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
    DialogDescription,
    DialogFooter
} from "@/components/ui/dialog";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { toast } from '@/components/ui/use-toast';

interface UserRecord {
    id: number;
    email: string;
    role: string;
    created_at: string;
}

const AdminUsers = () => {
    const { user, isLoading: authLoading, isAuthenticated } = useAuth();
    const [loading, setLoading] = useState(true);
    const [users, setUsers] = useState<UserRecord[]>([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [isAddUserOpen, setIsAddUserOpen] = useState(false);
    const [newUserEmail, setNewUserEmail] = useState('');
    const [newUserRole, setNewUserRole] = useState('user');
    const [isSubmitting, setIsSubmitting] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        if (!authLoading) {
            if (!isAuthenticated || user?.role !== 'admin') {
                navigate('/admin/login');
            } else {
                fetchUsers();
            }
        }
    }, [authLoading, isAuthenticated, user, navigate]);

    const fetchUsers = async () => {
        try {
            const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';
            const res = await fetch(`${API_URL}/admin/users`, { credentials: 'include' });
            if (res.ok) {
                const json = await res.json();
                setUsers(json);
            }
        } catch (e) {
            console.error(e);
        } finally {
            setLoading(false);
        }
    };

    const handleAddUser = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);
        try {
            const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';
            const res = await fetch(`${API_URL}/admin/users/create`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                credentials: 'include',
                body: JSON.stringify({
                    email: newUserEmail,
                    role: newUserRole
                })
            });
            const data = await res.json();
            if (res.ok) {
                toast({ title: "Success", description: data.msg });
                setIsAddUserOpen(false);
                setNewUserEmail('');
                setNewUserRole('user');
                fetchUsers();
            } else {
                toast({ title: "Registration Failed", description: data.msg, variant: "destructive" });
            }
        } catch {
            toast({ title: "Error", description: "Communication error with neural server", variant: "destructive" });
        } finally {
            setIsSubmitting(false);
        }
    };

    const filteredUsers = users.filter(u =>
        u.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        u.role.toLowerCase().includes(searchTerm.toLowerCase())
    );

    if (loading) return (
        <div className="flex flex-col items-center justify-center h-[60vh] gap-4">
            <div className="h-12 w-12 border-4 border-primary/20 border-t-primary rounded-full animate-spin" />
            <p className="text-sm font-black uppercase tracking-[0.2em] animate-pulse text-primary">Scanning Personnel Bio-data...</p>
        </div>
    );

    return (
        <div className="space-y-12">
            <header className="flex flex-col md:flex-row md:items-end justify-between gap-6">
                <div className="space-y-2">
                    <div className="flex items-center gap-2 mb-2">
                        <div className="p-2 bg-primary/10 rounded-lg">
                            <Users className="h-5 w-5 text-primary" />
                        </div>
                        <span className="text-[10px] font-black uppercase tracking-[0.4em] text-primary">Personnel Directory</span>
                    </div>
                    <h1 className="text-5xl font-black tracking-tighter leading-none">Identity <span className="text-gradient italic">Orchestrator</span></h1>
                    <p className="text-muted-foreground font-bold tracking-tight text-lg max-w-2xl italic">Manage secure access permissions and cluster participants.</p>
                </div>

                <div className="flex items-center gap-4">
                    <Dialog open={isAddUserOpen} onOpenChange={setIsAddUserOpen}>
                        <DialogTrigger asChild>
                            <Button className="rounded-2xl h-12 px-8 font-black uppercase tracking-widest text-xs shadow-xl shadow-primary/20 group">
                                Enroll Personnel <Plus className="ml-2 h-4 w-4 group-hover:rotate-90 transition-transform duration-300" />
                            </Button>
                        </DialogTrigger>
                        <DialogContent className="admin-card-premium border-primary/20 max-w-md">
                            <DialogHeader>
                                <DialogTitle className="text-2xl font-black tracking-tighter text-white flex items-center gap-3">
                                    <UserPlus className="h-6 w-6 text-primary" />
                                    New Identity Authorization
                                </DialogTitle>
                                <DialogDescription className="font-bold text-muted-foreground/60 tracking-tight">Provision a new cryptographic identity for cluster access.</DialogDescription>
                            </DialogHeader>
                            <form onSubmit={handleAddUser} className="space-y-6 pt-6">
                                <div className="space-y-3">
                                    <Label className="text-[10px] font-black uppercase tracking-[0.2em] text-primary">Terminal ID (Email)</Label>
                                    <Input
                                        type="email"
                                        placeholder="researcher@geneforge.ai"
                                        className="h-12 rounded-xl bg-muted/30 border-border/40 focus:ring-primary/20"
                                        value={newUserEmail}
                                        onChange={(e) => setNewUserEmail(e.target.value)}
                                        required
                                    />
                                </div>
                                <div className="space-y-3">
                                    <Label className="text-[10px] font-black uppercase tracking-[0.2em] text-primary">Permission Clearance Tier</Label>
                                    <Select value={newUserRole} onValueChange={setNewUserRole}>
                                        <SelectTrigger className="h-12 rounded-xl bg-muted/30 border-border/40">
                                            <SelectValue placeholder="Select Tier" />
                                        </SelectTrigger>
                                        <SelectContent className="admin-card-premium border-border/40">
                                            <SelectItem value="user" className="font-bold py-3">Standard Node</SelectItem>
                                            <SelectItem value="researcher" className="font-bold py-3 text-accent">Researcher Cluster</SelectItem>
                                            <SelectItem value="admin" className="font-bold py-3 text-primary">Command Core</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>
                                <DialogFooter className="pt-6 gap-3">
                                    <Button type="button" variant="ghost" onClick={() => setIsAddUserOpen(false)} className="rounded-xl font-black uppercase tracking-widest text-[10px]">Abort</Button>
                                    <Button type="submit" className="rounded-xl px-10 h-12 font-black uppercase tracking-widest text-[10px] shadow-lg shadow-primary/20" disabled={isSubmitting}>
                                        {isSubmitting ? <Loader2 className="animate-spin h-4 w-4" /> : "Authorize Node"}
                                    </Button>
                                </DialogFooter>
                            </form>
                        </DialogContent>
                    </Dialog>
                </div>
            </header>

            <Card className="admin-card-premium p-0 overflow-hidden border-none shadow-2xl">
                <div className="p-8 border-b border-border/40 flex flex-col md:flex-row md:items-center justify-between gap-6">
                    <div className={`relative flex-1 max-w-md transition-all duration-300`}>
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                        <Input
                            placeholder="Search by ID or clearance..."
                            className="pl-12 h-12 admin-search-input"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>
                    <div className="flex items-center gap-3">
                        <Button variant="ghost" className="h-12 rounded-2xl px-6 font-black uppercase tracking-widest text-[10px] text-muted-foreground hover:bg-primary/5 hover:text-primary transition-all">
                            <Filter className="mr-2 h-4 w-4" /> Advanced Sort
                        </Button>
                    </div>
                </div>

                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead className="bg-muted/30 border-b border-border/40">
                            <tr>
                                <th className="px-8 py-5 text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground/60">Node Integrity</th>
                                <th className="px-8 py-5 text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground/60">Clearance Tier</th>
                                <th className="px-8 py-5 text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground/60">Deployment Date</th>
                                <th className="px-8 py-5 text-right text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground/60">Command</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-border/40">
                            {filteredUsers.map((u, i) => (
                                <tr key={u.id} className="hover:bg-primary/[0.03] transition-colors group animate-in fade-in slide-in-from-left-4" style={{ animationDelay: `${i * 50}ms` }}>
                                    <td className="px-8 py-6">
                                        <div className="flex items-center gap-5">
                                            <div className="h-12 w-12 shrink-0 rounded-2xl bg-gradient-to-br from-primary/10 to-accent/10 flex items-center justify-center border border-primary/10 shadow-inner group-hover:scale-110 transition-transform duration-500">
                                                <span className="text-sm font-black text-primary">{u.email[0].toUpperCase()}</span>
                                            </div>
                                            <div>
                                                <p className="text-base font-black tracking-tight group-hover:text-primary transition-colors">{u.email}</p>
                                                <p className="text-[10px] font-mono font-bold text-muted-foreground uppercase opacity-50">UID-{u.id.toString().padStart(6, '0')}</p>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-8 py-6">
                                        <Badge className={`uppercase text-[9px] font-black tracking-[0.2em] px-4 py-1.5 rounded-full border-none shadow-sm ${u.role === 'admin'
                                            ? 'bg-primary/10 text-primary shadow-primary/5'
                                            : u.role === 'researcher'
                                                ? 'bg-accent/10 text-accent shadow-accent/5'
                                                : 'bg-muted text-muted-foreground'
                                            }`}>
                                            {u.role === 'admin' && <Shield className="mr-2 h-3 w-3" />}
                                            {u.role}
                                        </Badge>
                                    </td>
                                    <td className="px-8 py-6">
                                        <div className="flex flex-col">
                                            <span className="text-sm font-black tracking-tighter">{new Date(u.created_at).toLocaleDateString(undefined, { year: 'numeric', month: 'short', day: 'numeric' })}</span>
                                            <span className="text-[10px] font-mono font-bold text-muted-foreground/50 uppercase">{new Date(u.created_at).toLocaleTimeString()}</span>
                                        </div>
                                    </td>
                                    <td className="px-8 py-6 text-right">
                                        <DropdownMenu>
                                            <DropdownMenuTrigger asChild>
                                                <Button variant="ghost" className="h-10 w-10 p-0 rounded-xl hover:bg-primary/10 hover:text-primary transition-all">
                                                    <MoreHorizontal className="h-5 w-5" />
                                                </Button>
                                            </DropdownMenuTrigger>
                                            <DropdownMenuContent align="end" className="admin-card-premium w-56 border-border/40 p-2">
                                                <DropdownMenuLabel className="text-[10px] font-black uppercase tracking-[0.3em] px-3 pb-2 pt-1 text-muted-foreground/50">Node Operations</DropdownMenuLabel>
                                                <DropdownMenuItem className="text-xs font-black rounded-lg py-2.5 cursor-pointer">
                                                    <ExternalLink className="mr-2 h-4 w-4 opacity-50" /> Profile Overview
                                                </DropdownMenuItem>
                                                <DropdownMenuItem className="text-xs font-black rounded-lg py-2.5 cursor-pointer">
                                                    <Shield className="mr-2 h-4 w-4 opacity-50" /> Elevate Permissions
                                                </DropdownMenuItem>
                                                <DropdownMenuSeparator className="bg-border/40 my-1" />
                                                <DropdownMenuItem className="text-xs font-black rounded-lg py-2.5 cursor-pointer text-destructive hover:bg-destructive/10">
                                                    <Trash2 className="mr-2 h-4 w-4 opacity-50" /> Terminate Access
                                                </DropdownMenuItem>
                                            </DropdownMenuContent>
                                        </DropdownMenu>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                    {filteredUsers.length === 0 && (
                        <div className="p-32 text-center">
                            <Users className="h-16 w-16 text-muted-foreground/10 mx-auto mb-6" />
                            <p className="text-lg font-black tracking-tight text-muted-foreground uppercase opacity-40 italic">No biometric matches in current cluster partition</p>
                        </div>
                    )}
                </div>
            </Card>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-10 pt-4 pb-12">
                <Card className="admin-card-premium border-primary/20 group hover:bg-primary/5 transition-all">
                    <div className="flex gap-6">
                        <div className="h-16 w-16 shrink-0 rounded-2xl bg-primary/10 flex items-center justify-center border border-primary/20 shadow-lg shadow-primary/5 group-hover:scale-110 transition-transform duration-500">
                            <Mail className="h-8 w-8 text-primary" />
                        </div>
                        <div>
                            <h3 className="text-xl font-black tracking-tighter mb-1">Mass Broadcast Uplink</h3>
                            <p className="text-sm font-bold text-muted-foreground leading-snug">Transmit an encrypted notification to all active nodes within the secure cluster.</p>
                            <Button className="mt-6 h-10 px-8 rounded-xl font-black uppercase tracking-widest text-[10px] bg-primary group-hover:shadow-lg group-hover:shadow-primary/20 transition-all">
                                Transmit Comms
                            </Button>
                        </div>
                    </div>
                </Card>
                <Card className="admin-card-premium border-accent/20 group hover:bg-accent/5 transition-all">
                    <div className="flex gap-6">
                        <div className="h-16 w-16 shrink-0 rounded-2xl bg-accent/10 flex items-center justify-center border border-accent/20 shadow-lg shadow-accent/5 group-hover:scale-110 transition-transform duration-500">
                            <Calendar className="h-8 w-8 text-accent" />
                        </div>
                        <div>
                            <h3 className="text-xl font-black tracking-tighter mb-1">Quarterly Audit Report</h3>
                            <p className="text-sm font-bold text-muted-foreground leading-snug">Compile and retrieve comprehensive security forensics for the current fiscal deployment.</p>
                            <Button variant="outline" className="mt-6 h-10 px-8 rounded-xl font-black uppercase tracking-widest text-[10px] border-accent/30 text-accent group-hover:bg-accent group-hover:text-white transition-all">
                                Generate Ledger
                            </Button>
                        </div>
                    </div>
                </Card>
            </div>
        </div>
    );
};

export default AdminUsers;
