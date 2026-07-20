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

// Defaults for the home-screen QuickPlay tile: jump straight into a
// mixed game without going through the custom settings screen. Guest
// QuickPlay (/play) uses the same defaults client-side.
export const QUICKPLAY_QUERY: GameQuery = {
  numbers: [2, 3, 4, 5, 6, 7, 8, 9],
  operators: ["ADD", "SUBTRACT", "MULTIPLY"],
  gameMode: "normal",
  modifiers: ["shuffled"],
};

export function getGameRouteQuickPlay(): string {
  return getGameRouteCustom(QUICKPLAY_QUERY);
}
