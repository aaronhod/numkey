import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "@/utils/shad";

// Outline-only buttons: no fills, state is communicated by border opacity.
const buttonVariants = cva(
  "inline-flex items-center justify-center whitespace-nowrap border border-transparent bg-transparent text-[13px] font-medium uppercase tracking-[0.05em] transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 disabled:text-muted-foreground",
  {
    variants: {
      variant: {
        default: "border-foreground text-foreground hover:bg-foreground/10",
        destructive:
          "border-foreground/35 text-foreground hover:border-foreground hover:bg-foreground/10",
        outline:
          "border-foreground/35 text-foreground hover:border-foreground",
        secondary:
          "border-foreground/30 text-secondary-foreground hover:border-foreground/60 hover:text-foreground",
        ghost: "text-muted-foreground hover:text-foreground",
        link: "text-foreground underline-offset-4 hover:underline",
      },
      size: {
        default: "h-10 px-4 py-2",
        sm: "h-9 px-3 text-xs",
        lg: "h-11 px-8",
        icon: "h-10 w-10",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  },
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "button";
    return (
      <Comp
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        {...props}
      />
    );
  },
);
Button.displayName = "Button";

export { Button, buttonVariants };
