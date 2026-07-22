import type { Operator } from "@/game/problem";
import type {
  GameMode,
  GameModifierName,
} from "@/components/views/GameSettings";

export const GAME_SMART_ROUTE = "game-smart";
export const GAME_CUSTOM_ROUTE = "game-custom";

export const GAME_ROUTES = [GAME_SMART_ROUTE, GAME_CUSTOM_ROUTE] as const;
export type GameRoute = typeof GAME_ROUTES[number];

interface GameQuery {
  numbers: number[];
  operators: Operator[];
  gameMode: GameMode;
  modifiers: GameModifierName[];
  nextOnFail?: boolean;
}

export function getGameRouteCustom(options: GameQuery): string {
  const searchParams = new URLSearchParams(options as never);
  return `${GAME_SMART_ROUTE}?${searchParams.toString()}`;
}

// The pool QuickPlay draws its "fresh" (non-weak) problems from. Guest
// QuickPlay (/play) uses the same pool client-side; the signed-in server
// builder uses it to top up the adaptive set.
export const QUICKPLAY_QUERY: GameQuery = {
  numbers: [2, 3, 4, 5, 6, 7, 8, 9],
  operators: ["ADD", "SUBTRACT", "MULTIPLY"],
  gameMode: "normal",
  modifiers: ["shuffled"],
};

// QuickPlay hits game-smart with no settings query. That signals the page to
// build an adaptive set from the player's history (the problems they miss
// most) rather than run a fixed, configured game.
export function getGameRouteQuickPlay(): string {
  return GAME_SMART_ROUTE;
}
