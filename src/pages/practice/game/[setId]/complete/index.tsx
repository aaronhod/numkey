import { type RouterOutputs } from "@/utils/api";
import { CompletedGameScreen } from "@/components/views/CompletedGameScreen";
import { ssgHelper } from "@/server/ssgHelper";
import { getServerAuth } from "@/server/auth";
import {
  type GetServerSideProps,
  type InferGetServerSidePropsType,
} from "next";

// The [setId] segment here carries the finished-game id (that's what the Game
// component redirects to after saving), not a problem-set id.
export const getServerSideProps: GetServerSideProps = async (ctx) => {
  const { userId } = await getServerAuth(ctx.req, ctx.res);
  if (!userId) {
    return {
      redirect: { destination: "/login", permanent: false },
    };
  }

  const helpers = await ssgHelper(ctx);

  const gameId = Number(ctx.query.setId);
  if (Number.isNaN(gameId)) {
    return {
      props: {
        game: null,
        error: "Invalid game id",
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
        game: null,
        error: error instanceof Error ? error.message : "Could not load game",
      },
    };
  }
};

type Props = {
  game: RouterOutputs["game"]["getById"];
  error?: string;
} & InferGetServerSidePropsType<typeof getServerSideProps>;

const PracticeGameCompletePage = ({ game, error }: Props) => {
  return (
    <CompletedGameScreen game={game} error={error} playAgainHref="/practice" />
  );
};

export { PracticeGameCompletePage as default };
