"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { Button } from "@shad/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@shad/table";
import { CheckCircle2, CircleSlash } from "lucide-react";
import { LoaderOverlay } from "Macaca/packages/ui/src/components/LoaderOverlay";

import type { Operator } from "@munk/domain/problem";
import { getOperatorChar } from "@munk/domain/problem";

interface User {}

interface FinishedGameSummary {}

const FinishedGameReview = (user: User, game: FinishedGameSummary) => {
  // const { user, isLoaded } = useUser();
  const router = useRouter();
  // const [gameId, setGameId] = useState<number>();

  // const { data: game, error } = api.game.getById.useQuery(gameId!, {
  //   enabled: gameId !== undefined,
  // });

  // useEffect(() => {
  //   if (!isLoaded || !router.isReady) {
  //     return;
  //   }
  //   const { gameId: queryGameId } = router.query;
  //   setGameId(Number(queryGameId));
  // }, [isLoaded, router.isReady]);

  function newGame() {
    router.push("/game").catch((err) => console.error(err));
  }

  function mainMenu() {
    router.push("/").catch((err) => console.error(err));
  }

  const Time = ({ milliSeconds }: { milliSeconds: number }) => {
    const seconds = Math.floor(milliSeconds / 1000);
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    const remainingMilliseconds = milliSeconds % 1000;

    const values = () => {
      if (minutes > 0) {
        return {
          value: `${minutes}:${remainingSeconds}`,
          unit: "m",
        };
      }

      if (seconds > 0) {
        return {
          value: `${seconds}.${remainingMilliseconds}`,
          unit: "s",
        };
      }

      return {
        value: milliSeconds.toString(),
        unit: "ms",
      };
    };

    return (
      <div className="flex">
        <p className="">{values().value}</p>
        <p className="font-extralight">{values().unit}</p>
      </div>
    );
  };

  if (!game) {
    return <LoaderOverlay isLoading={true} />;
  }

  return (
    <div className="container flex h-full flex-col items-center justify-center p-5">
      <div className="h-full w-full">
        <div className="flex w-full items-center">
          <h1 className="py-3 text-4xl font-bold">Game Complete</h1>
        </div>
        <Table className="h-3/5 rounded-lg bg-secondary shadow-sm">
          <TableHeader>
            <TableRow>
              <TableHead>Problem</TableHead>
              <TableHead>Answer</TableHead>
              <TableHead>Solved</TableHead>
              <TableHead>Time</TableHead>
              <TableHead>Attempts</TableHead>
              <TableHead>Average Time</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {game.rounds.map((round, index) => (
              <TableRow key={index}>
                <TableCell>
                  {round.problem.leftValue}{" "}
                  {getOperatorChar(round.problem.operator as Operator)}{" "}
                  {round.problem.rightValue}
                </TableCell>
                <TableCell>{round.problem.answer}</TableCell>
                <TableCell>
                  {round.isCompleted ? (
                    <CheckCircle2 className="text-primary" />
                  ) : (
                    <CircleSlash className="text-destructive" />
                  )}
                </TableCell>
                <TableCell>
                  <Time milliSeconds={Number(round.durationMs)} />
                </TableCell>
                <TableCell>{round.attempts.length}</TableCell>
                {/*<TableCell>todo for each problem find the users average solve time</TableCell>*/}
              </TableRow>
            ))}
          </TableBody>
        </Table>
        {error && <p className="text-red-500">{error.message}</p>}
        <div className="flex flex-row-reverse gap-3">
          <Button className="btn mt-5" onClick={() => void newGame()}>
            Play Again
          </Button>
          <Button
            variant="secondary"
            className="btn mt-5"
            onClick={() => void mainMenu()}
          >
            Main Menu
          </Button>
        </div>
      </div>
    </div>
  );
};

export { FinishedGameReview as default };
