import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { RouterProvider } from "react-router-dom";
import { ReduxProvider } from "@/components/providers/ReduxProvider";
import { CurrencyProvider } from "@/contexts/CurrencyContext";
import { router } from "./routes";

const App = () => (
  <ReduxProvider>
    <CurrencyProvider>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <RouterProvider
          router={router}
          future={{
            v7_startTransition: true,
          }}
        />
      </TooltipProvider>
    </CurrencyProvider>
  </ReduxProvider>
);

export default App;
