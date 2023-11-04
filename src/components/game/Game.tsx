import React, { useCallback, useEffect, useReducer } from "react";
import Numpad from "./Numpad";
import { Display } from "./Display";
import type { Problem } from "./Problem";
import dayjs from "dayjs";
import type { RouterError } from "@/utils/api";
import { api } from "@/utils/api";
import { useRouter } from "next/router";
import { useAuth } from "@clerk/nextjs";
import type { FinishedGame } from "@/server/api/routers/games";
import { enableMapSet } from "immer";
import { AlertDialogTitle } from "@radix-ui/react-alert-dialog";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
} from "@/components/ui/alert-dialog";
import { Loader2 } from "lucide-react";
import { gameReducer, initialGameState } from "@/components/game/gameReducer";

// Enable Map/Set as part of the global immer state
enableMapSet();

//TODO: refactor to use reducer pattern

interface GameProps {
  initialProblems: Problem[];
}

interface GameRoundAttempt {
  value: number;
  secondsElapsed: number;
}

export type ProblemAttempts = Map<number, GameRoundAttempt>;

const ErrorDialog = ({
  error,
  refetch,
  isLoading,
}: {
  error: RouterError | null;
  isLoading: boolean;
  refetch: () => void;
}) => {
  const router = useRouter();

  return (
    <AlertDialog open={Boolean(error)}>
      <AlertDialogContent className="max-w-2xl translate-y-[-100%]">
        <AlertDialogHeader>
          <AlertDialogTitle className="text-3xl ">
            Error saving your game
          </AlertDialogTitle>
          <AlertDialogDescription>
            <p className="text-base">
              There was an error when trying to saving your game. Please wait a
              few minutes and try to resubmit.
            </p>
            <p className="mt-1 text-base font-light italic">
              Otherwise, go back to the menu to start a new game.
            </p>
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter className="mt-1">
          <AlertDialogAction
            variant="outline"
            className="mr-auto"
            onClick={() => void router.push("/")}
          >
            Back to Menu
          </AlertDialogAction>
          {isLoading ? (
            <AlertDialogAction disabled>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Resubmitting
            </AlertDialogAction>
          ) : (
            <AlertDialogAction onClick={() => refetch()}>
              Resubmit
            </AlertDialogAction>
          )}
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};

const Game: React.FC<GameProps> = ({ initialProblems }) => {
  const [
    {
      inputValue,
      prevInputValue,
      currentProblem,
      finishedProblems,
      lastSubmittedAt,
      allCompleted,
    },
    dispatch,
  ] = useReducer(gameReducer, initialGameState(initialProblems));

  const { userId } = useAuth();
  const addGameMutation = api.game.addFinishedGame.useMutation();
  const router = useRouter();
  const startedAt = dayjs();

  const submitGame = useCallback(() => {
    const finishedGame = {
      userId: userId!,
      startedAt: startedAt.toDate(),
      finishedAt: lastSubmittedAt.toDate(),
      rounds: finishedProblems,
    };
    addGameMutation.mutate(finishedGame);
  }, [addGameMutation, finishedProblems, lastSubmittedAt, startedAt, userId]);

  useEffect(() => {
    if (addGameMutation.isLoading) return;
    if (!allCompleted) return;

    submitGame();
  }, [addGameMutation.isLoading, allCompleted, submitGame]);

  useEffect(() => {
    if (!currentProblem) return;

    if (Number(inputValue) === currentProblem.answer) {
      dispatch({ type: "add-attempt", value: Number(inputValue) });
    }

    if (inputValue === "" && prevInputValue) {
      dispatch({ type: "add-attempt", value: Number(inputValue) });
    }
  }, [inputValue, currentProblem, prevInputValue]);

  function handleKeyDown(event: React.KeyboardEvent<HTMLDivElement>) {
    event.preventDefault();

    if (event.key === "Backspace") {
      dispatch({ type: "input-remove" });
      return;
    }

    dispatch({ type: "input-insert", value: event.key });
  }

  useEffect(() => {
    if (addGameMutation.isSuccess) {
      void router.push(`/game/${addGameMutation.data.id}/complete`);
    }
  }, [addGameMutation.data?.id, addGameMutation.isSuccess, router]);

  return (
    <>
      <ErrorDialog
        error={addGameMutation.error}
        refetch={submitGame}
        isLoading={addGameMutation.isLoading}
      />
      <div className="flex h-full flex-col font-mono text-lg font-semibold">
        <Display
          className="h-1/4"
          value={inputValue}
          problem={currentProblem}
          handleKeyDown={handleKeyDown}
        />
        <Numpad
          addValue={(value: string) =>
            dispatch({ type: "input-insert", value: value })
          }
          removeValue={() => dispatch({ type: "input-remove" })}
        />
      </div>
    </>
  );
};
export { Game as default };
