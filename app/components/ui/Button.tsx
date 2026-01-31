import { ButtonHTMLAttributes, forwardRef, ReactNode } from "react";
import { cva } from "class-variance-authority";
import { cn } from "./utils";

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 rounded-button text-sm font-semibold transition-all duration-200 px-5 py-2.5 focus:outline-none focus:ring-2 focus:ring-focus-ring focus:ring-offset-2 focus:ring-offset-background disabled:opacity-50 disabled:cursor-not-allowed",
  {
    variants: {
      variant: {
        default:
          "bg-primary text-primary-foreground hover:bg-primary-hover shadow-md hover:shadow-lg",
        secondary:
          "bg-transparent border-2 border-primary text-primary hover:bg-primary-soft",
        outline:
          "bg-transparent border border-border text-text-primary hover:bg-surface-alt hover:border-border-strong",
        ghost: "bg-transparent text-text-secondary hover:bg-surface-alt hover:text-text-primary",
        destructive:
          "bg-danger text-white hover:bg-danger/90 shadow-md",
      },
      size: {
        default: "text-sm h-10",
        lg: "text-base py-3 px-6 h-12",
        sm: "text-xs py-1.5 px-3 h-8",
        icon: "p-2 h-10 w-10",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
);

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "default" | "secondary" | "outline" | "ghost" | "destructive";
  size?: "default" | "lg" | "sm" | "icon";
  icon?: ReactNode;
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, icon, children, ...props }, ref) => {
    return (
      <button
        ref={ref}
        className={cn(buttonVariants({ variant, size }), className)}
        {...props}
      >
        {icon && <span className="text-lg">{icon}</span>}
        {children}
      </button>
    );
  }
);

Button.displayName = "Button";
