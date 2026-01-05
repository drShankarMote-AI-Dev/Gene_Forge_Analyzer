import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/index.tsx";
import Tools from "./pages/Tools";
import NotFound from "./pages/NotFound";
import Home from "./pages/Home";
import Navbar from "./components/Navbar"; // Import the Navbar component

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <div className="min-h-screen bg-background transition-colors duration-500">
          <Navbar />
          <div className="pt-24 pb-20">
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/analysis" element={<Index />} />
              <Route path="/tools" element={<Tools />} />
              <Route path="*" element={<NotFound />} />
            </Routes>
          </div>
        </div>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
