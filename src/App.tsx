import { useState } from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { I18nProvider, hasChosenLang } from "@/i18n/I18nProvider";
import LanguageGate from "@/components/LanguageGate";
import Seo from "@/components/Seo";
import SiteLayout from "./components/SiteLayout.tsx";
import Home from "./pages/Home.tsx";
import Cars from "./pages/Cars.tsx";
import CarDetails from "./pages/CarDetails.tsx";
import Booking from "./pages/Booking.tsx";
import About from "./pages/About.tsx";
import Contact from "./pages/Contact.tsx";
import Admin from "./pages/Admin.tsx";
import NotFound from "./pages/NotFound.tsx";

const queryClient = new QueryClient();

const AppShell = () => {
  const [chosen, setChosen] = useState<boolean>(() => hasChosenLang());
  return (
    <>
      {!chosen && <LanguageGate onChosen={() => setChosen(true)} />}
      <BrowserRouter>
        <Seo />
        <Routes>
          <Route element={<SiteLayout />}>
            <Route path="/" element={<Home />} />
            <Route path="/cars" element={<Cars />} />
            <Route path="/cars/:id" element={<CarDetails />} />
            <Route path="/booking" element={<Booking />} />
            <Route path="/about" element={<About />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="/admin/*" element={<Admin />} />
          </Route>
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </>
  );
};

const App = () => (
  <QueryClientProvider client={queryClient}>
    <I18nProvider>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <AppShell />
      </TooltipProvider>
    </I18nProvider>
  </QueryClientProvider>
);

export default App;
