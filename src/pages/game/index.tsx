import { useRouter } from "next/router";
import type { ParsedUrlQuery } from "querystring";
import { useEffect, useState } from "react";
import type { GameSettings } from "@/components/game/Game";
import Game from "../../components/game/Game";
import type { Operator, Problem } from "@/components/game/Problem";
import { generateProblems } from "@/components/game/Problem";
import type {
  GameMode,
  GameModifier,
} from "@/components/layouts/SelectionScreen";

interface Query {
  gameId: string;
  mode: GameMode;
  modifiers: GameModifier[];
}

interface ParsedQueryParams extends ParsedUrlQuery, Query {
  numbers: string[] | string;
  operators: string[] | string;
}

interface QueryParams extends Query {
  numbers: number[];
  operators: Operator[];
}

const RunningGame = () => {
  const [problems, setProblems] = useState<Problem[] | null>(null);
  const [queryParams, setQueryParams] = useState<QueryParams | null>(null);
  const [gameSettings, setGameSettings] = useState<GameSettings | null>(null);
  const router = useRouter();

  useEffect(() => {
    if (!router.isReady) return;
    const parsedQuery = router.query as ParsedQueryParams;
    const numbers = Array.isArray(parsedQuery.numbers)
      ? parsedQuery.numbers.map((num) => Number(num))
      : [Number(parsedQuery.numbers)];
    const operators = Array.isArray(parsedQuery.operators)
      ? (parsedQuery.operators as Operator[])
      : [parsedQuery.operators as Operator];

    setQueryParams({
      ...parsedQuery,
      operators,
      numbers,
    });
  }, [router.isReady, router.query]);

  useEffect(() => {
    if (!queryParams) return;

    const { numbers, operators, mode, modifiers } = queryParams;
    const currentProblems = generateProblems(numbers, operators);

    setProblems(currentProblems);
    setGameSettings({
      gameMode: mode,
      gameModifiers: modifiers,
    });
  }, [queryParams]);

  if (!problems || !gameSettings) {
    return null;
  }

  return <Game initialProblems={problems} settings={gameSettings} />;
};

export { RunningGame as default };
