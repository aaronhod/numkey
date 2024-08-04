"use client";

import Game from "Macaca/packages/ui/src/components/views/Game";
import { generateProblems, type Operator } from "@/game/problem";
import type {
  GameMode,
  GameModifierName,
  GameSettings,
} from "Macaca/packages/ui/src/components/views/GameSettings";
import { redirect, useParams } from "next/navigation";
import { hashProblemDefs } from "Macaca/packages/domain/src/hash";
import { GAME_SMART_ROUTE } from "Macaca/packages/app/constants/routes";
import { useEffect, useState } from "react";
import { api } from "@/utils/api";
import { type Params } from "next/dist/shared/lib/router/utils/route-matcher";

interface QueryParams extends Params {
  gameMode: GameMode;
  numbers: string[] | string;
  operators: string[] | string;
  nextOnFail: string;
  modifiers: string;
}

interface Options {
  numbers: number[];
  operators: Operator[];
  gameSettings: GameSettings;
}

function parseOptions(query: QueryParams): Options {
  const numbers = Array.isArray(query.numbers)
    ? query.numbers.map((num) => Number(num))
    : [Number(query.numbers)];
  const operators: Operator[] = (
    Array.isArray(query.operators) ? query.operators : [query.operators]
  ) as Operator[];
  const nextOnFail = query.nextOnFail === "true";
  const modifiers = query.modifiers.split(",") as GameModifierName[];

  const gameSettings = {
    gameMode: query.gameMode,
    gameModifiers: {
      random: {
        enabled: modifiers.includes("random"),
      },
      timed: {
        enabled: modifiers.includes("timed"),
        durationSeconds: 10,
      },
      shuffled: {
        enabled: modifiers.includes("shuffled"),
      },
    },
    nextOnFail: nextOnFail,
  } satisfies GameSettings;

  return {
    numbers,
    operators,
    gameSettings,
  };
}

export default function SmartGame() {
  const options = parseOptions(useParams<QueryParams>());

  const [problemDefinitions, setProblemDefinitions] = useState<string[]>([]);
  const problemQuery = api.game.findProblemsByHash.useQuery(
    problemDefinitions,
    {
      enabled: problemDefinitions.length > 0,
    },
  );

  useEffect(() => {
    if (!isLoaded) {
      return;
    }

    const loadData = async () => {
      setProblemDefinitions(
        await hashProblemDefs(
          generateProblems(options.numbers, options.operators),
        ),
      );
    };

    void loadData();
  }, [options, isLoaded]);

  if (!isLoaded || !options || !problemQuery.data) {
    return null;
  }

  if (!user) {
    redirect("/");
  }

  return (
    <Game
      userId={user.id}
      category="SMART"
      initialProblems={problemQuery.data ?? []}
      settings={options.gameSettings}
      route={GAME_SMART_ROUTE}
    />
  );
}
