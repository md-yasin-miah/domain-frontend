import { Loader2 } from "lucide-react";
import { useTranslation } from "react-i18next";
import { cn } from "@/lib/utils";

interface InitialLoaderProps {
  message?: string;
  className?: string;
}

export const InitialLoader = ({ message, className }: InitialLoaderProps) => {
  const { t } = useTranslation();

  return (
    <div
      className={cn(
        "min-h-screen flex items-center justify-center bg-gradient-to-br from-background via-background to-muted/20",
        className
      )}
    >
      <div className="text-center space-y-6 px-4">
        {/* Logo/Brand Area */}
        <div className="flex flex-col items-center space-y-4">
          {/* Animated Logo Container */}
          <div className="relative">
            {/* Outer ring animation */}
            <div className="absolute inset-0 rounded-full border-4 border-primary/20 animate-pulse" />
            {/* Main spinner */}
            <div className="relative w-16 h-16 flex items-center justify-center">
              <Loader2 className="h-12 w-12 animate-spin text-primary" />
              {/* Inner glow effect */}
              <div className="absolute inset-0 rounded-full bg-primary/10 blur-xl animate-pulse" />
            </div>
          </div>

          {/* Loading Text */}
          <div className="space-y-2">
            <h2 className="text-xl font-semibold text-foreground">
              {message || t("common.loading") || "Loading"}
            </h2>
            {/* Progress dots */}
            <div className="flex items-center justify-center gap-1.5 pt-2">
              <div className="w-2 h-2 rounded-full bg-primary animate-bounce [animation-delay:-0.3s]" />
              <div className="w-2 h-2 rounded-full bg-primary animate-bounce [animation-delay:-0.15s]" />
              <div className="w-2 h-2 rounded-full bg-primary animate-bounce" />
            </div>
          </div>
        </div>

        {/* Subtle background pattern */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-primary/5 rounded-full blur-3xl animate-pulse" />
          <div className="absolute bottom-1/4 right-1/4 w-64 h-64 bg-primary/5 rounded-full blur-3xl animate-pulse [animation-delay:1s]" />
        </div>
      </div>
    </div>
  );
};

