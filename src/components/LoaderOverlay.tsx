import React from "react";
import { cn } from "@/utils/shad";

interface Props {
  heading?: React.ReactNode;
  isLoading: boolean;
  className?: string;
  children?: React.ReactNode;
}

export const LoaderOverlay = ({
  heading,
  isLoading,
  className,
  children,
}: Props) =>
  isLoading && (
    <div
      className={cn(
        "fixed bottom-0 left-0 right-0 top-0 z-50 flex h-screen w-full flex-col items-center justify-center overflow-hidden bg-background/90",
        className,
      )}
    >
      <div className="flex h-full w-full flex-col items-center justify-center gap-3">
        {heading ?? (
          <h1 className="text-center text-sm font-medium uppercase tracking-[0.08em]">
            Loading <span className="animate-pulse">█</span>
          </h1>
        )}
        {children}
      </div>
    </div>
  );
