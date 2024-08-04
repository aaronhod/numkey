import React from "react";
import { LucideLoader } from "lucide-react";
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
        "fixed bottom-0 left-0 right-0 top-0 z-50 flex h-screen w-full flex-col items-center justify-center overflow-hidden bg-background/80 backdrop-blur-sm",
        className,
      )}
    >
      <div className="flex h-full w-full flex-col items-center justify-center gap-3">
        {heading ?? (
          <h1 className="text-center text-3xl font-bold">Loading...</h1>
        )}
        <LucideLoader className="h-1/6 w-1/6 animate-spin-slow" />
        {children}
      </div>
    </div>
  );
