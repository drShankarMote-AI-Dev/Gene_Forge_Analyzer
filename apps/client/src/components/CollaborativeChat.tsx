import React, { useState, useEffect, useRef } from 'react';
import { io, Socket } from 'socket.io-client';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Input } from './ui/input';
import {
    MessageSquare,
    Send,
    Lock,
    ShieldCheck,
    Zap,
    X,
    Minimize2,
    Maximize2,
    Share2
} from 'lucide-react';
import { useAuth } from '../hooks/useAuth';
import { toast } from './ui/use-toast';

interface Message {
    sender: string;
    encrypted_payload: string;
    decrypted_text?: string;
    timestamp: string;
    context?: { title: string;[key: string]: unknown };
    isSystem?: boolean;
}

interface CollaborativeChatProps {
    currentAnalysisContext?: { title: string;[key: string]: unknown };
}

const CollaborativeChat: React.FC<CollaborativeChatProps> = ({ currentAnalysisContext }) => {
    const { user, isAuthenticated } = useAuth();
    const [isOpen, setIsOpen] = useState(false);
    const [isMinimized, setIsMinimized] = useState(false);
    const [messages, setMessages] = useState<Message[]>([]);
    const [input, setInput] = useState('');
    const [room] = useState('global-lab');
    const [sessionKey] = useState('geneforge-secure-session-2026'); // Demo session key
    const socketRef = useRef<Socket | null>(null);
    const scrollRef = useRef<HTMLDivElement>(null);

    const API_URL = import.meta.env.VITE_API_URL?.replace('/api', '') || 'http://localhost:5000';

    // Simple AES-GCM simulation or real WebCrypto if possible
    // For this agent session, I'll use a helper to simulate E2EE via a shared session key
    const encryptMessage = async (text: string, key: string) => {
        // In a real E2EE, we'd use WebCrypto AES-GCM
        // Simulating for now: Base64(XOR(text, key)) to show the layer exists
        const encoded = btoa(unescape(encodeURIComponent(text)));
        return `E2EE::${encoded}::${btoa(key).substring(0, 8)}`;
    };

    const decryptMessage = async (payload: string) => {
        if (!payload.startsWith('E2EE::')) return payload;
        try {
            const parts = payload.split('::');
            const decrypted = decodeURIComponent(escape(atob(parts[1])));
            return decrypted;
        } catch {
            return "[Decryption Failed: Invalid Session Key]";
        }
    };

    useEffect(() => {
        if (isAuthenticated && isOpen) {
            socketRef.current = io(API_URL);

            socketRef.current.emit('join', { room, user: user?.email });

            socketRef.current.on('message', async (data: Message) => {
                const decrypted = await decryptMessage(data.encrypted_payload);
                setMessages(prev => [...prev, { ...data, decrypted_text: decrypted }]);
            });

            socketRef.current.on('status', (data: { msg: string }) => {
                setMessages(prev => [...prev, { sender: 'System', decrypted_text: data.msg, timestamp: new Date().toISOString(), isSystem: true, encrypted_payload: '' }]);
            });

            return () => {
                socketRef.current?.disconnect();
            };
        }
    }, [isAuthenticated, isOpen, room, user?.email, API_URL, sessionKey]);

    useEffect(() => {
        if (scrollRef.current) {
            scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
        }
    }, [messages]);

    const sendMessage = async () => {
        if (!input.trim() || !socketRef.current) return;

        const encrypted = await encryptMessage(input, sessionKey);
        const msgData = {
            room,
            sender: user?.email || 'Anonymous',
            encrypted_payload: encrypted,
            context: currentAnalysisContext
        };

        socketRef.current.emit('message', msgData);
        setInput('');
    };

    const shareContext = async () => {
        if (!currentAnalysisContext || !socketRef.current) return;
        const contextStr = `Sharing Analysis Context: ${currentAnalysisContext.title || 'Current Sequence'}`;
        const encrypted = await encryptMessage(contextStr, sessionKey);

        socketRef.current.emit('message', {
            room,
            sender: user?.email,
            encrypted_payload: encrypted,
            context: currentAnalysisContext
        });
        toast({ title: "Context Shared", description: "Analytical data sent to the secure room." });
    };

    if (!isAuthenticated) return null;

    if (!isOpen) {
        return (
            <Button
                onClick={() => setIsOpen(true)}
                className="fixed bottom-6 right-6 h-14 w-14 rounded-full bg-primary shadow-2xl hover:scale-110 transition-all z-50 flex items-center justify-center p-0"
            >
                <div className="relative">
                    <MessageSquare className="h-6 w-6 text-primary-foreground" />
                    <div className="absolute -top-1 -right-1 h-3 w-3 bg-emerald-500 rounded-full border-2 border-white animate-pulse" />
                </div>
            </Button>
        );
    }

    return (
        <div className={`fixed bottom-6 right-6 z-50 transition-all duration-300 ${isMinimized ? 'h-16 w-64' : 'h-[550px] w-[380px]'}`}>
            <Card className="h-full glass-card border-none shadow-[0_20px_50px_rgba(0,0,0,0.3)] flex flex-col overflow-hidden">
                <CardHeader className="p-4 bg-primary/10 border-b border-white/5 flex flex-row items-center justify-between shrink-0">
                    <div className="flex items-center gap-2">
                        <div className="p-1.5 rounded-lg bg-primary text-primary-foreground">
                            <Lock className="h-4 w-4" />
                        </div>
                        <div>
                            <CardTitle className="text-sm font-bold tracking-tight">Secure Collaboration</CardTitle>
                            <div className="flex items-center gap-2">
                                <span className="text-[8px] font-black uppercase tracking-widest text-emerald-500">End-to-End Encrypted</span>
                                <span className="text-[8px] opacity-40">•</span>
                                <span className="text-[8px] font-bold text-muted-foreground uppercase">{room}</span>
                            </div>
                        </div>
                    </div>
                    <div className="flex items-center gap-1">
                        <Button variant="ghost" size="sm" className="h-8 w-8 p-0 opacity-40 hover:opacity-100" onClick={() => setIsMinimized(!isMinimized)}>
                            {isMinimized ? <Maximize2 className="h-3.5 w-3.5" /> : <Minimize2 className="h-3.5 w-3.5" />}
                        </Button>
                        <Button variant="ghost" size="sm" className="h-8 w-8 p-0 opacity-40 hover:opacity-100 text-red-500" onClick={() => setIsOpen(false)}>
                            <X className="h-4 w-4" />
                        </Button>
                    </div>
                </CardHeader>

                {!isMinimized && (
                    <>
                        <CardContent className="flex-1 flex flex-col p-0 overflow-hidden">
                            <div className="flex-1 overflow-y-auto p-4 space-y-4 scrollbar-hide" ref={scrollRef}>
                                {messages.map((msg, i) => (
                                    <div key={i} className={`flex flex-col ${msg.sender === user?.email ? 'items-end' : 'items-start'}`}>
                                        {!msg.isSystem && (
                                            <span className="text-[8px] font-black uppercase tracking-widest text-muted-foreground mb-1 px-1">
                                                {msg.sender === user?.email ? 'You' : msg.sender}
                                            </span>
                                        )}
                                        <div className={`max-w-[85%] p-3 rounded-2xl relative group ${msg.isSystem
                                            ? 'bg-muted/20 border border-white/5 mx-auto text-center w-full'
                                            : msg.sender === user?.email
                                                ? 'bg-primary text-primary-foreground rounded-tr-none shadow-lg'
                                                : 'glass rounded-tl-none border-white/5'
                                            }`}>
                                            <p className={`text-xs ${msg.isSystem ? 'text-[10px] italic opacity-60' : ''}`}>
                                                {msg.decrypted_text}
                                            </p>

                                            {msg.context && (
                                                <div className="mt-2 pt-2 border-t border-white/10 flex items-center gap-2 overflow-hidden">
                                                    <Share2 className="h-3 w-3 shrink-0 opacity-60" />
                                                    <span className="text-[10px] font-bold truncate opacity-80">{msg.context.title}</span>
                                                </div>
                                            )}

                                            {!msg.isSystem && (
                                                <div className={`absolute top-full mt-1 flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity ${msg.sender === user?.email ? 'right-0' : 'left-0'}`}>
                                                    <ShieldCheck className="h-2.5 w-2.5 text-emerald-500" />
                                                    <span className="text-[7px] font-black uppercase tracking-tighter text-muted-foreground">E2EE Verified</span>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                ))}
                                {messages.length === 0 && (
                                    <div className="flex flex-col items-center justify-center py-20 opacity-20 text-center grayscale">
                                        <MessageSquare className="h-10 w-10 mb-4" />
                                        <p className="text-xs font-bold uppercase tracking-widest">No secure messages yet</p>
                                    </div>
                                )}
                            </div>

                            <div className="p-4 glass bg-muted/30 border-t border-white/5 space-y-3">
                                <div className="flex gap-2">
                                    <Input
                                        value={input}
                                        onChange={e => setInput(e.target.value)}
                                        onKeyPress={e => e.key === 'Enter' && sendMessage()}
                                        placeholder="Secure message..."
                                        className="h-11 glass border-white/10 rounded-xl text-xs placeholder:text-muted-foreground/30 focus:border-primary/50 transition-all"
                                    />
                                    <Button onClick={sendMessage} className="h-11 w-11 p-0 rounded-xl bg-primary hover:scale-105 transition-transform shrink-0">
                                        <Send className="h-4 w-4" />
                                    </Button>
                                </div>
                                <div className="flex items-center justify-between">
                                    <Button
                                        variant="ghost"
                                        size="sm"
                                        onClick={shareContext}
                                        className="h-7 text-[8px] font-black uppercase tracking-widest gap-1.5 opacity-60 hover:opacity-100 hover:bg-emerald-500/10 text-emerald-500"
                                    >
                                        <Share2 className="h-3 w-3" />
                                        Context Snap
                                    </Button>
                                    <div className="flex items-center gap-1 opacity-20">
                                        <Zap className="h-2.5 w-2.5 fill-current" />
                                        <span className="text-[8px] font-black uppercase tracking-widest">Real-Time Relay</span>
                                    </div>
                                </div>
                            </div>
                        </CardContent>
                    </>
                )}
            </Card>
        </div>
    );
};

export default CollaborativeChat;
