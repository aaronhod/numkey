import React, { useCallback, useEffect, useReducer, useState } from "react";
import Numpad from "./Numpad";
import { Display, DisplayContent, DisplayHeader } from "./Display";
import type { Problem } from "./Problem";
import dayjs from "dayjs";
import type { RouterError } from "@/utils/api";
import { api } from "@/utils/api";
import { useRouter } from "next/router";
import { useAuth } from "@clerk/nextjs";
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
import { LoaderOverlay } from "@/components/LoaderOverlay";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

// add duration plugin for dayjs
import duration from "dayjs/plugin/duration";
import type { GameMode, GameModifiers } from "@/components/game/GameSettings";

dayjs.extend(duration);

interface GameProps {
  initialProblems: Problem[];
  settings: GameSettings;
}

export interface GameRoundAttempt {
  value: number;
  msElapsed: number;
}

export interface GameSettings {
  gameMode: GameMode;
  gameModifiers: GameModifiers;
  nextOnFail?: boolean;
}

export function isCorrectAnswer(
  answer: number,
  attempt: string | number,
  negativeMode: boolean,
) {
  if (negativeMode) {
    return Number(attempt) === -answer;
  }
  return Number(attempt) === answer;
}

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

const PauseMenu = ({
  isOpen,
  setIsOpen,
}: {
  isOpen: boolean;
  setIsOpen: (open: boolean) => void;
}) => {
  const router = useRouter();

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogContent
        className="sm:max-w-[425px]"
        onEscapeKeyDown={(e) => {
          e.preventDefault();
        }}
      >
        <DialogHeader>
          <DialogTitle>Game Paused</DialogTitle>
          <DialogDescription>
            Exit to the main menu or resume.
          </DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <Button
            variant="destructive"
            className="mr-auto"
            onClick={() => void router.push("/")}
          >
            Exit Game
          </Button>
          <Button variant="secondary" onClick={() => setIsOpen(false)}>
            Resume
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

const Game: React.FC<GameProps> = ({ initialProblems, settings }) => {
  const [
    {
      startedAt,
      inputValue,
      prevInputValue,
      finishedProblems,
      allCompleted,
      negativeMode,
      stopWatchMs,
      timerMs,
      problemQueue,
      lives,
    },
    dispatch,
  ] = useReducer(
    gameReducer(settings),
    initialGameState(initialProblems, settings),
  );
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const { userId } = useAuth();
  const addGameMutation = api.game.addFinishedGame.useMutation();
  const router = useRouter();
  const currentProblem = problemQueue[0]?.problem;

  const updateRunningMilliseconds = useCallback((deltaMilliseconds: number) => {
    dispatch({ type: "update-timer", value: deltaMilliseconds });
  }, []);

  const submitGame = useCallback(() => {
    const finishedGame = {
      userId: userId!,
      startedAt: startedAt,
      finishedAt: dayjs().toDate(),
      rounds: finishedProblems,
    };
    addGameMutation.mutate(finishedGame);
  }, [addGameMutation, finishedProblems, startedAt, userId]);

  const handleKeyDown = useCallback((event: KeyboardEvent) => {
    event.preventDefault();
    switch (event.key.toLowerCase()) {
      // Menu Input
      case "escape":
        return setIsMenuOpen((prev) => !prev);
      // Main Game Input
      case "enter":
        return dispatch({ type: "add-attempt" });
      case "backspace":
        return dispatch({ type: "input-remove" });
      case "-":
        return dispatch({ type: "input-toggle-negative", value: "-" });
      // on small keyboards, + and = are the same key. = isn't used so we do this for now.
      case "+":
      case "=":
        return dispatch({ type: "input-toggle-negative", value: "+" });
      default:
        dispatch({ type: "input-insert", value: event.key });
    }
  }, []);

  useEffect(() => {
    if (!allCompleted || !addGameMutation.isIdle) return;

    submitGame();
  }, [addGameMutation.isIdle, allCompleted, submitGame]);

  useEffect(() => {
    if (!currentProblem) return;
    const inputNumber = Number(inputValue);

    // add attempt for correct answer
    if (isCorrectAnswer(currentProblem.answer, inputNumber, negativeMode)) {
      dispatch({
        type: "add-attempt",
        value: inputNumber,
      });
    }

    // add implicit attempt when a user has entered a value and then cleared their input
    // this is toggled off for lives mode
    if (settings.gameMode === "lives") {
      return;
    }
    if (inputValue === "" && prevInputValue) {
      // don't add implicit attempt if the user is in the middle of typing a number
      if (prevInputValue.length < currentProblem.answer.toString().length) {
        return;
      }

      dispatch({
        type: "add-attempt",
        value: inputNumber,
      });
    }
  }, [inputValue, currentProblem, prevInputValue, negativeMode, settings]);

  useEffect(() => {
    if (addGameMutation.isSuccess) {
      void router.push(`/game/${addGameMutation.data.id}/complete`);
    }
  }, [addGameMutation.data?.id, addGameMutation.isSuccess, router]);

  return (
    <>
      <PauseMenu isOpen={isMenuOpen} setIsOpen={setIsMenuOpen} />
      <ErrorDialog
        error={addGameMutation.error}
        refetch={submitGame}
        isLoading={addGameMutation.isPending}
      />
      <LoaderOverlay isLoading={addGameMutation.isPending} />
      <div className="flex h-full flex-col font-mono text-lg font-semibold">
        <Display
          className="h-1/4"
          negativeMode={negativeMode}
          handleKeyDown={handleKeyDown}
        >
          <DisplayHeader
            completed={finishedProblems.length}
            total={initialProblems.length}
            runningMs={stopWatchMs}
            setRunningMs={updateRunningMilliseconds}
            paused={isMenuOpen}
            lives={lives}
            settings={settings}
            remainingMs={timerMs}
          />
          <DisplayContent
            problem={currentProblem ?? null}
            negativeMode={negativeMode}
            userValue={inputValue}
          />
        </Display>
        <Numpad dispatch={dispatch} negativeMode={negativeMode} />
      </div>
    </>
  );
};
export { Game as default };
