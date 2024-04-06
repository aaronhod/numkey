import { type GetServerSideProps } from "next/types";
import { fromProblemSetId, type Problem } from "@/game/problem";
import Game from "@/components/views/Game";
import { hashProblemDefs } from "@/utils/hash";
import { ssgHelper } from "@/server/ssgHelper";

interface PageProps {
  problems: Problem[];
}

const getServerSideProps: GetServerSideProps = async (ctx) => {
  const setId = ctx.query.setId;
  if (typeof setId !== "string") {
    return {
      notFound: true,
    };
  }

  const helpers = await ssgHelper(ctx);
  const problemHashes = await hashProblemDefs(fromProblemSetId(setId));
  const problems = await helpers.game.findProblemsByHash.fetch(problemHashes);

  return {
    props: {
      problems,
    } satisfies PageProps,
  };
};

const Page = ({ problems }: PageProps) => {
  return <Game initialProblems={problems} />;
};

export { Page as default, getServerSideProps };
