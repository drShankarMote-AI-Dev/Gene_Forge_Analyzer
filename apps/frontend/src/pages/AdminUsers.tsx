import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { API_BASE_URL } from '@/utils/api';
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
            const res = await fetch(`${API_BASE_URL}/admin/users`, { credentials: 'include' });
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
            const res = await fetch(`${API_BASE_URL}/admin/users/create`, {
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
        <div className="space-y-16 pb-20">
            <header className="flex flex-col lg:flex-row lg:items-end justify-between gap-10">
                <div className="space-y-4">
                    <div className="flex items-center gap-3">
                        <div className="p-2.5 bg-primary/20 rounded-xl border border-primary/20">
                            <Users className="h-5 w-5 text-primary" />
                        </div>
                        <span className="text-[11px] font-black uppercase tracking-[0.5em] text-primary">Identity Cluster // Verified Nodes</span>
                    </div>
                    <h1 className="text-6xl md:text-7xl font-black tracking-tighter leading-none text-foreground">
                        Personnel <span className="text-gradient italic">Registry</span>
                    </h1>
                    <p className="text-muted-foreground font-medium tracking-tight text-xl max-w-3xl leading-relaxed">
                        Manage system clearance tiers, biometric authorizations, and node access protocols for the global research collective.
                    </p>
                </div>

                <div className="flex items-center gap-4">
                    <Dialog open={isAddUserOpen} onOpenChange={setIsAddUserOpen}>
                        <DialogTrigger asChild>
                            <Button className="rounded-[1.25rem] h-16 px-8 font-black uppercase tracking-[0.2em] text-[10px] bg-white text-black hover:bg-white/90 transition-all group shadow-xl shadow-white/5">
                                Enroll New Personnel <UserPlus className="ml-3 h-4 w-4 group-hover:scale-110 transition-transform" />
                            </Button>
                        </DialogTrigger>
                        <DialogContent className="glass-card bg-black/90 backdrop-blur-3xl border-white/10 max-w-md p-8 rounded-[2.5rem] shadow-[0_0_50px_rgba(0,0,0,0.5)]">
                            <DialogHeader>
                                <DialogTitle className="text-3xl font-black tracking-tighter text-foreground flex items-center gap-4">
                                    <ShieldCheck className="h-7 w-7 text-primary" />
                                    Node Authorization
                                </DialogTitle>
                                <DialogDescription className="font-medium text-muted-foreground/60 tracking-tight text-base py-2">Provision a new cryptographic bio-identity for secure cluster access.</DialogDescription>
                            </DialogHeader>
                            <form onSubmit={handleAddUser} className="space-y-8 pt-6">
                                <div className="space-y-3">
                                    <Label className="text-[10px] font-black uppercase tracking-[0.4em] text-primary">Terminal ID (Email)</Label>
                                    <Input
                                        type="email"
                                        placeholder="researcher@geneforge.ai"
                                        className="h-14 rounded-2xl bg-muted/50 border-border/10 focus:ring-primary/20 focus:border-primary/50 text-foreground font-medium"
                                        value={newUserEmail}
                                        onChange={(e) => setNewUserEmail(e.target.value)}
                                        required
                                    />
                                </div>
                                <div className="space-y-3">
                                    <Label className="text-[10px] font-black uppercase tracking-[0.4em] text-primary">Clearance Level</Label>
                                    <Select value={newUserRole} onValueChange={setNewUserRole}>
                                        <SelectTrigger className="h-14 rounded-2xl bg-muted/50 border-border/10 text-foreground font-medium">
                                            <SelectValue placeholder="Select Tier" />
                                        </SelectTrigger>
                                        <SelectContent className="glass-card bg-zinc-900 border-white/10 rounded-2xl">
                                            <SelectItem value="user" className="font-bold py-4 focus:bg-white/5 cursor-pointer">Protocol: Standard Node</SelectItem>
                                            <SelectItem value="researcher" className="font-bold py-4 focus:bg-accent/10 text-accent cursor-pointer">Protocol: Researcher Node</SelectItem>
                                            <SelectItem value="admin" className="font-bold py-4 focus:bg-primary/10 text-primary cursor-pointer">Protocol: Command Core</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>
                                <DialogFooter className="pt-4 gap-4">
                                    <Button type="submit" className="w-full h-15 rounded-2xl bg-primary text-black font-black uppercase tracking-[0.2em] text-[11px] shadow-xl shadow-primary/20 hover:brightness-110 transition-all" disabled={isSubmitting}>
                                        {isSubmitting ? <Loader2 className="animate-spin h-4 w-4" /> : "Initiate Provisioning"}
                                    </Button>
                                </DialogFooter>
                            </form>
                        </DialogContent>
                    </Dialog>
                </div>
            </header>

            <Card className="glass-card bg-white/[0.01] border-white/5 overflow-hidden rounded-[2.5rem]">
                <div className="p-10 border-b border-white/5 flex flex-col md:flex-row md:items-center justify-between gap-8">
                    <div className="relative flex-1 max-w-xl group">
                        <Search className="absolute left-6 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground/40 group-focus-within:text-primary transition-colors" />
                        <Input
                            placeholder="Search by personnel ID or clearance level..."
                            className="pl-14 h-15 rounded-2xl bg-muted/30 border-border/10 focus:bg-muted/50 focus:border-primary/30 transition-all text-foreground placeholder:text-muted-foreground/30 font-medium"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>
                    <div className="flex items-center gap-4">
                        <Button variant="ghost" className="h-15 rounded-2xl px-8 font-black uppercase tracking-widest text-[10px] text-muted-foreground/60 hover:bg-white/5 hover:text-white transition-all border border-transparent hover:border-white/5">
                            <Filter className="mr-3 h-4 w-4" /> Filter Matrix
                        </Button>
                    </div>
                </div>

                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead>
                            <tr className="bg-white/[0.02] border-b border-white/5">
                                <th className="px-10 py-6 text-[10px] font-black uppercase tracking-[0.4em] text-muted-foreground/30">Personnel Identity</th>
                                <th className="px-10 py-6 text-[10px] font-black uppercase tracking-[0.4em] text-muted-foreground/30">Clearance Tier</th>
                                <th className="px-10 py-6 text-[10px] font-black uppercase tracking-[0.4em] text-muted-foreground/30">Authorized On</th>
                                <th className="px-10 py-6 text-right text-[10px] font-black uppercase tracking-[0.4em] text-muted-foreground/30">Action</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-white/5">
                            {filteredUsers.map((u, i) => (
                                <tr key={u.id} className="hover:bg-white/[0.03] transition-all group animate-in fade-in slide-in-from-left-6 duration-700" style={{ animationDelay: `${i * 60}ms` }}>
                                    <td className="px-10 py-8">
                                        <div className="flex items-center gap-6">
                                            <div className="h-15 w-15 shrink-0 rounded-[1.25rem] bg-gradient-to-br from-primary/10 to-accent/5 flex items-center justify-center border border-white/5 shadow-inner group-hover:scale-110 group-hover:border-primary/30 transition-all duration-500">
                                                <span className="text-xl font-black text-white/80 group-hover:text-primary transition-colors">{u.email[0].toUpperCase()}</span>
                                            </div>
                                            <div className="space-y-1">
                                                <p className="text-lg font-black tracking-tight text-foreground group-hover:text-primary transition-colors">{u.email}</p>
                                                <p className="text-[10px] font-mono font-bold text-muted-foreground/30 uppercase tracking-[0.2em]">NODE-ADDR // 0x{u.id.toString(16).padStart(4, '0').toUpperCase()}</p>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-10 py-8">
                                        <Badge className={`uppercase text-[9px] font-black tracking-[0.3em] px-5 py-2 rounded-xl border-none ${u.role === 'admin'
                                            ? 'bg-primary/20 text-primary'
                                            : u.role === 'researcher'
                                                ? 'bg-accent/20 text-accent'
                                                : 'bg-white/10 text-muted-foreground'
                                            }`}>
                                            {u.role}
                                        </Badge>
                                    </td>
                                    <td className="px-10 py-8">
                                        <div className="flex flex-col gap-1">
                                            <span className="text-sm font-black text-white/70 tracking-tight">{new Date(u.created_at).toLocaleDateString()}</span>
                                            <span className="text-[10px] font-mono font-bold text-muted-foreground/20 uppercase">{new Date(u.created_at).toLocaleTimeString()}</span>
                                        </div>
                                    </td>
                                    <td className="px-10 py-8 text-right">
                                        <DropdownMenu>
                                            <DropdownMenuTrigger asChild>
                                                <Button variant="ghost" className="h-12 w-12 p-0 rounded-2xl hover:bg-white/10 hover:text-white transition-all border border-transparent hover:border-white/10">
                                                    <MoreHorizontal className="h-5 w-5" />
                                                </Button>
                                            </DropdownMenuTrigger>
                                            <DropdownMenuContent align="end" className="glass-card bg-zinc-950 border-white/10 w-64 p-3 rounded-2xl shadow-2xl">
                                                <DropdownMenuLabel className="text-[10px] font-black uppercase tracking-[0.4em] px-4 pb-3 pt-2 text-muted-foreground/40 italic">Command Submenu</DropdownMenuLabel>
                                                <DropdownMenuItem className="text-xs font-black rounded-xl py-3.5 px-4 cursor-pointer focus:bg-primary/10 focus:text-primary transition-all">
                                                    <ExternalLink className="mr-3 h-4 w-4 opacity-40" /> Profile Telemetry
                                                </DropdownMenuItem>
                                                <DropdownMenuItem className="text-xs font-black rounded-xl py-3.5 px-4 cursor-pointer focus:bg-accent/10 focus:text-accent transition-all">
                                                    <Shield className="mr-3 h-4 w-4 opacity-40" /> Security Override
                                                </DropdownMenuItem>
                                                <DropdownMenuSeparator className="bg-white/5 my-2" />
                                                <DropdownMenuItem className="text-xs font-black rounded-xl py-3.5 px-4 cursor-pointer text-destructive focus:bg-destructive/10 focus:text-destructive transition-all">
                                                    <Trash2 className="mr-3 h-4 w-4 opacity-40" /> Purge Identity
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

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 pt-8">
                <Card className="glass-card bg-gradient-to-br from-primary/10 to-transparent p-10 group cursor-pointer hover:translate-y-[-4px] transition-all duration-500 rounded-[2.5rem]">
                    <div className="flex items-start gap-8">
                        <div className="h-18 w-18 shrink-0 rounded-3xl bg-primary/20 flex items-center justify-center border border-primary/20 shadow-2xl shadow-primary/10 group-hover:scale-110 transition-transform duration-700">
                            <Mail className="h-9 w-9 text-primary" />
                        </div>
                        <div className="space-y-4">
                            <h3 className="text-2xl font-black tracking-tighter text-white">Mass Uplink Blast</h3>
                            <p className="text-muted-foreground leading-relaxed font-medium">Transmit an end-to-end encrypted notification to every active biometric node within the GeneForge cluster.</p>
                            <Button className="h-12 px-8 rounded-2xl bg-primary text-black font-black uppercase tracking-widest text-[10px] group-hover:shadow-xl group-hover:shadow-primary/20 transition-all">
                                Initiate Broadcast →
                            </Button>
                        </div>
                    </div>
                </Card>

                <Card className="glass-card bg-gradient-to-br from-accent/10 to-transparent p-10 group cursor-pointer hover:translate-y-[-4px] transition-all duration-500 rounded-[2.5rem]">
                    <div className="flex items-start gap-8">
                        <div className="h-18 w-18 shrink-0 rounded-3xl bg-accent/20 flex items-center justify-center border border-accent/20 shadow-2xl shadow-accent/10 group-hover:scale-110 transition-transform duration-700">
                            <Shield className="h-9 w-9 text-accent" />
                        </div>
                        <div className="space-y-4">
                            <h3 className="text-2xl font-black tracking-tighter text-white">Full Security Audit</h3>
                            <p className="text-muted-foreground leading-relaxed font-medium">Compile and retrieve a comprehensive forensic ledger of all personnel activities and permission shifts.</p>
                            <Button variant="outline" className="h-12 px-8 rounded-2xl border-accent/30 text-accent font-black uppercase tracking-widest text-[10px] hover:bg-accent hover:text-white transition-all">
                                Generate Forensic Ledger
                            </Button>
                        </div>
                    </div>
                </Card>
            </div>
        </div>
    );
};

export default AdminUsers;
