import type { LucideProps } from "lucide-react";
import {
  Activity,
  Calculator,
  Clock,
  Dice6,
  Layers,
  RefreshCw,
  Shuffle,
} from "lucide-react";
import React from "react";

export type GameModifiers = {
  random: {
    enabled: boolean;
  };
  shuffled: {
    enabled: boolean;
  };
  timed: {
    enabled: boolean;
    durationSeconds: number;
  };
};

export type GameModifierName = keyof GameModifiers;
export type GameMode = "normal" | "endless" | "lives" | "stack";

interface IconProps extends LucideProps {
  className?: string;
}

export const ModifierIcon = ({
  modifier,
  ...props
}: { modifier: GameModifierName } & IconProps) => {
  return getModifierIcon(modifier, props);
};

export const ModeIcon = ({
  mode,
  ...props
}: { mode: GameMode } & IconProps) => {
  return getModeIcon(mode, props);
};

const getModifierIcon = (modifier: GameModifierName, props: IconProps) => {
  switch (modifier) {
    case "random":
      return <Dice6 {...props} />;
    case "timed":
      return <Clock {...props} />;
    case "shuffled":
      return <Shuffle {...props} />;
  }
};

const getModeIcon = (mode: GameMode, props: IconProps) => {
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
