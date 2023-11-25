import { useRouter } from "next/router";
import type { ParsedUrlQuery } from "querystring";
import { useEffect, useState } from "react";
import type { GameSettings } from "@/components/game/Game";
import Game from "../../components/game/Game";
import type { Operator, Problem } from "@/components/game/Problem";
import {
  generateProblems,
  shuffleProblemListNumbers,
  shuffleProblemListOrder,
} from "@/components/game/Problem";
import type {
  GameMode,
  GameModifierName,
} from "@/components/game/GameSettings";

interface Query {
  gameId: string;
  gameMode: GameMode;
}

interface ParsedQueryParams extends ParsedUrlQuery, Query {
  numbers: string[] | string;
  operators: string[] | string;
  nextOnFail: string;
  modifiers: string;
}

interface QueryParams extends Query {
  numbers: number[];
  operators: Operator[];
  nextOnFail: boolean;
  modifiers: GameModifierName[];
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
    const nextOnFail = parsedQuery.nextOnFail === "true";
    const modifiers = parsedQuery.modifiers.split(",") as GameModifierName[];

    setQueryParams({
      ...parsedQuery,
      operators,
      numbers,
      nextOnFail,
      modifiers,
    });
  }, [router.isReady, router.query]);

  useEffect(() => {
    if (!queryParams) return;

    const { numbers, operators, gameMode, modifiers } = queryParams;
    const enabledModifiers = Array.isArray(modifiers) ? modifiers : [modifiers];

    let currentProblems = generateProblems(numbers, operators);
    if (enabledModifiers.includes("random")) {
      currentProblems = shuffleProblemListNumbers(currentProblems);
    }
    if (enabledModifiers.includes("shuffled")) {
      currentProblems = shuffleProblemListOrder(currentProblems);
    }

    setProblems(currentProblems);
    setGameSettings({
      gameMode: gameMode,
      gameModifiers: {
        random: {
          enabled: enabledModifiers.includes("random"),
        },
        timed: {
          enabled: enabledModifiers.includes("timed"),
        },
        shuffled: {
          enabled: enabledModifiers.includes("shuffled"),
        },
      },
    });
  }, [queryParams]);

  if (!problems || !gameSettings) {
    return null;
  }

  return <Game initialProblems={problems} settings={gameSettings} />;
};

export { RunningGame as default };
