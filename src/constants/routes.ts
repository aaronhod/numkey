import type { Operator } from "@/components/game/Problem";
import type {
  GameMode,
  GameModifier,
} from "@/components/layouts/SelectionScreen";

export const RUNNING_GAME_ROUTE = "/game";

export function getGameRouteCustom(
  numbers: number[],
  operators: Operator[],
  gameMode: GameMode,
  modifiers: GameModifier[],
) {
  const searchParams = new URLSearchParams();
  searchParams.append("mode", gameMode);
  numbers.forEach((number) => searchParams.append("numbers", String(number)));
  operators.forEach((operator) => searchParams.append("operators", operator));
  modifiers.forEach((modifier) => searchParams.append("modifiers", modifier));

  return `${RUNNING_GAME_ROUTE}?${searchParams.toString()}`;
}
