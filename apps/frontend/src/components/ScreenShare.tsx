import React, { useState, useEffect, useRef, useCallback, useMemo } from 'react';
import { socket } from '../utils/socket';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import {
    Monitor,
    MonitorOff,
    Radio,
    Lock
} from 'lucide-react';
import { useAuth } from '../hooks/useAuth';
import { toast } from './ui/use-toast';

interface WebRTCSignalData {
    offer?: RTCSessionDescriptionInit;
    answer?: RTCSessionDescriptionInit;
    candidate?: RTCIceCandidateInit;
    room: string;
}

const ScreenShare: React.FC = () => {
    const { user, isAuthenticated } = useAuth();
    const [isSharing, setIsSharing] = useState(false);
    const [isReceiving, setIsReceiving] = useState(false);
    const [room] = useState('global-lab');
    const peerConnectionRef = useRef<RTCPeerConnection | null>(null);
    const localStreamRef = useRef<MediaStream | null>(null);
    const remoteVideoRef = useRef<HTMLVideoElement>(null);

    const iceServers = useMemo(() => ({
        iceServers: [
            { urls: 'stun:stun.l.google.com:19302' },
            { urls: 'stun:stun1.l.google.com:19302' },
        ]
    }), []);

    const createPeerConnection = useCallback(() => {
        const pc = new RTCPeerConnection(iceServers);

        pc.onicecandidate = (event) => {
            if (event.candidate) {
                socket.emit('webrtc-ice-candidate', {
                    candidate: event.candidate,
                    room
                });
            }
        };

        pc.ontrack = (event) => {
            if (remoteVideoRef.current) {
                remoteVideoRef.current.srcObject = event.streams[0];
                setIsReceiving(true);
            }
        };

        return pc;
    }, [iceServers, room]);

    const processOffer = useCallback(async (offer: RTCSessionDescriptionInit) => {
        peerConnectionRef.current = createPeerConnection();
        await peerConnectionRef.current.setRemoteDescription(new RTCSessionDescription(offer));

        const answer = await peerConnectionRef.current.createAnswer();
        await peerConnectionRef.current.setLocalDescription(answer);

        socket.emit('webrtc-answer', { answer, room });
    }, [createPeerConnection, room]);

    const processAnswer = useCallback(async (answer: RTCSessionDescriptionInit) => {
        await peerConnectionRef.current?.setRemoteDescription(new RTCSessionDescription(answer));
    }, []);

    const processIceCandidate = useCallback(async (candidate: RTCIceCandidateInit) => {
        try {
            await peerConnectionRef.current?.addIceCandidate(new RTCIceCandidate(candidate));
        } catch (e) {
            console.error("Error adding ice candidate", e);
        }
    }, []);

    const stopSharing = useCallback(() => {
        localStreamRef.current?.getTracks().forEach(track => track.stop());
        peerConnectionRef.current?.close();
        setIsSharing(false);
        setIsReceiving(false);
    }, []);

    useEffect(() => {
        if (isAuthenticated) {
            if (!socket.connected) {
                socket.connect();
            }

            socket.emit('join', { room, user: user?.email });

            const handleOffer = async (data: WebRTCSignalData) => {
                if (isSharing || !data.offer) return;
                await processOffer(data.offer);
            };

            const handleAnswer = async (data: WebRTCSignalData) => {
                if (!data.answer) return;
                await processAnswer(data.answer);
            };

            const handleIceCandidate = async (data: WebRTCSignalData) => {
                if (!data.candidate) return;
                await processIceCandidate(data.candidate);
            };

            socket.on('webrtc-offer', handleOffer);
            socket.on('webrtc-answer', handleAnswer);
            socket.on('webrtc-ice-candidate', handleIceCandidate);

            return () => {
                stopSharing();
                socket.off('webrtc-offer', handleOffer);
                socket.off('webrtc-answer', handleAnswer);
                socket.off('webrtc-ice-candidate', handleIceCandidate);
            };
        }
    }, [isAuthenticated, room, isSharing, user?.email, processOffer, processAnswer, processIceCandidate, stopSharing]);

    const startSharing = async () => {
        try {
            const stream = await navigator.mediaDevices.getDisplayMedia({ video: true });
            localStreamRef.current = stream;
            setIsSharing(true);

            peerConnectionRef.current = createPeerConnection();
            stream.getTracks().forEach(track => {
                peerConnectionRef.current?.addTrack(track, stream);
            });

            const offer = await peerConnectionRef.current.createOffer();
            await peerConnectionRef.current.setLocalDescription(offer);

            socket.emit('webrtc-offer', { offer, room });

            stream.getVideoTracks()[0].onended = () => stopSharing();

            toast({ title: "Screen Sharing Active", description: "Your analysis dashboard is being relayed securely via P2P DTLS-SRTP." });
        } catch (err) {
            console.error(err);
            toast({ title: "Sharing Failed", description: "Permission denied or browser not supported.", variant: "destructive" });
        }
    };

    if (!isAuthenticated) return null;

    return (
        <Card className="glass-card border-none shadow-2xl overflow-hidden group mb-6">
            <CardHeader className="pb-4">
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <div className={`p-2 rounded-xl transition-all ${isSharing ? 'bg-red-500/10 text-red-500 animate-pulse' : 'bg-primary/10 text-primary'}`}>
                            <Monitor className="h-5 w-5" />
                        </div>
                        <div>
                            <CardTitle className="text-xl font-bold tracking-tight">Analysis Review Portal</CardTitle>
                            <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-muted-foreground mt-1">
                                Secure P2P Screen Relay
                            </p>
                        </div>
                    </div>
                    {isSharing && (
                        <div className="flex items-center gap-2 px-3 py-1 bg-red-500/10 border border-red-500/20 rounded-full">
                            <Radio className="h-3 w-3 text-red-500 animate-ping" />
                            <span className="text-[9px] font-black text-red-500 uppercase tracking-widest">Live Broadcast</span>
                        </div>
                    )}
                </div>
            </CardHeader>

            <CardContent className="space-y-4">
                <div className={`relative aspect-video rounded-3xl overflow-hidden border border-white/5 transition-all ${isReceiving || isSharing ? 'bg-black' : 'bg-muted/30 flex flex-col items-center justify-center opacity-40'}`}>
                    <video
                        ref={remoteVideoRef}
                        autoPlay
                        playsInline
                        className={`w-full h-full object-contain ${isSharing ? 'hidden' : ''}`}
                    />

                    {isSharing && (
                        <div className="flex flex-col items-center justify-center h-full space-y-4">
                            <div className="p-6 rounded-full bg-red-500/20 text-red-500">
                                <Monitor className="h-12 w-12" />
                            </div>
                            <p className="text-xs font-bold uppercase tracking-widest text-red-500">Screen Relaying via DTLS Encryption</p>
                        </div>
                    )}

                    {!isReceiving && !isSharing && (
                        <>
                            <MonitorOff className="h-12 w-12 mb-4" />
                            <p className="text-[10px] font-bold uppercase tracking-widest">Awaiting Peer Stream</p>
                        </>
                    )}

                    <div className="absolute top-4 left-4 p-2 glass rounded-xl flex items-center gap-2">
                        <Lock className="h-3 w-3 text-emerald-500" />
                        <span className="text-[8px] font-black uppercase tracking-widest text-white/60">DTLS-SRTP Primary</span>
                    </div>
                </div>

                <div className="flex gap-3">
                    {!isSharing ? (
                        <Button
                            onClick={startSharing}
                            className="flex-1 btn-premium py-6 rounded-xl bg-primary hover:bg-primary/90 text-primary-foreground font-bold"
                        >
                            <Monitor className="mr-2 h-4 w-4" />
                            Broadcast Analysis
                        </Button>
                    ) : (
                        <Button
                            onClick={stopSharing}
                            variant="destructive"
                            className="flex-1 py-6 rounded-xl font-bold"
                        >
                            <MonitorOff className="mr-2 h-4 w-4" />
                            Stop Transmission
                        </Button>
                    )}
                </div>

                <p className="text-[9px] font-bold text-muted-foreground/60 text-center uppercase tracking-widest px-8 leading-relaxed">
                    Peer-to-peer streams are ephemeral and use hardware-accelerated encryption.
                    No data is stored on laboratory servers.
                </p>
            </CardContent>
        </Card>
    );
};

export default ScreenShare;
