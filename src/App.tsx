import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import Index from "./pages/Index.tsx";
import NotFound from "./pages/NotFound.tsx";
import Login from "./pages/Login.tsx";
import Register from "./pages/Register.tsx";
import Jobs from "./pages/Jobs.tsx";
import DeveloperProfile from "./pages/DeveloperProfile.tsx";
import Pricing from "./pages/Pricing.tsx";
import ApplyJob from "./pages/ApplyJob.tsx";
import Applications from "./pages/Applications.tsx";
import Messages from "./pages/Messages.tsx";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/jobs" element={<Jobs />} />
          <Route path="/jobs/:id/apply" element={<ApplyJob />} />
          <Route path="/applications" element={<Applications />} />
          <Route path="/messages" element={<Messages />} />
          <Route path="/messages/:threadId" element={<Messages />} />
          <Route path="/developers/:id" element={<DeveloperProfile />} />
          <Route path="/pricing" element={<Pricing />} />
          {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
