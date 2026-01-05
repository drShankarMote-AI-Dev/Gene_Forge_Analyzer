import { createRoot } from 'react-dom/client'
import App from './App.tsx'
import './index.css'
import { ThemeProvider } from './theme/ThemeProvider'

// Add a fade animation for theme change
document.documentElement.style.transition = 'background 0.5s, color 0.5s';

createRoot(document.getElementById("root")!).render(
  <ThemeProvider>
    <App />
  </ThemeProvider>
);