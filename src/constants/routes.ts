import type { Operator } from "./../components/numpad/Problem";

export const RUNNING_GAME_ROUTE = "/game";

export function getGameRouteSimple(number: number, operator: Operator) {
  const searchParams = new URLSearchParams();
  searchParams.append("number", number.toString());
  searchParams.append("operator", operator);
  const gameId = crypto.randomUUID();

  return `${RUNNING_GAME_ROUTE}/${gameId}?${searchParams.toString()}`;
}

// export function getGameRoute(numbers: number[], operators: Operator[]): URL {
//   const route = new URL(RUNNING_GAME_ROUTE);
//   numbers.map((number) =>
//     route.searchParams.append("numbers", number.toString())
//   );
//   operators.map((operator) => route.searchParams.append("operators", operator));

//   return route;
// }
