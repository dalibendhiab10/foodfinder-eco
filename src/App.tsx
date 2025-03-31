
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate, useLocation } from "react-router-dom";
import { Provider as ReduxProvider } from "react-redux";
import { store } from "./redux/store";
import { AuthProvider, useAuth } from "./contexts/AuthContext";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import MapPage from "./pages/MapPage";
import SearchPage from "./pages/SearchPage";
import OrdersPage from "./pages/OrdersPage";
import ProfilePage from "./pages/ProfilePage";
import FoodDetailPage from "./pages/FoodDetailPage";
import OrderDetailPage from "./pages/OrderDetailPage";
import AuthPage from "./pages/AuthPage";
import AuthCallbackPage from "./pages/AuthCallbackPage";
import ResetPasswordPage from "./pages/ResetPasswordPage";
import UpdatePasswordPage from "./pages/UpdatePasswordPage";
import LoyaltyProgramPage from "./pages/LoyaltyProgramPage";
import NotificationPage from "./pages/NotificationPage";
import CartPage from "./pages/CartPage";
import GuideScreen from "./components/GuideScreen";
import { useEffect, useState } from "react";

const queryClient = new QueryClient();

// Improved auth guard
const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const { user, isLoading } = useAuth();
  const location = useLocation();
  
  if (isLoading) {
    // Show loading state while checking auth
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-pulse text-center">
          <p className="text-lg font-medium">Loading...</p>
        </div>
      </div>
    );
  }
  
  if (!user) {
    // Redirect to auth page but save the intended destination
    return <Navigate to="/auth" state={{ from: location }} replace />;
  }
  
  return <>{children}</>;
};

const AppRoutes = () => {
  const [isReady, setIsReady] = useState(false);
  const [hasSeenGuide, setHasSeenGuide] = useState(false);
  const { user, isLoading } = useAuth();
  
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
  
  if (!isReady || isLoading) return null;
  
  // Determine the initial route based on whether the user has seen the guide
  const getInitialRoute = () => {
    if (!hasSeenGuide) {
      return <Navigate to="/guide" />;
    } else if (!user) {
      return <Navigate to="/auth" />;
    } else {
      return <Navigate to="/" />;
    }
  };
  
  return (
    <Routes>
      {/* Public Routes */}
      <Route path="/guide" element={<GuideScreen />} />
      <Route path="/auth" element={user ? <Navigate to="/" /> : <AuthPage />} />
      <Route path="/auth/callback" element={<AuthCallbackPage />} />
      <Route path="/auth/reset-password" element={<ResetPasswordPage />} />
      <Route path="/auth/update-password" element={<UpdatePasswordPage />} />
      
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
  );
};

const App = () => {
  return (
    <ReduxProvider store={store}>
      <QueryClientProvider client={queryClient}>
        <TooltipProvider>
          <Toaster />
          <Sonner position="top-center" className="top-0 md:top-4 right-0 md:right-4" />
          <BrowserRouter>
            <AuthProvider>
              <AppRoutes />
            </AuthProvider>
          </BrowserRouter>
        </TooltipProvider>
      </QueryClientProvider>
    </ReduxProvider>
  );
};

export default App;
