import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Route, Routes, Navigate, Outlet } from "react-router-dom";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { Analytics } from "@vercel/analytics/react";
import { AuthProvider, useAuth } from "./contexts/AuthContext";
import ProtectedRoute from "./components/ProtectedRoute";

// Pages
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import Login from "./pages/Auth/Login";
import Signup from "./pages/Auth/Signup";
import AuthLayout from "./pages/Auth/AuthLayout";
import DashboardLayout from "./pages/Dashboard/DashboardLayout";
import AdminDashboard from "./pages/Dashboard/AdminDashboard";
import UserDashboard from "./pages/Dashboard/UserDashboard";
import Unauthorized from "./pages/Auth/Unauthorized";
import Profile from "./pages/Dashboard/Profile";

import ServiceTypes from "./pages/Dashboard/Admin/ServiceTypes";
import JobUnits from "./pages/Dashboard/Admin/JobUnits";
import AllBookings from "./pages/Dashboard/Admin/AllBookings";
import Enquiries from "./pages/Dashboard/Admin/Enquiries";
import SettingsPage from "./pages/Dashboard/Settings";
import JobDiscovery from "./pages/Jobs/JobDiscovery";
import BookingForm from "./pages/Jobs/BookingForm";
import Notifications from "./pages/Dashboard/Notifications";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      staleTime: 30000,
      refetchOnWindowFocus: false,
    },
  },
});

const RoleRedirect = () => {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen bg-[#0D0D0D] flex items-center justify-center">
        <div className="w-10 h-10 border-4 border-[#E8640A] border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  // Everyone lands on the beautiful landing page first
  return <Navigate to="/" />;
};

const App = () => (
  <QueryClientProvider client={queryClient}>
    <AuthProvider>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            {/* Main Public Route - Now with the shared layout */}
            <Route element={<DashboardLayout />}>
              <Route path="/" element={<Index />} />

              <Route path="/profile" element={
                <ProtectedRoute>
                  <Profile />
                </ProtectedRoute>
              } />

              <Route path="/unauthorized" element={<Unauthorized />} />

              {/* Public Dashboard Routes */}
              <Route path="/dashboard/jobs" element={<JobDiscovery />} />
              <Route path="/dashboard/jobs/:jobId/book" element={
                <ProtectedRoute>
                  <BookingForm />
                </ProtectedRoute>
              } />

              {/* Management Routes wrapped in the same layout */}
              <Route path="/dashboard" element={
                <ProtectedRoute>
                  <Outlet />
                </ProtectedRoute>
              }>
                <Route index element={<RoleRedirect />} />
                <Route path="admin" element={
                  <ProtectedRoute requiredRole="admin">
                    <AdminDashboard />
                  </ProtectedRoute>
                } />
                <Route path="user" element={
                  <ProtectedRoute>
                    <UserDashboard />
                  </ProtectedRoute>
                } />
                <Route path="settings" element={
                  <ProtectedRoute>
                    <SettingsPage />
                  </ProtectedRoute>
                } />
                <Route path="notifications" element={
                  <ProtectedRoute>
                    <Notifications />
                  </ProtectedRoute>
                } />
              </Route>

              {/* Admin-only Management views */}
              <Route path="/admin/services" element={
                <ProtectedRoute requiredRole="admin">
                  <ServiceTypes />
                </ProtectedRoute>
              } />
              <Route path="/admin/jobs" element={
                <ProtectedRoute requiredRole="admin">
                  <JobUnits />
                </ProtectedRoute>
              } />
              <Route path="/admin/bookings" element={
                <ProtectedRoute requiredRole="admin">
                  <AllBookings />
                </ProtectedRoute>
              } />
              <Route path="/admin/enquiries" element={
                <ProtectedRoute requiredRole="admin">
                  <Enquiries />
                </ProtectedRoute>
              } />
            </Route>

            {/* Auth Routes (Separate full-page layout) */}
            <Route path="/auth" element={<AuthLayout />}>
              <Route path="login" element={<Login />} />
              <Route path="signup" element={<Signup />} />
            </Route>

            <Route path="/admin" element={<Navigate to="/dashboard/admin" />} />
            <Route path="*" element={<Navigate to="/" />} />
          </Routes>
        </BrowserRouter>
        <Analytics />
      </TooltipProvider>
    </AuthProvider>
  </QueryClientProvider>
);

export default App;
