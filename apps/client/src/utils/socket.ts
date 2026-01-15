import { io, Socket } from "socket.io-client";

// Get the backend URL from environment variables
// In production, VITE_API_URL should be the full URL to the backend (e.g., https://backend.onrender.com)
// In development, it might be /api (handled by Vite proxy) or http://localhost:5000
const getSocketUrl = () => {
    const apiUrl = import.meta.env.VITE_API_URL || "";
    if (apiUrl.startsWith('http')) {
        return apiUrl.replace('/api', '');
    }
    // Fallback for relative paths or development
    return window.location.origin.includes('localhost') ? 'http://localhost:5000' : window.location.origin;
};

export const socket: Socket = io(getSocketUrl(), {
    transports: ["websocket"],
    autoConnect: false, // Components will connect/disconnect as needed
});

socket.on("connect", () => console.log("Connected to backend!"));
socket.on("connect_error", (error) => console.error("Socket Connection Error:", error));

export default socket;
