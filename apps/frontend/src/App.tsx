import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate, Outlet } from "react-router-dom";
import React, { Suspense, lazy } from 'react';
import Navbar from "./components/Navbar";
import { AuthProvider } from "./hooks/useAuth";

// Lazy load pages
const Index = lazy(() => import("./pages/index.tsx"));
const Tools = lazy(() => import("./pages/Tools"));
const Learn = lazy(() => import("./pages/Learn"));
const ToolWorkspace = lazy(() => import("./pages/ToolWorkspace"));
const NotFound = lazy(() => import("./pages/NotFound"));
const Home = lazy(() => import("./pages/Home"));
const SecurityCompliance = lazy(() => import("./pages/SecurityCompliance"));
const AdminAI = lazy(() => import("./pages/AdminAI"));
const AdminDashboard = lazy(() => import("./pages/AdminDashboard"));
const AdminUsers = lazy(() => import("./pages/AdminUsers"));
const AdminLogs = lazy(() => import("./pages/AdminLogs"));
const AdminLogin = lazy(() => import("./pages/AdminLogin"));
const AdminLayout = lazy(() => import("./components/admin/AdminLayout"));
const AdminErrorBoundary = lazy(() => import("./components/admin/AdminErrorBoundary"));

const queryClient = new QueryClient();

// Loading Fallback
const PageLoader = () => (
  <div className="min-h-screen flex items-center justify-center bg-background">
    <div className="flex flex-col items-center gap-4">
      <div className="h-12 w-12 border-4 border-primary/30 border-t-primary rounded-full animate-spin" />
      <p className="text-[10px] font-black uppercase tracking-[0.3em] text-muted-foreground animate-pulse">Initializing Neural Node...</p>
    </div>
  </div>
);

const AppContent = () => {
  return (
    <Suspense fallback={<PageLoader />}>
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
          <Route path="/tools/:toolId" element={<ToolWorkspace />} />
          <Route path="/learn" element={<Learn />} />
          <Route path="/security" element={<SecurityCompliance />} />
          <Route path="*" element={<NotFound />} />
        </Route>
      </Routes>
    </Suspense>
  );
};


// Layout Wrappers
const AdminLayoutWrapper = () => (
  <AdminErrorBoundary>
    <AdminLayout>
      <Outlet />
    </AdminLayout>
  </AdminErrorBoundary>
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

