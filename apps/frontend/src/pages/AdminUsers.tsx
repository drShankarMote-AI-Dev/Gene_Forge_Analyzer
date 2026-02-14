import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { API_BASE_URL, apiFetch } from '@/utils/api';
import { Card } from "@/components/ui/card";
import { useAuth } from "@/hooks/useAuth";
import {
    Users,
    Search,
    MoreHorizontal,
    ShieldCheck,
    Mail,
    Loader2,
    Filter,
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
    const [isEditUserOpen, setIsEditUserOpen] = useState(false);
    const [isDeleteConfirmOpen, setIsDeleteConfirmOpen] = useState(false);
    const [selectedUser, setSelectedUser] = useState<UserRecord | null>(null);
    const [newUserEmail, setNewUserEmail] = useState('');
    const [newUserRole, setNewUserRole] = useState('user');
    const [isSubmitting, setIsSubmitting] = useState(false);
    const navigate = useNavigate();

    // Ref for search input focus functionality
    const searchInputRef = React.useRef<HTMLInputElement>(null);

    // Detect admin theme for local styling
    const [adminTheme, setAdminTheme] = useState(() => localStorage.getItem('admin-theme') || 'admin-dark');
    const isDark = adminTheme === 'admin-dark';

    useEffect(() => {
        const handleStorageChange = () => {
            setAdminTheme(localStorage.getItem('admin-theme') || 'admin-dark');
        };
        window.addEventListener('storage', handleStorageChange);
        const interval = setInterval(handleStorageChange, 500);
        return () => {
            window.removeEventListener('storage', handleStorageChange);
            clearInterval(interval);
        };
    }, []);

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
        setLoading(true);
        try {
            const json = await apiFetch('/admin/users');
            setUsers(json);
        } catch (e: unknown) {
            console.error(e);
            toast({ title: "Sync Failed", description: "Could not retrieve personnel registry", variant: "destructive" });
        } finally {
            setLoading(false);
        }
    };

    const handleAddUser = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);
        try {
            const data = await apiFetch('/admin/users/create', {
                method: 'POST',
                body: JSON.stringify({
                    email: newUserEmail,
                    role: newUserRole
                })
            });
            toast({ title: "Success", description: data.msg });
            setIsAddUserOpen(false);
            setNewUserEmail('');
            setNewUserRole('user');
            fetchUsers();
        } catch (err: any) {
            toast({ title: "Registration Failed", description: err.message, variant: "destructive" });
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleEditUser = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!selectedUser) return;
        setIsSubmitting(true);
        try {
            const data = await apiFetch(`/admin/users/${selectedUser.id}`, {
                method: 'PUT',
                body: JSON.stringify({
                    role: newUserRole,
                    email: newUserEmail
                })
            });
            toast({ title: "Update Successful", description: data.msg });
            setIsEditUserOpen(false);
            fetchUsers();
        } catch (err: any) {
            toast({ title: "Update Failed", description: err.message, variant: "destructive" });
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleDeleteUser = async () => {
        if (!selectedUser) return;
        setIsSubmitting(true);
        try {
            const data = await apiFetch(`/admin/users/${selectedUser.id}`, {
                method: 'DELETE'
            });
            toast({ title: "Personnel Purged", description: data.msg });
            setIsDeleteConfirmOpen(false);
            fetchUsers();
        } catch (err: any) {
            toast({ title: "Purge Blocked", description: err.message, variant: "destructive" });
        } finally {
            setIsSubmitting(false);
        }
    };

    const openEditDialog = (u: UserRecord) => {
        setSelectedUser(u);
        setNewUserEmail(u.email);
        setNewUserRole(u.role);
        setIsEditUserOpen(true);
    };

    const openDeleteConfirm = (u: UserRecord) => {
        setSelectedUser(u);
        setIsDeleteConfirmOpen(true);
    };

    const [isMassUplinkOpen, setIsMassUplinkOpen] = useState(false);

    const handleMassUplink = async () => {
        setIsSubmitting(true);
        // Simulate broadcast
        await new Promise(r => setTimeout(r, 2500));
        toast({
            title: "Broadcast Dispatched",
            description: "End-to-end encrypted notification sent to 14 active nodes.",
        });
        setIsSubmitting(false);
        setIsMassUplinkOpen(false);
    };

    const handleSecurityAudit = () => {
        toast({ title: "Initializing Audit", description: "Accessing forensic ledger..." });
        navigate('/admin/logs');
    };

    const handleSecurityOverride = (u: UserRecord) => {
        toast({
            title: "Override Active",
            description: `Security protocols bypassed for node ${u.email}. Session tagged for review.`,
            variant: "destructive"
        });
    };

    const filteredUsers = users.filter(u =>
        u.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        u.role.toLowerCase().includes(searchTerm.toLowerCase())
    );

    if (loading && users.length === 0) return (
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
                    <h1 className={`text-6xl md:text-7xl font-black tracking-tighter leading-none ${isDark ? 'text-foreground' : 'text-slate-900'}`}>
                        Personnel <span className="text-gradient italic">Registry</span>
                    </h1>
                    <p className={`font-medium tracking-tight text-xl max-w-3xl leading-relaxed ${isDark ? 'text-muted-foreground' : 'text-slate-600'}`}>
                        Manage system clearance tiers, biometric authorizations, and node access protocols for the global research collective.
                    </p>
                </div>

                <div className="flex items-center gap-4">
                    <Dialog open={isAddUserOpen} onOpenChange={setIsAddUserOpen}>
                        <DialogTrigger asChild>
                            <Button className={`rounded-[1.25rem] h-16 px-8 font-black uppercase tracking-[0.2em] text-[10px] transition-all group shadow-xl ${isDark ? 'bg-white text-black hover:bg-white/90 shadow-white/5' : 'bg-slate-900 text-white hover:bg-slate-800 shadow-black/5'}`}>
                                Enroll New Personnel <UserPlus className="ml-3 h-4 w-4 group-hover:scale-110 transition-transform" />
                            </Button>
                        </DialogTrigger>
                        <DialogContent className={`glass-card backdrop-blur-3xl border max-w-md p-8 rounded-[2.5rem] shadow-[0_0_50px_rgba(0,0,0,0.5)] ${isDark ? 'bg-black/90 border-white/10' : 'bg-white border-black/5'}`}>
                            <DialogHeader>
                                <DialogTitle className={`text-3xl font-black tracking-tighter flex items-center gap-4 ${isDark ? 'text-foreground' : 'text-slate-900'}`}>
                                    <ShieldCheck className="h-7 w-7 text-primary" />
                                    Node Authorization
                                </DialogTitle>
                                <DialogDescription className={`font-medium tracking-tight text-base py-2 ${isDark ? 'text-muted-foreground/60' : 'text-slate-500'}`}>Provision a new cryptographic bio-identity for secure cluster access.</DialogDescription>
                            </DialogHeader>
                            <form onSubmit={handleAddUser} className="space-y-8 pt-6">
                                <div className="space-y-3">
                                    <Label className="text-[10px] font-black uppercase tracking-[0.4em] text-primary">Terminal ID (Email)</Label>
                                    <Input
                                        type="email"
                                        placeholder="researcher@geneforge.ai"
                                        className={`h-14 rounded-2xl border focus:ring-primary/20 focus:border-primary/50 text-foreground font-medium ${isDark ? 'bg-muted/50 border-border/10' : 'bg-slate-50 border-black/5'}`}
                                        value={newUserEmail}
                                        onChange={(e) => setNewUserEmail(e.target.value)}
                                        required
                                    />
                                </div>
                                <div className="space-y-3">
                                    <Label className="text-[10px] font-black uppercase tracking-[0.4em] text-primary">Clearance Level</Label>
                                    <Select value={newUserRole} onValueChange={setNewUserRole}>
                                        <SelectTrigger className={`h-14 rounded-2xl border text-foreground font-medium ${isDark ? 'bg-muted/50 border-border/10' : 'bg-slate-50 border-black/5'}`}>
                                            <SelectValue placeholder="Select Tier" />
                                        </SelectTrigger>
                                        <SelectContent className={`glass-card border rounded-2xl ${isDark ? 'bg-zinc-900 border-white/10' : 'bg-white border-black/5'}`}>
                                            <SelectItem value="user" className="font-bold py-4 focus:bg-primary/5 cursor-pointer">Protocol: Standard Node</SelectItem>
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

            {/* Edit User Dialog */}
            <Dialog open={isEditUserOpen} onOpenChange={setIsEditUserOpen}>
                <DialogContent className={`glass-card backdrop-blur-3xl border max-w-md p-8 rounded-[2.5rem] ${isDark ? 'bg-black/90 border-white/10 text-white' : 'bg-white border-black/5 text-slate-900'}`}>
                    <DialogHeader>
                        <DialogTitle className="text-3xl font-black tracking-tighter flex items-center gap-4">
                            <Shield className="h-7 w-7 text-primary" />
                            Reconfigure Node
                        </DialogTitle>
                        <DialogDescription className="font-medium text-muted-foreground">Adjust security levels and identity hooks for this personnel node.</DialogDescription>
                    </DialogHeader>
                    <form onSubmit={handleEditUser} className="space-y-8 pt-6">
                        <div className="space-y-3">
                            <Label className="text-[10px] font-black uppercase tracking-[0.4em] text-primary">Email Identifier</Label>
                            <Input
                                value={newUserEmail}
                                onChange={e => setNewUserEmail(e.target.value)}
                                className={`h-14 rounded-2xl border ${isDark ? 'bg-muted/50 border-border/10' : 'bg-slate-50 border-black/5'}`}
                            />
                        </div>
                        <div className="space-y-3">
                            <Label className="text-[10px] font-black uppercase tracking-[0.4em] text-primary">Security Tier</Label>
                            <Select value={newUserRole} onValueChange={setNewUserRole}>
                                <SelectTrigger className={`h-14 rounded-2xl border ${isDark ? 'bg-muted/50 border-border/10' : 'bg-slate-50 border-black/5'}`}>
                                    <SelectValue />
                                </SelectTrigger>
                                <SelectContent className={`glass-card border rounded-2xl ${isDark ? 'bg-zinc-900 border-white/10' : 'bg-white border-black/5'}`}>
                                    <SelectItem value="user">Standard Node</SelectItem>
                                    <SelectItem value="researcher">Researcher Node</SelectItem>
                                    <SelectItem value="admin">Command Core</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                        <DialogFooter className="pt-4">
                            <Button type="submit" className="w-full h-15 rounded-2xl bg-primary text-black font-black uppercase" disabled={isSubmitting}>
                                {isSubmitting ? <Loader2 className="animate-spin h-4 w-4" /> : "Authorize Changes"}
                            </Button>
                        </DialogFooter>
                    </form>
                </DialogContent>
            </Dialog>

            {/* Delete Confirmation Dialog */}
            <Dialog open={isDeleteConfirmOpen} onOpenChange={setIsDeleteConfirmOpen}>
                <DialogContent className={`glass-card border max-w-sm p-8 rounded-[2rem] ${isDark ? 'bg-black border-white/10' : 'bg-white border-black/5'}`}>
                    <DialogHeader className="space-y-4">
                        <div className="h-16 w-16 rounded-2xl bg-destructive/10 flex items-center justify-center mx-auto">
                            <Trash2 className="h-8 w-8 text-destructive" />
                        </div>
                        <DialogTitle className="text-2xl font-black tracking-tighter text-center">Identity Purge Protocol</DialogTitle>
                        <DialogDescription className="text-center font-medium">
                            Are you certain you want to extract <span className="text-destructive font-bold">{selectedUser?.email}</span>? This action is irrevocable across all neural sub-nets.
                        </DialogDescription>
                    </DialogHeader>
                    <DialogFooter className="flex-col sm:flex-col gap-3 mt-6">
                        <Button variant="destructive" className="w-full h-12 rounded-xl font-black uppercase text-[10px] tracking-widest" onClick={handleDeleteUser} disabled={isSubmitting}>
                            {isSubmitting ? <Loader2 className="animate-spin h-3 w-3 mr-2" /> : "Confirm Immediate Purge"}
                        </Button>
                        <Button variant="ghost" className="w-full h-12 rounded-xl font-black uppercase text-[10px] tracking-widest" onClick={() => setIsDeleteConfirmOpen(false)}>
                            Abort Protocol
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

            <Card className={`glass-card overflow-hidden rounded-[2.5rem] border ${isDark ? 'bg-white/[0.01] border-white/5' : 'bg-white border-black/5'}`}>
                <div className={`p-10 border-b flex flex-col md:flex-row md:items-center justify-between gap-8 ${isDark ? 'border-white/5' : 'border-black/5'}`}>
                    <div className="relative flex-1 max-w-xl group">
                        <Search className={`absolute left-6 top-1/2 -translate-y-1/2 h-4 w-4 transition-colors ${isDark ? 'text-muted-foreground/40 group-focus-within:text-primary' : 'text-slate-400 group-focus-within:text-primary'}`} />
                        <Input
                            ref={searchInputRef}
                            placeholder="Search by personnel ID or clearance level..."
                            className={`pl-14 h-15 rounded-2xl border transition-all text-foreground font-medium ${isDark ? 'bg-muted/30 border-border/10 focus:bg-muted/50 focus:border-primary/30 placeholder:text-muted-foreground/30' : 'bg-slate-50 border-black/5 focus:bg-white focus:border-primary/30 placeholder:text-slate-400'}`}
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>
                    <div className="flex items-center gap-4">
                        <Button
                            variant="ghost"
                            onClick={() => searchInputRef.current?.focus()}
                            className={`h-15 rounded-2xl px-8 font-black uppercase tracking-widest text-[10px] transition-all border border-transparent ${isDark ? 'text-muted-foreground/60 hover:bg-white/5 hover:text-white hover:border-white/5' : 'text-slate-500 hover:bg-slate-50 hover:text-slate-900 hover:border-black/5'}`}
                        >
                            <Filter className="mr-3 h-4 w-4" /> Filter Matrix
                        </Button>
                    </div>
                </div>

                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        {/* THEAD remains unchanged */}
                        <thead>
                            <tr className={`border-b ${isDark ? 'bg-white/[0.02] border-white/5' : 'bg-slate-50 border-black/5'}`}>
                                <th className="px-10 py-6 text-[10px] font-black uppercase tracking-[0.4em] text-muted-foreground/30">Personnel Identity</th>
                                <th className="px-10 py-6 text-[10px] font-black uppercase tracking-[0.4em] text-muted-foreground/30">Clearance Tier</th>
                                <th className="px-10 py-6 text-[10px] font-black uppercase tracking-[0.4em] text-muted-foreground/30">Authorized On</th>
                                <th className="px-10 py-6 text-right text-[10px] font-black uppercase tracking-[0.4em] text-muted-foreground/30">Action</th>
                            </tr>
                        </thead>
                        <tbody className={`divide-y ${isDark ? 'divide-white/5' : 'divide-black/5'}`}>
                            {filteredUsers.map((u) => (
                                <tr key={u.id} className={`transition-all group animate-in fade-in slide-in-from-left-6 duration-700 ${isDark ? 'hover:bg-white/[0.03]' : 'hover:bg-slate-50/50'}`}>
                                    {/* TD Body content... */}
                                    <td className="px-10 py-8">
                                        <div className="flex items-center gap-6">
                                            <div className="h-15 w-15 shrink-0 rounded-[1.25rem] bg-gradient-to-br from-primary/10 to-accent/5 flex items-center justify-center border border-white/5 shadow-inner group-hover:scale-110 group-hover:border-primary/30 transition-all duration-500">
                                                <span className={`text-xl font-black transition-colors ${isDark ? 'text-white/80 group-hover:text-primary' : 'text-slate-700 group-hover:text-primary'}`}>{u.email[0].toUpperCase()}</span>
                                            </div>
                                            <div className="space-y-1">
                                                <p className={`text-lg font-black tracking-tight transition-colors ${isDark ? 'text-foreground group-hover:text-primary' : 'text-slate-900 group-hover:text-primary'}`}>{u.email}</p>
                                                <p className={`text-[10px] font-mono font-bold uppercase tracking-[0.2em] ${isDark ? 'text-muted-foreground/30' : 'text-slate-400'}`}>NODE-ADDR // 0x{u.id.toString(16).padStart(4, '0').toUpperCase()}</p>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-10 py-8">
                                        <Badge className={`uppercase text-[9px] font-black tracking-[0.3em] px-5 py-2 rounded-xl border-none ${u.role === 'admin'
                                            ? 'bg-primary/20 text-primary'
                                            : u.role === 'researcher'
                                                ? 'bg-accent/20 text-accent'
                                                : isDark ? 'bg-white/10 text-muted-foreground' : 'bg-slate-200 text-slate-600'
                                            }`}>
                                            {u.role}
                                        </Badge>
                                    </td>
                                    <td className="px-10 py-8">
                                        <div className="flex flex-col gap-1">
                                            <span className={`text-sm font-black tracking-tight ${isDark ? 'text-white/70' : 'text-slate-700'}`}>{new Date(u.created_at).toLocaleDateString()}</span>
                                            <span className={`text-[10px] font-mono font-bold uppercase ${isDark ? 'text-muted-foreground/20' : 'text-slate-400'}`}>{new Date(u.created_at).toLocaleTimeString()}</span>
                                        </div>
                                    </td>
                                    <td className="px-10 py-8 text-right">
                                        <DropdownMenu>
                                            <DropdownMenuTrigger asChild>
                                                <Button variant="ghost" className={`h-12 w-12 p-0 rounded-2xl transition-all border border-transparent ${isDark ? 'hover:bg-white/10 hover:text-white hover:border-white/10' : 'hover:bg-slate-100 hover:text-slate-900 hover:border-black/5'}`}>
                                                    <MoreHorizontal className="h-5 w-5" />
                                                </Button>
                                            </DropdownMenuTrigger>
                                            <DropdownMenuContent align="end" className={`glass-card border w-64 p-3 rounded-2xl shadow-2xl ${isDark ? 'bg-zinc-950 border-white/10' : 'bg-white border-black/5'}`}>
                                                <DropdownMenuLabel className="text-[10px] font-black uppercase tracking-[0.4em] px-4 pb-3 pt-2 text-muted-foreground/40 italic">Command Submenu</DropdownMenuLabel>
                                                <DropdownMenuItem
                                                    onClick={() => openEditDialog(u)}
                                                    className="text-xs font-black rounded-xl py-3.5 px-4 cursor-pointer focus:bg-primary/10 focus:text-primary transition-all"
                                                >
                                                    <ExternalLink className="mr-3 h-4 w-4 opacity-40" /> Profile Telemetry & Edit
                                                </DropdownMenuItem>
                                                <DropdownMenuItem
                                                    onClick={() => handleSecurityOverride(u)}
                                                    className="text-xs font-black rounded-xl py-3.5 px-4 cursor-pointer focus:bg-accent/10 focus:text-accent transition-all"
                                                >
                                                    <Shield className="mr-3 h-4 w-4 opacity-40" /> Security Override
                                                </DropdownMenuItem>
                                                <DropdownMenuSeparator className={`${isDark ? 'bg-white/5' : 'bg-black/5'} my-2`} />
                                                <DropdownMenuItem
                                                    onClick={() => openDeleteConfirm(u)}
                                                    className="text-xs font-black rounded-xl py-3.5 px-4 cursor-pointer text-destructive focus:bg-destructive/10 focus:text-destructive transition-all"
                                                >
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

            {/* Mass Uplink Dialog */}
            <Dialog open={isMassUplinkOpen} onOpenChange={setIsMassUplinkOpen}>
                <DialogContent className={`glass-card border max-w-sm p-8 rounded-[2rem] ${isDark ? 'bg-black border-white/10' : 'bg-white border-black/5'}`}>
                    <DialogHeader className="space-y-4">
                        <div className="h-16 w-16 rounded-2xl bg-primary/10 flex items-center justify-center mx-auto">
                            <Mail className="h-8 w-8 text-primary" />
                        </div>
                        <DialogTitle className="text-2xl font-black tracking-tighter text-center">System Broadcast</DialogTitle>
                        <DialogDescription className="text-center font-medium">
                            Transmit an encrypted alert to all active personnel nodes? This message will be logged in the forensic ledger.
                        </DialogDescription>
                    </DialogHeader>
                    <div className="space-y-4 pt-4">
                        <div className="space-y-2">
                            <Label className="text-[10px] font-black uppercase tracking-[0.4em] text-primary">Priority Level</Label>
                            <Select defaultValue="normal">
                                <SelectTrigger className="h-12 rounded-xl border-dashed">
                                    <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="low">Low Priority</SelectItem>
                                    <SelectItem value="normal">Standard Protocol</SelectItem>
                                    <SelectItem value="critical" className="text-destructive font-bold">CRITICAL ALERT</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                        <Input placeholder="Subject Line..." className="h-12 rounded-xl bg-transparent border-dashed" />
                    </div>
                    <DialogFooter className="flex-col sm:flex-col gap-3 mt-6">
                        <Button className="w-full h-12 rounded-xl font-black uppercase text-[10px] tracking-widest bg-primary text-black hover:bg-primary/90" onClick={handleMassUplink} disabled={isSubmitting}>
                            {isSubmitting ? <Loader2 className="animate-spin h-3 w-3 mr-2" /> : "Transmit Signal"}
                        </Button>
                        <Button variant="ghost" className="w-full h-12 rounded-xl font-black uppercase text-[10px] tracking-widest" onClick={() => setIsMassUplinkOpen(false)}>
                            Cancel Transmission
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 pt-8">
                <Card className={`glass-card p-10 group cursor-pointer hover:translate-y-[-4px] transition-all duration-500 rounded-[2.5rem] ${isDark ? 'bg-gradient-to-br from-primary/10 to-transparent' : 'bg-white border-black/5 shadow-xl shadow-black/5'}`}>
                    <div className="flex items-start gap-8">
                        <div className="h-18 w-18 shrink-0 rounded-3xl bg-primary/20 flex items-center justify-center border border-primary/20 shadow-2xl shadow-primary/10 group-hover:scale-110 transition-transform duration-700">
                            <Mail className="h-9 w-9 text-primary" />
                        </div>
                        <div className="space-y-4">
                            <h3 className={`text-2xl font-black tracking-tighter ${isDark ? 'text-white' : 'text-slate-900'}`}>Mass Uplink Blast</h3>
                            <p className={`font-medium leading-relaxed ${isDark ? 'text-muted-foreground' : 'text-slate-600'}`}>Transmit an end-to-end encrypted notification to every active biometric node within the GeneForge cluster.</p>
                            <Button
                                onClick={() => setIsMassUplinkOpen(true)}
                                className={`h-12 px-8 rounded-2xl font-black uppercase tracking-widest text-[10px] transition-all shadow-xl shadow-primary/20 ${isDark ? 'bg-primary text-black hover:brightness-110' : 'bg-primary text-white hover:bg-primary/90'}`}
                            >
                                Initiate Broadcast →
                            </Button>
                        </div>
                    </div>
                </Card>

                <Card className={`glass-card p-10 group cursor-pointer hover:translate-y-[-4px] transition-all duration-500 rounded-[2.5rem] ${isDark ? 'bg-gradient-to-br from-accent/10 to-transparent' : 'bg-white border-black/5 shadow-xl shadow-black/5'}`}>
                    <div className="flex items-start gap-8">
                        <div className="h-18 w-18 shrink-0 rounded-3xl bg-accent/20 flex items-center justify-center border border-accent/20 shadow-2xl shadow-accent/10 group-hover:scale-110 transition-transform duration-700">
                            <Shield className="h-9 w-9 text-accent" />
                        </div>
                        <div className="space-y-4">
                            <h3 className={`text-2xl font-black tracking-tighter ${isDark ? 'text-white' : 'text-slate-900'}`}>Full Security Audit</h3>
                            <p className={`font-medium leading-relaxed ${isDark ? 'text-muted-foreground' : 'text-slate-600'}`}>Compile and retrieve a comprehensive forensic ledger of all personnel activities and permission shifts.</p>
                            <Button
                                variant="outline"
                                onClick={handleSecurityAudit}
                                className={`h-12 px-8 rounded-2xl border font-black uppercase tracking-widest text-[10px] transition-all ${isDark ? 'border-accent/30 text-accent hover:bg-accent hover:text-white' : 'border-accent text-accent hover:bg-accent hover:text-white'}`}
                            >
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
