import { type GetServerSideProps } from "next/types";
import { type Problem, shuffleProblemListOrder } from "@/game/problem";
import Game from "@/components/views/Game";
import { getProblemsFromSetId } from "@/utils/hash";
import { isProblemSetId } from "@/game/problemSet";
import { type GameSettings } from "@/components/views/GameSettings";
import { ssgHelper } from "@/server/ssgHelper";
import { getServerAuth } from "@/server/auth";

interface PageProps {
  problems: Problem[];
}

// Repetition drills the set by running through it several times, shuffled, so
// each fact comes back around until it's automatic.
const REPETITIONS = 3;

const REPETITION_SETTINGS: GameSettings = {
  gameMode: "normal",
  gameModifiers: {
    random: { enabled: false },
    shuffled: { enabled: false },
    timed: { enabled: false, durationSeconds: 10 },
  },
};

const getServerSideProps: GetServerSideProps = async (ctx) => {
  const { userId } = await getServerAuth(ctx.req, ctx.res);
  if (!userId) {
    return { redirect: { destination: "/login", permanent: false } };
  }

  const setId = ctx.query.setId;
  if (typeof setId !== "string" || !isProblemSetId(setId)) {
    return { redirect: { destination: "/practice", permanent: false } };
  }

  const helpers = await ssgHelper(ctx);
  const base = await getProblemsFromSetId(setId, helpers);
  const problems = shuffleProblemListOrder(
    Array.from({ length: REPETITIONS }, () => base).flat(),
  );

  return {
    props: {
      problems,
    } satisfies PageProps,
  };
};

const Page = ({ problems }: PageProps) => {
  return (
    <Game
      category="PRACTICE"
      // Reuse the practice game's completion page after saving.
      route="practice/game"
      userId="TEMP"
      initialProblems={problems}
      settings={REPETITION_SETTINGS}
    />
  );
};

export { Page as default, getServerSideProps };
