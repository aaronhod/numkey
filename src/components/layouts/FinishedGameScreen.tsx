import type { FinishedGame } from "@/server/api/routers/games";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { api } from "@/utils/api";
import { SpinningLoader } from "@/components/ui/loader";
import { useRouter } from "next/router";

interface FinishedGameProps {
  finishedGame: FinishedGame;
}

const FinishedGameScreen = ({ finishedGame }: FinishedGameProps) => {
  const { rounds } = finishedGame;
  const { isFetching, error, refetch } = api.game.getById.useQuery(
    finishedGame,
    {
      enabled: false,
    },
  );
  const router = useRouter();

  const submitGame = async () => {
    await refetch();
  };

  const newGame = async () => {
    await submitGame().then(() => router.push("/game"));
  };

  const mainMenu = async () => {
    await submitGame().then(() => router.push("/"));
  };

  if (isFetching) {
    return (
      <div className="mb-72 flex flex-grow flex-col items-center justify-center">
        <SpinningLoader className="duration-[100000ms] h-32 w-32" />
      </div>
    );
  }

  return (
    <div className="mt-5 flex h-full flex-col items-center justify-center">
      <div className="flex flex-col items-center">
        <h1 className="py-3 text-4xl font-bold">Game Complete</h1>
        <h2 className="py-3 text-2xl font-bold">
          You solved {rounds.length} problems
        </h2>
      </div>
      <Table className="m-auto w-4/5">
        <TableHeader>
          <TableRow>
            <TableHead>Problem</TableHead>
            <TableHead>Time</TableHead>
            <TableHead>Average Time</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {rounds.map((problem, index) => (
            <TableRow key={index}>
              <TableCell>
                {problem.leftValue} {problem.operator} {problem.rightValue} ={" "}
                {problem.answer}
              </TableCell>
              <TableCell>{problem.duration / 1000}s</TableCell>
              {/*<TableCell>todo</TableCell>*/}
            </TableRow>
          ))}
        </TableBody>
      </Table>
      {error && <p className="text-red-500">{error.message}</p>}
      <button className="btn mb-72 mt-5" onClick={() => void newGame()}>
        Play Again
      </button>
      <button className="btn mb-72 mt-5" onClick={() => void mainMenu()}>
        Main Menu
      </button>
    </div>
  );
};

export { FinishedGameScreen as default };
