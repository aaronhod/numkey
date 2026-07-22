import { type RouterOutputs } from "@/utils/api";
import { useRouter } from "next/router";
import { Button } from "@/components/shad-ui/button";
import { LoaderOverlay } from "@/components/LoaderOverlay";
import { GameResults } from "@/components/views/GameResults";
import type { Operator } from "@/game/problem";

/**
 * Results screen shared by the finished-game pages (QuickPlay/smart games and
 * practice games). Fetching happens in each page's getServerSideProps; this
 * just renders the round-by-round table and the navigation buttons.
 */
export const CompletedGameScreen = ({
  game,
  error,
  playAgainHref,
}: {
  game: RouterOutputs["game"]["getById"];
  error?: string | null;
  playAgainHref: string;
}) => {
  const router = useRouter();

  if (!game) {
    return <LoaderOverlay isLoading={true} />;
  }

  return (
    <div className="container flex h-full flex-col items-center justify-center p-5">
      <div className="h-full w-full ">
        <div className="flex w-full flex-col gap-3 py-3">
          <p className="text-[11px] uppercase tracking-[0.08em] text-muted-foreground">
            Results
          </p>
          <h1 className="text-4xl font-bold leading-[1.1] tracking-[-0.01em]">
            Game Complete
          </h1>
        </div>
        <GameResults
          rounds={game.rounds.map((round) => ({
            problem: {
              leftValue: round.problem.leftValue,
              rightValue: round.problem.rightValue,
              operator: round.problem.operator as Operator,
              answer: round.problem.answer,
            },
            isCompleted: round.isCompleted,
            durationMs: Number(round.durationMs),
            attemptCount: round.attempts.length,
          }))}
        />
        {error && (
          <p className="uppercase tracking-[0.05em] text-muted-foreground">
            Error — {error}
          </p>
        )}
        <div className="flex flex-row-reverse gap-3">
          <Button
            className="btn mt-5"
            onClick={() => void router.push(playAgainHref)}
          >
            Play Again
          </Button>
          <Button
            variant="secondary"
            className="btn mt-5"
            onClick={() => void router.push("/")}
          >
            Main Menu
          </Button>
        </div>
      </div>
    </div>
  );
};
