import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { Problem, generateProblems } from "../../../components/numpad/Problem";
import { getStorageValueUnsafe } from "../../../utils/storage";

const PROBLEM_STORAGE_KEY = "game-problems"

const RunningGame = () => {
    const [problems, setProblems] = useState<Problem[]>();

    const router = useRouter();
    const { operator, number, gameId } = router.query;

    useEffect(() => {
        let currentProblems = getStorageValueUnsafe(getProblemsKey(gameId as string), "localStorage")
        if (!currentProblems) {
            currentProblems = generateProblems(number as number, operator as string);
            localStorage.setItem(getProblemsKey(gameId as string), JSON.stringify(currentProblems))
        }

        setProblems(currentProblems);
    }, [])

    function getProblemsKey(gameId: string) {
        return `${PROBLEM_STORAGE_KEY}-${gameId}`
    }
    
    console.log(router)

    return (
        <div>
            <h1>Running Game: {gameId}</h1>
            <p>Operator: {operator}</p>
            <p>Number: {number}</p>
        </div>
    )
}

export {
    RunningGame as default,
}
