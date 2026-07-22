import React, {
  useCallback,
  useEffect,
  useMemo,
  useReducer,
  useRef,
  useState,
} from "react";
import Numpad from "src/components/views/Numpad";
import {
  Display,
  DisplayContent,
  DisplayHeader,
} from "src/components/views/Display";
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
} from "@/components/shad-ui/alert-dialog";
import {
  gameReducer,
  initialGameState,
  type AttemptOutcome,
} from "@/components/views/gameReducer";
import { LoaderOverlay } from "@/components/LoaderOverlay";
import { Button } from "@/components/shad-ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/shad-ui/dialog";
import { useLocalStorage } from "@/hooks/useLocalStorage";
import {
  setSoundEnabled,
  setSoundVolume,
  sound,
  VOLUME_LEVELS,
} from "@/utils/sound";
import { saveGuestGame } from "@/utils/guestStorage";

// add duration plugin for dayjs
import duration from "dayjs/plugin/duration";
import { getFinishedGame } from "@/game/gameInstance";
import {
  DEFAULT_GAME_SETTINGS,
  type GameCategory,
  type GameSettings,
} from "@/components/views/GameSettings";
dayjs.extend(duration);

interface GameProps {
  initialProblems: Problem[];
  userId: string;
  category: GameCategory;
  route: string;
  settings?: GameSettings;
  /**
   * Where finished games go: "server" saves via tRPC to the database,
   * "local" (guest mode) saves to localStorage.
   */
  persistence?: "server" | "local";
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
          <AlertDialogTitle className="text-3xl">
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
              Resubmitting <span className="ml-2 animate-pulse">█</span>
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

const SettingsRowLabel = ({ children }: { children: React.ReactNode }) => (
  <span className="text-muted-foreground text-[11px] tracking-[0.08em] uppercase">
    {children}
  </span>
);

const PauseMenu = ({
  isOpen,
  setIsOpen,
  soundOn,
  toggleSound,
  volume,
  setVolume,
}: {
  isOpen: boolean;
  setIsOpen: (open: boolean) => void;
  soundOn: boolean;
  toggleSound: () => void;
  volume: number;
  setVolume: (volume: number) => void;
}) => {
  const router = useRouter();

  const previewVolume = (value: number) => {
    setVolume(value);
    // Apply immediately so the preview blip plays at the new volume.
    setSoundVolume(value);
    sound.correct();
  };

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
            Adjust settings, exit to the main menu, or resume.
          </DialogDescription>
        </DialogHeader>
        <div className="flex flex-col gap-1">
          <div className="flex items-center justify-between">
            <SettingsRowLabel>Sound</SettingsRowLabel>
            <Button variant="ghost" size="sm" onClick={toggleSound}>
              {soundOn ? "On ●" : "Off ○"}
            </Button>
          </div>
          <div className="flex items-center justify-between">
            <SettingsRowLabel>Volume</SettingsRowLabel>
            <div className="flex gap-1">
              {VOLUME_LEVELS.map(({ label, value }) => (
                <Button
                  key={label}
                  variant={volume === value ? "outline" : "ghost"}
                  size="sm"
                  disabled={!soundOn}
                  onClick={() => previewVolume(value)}
                >
                  {label}
                </Button>
              ))}
            </div>
          </div>
        </div>
        <DialogFooter className="gap-2">
          <Button variant="destructive" onClick={() => void router.push("/")}>
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
  persistence = "server",
}: GameProps) => {
  const router = useRouter();
  const addGameMutation = api.game.addFinishedGame.useMutation();

  const [
    {
      game,
      inputValue,
      negativeMode,
      feedback,
      gameStopWatchMs,
      problemTimerMs,
    },
    dispatch,
  ] = useReducer(
    gameReducer(settings),
    initialGameState(userId, initialProblems, category, settings),
  );

  // Only offer the sign/decimal keys when the problem set can need them.
  const showNegative = useMemo(
    () => initialProblems.some((problem) => problem.answer < 0),
    [initialProblems],
  );
  const showDecimal = useMemo(
    () => initialProblems.some((problem) => !Number.isInteger(problem.answer)),
    [initialProblems],
  );

  const [soundOn, setSoundOn] = useLocalStorage("soundEnabled", true);
  useEffect(() => {
    setSoundEnabled(soundOn);
  }, [soundOn]);

  const [soundVolume, setSoundVolumeSetting] = useLocalStorage(
    "soundVolume",
    0.5,
  );
  useEffect(() => {
    setSoundVolume(soundVolume);
  }, [soundVolume]);

  const pauseGame = useCallback((newPauseState?: boolean) => {
    dispatch({ type: "pause-game", value: newPauseState });
  }, []);

  const updateRunningMilliseconds = useCallback((deltaMilliseconds: number) => {
    dispatch({ type: "update-timer", value: deltaMilliseconds });
  }, []);

  const submitGame = useCallback(() => {
    addGameMutation.mutate(getFinishedGame(game));
  }, [addGameMutation, game]);

  // The reducer evaluates every keystroke: correct answers auto-submit and
  // wrong full-length answers auto-clear, so the handler only routes keys.
  // It has stable deps, so the listener is attached exactly once.
  const handleKeyDown = useCallback(
    (event: KeyboardEvent) => {
      const key = event.key;

      if (key === "Escape") {
        event.preventDefault();
        return pauseGame();
      }
      if (key === "Backspace") {
        event.preventDefault();
        return dispatch({ type: "input-remove" });
      }
      if (key === "-") {
        event.preventDefault();
        sound.tap();
        return dispatch({ type: "input-toggle-negative", value: "-" });
      }
      // on small keyboards, + and = are the same key. = isn't used, so we do
      // this for now.
      if (key === "+" || key === "=") {
        event.preventDefault();
        sound.tap();
        return dispatch({ type: "input-toggle-negative", value: "+" });
      }
      if ((key >= "0" && key <= "9") || key === ".") {
        event.preventDefault();
        sound.tap();
        return dispatch({ type: "input-insert", value: key });
      }
    },
    [pauseGame],
  );

  // Attempt feedback: flash the display and play a sound. The flash is
  // derived from the latest attempt and expires via the timeout below.
  const [flashExpiredSeq, setFlashExpiredSeq] = useState(0);
  const flash: AttemptOutcome | null =
    feedback && feedback.seq !== flashExpiredSeq ? feedback.outcome : null;
  useEffect(() => {
    if (!feedback) {
      return;
    }

    if (feedback.outcome === "correct") {
      sound.correct();
    } else {
      sound.wrong();
    }

    const timeout = setTimeout(() => setFlashExpiredSeq(feedback.seq), 160);
    return () => clearTimeout(timeout);
  }, [feedback]);

  useEffect(() => {
    if (game.state === "finished") {
      sound.finish();
    }
  }, [game.state]);

  // submit game when game is finished (once)
  const submittedRef = useRef(false);
  useEffect(() => {
    if (game.state !== "finished" || submittedRef.current) {
      return;
    }

    if (persistence === "local") {
      submittedRef.current = true;
      const saved = saveGuestGame(game);
      void router.push(`/${route}/complete?game=${saved.id}`);
      return;
    }

    if (addGameMutation.isIdle) {
      submittedRef.current = true;
      submitGame();
    }
  }, [addGameMutation.isIdle, game, persistence, route, router, submitGame]);

  // redirect to complete page when game is submitted
  useEffect(() => {
    if (addGameMutation.isSuccess) {
      void router.push(`/${route}/${addGameMutation.data.id}/complete`);
    }
  }, [addGameMutation.data?.id, addGameMutation.isSuccess, router]);

  return (
    <>
      <PauseMenu
        isOpen={game.pause.isPaused}
        setIsOpen={pauseGame}
        soundOn={soundOn}
        toggleSound={() => setSoundOn(!soundOn)}
        volume={soundVolume}
        setVolume={setSoundVolumeSetting}
      />
      <ErrorDialog
        error={addGameMutation.error}
        refetch={submitGame}
        isLoading={addGameMutation.isPending}
      />
      <LoaderOverlay isLoading={addGameMutation.isPending} />
      <div className="flex h-full flex-col border font-mono text-lg font-semibold">
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
            onOpenMenu={() => pauseGame(true)}
          />
          <DisplayContent
            problem={game.currentProblem ?? null}
            negativeMode={negativeMode}
            userValue={inputValue}
            flash={flash}
          />
        </Display>
        <Numpad
          dispatch={dispatch}
          negativeMode={negativeMode}
          showDecimal={showDecimal}
          showNegative={showNegative}
        />
      </div>
    </>
  );
};

export { Game as default };
