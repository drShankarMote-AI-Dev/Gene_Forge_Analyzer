import { createRoot } from 'react-dom/client'
import App from './App.tsx'
import './index.css'
import { ThemeProvider } from './theme/ThemeProvider'
import { GoogleOAuthProvider } from '@react-oauth/google'
import { Analytics } from '@vercel/analytics/react'

// Add a fade animation for theme change
document.documentElement.style.transition = 'background 0.5s, color 0.5s';

const GOOGLE_CLIENT_ID = import.meta.env.VITE_GOOGLE_CLIENT_ID;

if (!GOOGLE_CLIENT_ID || GOOGLE_CLIENT_ID.includes('your-google-client-id')) {
  console.warn("⚠️ GOOGLE_CLIENT_ID is not configured. Please set VITE_GOOGLE_CLIENT_ID in your .env file.");
}

createRoot(document.getElementById("root")!).render(
  <GoogleOAuthProvider clientId={GOOGLE_CLIENT_ID}>
    <ThemeProvider>
      <App />
      <Analytics />
    </ThemeProvider>
  </GoogleOAuthProvider>
);