import type {
  LucideProps} from "lucide-react";
import {
  Activity,
  Calculator,
  Clock,
  Dice6,
  Layers,
  RefreshCw,
} from "lucide-react";
import React from "react";

export type GameModifier = "random" | "timed" | "sorted";
export type GameMode = "normal" | "endless" | "lives" | "stack";

interface IconProps extends LucideProps {
  className?: string;
}

export const getModifierIcon = (modifier: GameModifier, props: IconProps) => {
  switch (modifier) {
    case "random":
      return <Dice6 {...props} />;
    case "timed":
      return <Clock {...props} />;
    case "sorted":
      return <Layers {...props} />;
  }
};

export const getModeIcon = (mode: GameMode, props: IconProps) => {
  switch (mode) {
    case "normal":
      return <Calculator {...props} />;
    case "endless":
      return <RefreshCw {...props} />;
    case "lives":
      return <Activity {...props} />;
    case "stack":
      return <Layers {...props} />;
  }
};
