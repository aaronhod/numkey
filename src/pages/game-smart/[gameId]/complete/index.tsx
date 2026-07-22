import { type RouterOutputs } from "@/utils/api";
import { CompletedGameScreen } from "@/components/views/CompletedGameScreen";
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

const FinishedGamePage = ({ game, error }: Props) => {
  return (
    <CompletedGameScreen
      game={game}
      error={error}
      playAgainHref={`/${getGameRouteQuickPlay()}`}
    />
  );
};

export { FinishedGamePage as default };
