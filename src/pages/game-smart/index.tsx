import type { ParsedUrlQuery } from "querystring";
import Game from "@/components/views/Game";
import { generateProblems, type Operator } from "@/game/problem";
import type {
  GameMode,
  GameModifierName,
  GameSettings,
} from "@/components/views/GameSettings";
import { redirect } from "next/navigation";
import { hashProblemDefs } from "@/utils/hash";
import { GAME_SMART_ROUTE } from "@/constants/routes";
import { useUser } from "@clerk/nextjs";
import { useEffect, useState } from "react";
import { api } from "@/utils/api";
import { useRouter } from "next/router";

interface ParsedQueryParams extends ParsedUrlQuery {
  gameMode: GameMode;
  numbers: string[] | string;
  operators: string[] | string;
  nextOnFail: string;
  modifiers: string;
}

interface QueryParams {
  numbers: number[];
  operators: Operator[];
  gameSettings: GameSettings;
}

function parseQueryParams(query: ParsedUrlQuery): QueryParams {
  const parsedQuery = query as ParsedQueryParams;
  const numbers = Array.isArray(parsedQuery.numbers)
    ? parsedQuery.numbers.map((num) => Number(num))
    : [Number(parsedQuery.numbers)];
  const operators: Operator[] = (
    Array.isArray(parsedQuery.operators)
      ? parsedQuery.operators
      : [parsedQuery.operators]
  ) as Operator[];
  const nextOnFail = parsedQuery.nextOnFail === "true";
  const modifiers = parsedQuery.modifiers.split(",") as GameModifierName[];

  const gameSettings = {
    gameMode: parsedQuery.gameMode,
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

export default function RunningGame() {
  const { user, isLoaded } = useUser();
  const router = useRouter();

  const [settings, setSettings] = useState<GameSettings>();
  const [problemDefinitions, setProblemDefinitions] = useState<string[]>([]);
  const problemQuery = api.game.findProblemsByHash.useQuery(
    problemDefinitions,
    {
      enabled: problemDefinitions.length > 0,
    },
  );

  useEffect(() => {
    if (!isLoaded || !router.isReady) {
      return;
    }

    const params = parseQueryParams(router.query);
    setSettings(params.gameSettings);

    console.log("here")
    console.info("params", params)

    const loadData = async () => {
      setProblemDefinitions(
        await hashProblemDefs(
          generateProblems(params.numbers, params.operators),
        ),
      );
    };

    void loadData();
  }, [router.isReady, isLoaded]);

  console.log(problemDefinitions);

  if (!isLoaded || !settings || !problemQuery.data) {
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
      settings={settings}
      route={GAME_SMART_ROUTE}
    />
  );
}
