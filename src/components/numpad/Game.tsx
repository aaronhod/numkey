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
  time: number;
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

  useEffect(() => {
    if (!currentProblem || !currentProblemAttempt) {
      return;
    }

    const isSolution =
      currentProblemAttempt.get(currentProblemAttempt.size - 1)?.value ===
      currentProblem.answer;

    if (!isSolution) {
      return;
    }

    const totalDuration = solutions.reduce(
      (acc, problem) => acc + problem.duration,
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
            currentProblemAttempt,
            ([ordering, { value }]) => ({
              ordering,
              value,
            }),
          ),
        },
      ];
    });
    setCurrentProblemAttempt(new Map());
  }, [currentProblem, currentProblem?.answer, currentProblemAttempt, setCurrentProblemAttempt, setSolutions, solutions]);

  const addAttempt = useCallback(() => {
    const finishedAt = dayjs();
    const timeDiff = finishedAt.diff(lastSubmitAt, "millisecond");

    setCurrentProblemAttempt((prev) => {
      prev.set(prev.size, {
        value: Number(inputValue),
        time: timeDiff,
      });
      return prev;
    });
    setLastSubmitAt(finishedAt);
  }, [lastSubmitAt, inputValue, setCurrentProblemAttempt]);

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
    setInputValue(null);
  }

  // capture attempts, if a number is fully cleared, then it is an attempt
  useEffect(() => {
    if (!inputValue) {
      return;
    }

    setPrevInputValue((prev) => prev + inputValue);
  }, [inputValue]);

  useEffect(() => {
    if (!prevInputValue) {
      return;
    }

    if (inputValue === "") {
      addAttempt();
    }
  }, [inputValue, prevInputValue, addAttempt]);

  // check if the answer is correct
  useEffect(() => {
    if (inputValue === "") {
      return;
    }

    if (Number(inputValue) === currentProblem?.answer) {
      addAttempt();
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
