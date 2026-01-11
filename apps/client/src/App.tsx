import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Index from "./pages/index.tsx";
import Tools from "./pages/Tools";
import NotFound from "./pages/NotFound";
import Home from "./pages/Home";
import SecurityCompliance from "./pages/SecurityCompliance";
import AdminAI from "./pages/AdminAI";
import AdminDashboard from "./pages/AdminDashboard";
import AdminLogin from "./pages/AdminLogin";
import Navbar from "./components/Navbar"; // Import the Navbar component
import { AuthProvider } from "./hooks/useAuth";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <BrowserRouter>
      <AuthProvider>
        <TooltipProvider>
          <Toaster />
          <Sonner />
          <div className="min-h-screen bg-background transition-colors duration-500">
            <Navbar />
            <div className="pt-24 pb-20">
              <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/analysis" element={<Index />} />
                <Route path="/tools" element={<Tools />} />
                <Route path="/security" element={<SecurityCompliance />} />
                <Route path="/admin/dashboard" element={<AdminDashboard />} />
                <Route path="/admin/ai" element={<AdminAI />} />
                <Route path="/admin/login" element={<AdminLogin />} />
                <Route path="/admin" element={<Navigate to="/admin/login" replace />} />
                <Route path="*" element={<NotFound />} />
              </Routes>
            </div>
          </div>
        </TooltipProvider>
      </AuthProvider>
    </BrowserRouter>
  </QueryClientProvider>
);

export default App;
