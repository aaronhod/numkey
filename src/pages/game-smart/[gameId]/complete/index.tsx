import { type RouterOutputs } from "@/utils/api";
import { useRouter } from "next/router";
import { Button } from "@/components/shad-ui/button";
import { LoaderOverlay } from "@/components/LoaderOverlay";
import { GameResults } from "@/components/views/GameResults";
import type { Operator } from "@/game/problem";
import { getGameRouteQuickPlay } from "@/constants/routes";
import { ssgHelper } from "@/server/ssgHelper";
import { getServerAuth } from "@/server/auth";
import {
  type GetServerSideProps,
  type InferGetServerSidePropsType,
} from "next";

export const getServerSideProps: GetServerSideProps = async (ctx) => {
  const { userId } = await getServerAuth(ctx.req, ctx.res);
  if (!userId) {
    return {
      redirect: { destination: "/login", permanent: false },
    };
  }

  const helpers = await ssgHelper(ctx);

  const gameId = Number(ctx.query.gameId);
  if (Number.isNaN(gameId)) {
    return {
      props: {
        error: new Error("Invalid game id"),
      },
    };
  }

  try {
    const game = await helpers.game.getById.fetch(gameId);

    return {
      props: {
        game,
      },
    };
  } catch (error) {
    return {
      props: {
        error: error,
      },
    };
  }
};

type Props = {
  game: RouterOutputs["game"]["getById"];
  error?: Error;
} & InferGetServerSidePropsType<typeof getServerSideProps>;

const FinishedGamePage = ({ game, error }: Props) => {
  const router = useRouter();

  function newGame() {
    router.push(`/${getGameRouteQuickPlay()}`).catch((err) => console.error(err));
  }

  function mainMenu() {
    router.push("/").catch((err) => console.error(err));
  }

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
            Error — {error.message}
          </p>
        )}
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

export { FinishedGamePage as default };
