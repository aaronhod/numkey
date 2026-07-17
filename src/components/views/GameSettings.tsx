import React from "react";
import { cn } from "@/utils/shad";

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
export type GameCategory = "CUSTOM" | "SMART" | "VERSUS" | "PRACTICE";

export interface GameSettings {
  gameMode: GameMode;
  gameModifiers: GameModifiers;
  nextOnFail?: boolean;
}

const DEFAULT_GAME_MODIFIERS: GameModifiers = {
  random: {
    enabled: false,
  },
  shuffled: {
    enabled: false,
  },
  timed: {
    enabled: false,
    durationSeconds: 10,
  },
};

export const DEFAULT_GAME_SETTINGS: GameSettings = {
  gameMode: "normal",
  gameModifiers: DEFAULT_GAME_MODIFIERS,
  nextOnFail: undefined,
};

interface TagProps {
  className?: string;
}

// The design uses no icons — modes and modifiers are plain uppercase tags.
export const ModifierIcon = ({
  modifier,
  className,
}: { modifier: GameModifierName } & TagProps) => {
  return (
    <span className={cn("uppercase tracking-[0.08em]", className)}>
      {modifier}
    </span>
  );
};

export const ModeIcon = ({ mode, className }: { mode: GameMode } & TagProps) => {
  return (
    <span className={cn("uppercase tracking-[0.08em]", className)}>{mode}</span>
  );
};
