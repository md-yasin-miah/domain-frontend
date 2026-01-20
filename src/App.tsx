import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { RouterProvider } from "react-router-dom";
import { ReduxProvider } from "@/components/providers/ReduxProvider";
import { router } from "./routes";

const App = () => (
  <ReduxProvider>
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
  </ReduxProvider>
);

export default App;
