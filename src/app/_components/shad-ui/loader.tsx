import * as React from "react";

import { cn } from "@/utils/shad";
import type { LucideProps } from "lucide-react";
import { Loader as LucideLoader } from "lucide-react";

type LoaderProps = LucideProps;

export const SpinningLoader = React.forwardRef<HTMLDivElement, LoaderProps>(
  ({ className, ...props }) => (
    <LucideLoader {...props} className={cn("animate-spin-slow", className)} />
  ),
);
SpinningLoader.displayName = "Spinning Loader";
