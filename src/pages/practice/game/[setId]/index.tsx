import { type GetServerSideProps } from "next/types";
import { type Problem } from "@/game/problem";
import Game from "@/components/views/Game";
import { getProblemsFromSetId } from "@/utils/hash";
import { isProblemSetId } from "@/game/problemSet";
import { ssgHelper } from "@/server/ssgHelper";
import { getServerAuth } from "@/server/auth";

interface PageProps {
  problems: Problem[];
}

const getServerSideProps: GetServerSideProps = async (ctx) => {
  const { userId } = await getServerAuth(ctx.req, ctx.res);
  if (!userId) {
    // Practice saves to the account, so it requires a login.
    return { redirect: { destination: "/login", permanent: false } };
  }

  const setId = ctx.query.setId;
  if (typeof setId !== "string" || !isProblemSetId(setId)) {
    // An unknown set id would throw in problem generation (500); send the
    // player back to the practice picker instead.
    return { redirect: { destination: "/practice", permanent: false } };
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
  return (
    <Game
      category="PRACTICE"
      route="practice/game"
      userId="TEMP"
      initialProblems={problems}
    />
  );
};

export { Page as default, getServerSideProps };
