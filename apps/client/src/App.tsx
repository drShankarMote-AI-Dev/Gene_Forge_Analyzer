import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate, Outlet } from "react-router-dom";
import Index from "./pages/index.tsx";
import Tools from "./pages/Tools";
import NotFound from "./pages/NotFound";
import Home from "./pages/Home";
import SecurityCompliance from "./pages/SecurityCompliance";
import AdminAI from "./pages/AdminAI";
import AdminDashboard from "./pages/AdminDashboard";
import AdminUsers from "./pages/AdminUsers";
import AdminLogs from "./pages/AdminLogs";
import AdminLogin from "./pages/AdminLogin";
import Navbar from "./components/Navbar";
import AdminLayout from "./components/admin/AdminLayout";
import { AuthProvider } from "./hooks/useAuth";

const queryClient = new QueryClient();

const AppContent = () => {
  return (
    <Routes>
      {/* Admin Specific Routes (Wrapped in AdminLayout) */}
      <Route element={<AdminLayoutWrapper />}>
        <Route path="/admin/dashboard" element={<AdminDashboard />} />
        <Route path="/admin/ai" element={<AdminAI />} />
        <Route path="/admin/users" element={<AdminUsers />} />
        <Route path="/admin/logs" element={<AdminLogs />} />
      </Route>

      {/* Admin Login (Full Screen, no Sidebar/Navbar) */}
      <Route path="/admin/login" element={<AdminLogin />} />
      <Route path="/admin" element={<Navigate to="/admin/login" replace />} />

      {/* Public Routes (Wrapped in Navbar/Standard Layout) */}
      <Route element={<PublicLayout />}>
        <Route path="/" element={<Home />} />
        <Route path="/analysis" element={<Index />} />
        <Route path="/tools" element={<Tools />} />
        <Route path="/security" element={<SecurityCompliance />} />
        <Route path="*" element={<NotFound />} />
      </Route>
    </Routes>
  );
};

// Layout Wrappers
const AdminLayoutWrapper = () => (
  <AdminLayout>
    <Outlet />
  </AdminLayout>
);

const PublicLayout = () => (
  <div className="min-h-screen bg-background transition-colors duration-500">
    <Navbar />
    <div className="pt-24 pb-20">
      <Outlet />
    </div>
  </div>
);


const App = () => (
  <QueryClientProvider client={queryClient}>
    <BrowserRouter>
      <AuthProvider>
        <TooltipProvider>
          <Toaster />
          <Sonner />
          <AppContent />
        </TooltipProvider>
      </AuthProvider>
    </BrowserRouter>
  </QueryClientProvider>
);

export default App;

