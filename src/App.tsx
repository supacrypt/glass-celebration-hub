import { useState } from 'react';
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, useNavigate, useLocation } from "react-router-dom";
import GlassLayout from "./components/GlassLayout";
import Home from "./pages/Home";
import Venue from "./pages/Venue";
import Dashboard from "./pages/Dashboard";
import Social from "./pages/Social";
import Gallery from "./pages/Gallery";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const AppContent = () => {
  const location = useLocation();
  const navigate = useNavigate();
  
  // Extract current route from pathname
  const currentRoute = location.pathname === '/' ? 'home' : location.pathname.slice(1);
  
  const handleNavigate = (route: string) => {
    const path = route === 'home' ? '/' : `/${route}`;
    navigate(path);
  };

  return (
    <GlassLayout activeRoute={currentRoute} onNavigate={handleNavigate}>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/venue" element={<Venue />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/social" element={<Social />} />
        <Route path="/gallery" element={<Gallery />} />
        {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
        <Route path="*" element={<NotFound />} />
      </Routes>
    </GlassLayout>
  );
};

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <AppContent />
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
