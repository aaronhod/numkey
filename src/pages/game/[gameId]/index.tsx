import { useRouter } from "next/router";
import { ParsedUrlQuery } from "querystring";
import { useEffect, useState } from "react";
import {
  Problem,
  generateProblems,
  Operator,
} from "../../../components/numpad/Problem";
import { getStorageValueUnsafe } from "../../../utils/storage";

const PROBLEM_STORAGE_KEY = "game-problems";

interface QueryParams {
  operator: Operator;
  number: number;
  gameId: string;
}

function parseQueryParams(query: ParsedUrlQuery): QueryParams {
  // error handle if any null

  const { operator, number, gameId } = query;
  return {
    operator: operator as Operator,
    number: parseInt(number as string),
    gameId: gameId as string,
  };
}

const RunningGame = () => {
  const [problems, setProblems] = useState<Problem[]>();

  const router = useRouter();

  const { operator, number, gameId } = parseQueryParams(router.query);

  useEffect(() => {
    let currentProblems: Problem[] | undefined = getStorageValueUnsafe(
      getProblemsKey(gameId),
      "localStorage"
    );
    if (!currentProblems) {
      currentProblems = generateProblems(number, operator);
      localStorage.setItem(
        getProblemsKey(gameId),
        JSON.stringify(currentProblems)
      );
    }

    setProblems(currentProblems);
  }, []);

  function getProblemsKey(gameId: string) {
    return `${PROBLEM_STORAGE_KEY}-${gameId}`;
  }

  console.log(router);

  return (
    <div>
      <h1>Running Game: {gameId}</h1>
      <p>Operator: {operator}</p>
      <p>Number: {number}</p>
    </div>
  );
};

export { RunningGame as default };
