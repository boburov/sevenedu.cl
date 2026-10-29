import * as React from "react";
import { cn } from "@/app/components/ui/utils";

export interface InputProps
  extends React.InputHTMLAttributes<HTMLInputElement> {
  error?: boolean;
}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, type, error, ...props }, ref) => {
    return (
      <input
        type={type}
        className={cn(
          "flex h-12 w-full rounded-input border bg-surface px-4 py-3 text-sm text-text-primary",
          "placeholder:text-text-muted",
          "transition-colors duration-200",
          // Fokus outline orqali (globals.css), ring-* emas — u box-shadow.
          "focus-ring",
          "disabled:cursor-not-allowed disabled:opacity-50 disabled:bg-surface-alt",
          error
            ? "border-danger"
            : "border-border hover:border-border-strong",
          className
        )}
        ref={ref}
        {...props}
      />
    );
  }
);

Input.displayName = "Input";

export { Input };
