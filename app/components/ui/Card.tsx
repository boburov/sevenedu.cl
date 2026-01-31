import { HTMLAttributes, ReactNode } from "react";
import { cn } from "./utils";

interface CardProps extends HTMLAttributes<HTMLDivElement> {
  children?: ReactNode;
  icon?: ReactNode;
  header?: ReactNode;
  footer?: ReactNode;
}

export function Card({
  className,
  children,
  icon,
  header,
  footer,
  ...props
}: CardProps) {
  return (
    <div
      className={cn(
        "rounded-card border border-border bg-surface shadow-card p-5 text-text-primary transition-all duration-200 hover:shadow-card-hover",
        className
      )}
      {...props}
    >
      {(icon || header) && (
        <div className="flex items-center justify-between mb-4">
          {icon && <div className="text-2xl text-primary">{icon}</div>}
          {header && (
            <div className="text-lg font-semibold text-text-primary">
              {header}
            </div>
          )}
        </div>
      )}

      <div>{children}</div>

      {footer && (
        <div className="mt-4 border-t border-border pt-3 text-text-secondary">
          {footer}
        </div>
      )}
    </div>
  );
}
