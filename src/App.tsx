import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
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
import ScanQRPage from "./pages/ScanQRPage";
import TableMenuPage from "./pages/TableMenuPage";
import TableCheckoutPage from "./pages/TableCheckoutPage";
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
  const { user, isLoading } = useAuth();
  
  // Simple check for hydration and guide status
  useEffect(() => {
    setIsReady(true);
  }, []);
  
  
  if (!isReady || isLoading) return null;
  
  
  return (
    <Routes>
      {/* Public Routes */}
      {/* Home page (original index) - Protected */}
      <Route path="/home" element={<ProtectedRoute><Index /></ProtectedRoute>} />
      <Route path="/auth" element={user ? <Navigate to="/home" /> : <AuthPage />} />
      <Route path="/auth/callback" element={<AuthCallbackPage />} />
      <Route path="/auth/reset-password" element={<ResetPasswordPage />} />
      <Route path="/auth/update-password" element={<UpdatePasswordPage />} />
      
      {/* Protected Routes */}
      {/* Root route is now the Guide Screen - Public */}
      <Route path="/" element= {user ? <Navigate to="/home" /> : <GuideScreen />} />
      <Route path="/map" element={<ProtectedRoute><MapPage /></ProtectedRoute>} />
      <Route path="/search" element={<ProtectedRoute><SearchPage /></ProtectedRoute>} />
      <Route path="/orders" element={<ProtectedRoute><OrdersPage /></ProtectedRoute>} />
      <Route path="/orders/:id" element={<ProtectedRoute><OrderDetailPage /></ProtectedRoute>} />
      <Route path="/profile" element={<ProtectedRoute><ProfilePage /></ProtectedRoute>} />
      <Route path="/loyalty" element={<ProtectedRoute><LoyaltyProgramPage /></ProtectedRoute>} />
      <Route path="/food/:id" element={<ProtectedRoute><FoodDetailPage /></ProtectedRoute>} />
      <Route path="/notifications" element={<ProtectedRoute><NotificationPage /></ProtectedRoute>} />
      <Route path="/cart" element={<ProtectedRoute><CartPage /></ProtectedRoute>} />
      
      {/* Restaurant Table Ordering Routes */}
      <Route path="/scan-qr" element={<ProtectedRoute><ScanQRPage /></ProtectedRoute>} />
      <Route path="/restaurant/:restaurantId/table/:tableId/session/:sessionId" element={<ProtectedRoute><TableMenuPage /></ProtectedRoute>} />
      <Route path="/restaurant/:restaurantId/table/:tableId/checkout/:sessionId" element={<ProtectedRoute><TableCheckoutPage /></ProtectedRoute>} />
      
      
      {/* Catch-all route */}
      <Route path="*" element={<Navigate to="/" />} /> {/* Redirect unknown paths to guide */}
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
          <ToastContainer
            position="top-right"
            autoClose={5000}
            hideProgressBar={false}
            newestOnTop={false}
            closeOnClick
            rtl={false}
            pauseOnFocusLoss
            draggable
            pauseOnHover
            theme="light" // or "dark" or "colored"
          />
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
