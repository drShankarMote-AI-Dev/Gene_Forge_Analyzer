import React, { useState, useEffect, useCallback } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { toast } from './ui/use-toast';
import {
    FolderPlus,
    Folder,
    History,
    Trash2,
    Play,
    Loader2,
    Search,
    Plus
} from 'lucide-react';
import { useAuth } from '../hooks/useAuth';
import { API_BASE_URL as API_URL } from '@/utils/api';

interface Project {
    id: number;
    name: string;
    created_at: string;
    analysis_count: number;
}

interface AnalysisVersion {
    id: number;
    version: number;
    created_at: string;
}

interface ProjectManagerProps {
    onLoadAnalysis: (sequence: string, results: unknown) => void;
    currentSequence: string;
    currentResults?: unknown;
}

const ProjectManager: React.FC<ProjectManagerProps> = ({ onLoadAnalysis, currentSequence, currentResults }) => {
    const [projects, setProjects] = useState<Project[]>([]);
    const [loading, setLoading] = useState(false);
    const [newProjectName, setNewProjectName] = useState('');
    const [selectedProject, setSelectedProject] = useState<Project | null>(null);
    const [versions, setVersions] = useState<AnalysisVersion[]>([]);
    const [loadingVersions, setLoadingVersions] = useState(false);
    const { isAuthenticated } = useAuth();

    const fetchProjects = useCallback(async () => {
        setLoading(true);
        try {
            const resp = await fetch(`${API_URL}/projects`, { credentials: 'include' });
            if (resp.ok) setProjects(await resp.json());
        } finally {
            setLoading(false);
        }
    }, []);

    const createProject = async () => {
        if (!newProjectName.trim()) return;
        try {
            const resp = await fetch(`${API_URL}/projects`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                credentials: 'include',
                body: JSON.stringify({ name: newProjectName })
            });
            if (resp.ok) {
                setNewProjectName('');
                fetchProjects();
                toast({ title: "Project Created", description: "You can now save analysis session to this project." });
            }
        } catch {
            toast({ title: "Error", description: "Failed to create project", variant: "destructive" });
        }
    };

    const deleteProject = async (id: number) => {
        if (!confirm("Are you sure? This will delete all analysis history for this project.")) return;
        try {
            const resp = await fetch(`${API_URL}/projects/${id}`, {
                method: 'DELETE',
                credentials: 'include'
            });
            if (resp.ok) {
                if (selectedProject?.id === id) setSelectedProject(null);
                fetchProjects();
                toast({ title: "Project Deleted" });
            }
        } catch {
            toast({ title: "Error", description: "Delete failed", variant: "destructive" });
        }
    };

    const fetchVersions = async (projectId: number) => {
        setLoadingVersions(true);
        try {
            const resp = await fetch(`${API_URL}/projects/${projectId}/analysis`, { credentials: 'include' });
            if (resp.ok) setVersions(await resp.json());
        } finally {
            setLoadingVersions(false);
        }
    };

    const loadVersion = async (analysisId: number) => {
        try {
            const resp = await fetch(`${API_URL}/analysis/${analysisId}`, { credentials: 'include' });
            if (resp.ok) {
                const data = await resp.json();
                onLoadAnalysis(data.sequence, data.results);
                toast({ title: "Analysis Restored", description: `Loaded version ${data.version} from secure storage.` });
            }
        } catch {
            toast({ title: "Error", description: "Failed to load history", variant: "destructive" });
        }
    };

    const saveCurrentToProject = async () => {
        if (!selectedProject || !currentSequence) {
            toast({ title: "Selection Required", description: "Select a project and ensure sequence data is present." });
            return;
        }

        try {
            const resp = await fetch(`${API_URL}/projects/${selectedProject.id}/analysis`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                credentials: 'include',
                body: JSON.stringify({
                    sequence: currentSequence,
                    results: currentResults || {}
                })
            });

            if (resp.ok) {
                fetchVersions(selectedProject.id);
                fetchProjects(); // Refresh counts
                toast({ title: "Snapshot Saved", description: "Current session encrypted and versioned." });
            }
        } catch {
            toast({ title: "Error", description: "Save failed", variant: "destructive" });
        }
    };

    useEffect(() => {
        if (isAuthenticated) fetchProjects();
    }, [isAuthenticated, fetchProjects]);

    if (!isAuthenticated) return null;

    return (
        <Card className="glass-card border-none shadow-2xl overflow-hidden">
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-emerald-500 via-primary to-emerald-500 opacity-50" />
            <CardHeader className="pb-4">
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <div className="p-2 rounded-xl bg-emerald-500/10 text-emerald-500">
                            <Folder className="h-5 w-5" />
                        </div>
                        <div>
                            <CardTitle className="text-xl font-bold tracking-tight">Project Dashboard</CardTitle>
                            <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-muted-foreground mt-1">
                                Secure Session Management
                            </p>
                        </div>
                    </div>
                </div>
            </CardHeader>

            <CardContent className="space-y-6">
                <div className="flex gap-2">
                    <Input
                        placeholder="Project name..."
                        value={newProjectName}
                        onChange={e => setNewProjectName(e.target.value)}
                        className="glass bg-background/50 border-border/50 rounded-xl px-4 py-2"
                    />
                    <Button onClick={createProject} className="bg-emerald-500 hover:bg-emerald-600 rounded-xl px-4">
                        <Plus className="h-4 w-4" />
                    </Button>
                </div>

                <div className="grid grid-cols-1 gap-6">
                    <div className="space-y-3">
                        <div className="flex items-center justify-between px-1">
                            <span className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Active Projects</span>
                            <Button variant="ghost" size="sm" onClick={fetchProjects} disabled={loading} className="h-6 w-6 p-0">
                                {loading ? <Loader2 className="h-3 w-3 animate-spin" /> : <Search className="h-3 w-3" />}
                            </Button>
                        </div>
                        <div className="space-y-2 max-h-[160px] overflow-y-auto pr-2 scrollbar-hide">
                            {projects.map(p => (
                                <div
                                    key={p.id}
                                    onClick={() => { setSelectedProject(p); fetchVersions(p.id); }}
                                    className={`p-3 rounded-xl border transition-all cursor-pointer flex items-center justify-between group ${selectedProject?.id === p.id
                                        ? 'bg-emerald-500/10 border-emerald-500/50'
                                        : 'glass border-transparent hover:border-primary/20'
                                        }`}
                                >
                                    <div className="flex items-center gap-3">
                                        <Folder className={`h-4 w-4 ${selectedProject?.id === p.id ? 'text-emerald-500' : 'text-muted-foreground/50'}`} />
                                        <div>
                                            <h4 className="text-xs font-bold truncate max-w-[120px]">{p.name}</h4>
                                            <p className="text-[8px] font-black text-muted-foreground/60 uppercase tracking-tighter">
                                                {p.analysis_count} Snapshots
                                            </p>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                        <Button
                                            variant="ghost"
                                            size="sm"
                                            className="h-7 w-7 p-0 text-red-500 hover:text-red-600 hover:bg-red-50"
                                            onClick={(e) => { e.stopPropagation(); deleteProject(p.id); }}
                                        >
                                            <Trash2 className="h-3.5 w-3.5" />
                                        </Button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    <div className="space-y-3 pt-4 border-t border-border/10">
                        <div className="flex items-center justify-between px-1">
                            <span className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Version History</span>
                            <History className="h-3 w-3 text-muted-foreground opacity-50" />
                        </div>
                        <div className="space-y-2 max-h-[220px] overflow-y-auto pr-2 scrollbar-hide">
                            {selectedProject ? (
                                loadingVersions ? (
                                    <div className="flex flex-col items-center justify-center py-10 opacity-30">
                                        <Loader2 className="h-6 w-6 animate-spin mb-2" />
                                        <span className="text-[8px] font-bold uppercase tracking-widest">Retrieving...</span>
                                    </div>
                                ) : versions.length === 0 ? (
                                    <div className="flex flex-col items-center justify-center py-10 opacity-20 text-center">
                                        <History className="h-8 w-8 mb-2" />
                                        <p className="text-[8px] font-bold uppercase tracking-widest leading-relaxed">No history found for<br />this project</p>
                                    </div>
                                ) : (
                                    versions.map(v => (
                                        <div
                                            key={v.id}
                                            className="p-3 rounded-xl glass border border-transparent hover:border-primary/20 transition-all flex items-center justify-between group"
                                        >
                                            <div>
                                                <div className="flex items-center gap-2">
                                                    <span className="text-[10px] font-black text-primary">v{v.version}</span>
                                                    <span className="text-[10px] font-medium text-muted-foreground">
                                                        {new Date(v.created_at).toLocaleDateString()}
                                                    </span>
                                                </div>
                                            </div>
                                            <Button
                                                size="sm"
                                                variant="outline"
                                                className="h-8 rounded-lg border-primary/20 hover:bg-primary/10 text-[9px] font-black uppercase"
                                                onClick={() => loadVersion(v.id)}
                                            >
                                                <Play className="h-3 w-3 mr-1" />
                                                Restore
                                            </Button>
                                        </div>
                                    ))
                                )
                            ) : (
                                <div className="flex flex-col items-center justify-center py-10 opacity-10 text-center grayscale">
                                    <FolderPlus className="h-10 w-10 mb-2" />
                                    <p className="text-[9px] font-bold uppercase tracking-widest">Select a project to<br />view history</p>
                                </div>
                            )}
                        </div>
                        {selectedProject && (
                            <Button
                                onClick={saveCurrentToProject}
                                className="w-full mt-4 bg-emerald-500 hover:bg-emerald-600 rounded-xl h-11 font-bold text-[10px] uppercase shadow-lg shadow-emerald-500/20"
                                disabled={!currentSequence}
                            >
                                <History className="h-3.5 w-3.5 mr-2" />
                                Save Current Snapshot
                            </Button>
                        )}
                    </div>
                </div>
            </CardContent>
        </Card>
    );
};

export default ProjectManager;
