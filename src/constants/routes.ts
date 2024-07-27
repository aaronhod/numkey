import type { Operator } from "@/game/problem";
import type {
  GameMode,
  GameModifierName,
} from "@/app/_components/views/GameSettings";

export const GAME_SMART_ROUTE = "game-smart";
export const GAME_CUSTOM_ROUTE = "game-custom";
export const GAME_BATTLE_ROUTE = "game-battle";

export const GAME_ROUTES = [GAME_SMART_ROUTE, GAME_CUSTOM_ROUTE, GAME_BATTLE_ROUTE] as const;
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
