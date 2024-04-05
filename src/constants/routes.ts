import type { Operator } from "@/game/problem";
import type {
  GameMode,
  GameModifierName,
} from "@/components/views/GameSettings";

export const RUNNING_GAME_ROUTE = "/game";

interface GameQuery {
  numbers: number[];
  operators: Operator[];
  gameMode: GameMode;
  modifiers: GameModifierName[];
  nextOnFail?: boolean;
}

export function getGameRouteCustom(options: GameQuery): string {
  const searchParams = new URLSearchParams(options as never);
  return `${RUNNING_GAME_ROUTE}?${searchParams.toString()}`;
}
