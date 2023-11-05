import type { Operator } from "@/components/game/Problem";
import type {
  GameMode,
  GameModifier,
} from "@/components/layouts/SelectionScreen";

export const RUNNING_GAME_ROUTE = "/game";

export function getGameRouteCustom(
  number: number,
  operator: Operator,
  gameMode: GameMode,
  modifiers: GameModifier[],
) {
  const searchParams = new URLSearchParams();
  searchParams.append("number", number.toString());
  searchParams.append("operator", operator);
  searchParams.append("mode", gameMode);
  modifiers.forEach((modifier) => searchParams.append("modifiers", modifier));

  return `${RUNNING_GAME_ROUTE}?${searchParams.toString()}`;
}
