
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
import LoyaltyProgramPage from "./pages/LoyaltyProgramPage";
import NotificationPage from "./pages/NotificationPage";
import CartPage from "./pages/CartPage";
import GuideScreen from "./components/GuideScreen";
import { CartProvider } from "./contexts/CartContext";
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
  const [hasSeenGuide, setHasSeenGuide] = useState(false);
  
  // Simple check for hydration and guide status
  useEffect(() => {
    setIsReady(true);
    const guideSeen = localStorage.getItem("hasSeenGuide") === "true";
    setHasSeenGuide(guideSeen);
  }, []);
  
  // Mark the guide as seen when navigating away from it
  useEffect(() => {
    if (window.location.pathname !== "/guide" && !hasSeenGuide) {
      localStorage.setItem("hasSeenGuide", "true");
      setHasSeenGuide(true);
    }
  }, [hasSeenGuide]);
  
  if (!isReady) return null;
  
  // Determine the initial route based on whether the user has seen the guide
  const getInitialRoute = () => {
    if (!hasSeenGuide) {
      return <Navigate to="/guide" />;
    } else if (localStorage.getItem("isAuthenticated") !== "true") {
      return <Navigate to="/auth" />;
    } else {
      return <Navigate to="/" />;
    }
  };
  
  return (
    <QueryClientProvider client={queryClient}>
      <CartProvider>
        <TooltipProvider>
          <Toaster position="top-center" />
          <Sonner position="top-center" className="top-0 md:top-4 right-0 md:right-4" />
          <BrowserRouter>
            <Routes>
              {/* Guide Route */}
              <Route path="/guide" element={<GuideScreen />} />
              
              {/* Auth Route */}
              <Route path="/auth" element={<AuthPage />} />
              
              {/* Protected Routes */}
              <Route path="/" element={<ProtectedRoute><Index /></ProtectedRoute>} />
              <Route path="/map" element={<ProtectedRoute><MapPage /></ProtectedRoute>} />
              <Route path="/search" element={<ProtectedRoute><SearchPage /></ProtectedRoute>} />
              <Route path="/orders" element={<ProtectedRoute><OrdersPage /></ProtectedRoute>} />
              <Route path="/orders/:id" element={<ProtectedRoute><OrderDetailPage /></ProtectedRoute>} />
              <Route path="/profile" element={<ProtectedRoute><ProfilePage /></ProtectedRoute>} />
              <Route path="/loyalty" element={<ProtectedRoute><LoyaltyProgramPage /></ProtectedRoute>} />
              <Route path="/food/:id" element={<ProtectedRoute><FoodDetailPage /></ProtectedRoute>} />
              <Route path="/notifications" element={<ProtectedRoute><NotificationPage /></ProtectedRoute>} />
              <Route path="/cart" element={<ProtectedRoute><CartPage /></ProtectedRoute>} />
              
              {/* Initial route */}
              <Route path="/initial" element={getInitialRoute()} />
              
              {/* Catch-all route */}
              <Route path="*" element={<Navigate to="/initial" />} />
            </Routes>
          </BrowserRouter>
        </TooltipProvider>
      </CartProvider>
    </QueryClientProvider>
  );
};

export default App;
