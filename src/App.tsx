
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import MapPage from "./pages/MapPage";
import SearchPage from "./pages/SearchPage";
import OrdersPage from "./pages/OrdersPage";
import ProfilePage from "./pages/ProfilePage";
import FoodDetailPage from "./pages/FoodDetailPage";
import OrderDetailPage from "./pages/OrderDetailPage";
import AuthPage from "./pages/AuthPage";
import { useEffect, useState } from "react";

const queryClient = new QueryClient();

// Simple authentication guard
const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const isAuthenticated = localStorage.getItem("isAuthenticated") === "true";
  
  // For demo purposes, auto-authenticate
  useEffect(() => {
    if (!isAuthenticated) {
      localStorage.setItem("isAuthenticated", "true");
    }
  }, [isAuthenticated]);
  
  return isAuthenticated ? <>{children}</> : <Navigate to="/auth" />;
};

const App = () => {
  const [isReady, setIsReady] = useState(false);
  
  // Simple check for hydration
  useEffect(() => {
    setIsReady(true);
  }, []);
  
  if (!isReady) return null;
  
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            {/* Auth Route */}
            <Route path="/auth" element={<AuthPage />} />
            
            {/* Protected Routes */}
            <Route path="/" element={<ProtectedRoute><Index /></ProtectedRoute>} />
            <Route path="/map" element={<ProtectedRoute><MapPage /></ProtectedRoute>} />
            <Route path="/search" element={<ProtectedRoute><SearchPage /></ProtectedRoute>} />
            <Route path="/orders" element={<ProtectedRoute><OrdersPage /></ProtectedRoute>} />
            <Route path="/orders/:id" element={<ProtectedRoute><OrderDetailPage /></ProtectedRoute>} />
            <Route path="/profile" element={<ProtectedRoute><ProfilePage /></ProtectedRoute>} />
            <Route path="/food/:id" element={<ProtectedRoute><FoodDetailPage /></ProtectedRoute>} />
            
            {/* Catch-all route */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </QueryClientProvider>
  );
};

export default App;
