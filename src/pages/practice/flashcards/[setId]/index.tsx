import type { NextPageWithLayout } from "@/pages/_app";
import HeaderLayout from "@/components/layouts/HeaderLayout";
import { getOperatorChar, type Problem } from "@/game/problem";
import { type GetStaticProps } from "next/types";
import { staticHelper } from "@/server/ssgHelper";
import { getProblemsFromSetId } from "@/utils/hash";
import { DEFAULT_PROBLEM_SET_IDS, type ProblemSetId } from "@/game/problemSet";
import Head from "next/head";
import { type ReactElement, useReducer } from "react";
import { Card } from "@/components/shad-ui/card";
import { Separator } from "@/components/shad-ui/separator";
import { Button } from "@/components/shad-ui/button";

interface FlashCardProps {
  problem: Problem;
}

const FlashCard = ({ problem }: FlashCardProps) => {
  const [flipped, setFlipped] = useReducer((flipped) => !flipped, false);

  return (
    <Card
      className="w-32 cursor-pointer select-none p-4 text-right"
      onClick={setFlipped}
    >
      <div className="flex flex-col text-4xl">
        <p>{problem.leftValue}</p>
        <div className="flex flex-row">
          <p className="flex-1 text-left text-4xl">
            {getOperatorChar(problem.operator)}
          </p>
          <p>{problem.rightValue}</p>
        </div>
        <Separator />
        <div className="flex min-h-10 flex-col">
          <p className="mt-auto leading-5">{flipped ? problem.answer : " "}</p>
        </div>
      </div>
    </Card>
  );
};

const FlashCardSetPage = ({ problems }: FlashCardSetPageProps) => {
  return (
    <main className="flex h-max flex-col p-12">
      <div className="flex">
        <h1 className="mb-4 text-3xl font-bold leading-tight tracking-tighter">
          Flash Cards
        </h1>
        <div className="ml-auto flex gap-2">
          <Button variant="secondary">Flip All</Button>
          <Button variant="secondary">Shuffle</Button>
          <Button variant="secondary">Sort</Button>
          <Button variant="destructive">Reset</Button>
        </div>
      </div>

      <div className="grid justify-items-center gap-5 grid-cols-fill-28">
        {problems.map((problem) => (
          <FlashCard problem={problem} key={problem.id} />
        ))}
      </div>
    </main>
  );
};

interface FlashCardSetPageProps {
  problems: Problem[];
}

export const getStaticProps = (async (ctx) => {
  const setId = ctx.params?.setId;
  if (typeof setId !== "string") {
    return {
      notFound: true,
    };
  }

  const helpers = await staticHelper();
  const problems = await getProblemsFromSetId(setId, helpers);

  return {
    props: {
      problems,
    } as FlashCardSetPageProps,
  };
}) satisfies GetStaticProps<FlashCardSetPageProps>;

export const getStaticPaths = async () => {
  return {
    paths: DEFAULT_PROBLEM_SET_IDS.map((setId: ProblemSetId) => ({
      params: { setId: setId },
    })),
    fallback: "blocking",
  };
};

const Page: NextPageWithLayout<FlashCardSetPageProps> = (props) => {
  return (
    <>
      <Head>
        <title>Math Game</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <FlashCardSetPage {...props} />
    </>
  );
};
Page.getLayout = (page: ReactElement) => <HeaderLayout>{page}</HeaderLayout>;

export default Page;
