import React, { useCallback, useEffect, useReducer } from "react";

import type { Problem } from "@/game/problem";
import dayjs from "dayjs";
import type { RouterError } from "@/utils/api";
import { api } from "@/utils/api";
import { useRouter } from "next/router";
import { AlertDialogTitle } from "@radix-ui/react-alert-dialog";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
} from "@/app/_components/shad-ui/alert-dialog";
import { Loader2 } from "lucide-react";
import {
  gameReducer,
  initialGameState,
} from "@/app/_components/views/gameReducer";
import { LoaderOverlay } from "@/app/_components/LoaderOverlay";
import { Button } from "@/app/_components/shad-ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/app/_components/shad-ui/dialog";

// add duration plugin for dayjs
import duration from "dayjs/plugin/duration";
import { getFinishedGame, isAnswerCorrect } from "@/game/gameInstance";
import {
  DEFAULT_GAME_SETTINGS,
  type GameCategory,
  type GameSettings,
} from "@/app/_components/views/GameSettings";
import { GameRoute } from "@/constants/routes";
import {
  Display,
  DisplayContent,
  DisplayHeader,
} from "@/app/_components/views/Display";
import Numpad from "@/app/_components/views/Numpad";

dayjs.extend(duration);

interface GameProps {
  initialProblems: Problem[];
  userId: string;
  category: GameCategory;
  route: GameRoute;
  settings?: GameSettings;
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

const Game = ({
  userId,
  initialProblems,
  category,
  route,
  settings = DEFAULT_GAME_SETTINGS,
}: GameProps) => {
  const router = useRouter();
  const addGameMutation = api.game.addFinishedGame.useMutation();

  const [
    {
      game,
      inputValue,
      prevInputValue,
      negativeMode,
      gameStopWatchMs,
      problemTimerMs,
    },
    dispatch,
  ] = useReducer(
    gameReducer(settings),
    initialGameState(userId, initialProblems, category, settings),
  );

  const pauseGame = useCallback((newPauseState?: boolean) => {
    dispatch({ type: "pause-game", value: newPauseState });
  }, []);

  const updateRunningMilliseconds = useCallback((deltaMilliseconds: number) => {
    dispatch({ type: "update-timer", value: deltaMilliseconds });
  }, []);

  const submitGame = useCallback(() => {
    addGameMutation.mutate(getFinishedGame(game));
  }, [addGameMutation, game]);

  const handleKeyDown = useCallback(
    (event: KeyboardEvent) => {
      function addImplicitAttempt() {
        if (
          !game.currentProblem ||
          (inputValue === null && prevInputValue === "")
        ) {
          return;
        }

        const userIsTyping =
          game.currentProblem &&
          prevInputValue.length < game.currentProblem.answer.toString().length;

        if (!userIsTyping && settings?.gameMode !== "lives") {
          dispatch({
            type: "add-attempt",
            value: Number(inputValue),
          });
        }
      }

      event.preventDefault();
      switch (event.key.toLowerCase()) {
        // Menu Input
        case "escape":
          return pauseGame();
        // Main Game Input
        case "enter":
          return dispatch({ type: "add-attempt" });
        case "backspace":
          if (inputValue === null) {
            return;
          }

          if (inputValue.length === 1) {
            addImplicitAttempt();
          }

          dispatch({ type: "input-remove" });
          return;
        case "-":
          return dispatch({ type: "input-toggle-negative", value: "-" });
        // on small keyboards, + and = are the same key. = isn't used, so we do this for now.
        case "+":
        case "=":
          return dispatch({ type: "input-toggle-negative", value: "+" });
        // Number Input
        default: {
          const keyNumber = Number(event.key);
          if (Number.isNaN(keyNumber) || !game.currentProblem) {
            return;
          }

          const fullAnswer = Number(inputValue + event.key);
          if (isAnswerCorrect(game.currentProblem, fullAnswer)) {
            return dispatch({
              type: "add-attempt",
              value: fullAnswer,
            });
          }

          return dispatch({
            type: "input-insert",
            value: keyNumber.toString(),
          });
        }
      }
    },
    [
      game.currentProblem,
      inputValue,
      pauseGame,
      prevInputValue,
      settings?.gameMode,
    ],
  );

  // submit game when game is finished
  useEffect(() => {
    if (game.state !== "finished" || !addGameMutation.isIdle) {
      return;
    }

    submitGame();
  }, [addGameMutation.isIdle, game.state, submitGame]);

  // redirect to complete page when game is submitted
  useEffect(() => {
    if (addGameMutation.isSuccess) {
      void router.push(`/${route}/${addGameMutation.data.id}/complete`);
    }
  }, [addGameMutation.data?.id, addGameMutation.isSuccess, router]);

  return (
    <>
      <PauseMenu isOpen={game.pause.isPaused} setIsOpen={pauseGame} />
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
            completed={game.completedProblems.length}
            total={initialProblems.length}
            runningMs={gameStopWatchMs}
            setRunningMs={updateRunningMilliseconds}
            paused={game.pause.isPaused}
            lives={game.lives}
            settings={settings}
            remainingMs={problemTimerMs ?? null}
          />
          <DisplayContent
            problem={game.currentProblem ?? null}
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
