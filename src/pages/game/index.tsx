import { useRouter } from "next/router";
import type { ParsedUrlQuery } from "querystring";
import { useEffect, useState } from "react";
import Game from "../../components/game/Game";
import type { Operator, Problem } from "@/components/game/Problem";
import { generateProblems } from "@/components/game/Problem";
import type {
  GameMode,
  GameModifier,
} from "@/components/layouts/SelectionScreen";

interface QueryParams {
  operator: Operator;
  number: number;
  gameId: string;
  mode: GameMode;
  modifiers: GameModifier[];
}

function parseQueryParams(query: ParsedUrlQuery): QueryParams {
  const { operator, number, gameId, mode, modifiers } = query;
  console.log(query);

  return {
    operator: operator as Operator,
    number: parseInt(number as string),
    gameId: gameId as string,
    mode: mode as GameMode,
    modifiers: modifiers as GameModifier[],
  };
}

const RunningGame = () => {
  const [problems, setProblems] = useState<Problem[]>();
  const [gameMode, setGameMode] = useState<GameMode>("normal");
  const [gameModifiers, setGameModifiers] = useState<GameModifier[]>([]);
  const [queryParams, setQueryParams] = useState<QueryParams>();
  const router = useRouter();

  useEffect(() => {
    if (!router.isReady) return;
    setQueryParams(parseQueryParams(router.query));
  }, [router.isReady, router.query]);

  useEffect(() => {
    if (!queryParams) return;

    const { number, operator, mode, modifiers } = queryParams;
    const currentProblems = generateProblems(number, operator);

    setProblems(currentProblems);
    setGameMode(mode ?? "normal");
    setGameModifiers(modifiers);
  }, [queryParams]);

  if (!problems) {
    return null;
  }

  return (
    <Game
      initialProblems={problems}
      settings={{ gameMode, gameModifiers }}
    />
  );
};

export { RunningGame as default };
