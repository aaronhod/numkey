import { type RouterOutputs } from "@/utils/api";
import { useRouter } from "next/router";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/shad-ui/table";
import { Button } from "@/components/shad-ui/button";
import { CheckCircle2, CircleSlash } from "lucide-react";
import { LoaderOverlay } from "@/components/LoaderOverlay";
import type { Operator } from "@/game/problem";
import { getOperatorChar } from "@/game/problem";
import { appRouter } from "@/server/api/root";
import { createContextInner } from "@/server/api/trpc";
import { createServerSideHelpers } from "@trpc/react-query/server";
import { redirect } from "next/navigation";
import superjson from "superjson";
import { clerkClient, getAuth } from "@clerk/nextjs/server";
import {
  type GetServerSideProps,
  type InferGetServerSidePropsType,
} from "next";

export const getServerSideProps: GetServerSideProps = async (ctx) => {
  const { userId } = getAuth(ctx.req);
  const user = userId
    ? await (await clerkClient()).users.getUser(userId)
    : undefined;

  if (!user || !userId) {
    redirect("/");
  }

  const helpers = createServerSideHelpers({
    router: appRouter,
    ctx: await createContextInner({ auth: getAuth(ctx.req) }),
    transformer: superjson,
  });

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
      <div className="h-full w-full ">
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

export { FinishedGamePage as default };
