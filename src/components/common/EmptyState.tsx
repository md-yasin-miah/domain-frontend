import { ReactNode } from "react";
import { Button } from "@/components/ui/button";
import { ArrowLeft, AlertTriangle } from "lucide-react";
import { cn } from "@/lib/utils";

interface EmptyStateProps {
  title: string;
  description?: string;
  icon?: ReactNode;
  variant?: "error" | "empty" | "notFound";
  actionLabel?: string;
  onAction?: () => void;
  actionButton?: ReactNode;
  className?: string;
  maxWidth?: string;
}

const EmptyState = ({
  title,
  description,
  icon,
  variant = "error",
  actionLabel,
  onAction,
  actionButton,
  className,
  maxWidth = "max-w-md",
}: EmptyStateProps) => {
  const defaultIcons = {
    error: <AlertTriangle className="w-10 h-10 text-destructive" />,
    empty: <AlertTriangle className="w-10 h-10 text-muted-foreground" />,
    notFound: <AlertTriangle className="w-10 h-10 text-muted-foreground" />,
  };

  const iconBgColors = {
    error: "bg-destructive/10",
    empty: "bg-muted/50",
    notFound: "bg-muted/50",
  };

  const displayIcon = icon || defaultIcons[variant];
  const iconBgColor = iconBgColors[variant];

  return (
    <div className={cn("min-h-fit", className)}>
      <div className="flex flex-col items-center justify-center py-12 px-6">
        <div className={cn("flex flex-col items-center gap-4 text-center", maxWidth)}>
          <div
            className={cn(
              "h-20 w-20 rounded-full flex items-center justify-center mb-4",
              iconBgColor
            )}
          >
            {displayIcon}
          </div>
          <h3 className="text-2xl font-bold">{title}</h3>
          {description && (
            <p className="text-muted-foreground">{description}</p>
          )}
          {(actionLabel && onAction) || actionButton ? (
            <div className="mt-4">
              {actionButton || (
                <Button onClick={onAction}>
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  {actionLabel}
                </Button>
              )}
            </div>
          ) : null}
        </div>
      </div>
    </div>
  );
};

export default EmptyState;

