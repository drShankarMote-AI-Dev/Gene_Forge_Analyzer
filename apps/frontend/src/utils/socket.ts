import { io, Socket } from "socket.io-client";

// Get the backend URL from environment variables
// In production, VITE_API_URL should be the full URL to the backend (e.g., https://backend.onrender.com)
// In development, it might be /api (handled by Vite proxy) or http://localhost:5000
const getSocketUrl = () => {
    const apiUrl = import.meta.env.VITE_API_URL || "/api";
    // If it's a relative path starting with /api, we should use the same domain but strip /api for socket.io
    if (apiUrl.startsWith('/')) {
        return window.location.origin;
    }
    // If it's a full URL, strip the /api suffix if it exists for socket.io connection
    return apiUrl.replace(/\/api$/, '');
};

export const socket: Socket = io(getSocketUrl(), {
    transports: ["websocket"],
    autoConnect: false, // Components will connect/disconnect as needed
});

socket.on("connect", () => { }); // Connection successful
socket.on("connect_error", (error) => console.error("Socket Connection Error:", error));

export default socket;
