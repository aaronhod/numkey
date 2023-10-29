import React, { useCallback, useEffect, useState } from "react";
import Numpad from "./Numpad";
import { Display } from "./Display";
import type { Problem } from "./Problem";
import type { Dayjs } from "dayjs";
import dayjs from "dayjs";
import { api } from "@/utils/api";
import { useRouter } from "next/router";
import { useAuth } from "@clerk/nextjs";
import type { FinishedGame, FinishedRound } from "@/server/api/routers/games";
import { useImmer } from "use-immer";
import { enableMapSet } from "immer";

enableMapSet();

interface GameProps {
  initialProblems: Problem[];
}

interface GameRoundAttempt {
  value: number;
  secondsElapsed: number;
}

type ProblemAttempts = Map<number, GameRoundAttempt>;

const Game: React.FC<GameProps> = ({ initialProblems }) => {
  const [inputValue, setInputValue] = useState<string | null>(null);
  const [prevInputValue, setPrevInputValue] = useState<string>("");
  const [problemQueue, setProblemQueue] = useImmer<Problem[]>(
    initialProblems.slice(1),
  );
  const [currentProblem, setCurrentProblem] = useState<Problem | null>(
    initialProblems[0] ?? null,
  );
  const [currentProblemAttempt, setCurrentProblemAttempt] =
    useImmer<ProblemAttempts>(new Map());
  const [solutions, setSolutions] = useImmer<FinishedRound[]>([]);
  const [lastSubmitAt, setLastSubmitAt] = useState<Dayjs>(dayjs());

  const { userId } = useAuth();
  const submitGame = api.game.addFinishedGame.useMutation();
  const router = useRouter();
  const startedAt = dayjs();

  const addSolution = useCallback(
    (updatedAttempts: Map<number, GameRoundAttempt>) => {
      const totalDuration = Array.from(updatedAttempts.values()).reduce(
        (acc, problem) => acc + problem.secondsElapsed,
        0,
      );
      setSolutions((prev) => {
        return [
          ...prev,
          {
            ...currentProblem,
            isCompleted: true,
            duration: totalDuration,
            attempts: Array.from(
              updatedAttempts.entries(),
              ([ordering, { value }]) => ({
                ordering,
                value,
              }),
            ),
          },
        ];
      });
      setCurrentProblemAttempt(new Map());
    },
    [currentProblem, setCurrentProblemAttempt, setSolutions],
  );

  const addAttempt = useCallback(
    (answer: number) => {
      const finishedAt = dayjs();
      const timeDiff = finishedAt.diff(lastSubmitAt, "millisecond");
      const updatedAttempts = new Map(currentProblemAttempt).set(
        currentProblemAttempt.size,
        {
          value: answer,
          secondsElapsed: timeDiff,
        },
      );

      setCurrentProblemAttempt(updatedAttempts);
      setLastSubmitAt(finishedAt);

      if (answer === currentProblem?.answer) {
        addSolution(updatedAttempts);
      }
    },
    [
      lastSubmitAt,
      currentProblemAttempt,
      setCurrentProblemAttempt,
      currentProblem?.answer,
      addSolution,
    ],
  );

  const constructFinishedGame = useCallback(
    (): FinishedGame => ({
      userId: userId!,
      startedAt: startedAt.toDate(),
      finishedAt: lastSubmitAt.toDate(),
      rounds: solutions,
    }),
    [userId, startedAt, lastSubmitAt, solutions],
  );

  const completeGame = useCallback(
    async (game: FinishedGame) => {
      // await submitGame.mutateAsync(game);
      console.log(game);

      if (submitGame.isSuccess) {
        await router.push(`/game/${submitGame.data.id}/complete`);
      }
    },
    [submitGame, router],
  );

  const endGame = useCallback(async () => {
    const finishedGame = constructFinishedGame();
    await completeGame(finishedGame);
  }, [constructFinishedGame, completeGame]);

  const problemQueuePeek = useCallback((): Problem | null => {
    const nextProblem = problemQueue[0];
    setCurrentProblem(nextProblem ?? null);

    if (!nextProblem) {
      return null;
    }

    setProblemQueue((prev) => prev.slice(1));
    return nextProblem;
  }, [problemQueue, setProblemQueue]);

  function clearInput() {
    setPrevInputValue("");
    setInputValue(null);
  }

  // capture attempts, if a number is fully cleared, then it is an attempt
  useEffect(() => {
    if (inputValue === "" || inputValue === null) {
      return;
    }

    if (inputValue.length < prevInputValue.length) {
      return;
    }

    setPrevInputValue((prev) => prev + inputValue.slice(-1));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [inputValue]);

  useEffect(() => {
    if (!prevInputValue) {
      return;
    }

    if (inputValue === "") {
      addAttempt(Number(prevInputValue));
      clearInput();
    }
  }, [inputValue, prevInputValue, addAttempt]);

  // check if the answer is correct
  useEffect(() => {
    if (inputValue === "") {
      return;
    }

    const inputNumber = Number(inputValue);
    if (inputNumber === currentProblem?.answer) {
      addAttempt(inputNumber);
      const nextProblem = problemQueuePeek();

      if (!nextProblem) {
        void endGame();
        return;
      }

      clearInput();
    }
  }, [
    inputValue,
    currentProblem,
    problemQueuePeek,
    endGame,
    initialProblems,
    problemQueue,
    addAttempt,
  ]);

  function handleKeyDown(event: React.KeyboardEvent<HTMLDivElement>) {
    event.preventDefault();

    const asNumber = Number(event.key);
    if (
      (!isNaN(asNumber) && asNumber >= 0 && asNumber <= 9) ||
      event.key === "."
    ) {
      setInputValue((prev) => {
        if (prev === null) {
          return event.key;
        }

        return prev + event.key;
      });
    }

    if (event.key === "Backspace") {
      setInputValue((prev) => {
        if (prev === null) {
          return null;
        }

        return prev.slice(0, -1);
      });
    }
  }

  return (
    <div className="flex h-full flex-col font-mono text-lg font-semibold">
      <Display
        className="h-1/6"
        value={inputValue}
        problem={currentProblem}
        handleKeyDown={handleKeyDown}
      />
      <Numpad className="h-5/6" value={inputValue} setValue={setInputValue} />
    </div>
  );
};

export { Game as default };
