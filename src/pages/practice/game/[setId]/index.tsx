import { type GetServerSideProps } from "next/types";
import { type Problem } from "@/game/problem";
import Game from "@/components/views/Game";
import { getProblemsFromSetId } from "@/utils/hash";
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
  const problems = await getProblemsFromSetId(setId, helpers);

  return {
    props: {
      problems,
    } satisfies PageProps,
  };
};

const Page = ({ problems }: PageProps) => {
  return <Game category="PRACTICE" userId="TEMP" initialProblems={problems} />;
};

export { Page as default, getServerSideProps };
