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
    Filter
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
            <Loader2 className="animate-spin h-12 w-12 text-primary" />
            <p className="text-sm font-black uppercase tracking-[0.2em] animate-pulse">Syncing Personnel Database...</p>
        </div>
    );

    return (
        <div className="space-y-10">
            <header className="flex flex-col gap-2">
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                        <div className="p-3 bg-primary/10 rounded-2xl">
                            <Users className="h-6 w-6 text-primary" />
                        </div>
                        <div>
                            <h1 className="text-4xl font-black tracking-tighter">User <span className="text-primary italic">Management</span></h1>
                            <p className="text-muted-foreground font-medium text-sm italic">Review and manage site-wide access permissions</p>
                        </div>
                    </div>
                </div>
            </header>

            <Card className="glass-card border-white/5 overflow-hidden">
                <CardHeader className="bg-white/5 border-b border-white/5 pb-8">
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mt-4">
                        <div className="relative flex-1 max-w-md">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                            <Input
                                placeholder="Search by email or role..."
                                className="pl-10 bg-black/20 border-white/10"
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                            />
                        </div>
                        <div className="flex items-center gap-3">
                            <Dialog open={isAddUserOpen} onOpenChange={setIsAddUserOpen}>
                                <DialogTrigger asChild>
                                    <Button className="bg-primary hover:bg-primary/90 text-xs font-black uppercase tracking-widest px-6">
                                        + Enroll Personnel
                                    </Button>
                                </DialogTrigger>
                                <DialogContent className="glass-card border-white/10">
                                    <DialogHeader>
                                        <DialogTitle className="text-xl font-black tracking-tight uppercase italic">Secure <span className="text-primary not-italic">Enrollment</span></DialogTitle>
                                        <DialogDescription className="text-xs font-medium uppercase tracking-wider opacity-60">Authorize new identity for cluster access</DialogDescription>
                                    </DialogHeader>
                                    <form onSubmit={handleAddUser} className="space-y-6 pt-4">
                                        <div className="space-y-2">
                                            <Label className="text-[10px] font-black uppercase tracking-widest opacity-70">Terminal ID (Email)</Label>
                                            <Input
                                                type="email"
                                                placeholder="researcher@institute.edu"
                                                className="bg-black/40 border-white/5 rounded-xl h-11 font-bold"
                                                value={newUserEmail}
                                                onChange={(e) => setNewUserEmail(e.target.value)}
                                                required
                                            />
                                        </div>
                                        <div className="space-y-2">
                                            <Label className="text-[10px] font-black uppercase tracking-widest opacity-70">Access Permission Tier</Label>
                                            <Select value={newUserRole} onValueChange={setNewUserRole}>
                                                <SelectTrigger className="bg-black/40 border-white/5 rounded-xl h-11 font-bold">
                                                    <SelectValue placeholder="Select Tier" />
                                                </SelectTrigger>
                                                <SelectContent className="glass-card border-white/10">
                                                    <SelectItem value="user" className="font-bold text-xs uppercase tracking-widest">Standard User</SelectItem>
                                                    <SelectItem value="researcher" className="font-bold text-xs uppercase tracking-widest text-purple-400">Researcher Tier</SelectItem>
                                                    <SelectItem value="admin" className="font-bold text-xs uppercase tracking-widest text-primary">System Admin</SelectItem>
                                                </SelectContent>
                                            </Select>
                                        </div>
                                        <DialogFooter className="pt-4">
                                            <Button type="button" variant="ghost" onClick={() => setIsAddUserOpen(false)} className="text-[10px] font-black uppercase tracking-widest">Abort</Button>
                                            <Button type="submit" className="bg-primary text-[10px] font-black uppercase tracking-widest px-8" disabled={isSubmitting}>
                                                {isSubmitting ? <Loader2 className="animate-spin h-4 w-4" /> : "Authorize Node"}
                                            </Button>
                                        </DialogFooter>
                                    </form>
                                </DialogContent>
                            </Dialog>
                            <Button variant="outline" className="bg-black/20 border-white/10 text-xs font-bold uppercase tracking-widest">
                                <Filter className="mr-2 h-4 w-4" /> Filter
                            </Button>
                        </div>
                    </div>
                </CardHeader>
                <CardContent className="p-0">
                    <div className="overflow-x-auto">
                        <table className="w-full text-left">
                            <thead className="bg-primary/5">
                                <tr>
                                    <th className="px-6 py-4 text-[10px] font-black uppercase tracking-widest text-muted-foreground">User Information</th>
                                    <th className="px-6 py-4 text-[10px] font-black uppercase tracking-widest text-muted-foreground">Permission Role</th>
                                    <th className="px-6 py-4 text-[10px] font-black uppercase tracking-widest text-muted-foreground">Joined Cluster</th>
                                    <th className="px-6 py-4 text-right text-[10px] font-black uppercase tracking-widest text-muted-foreground">Operations</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-white/5">
                                {filteredUsers.map((u) => (
                                    <tr key={u.id} className="hover:bg-primary/[0.02] transition-colors group">
                                        <td className="px-6 py-5">
                                            <div className="flex items-center gap-4">
                                                <div className="h-10 w-10 rounded-full bg-gradient-to-br from-primary/20 to-accent/20 flex items-center justify-center border border-white/5">
                                                    <span className="text-xs font-black text-primary">{u.email[0].toUpperCase()}</span>
                                                </div>
                                                <div>
                                                    <p className="text-sm font-black tracking-tight">{u.email}</p>
                                                    <p className="text-[10px] text-muted-foreground uppercase font-bold tracking-tighter">ID: #{u.id}</p>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-5">
                                            <Badge className={`uppercase text-[9px] font-black tracking-widest px-3 py-1 border-none ${u.role === 'admin'
                                                ? 'bg-primary/20 text-primary'
                                                : u.role === 'researcher'
                                                    ? 'bg-purple-500/20 text-purple-400'
                                                    : 'bg-zinc-500/20 text-zinc-400'
                                                }`}>
                                                {u.role === 'admin' && <ShieldCheck className="mr-1 h-3 w-3" />}
                                                {u.role}
                                            </Badge>
                                        </td>
                                        <td className="px-6 py-5">
                                            <div className="flex flex-col">
                                                <span className="text-xs font-bold">{new Date(u.created_at).toLocaleDateString()}</span>
                                                <span className="text-[10px] text-muted-foreground uppercase font-black">{new Date(u.created_at).toLocaleTimeString()}</span>
                                            </div>
                                        </td>
                                        <td className="px-6 py-5 text-right">
                                            <DropdownMenu>
                                                <DropdownMenuTrigger asChild>
                                                    <Button variant="ghost" className="h-8 w-8 p-0 hover:bg-white/10">
                                                        <MoreHorizontal className="h-4 w-4" />
                                                    </Button>
                                                </DropdownMenuTrigger>
                                                <DropdownMenuContent align="end" className="glass-card border-white/10 w-48">
                                                    <DropdownMenuLabel className="text-[10px] font-black uppercase tracking-widest opacity-50">Permissions</DropdownMenuLabel>
                                                    <DropdownMenuItem className="text-xs font-bold cursor-pointer">View Research Portfolio</DropdownMenuItem>
                                                    <DropdownMenuItem className="text-xs font-bold cursor-pointer">Modify Node Access</DropdownMenuItem>
                                                    <DropdownMenuSeparator className="bg-white/5" />
                                                    <DropdownMenuItem className="text-xs font-bold cursor-pointer text-destructive">Deactivate Access</DropdownMenuItem>
                                                </DropdownMenuContent>
                                            </DropdownMenu>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                        {filteredUsers.length === 0 && (
                            <div className="p-20 text-center">
                                <p className="text-sm font-black uppercase tracking-widest text-muted-foreground italic">No matching personnel records found</p>
                            </div>
                        )}
                    </div>
                </CardContent>
            </Card>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 pt-4">
                <Card className="glass-card bg-primary/5 border-primary/20 p-6">
                    <div className="flex gap-4">
                        <div className="h-12 w-12 rounded-xl bg-primary/20 flex items-center justify-center">
                            <Mail className="h-6 w-6 text-primary" />
                        </div>
                        <div>
                            <h3 className="text-lg font-black tracking-tight">Mass Broadcast</h3>
                            <p className="text-xs font-medium text-muted-foreground mt-1">Send a cryptographic notification to all registered nodes in the cluster.</p>
                            <Button className="mt-4 bg-primary text-[10px] font-black uppercase tracking-widest px-6 h-9">Transmit Signal</Button>
                        </div>
                    </div>
                </Card>
                <Card className="glass-card bg-accent/5 border-accent/20 p-6">
                    <div className="flex gap-4">
                        <div className="h-12 w-12 rounded-xl bg-accent/20 flex items-center justify-center">
                            <Calendar className="h-6 w-6 text-accent" />
                        </div>
                        <div>
                            <h3 className="text-lg font-black tracking-tight">Access Audit</h3>
                            <p className="text-xs font-medium text-muted-foreground mt-1">Generate a comprehensive report of all security-level access for the current quarter.</p>
                            <Button variant="outline" className="mt-4 border-accent/30 text-accent text-[10px] font-black uppercase tracking-widest px-6 h-9 hover:bg-accent/10">Download Report</Button>
                        </div>
                    </div>
                </Card>
            </div>
        </div>
    );
};

export default AdminUsers;
