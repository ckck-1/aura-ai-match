import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Route, Routes, Navigate } from "react-router-dom";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { AuthProvider, useAuth } from "@/contexts/AuthContext";
import { ProtectedRoute } from "@/components/auth/ProtectedRoute";

import Index from "./pages/Index.tsx";
import NotFound from "./pages/NotFound.tsx";
import Login from "./pages/Login.tsx";
import Register from "./pages/Register.tsx";
import EmailVerification from "./pages/EmailVerification.tsx";
import Onboarding from "./pages/Onboarding.tsx";
import Jobs from "./pages/Jobs.tsx";
import JobDetail from "./pages/JobDetail.tsx";
import ApplyJob from "./pages/ApplyJob.tsx";
import Applications from "./pages/Applications.tsx";
import DeveloperProfile from "./pages/DeveloperProfile.tsx";
import DeveloperDashboard from "./pages/DeveloperDashboard.tsx";
import StartupDashboard from "./pages/StartupDashboard.tsx";
import Messages from "./pages/Messages.tsx";
import Billing from "./pages/Billing.tsx";
import Settings from "./pages/Settings.tsx";
import Pricing from "./pages/Pricing.tsx";

const queryClient = new QueryClient();

/**
 * Helper component to redirect /dashboard to the correct role-based URL
 */
const DashboardRedirect = () => {
  const { user } = useAuth();
  if (user?.role === 'startup') return <Navigate to="/startup/dashboard" replace />;
  return <Navigate to="/developer/dashboard" replace />;
};

const App = () => (
  <QueryClientProvider client={queryClient}>
    <AuthProvider>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            {/* --- Public Routes --- */}
            <Route path="/" element={<Index />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/verify-email" element={<EmailVerification />} />
            <Route path="/pricing" element={<Pricing />} />
            
            {/* Jobs are technically public to view, but protected to apply */}
            <Route path="/jobs" element={<Jobs />} />
            <Route path="/jobs/:id" element={<JobDetail />} />
            <Route path="/developers/:id" element={<DeveloperProfile />} />

            {/* --- Universal Protected Routes (Any Role) --- */}
            <Route path="/dashboard" element={<ProtectedRoute><DashboardRedirect /></ProtectedRoute>} />
            <Route path="/onboarding" element={<ProtectedRoute><Onboarding /></ProtectedRoute>} />
            <Route path="/settings" element={<ProtectedRoute><Settings /></ProtectedRoute>} />
            <Route path="/messages" element={<ProtectedRoute><Messages /></ProtectedRoute>} />
            <Route path="/messages/:threadId" element={<ProtectedRoute><Messages /></ProtectedRoute>} />

            {/* --- Developer Only Routes --- */}
            <Route
              path="/developer/dashboard"
              element={
                <ProtectedRoute allowedRoles={['developer']}>
                  <DeveloperDashboard />
                </ProtectedRoute>
              }
            />
            <Route
              path="/applications"
              element={
                <ProtectedRoute allowedRoles={['developer']}>
                  <Applications />
                </ProtectedRoute>
              }
            />
            <Route 
              path="/jobs/:id/apply" 
              element={
                <ProtectedRoute allowedRoles={['developer']}>
                  <ApplyJob />
                </ProtectedRoute>
              } 
            />

            {/* --- Startup Only Routes --- */}
            <Route
              path="/startup/dashboard"
              element={
                <ProtectedRoute allowedRoles={['startup']}>
                  <StartupDashboard />
                </ProtectedRoute>
              }
            />
            <Route
              path="/billing"
              element={
                <ProtectedRoute allowedRoles={['startup']}>
                  <Billing />
                </ProtectedRoute>
              }
            />

            {/* --- Catch-all --- */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </AuthProvider>
  </QueryClientProvider>
);

export default App;