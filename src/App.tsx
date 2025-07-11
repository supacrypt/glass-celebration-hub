import { useState, useEffect } from 'react';
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, useNavigate, useLocation, Navigate } from "react-router-dom";
import GlassLayout from "./components/GlassLayout";
import Home from "./pages/Home";
import Venue from "./pages/Venue";
import VenueDetail from "./pages/VenueDetail";
import Social from "./pages/Social";
import Gallery from "./pages/Gallery";
// GiftRegistry component removed - now redirects externally
import Accommodation from "./pages/Accommodation";
import Transport from "./pages/Transport";
import FAQ from "./pages/FAQ";
import Auth from "./pages/Auth";
import NotFound from "./pages/NotFound";
import Profile from "./pages/Profile";
import Settings from "./pages/Settings";
import Help from "./pages/Help";
import BenEan from "./pages/venues/BenEan";
import PrinceOfMereweather from "./pages/venues/PrinceOfMereweather";
import NewcastleBeach from "./pages/venues/NewcastleBeach";
import ImprovedAdminDashboard from "./pages/ImprovedAdminDashboard";
import AdminUsers from "./pages/dashboard/AdminUsers";
import AdminPhotos from "./pages/dashboard/AdminPhotos";
// AdminGifts components removed - now handled externally
import AdminRSVPs from "./pages/dashboard/AdminRSVPs";
import AdminPhotosDetail from "./pages/dashboard/AdminPhotosDetail";
import AdminUserRoles from "./pages/dashboard/AdminUserRoles";
import SocialCompose from "./pages/SocialCompose";
import { SystemTest } from "./components/test/SystemTest";
import { AuthProvider, useAuth } from "./contexts/AuthContext";

const queryClient = new QueryClient();

const AppContent = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { user, loading } = useAuth();
  
  // Extract current route from pathname
  const currentRoute = location.pathname === '/' ? 'home' : location.pathname.slice(1);
  
  const handleNavigate = (route: string) => {
    const path = route === 'home' ? '/' : `/${route}`;
    navigate(path);
  };

  // Define public routes that don't require authentication
  const publicRoutes = ['/', '/venues', '/venues/ben-ean', '/venues/prince-of-mereweather', '/venues/newcastle-beach', '/accommodation', '/transport', '/faq', '/help'];
  const isPublicRoute = publicRoutes.includes(location.pathname);
  const isAdminRoute = location.pathname.startsWith('/admin') || location.pathname.startsWith('/dashboard');

  useEffect(() => {
    // Only redirect to auth for admin routes or if user is trying to access protected content
    if (!loading && !user && isAdminRoute) {
      navigate('/auth');
    } else if (!loading && user && location.pathname === '/auth') {
      navigate('/');
    }
  }, [user, loading, location.pathname, navigate, isAdminRoute]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-wedding-navy"></div>
      </div>
    );
  }

  // Block access to admin routes without authentication
  if (!user && isAdminRoute) {
    return <Auth />;
  }

  if (location.pathname === '/auth') {
    return <Auth />;
  }

  return (
    <GlassLayout activeRoute={currentRoute} onNavigate={handleNavigate}>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/venue" element={<Venue />} />
        <Route path="/venue/detail/:venueId" element={<VenueDetail />} />
        <Route path="/venue/ben-ean" element={<BenEan />} />
        <Route path="/venue/prince-of-mereweather" element={<PrinceOfMereweather />} />
        <Route path="/venue/newcastle-beach" element={<NewcastleBeach />} />
        
        <Route path="/social" element={<Social />} />
        <Route path="/gallery" element={<Gallery />} />
        {/* Gift Registry route removed - now redirects externally */}
        <Route path="/accommodation" element={<Accommodation />} />
        <Route path="/transport" element={<Transport />} />
        {/* RSVP removed - now handled via popup on home page */}
        <Route path="/faq" element={<FAQ />} />
        <Route path="/auth" element={<Auth />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/settings" element={<Settings />} />
        <Route path="/help" element={<Help />} />
        
        {/* Dashboard Admin Routes */}
        <Route path="/admin/dashboard" element={<ImprovedAdminDashboard />} />
        <Route path="/dashboard" element={<Navigate to="/" replace />} />
        <Route path="/dashboard/users" element={<AdminUsers />} />
        <Route path="/dashboard/users/roles" element={<AdminUserRoles />} />
        <Route path="/dashboard/photos" element={<AdminPhotos />} />
        <Route path="/dashboard/photos/:status" element={<AdminPhotosDetail />} />
        {/* Gift management routes removed - now handled externally */}
        <Route path="/dashboard/rsvps" element={<AdminRSVPs />} />
        
        {/* Social Routes */}
        <Route path="/social/compose" element={<SocialCompose />} />
        
        {/* System Test Route */}
        <Route path="/system-test" element={<SystemTest />} />
        
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
        <AuthProvider>
          <AppContent />
        </AuthProvider>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
