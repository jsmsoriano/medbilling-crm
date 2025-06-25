
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Layout from "./components/Layout";
import Index from "./pages/Index";
import Restaurants from "./pages/Restaurants";
import RestaurantDetail from "./pages/RestaurantDetail";
import Favorites from "./pages/Favorites";
import Map from "./pages/Map";
import PickForMe from "./pages/PickForMe";
import Dashboard from "./pages/Dashboard";
import Clients from "./pages/Clients";
import ClientDetail from "./pages/ClientDetail";
import Pipeline from "./pages/Pipeline";
import Performance from "./pages/Performance";
import NotFound from "./pages/NotFound";
import WelcomeModal from "./components/WelcomeModal";
import { FavoritesProvider } from "./context/FavoritesContext";
import "./App.css";

const queryClient = new QueryClient();

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <FavoritesProvider>
          <BrowserRouter>
            <Routes>
              <Route path="/" element={<Layout />}>
                <Route index element={<Index />} />
                <Route path="restaurants" element={<Restaurants />} />
                <Route path="restaurants/:id" element={<RestaurantDetail />} />
                <Route path="favorites" element={<Favorites />} />
                <Route path="map" element={<Map />} />
                <Route path="pick-for-me" element={<PickForMe />} />
                <Route path="dashboard" element={<Dashboard />} />
                <Route path="clients" element={<Clients />} />
                <Route path="clients/:id" element={<ClientDetail />} />
                <Route path="pipeline" element={<Pipeline />} />
                <Route path="performance" element={<Performance />} />
                <Route path="*" element={<NotFound />} />
              </Route>
            </Routes>
            <WelcomeModal />
          </BrowserRouter>
          <Toaster />
          <Sonner />
        </FavoritesProvider>
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
