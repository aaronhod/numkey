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
  const [problems, setProblems] = useState<Problem[]>();
  const [gameMode, setGameMode] = useState<GameMode>("normal");
  const [gameModifiers, setGameModifiers] = useState<GameModifier[]>([]);
  const [queryParams, setQueryParams] = useState<QueryParams>();
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
    setGameMode(mode ?? "normal");
    setGameModifiers(modifiers);
  }, [queryParams]);

  if (!problems) {
    return null;
  }

  return (
    <Game initialProblems={problems} settings={{ gameMode, gameModifiers }} />
  );
};

export { RunningGame as default };
