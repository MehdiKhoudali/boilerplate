import { cn } from "@/src/utils";
import { Button } from "./button";

interface PageHeaderProps {
  title: string;
  subtitle?: string;
  actions?: {
    label: string;
    icon?: React.ReactNode;
    onClick: () => void;
    variant?: "default" | "secondary" | "outline" | "ghost";
  }[];
  className?: string;
}

export function PageHeader({
  title,
  subtitle,
  actions,
  className,
}: PageHeaderProps) {
  return (
    <div className={cn(
      "flex flex-col w-full sm:flex-row items-start sm:items-center justify-between gap-4 rounded-lg bg-card p-6",
      className
    )}>
      <div className="space-y-1">
        <h1 className="text-2xl font-semibold tracking-tight">{title}</h1>
        {subtitle && (
          <p className="text-sm text-muted-foreground">{subtitle}</p>
        )}
      </div>
      {actions && actions.length > 0 && (
        <div className="flex items-center gap-2">
          {actions.map((action, index) => (
            <Button
              key={index}
              onClick={action.onClick}
              variant={action.variant || "default"}
              className="h-9 rounded-md"
            >
              {action.icon && (
                <span className="mr-2">{action.icon}</span>
              )}
              {action.label}
            </Button>
          ))}
        </div>
      )}
    </div>
  );
} 