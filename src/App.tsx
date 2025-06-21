
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import Dashboard from "./pages/Dashboard";
import Clients from "./pages/Clients";
import Pipeline from "./pages/Pipeline";
import Performance from "./pages/Performance";
import Layout from "./components/Layout";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <BrowserRouter>
        <Layout>
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/clients" element={<Clients />} />
            <Route path="/pipeline" element={<Pipeline />} />
            <Route path="/performance" element={<Performance />} />
          </Routes>
        </Layout>
        <Toaster />
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
