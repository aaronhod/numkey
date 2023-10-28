import React, {useEffect, useState} from 'react';
import Numpad from './Numpad';
import {Display} from './Display';
import type {Problem, SolvedProblem} from './Problem';
import {Stack} from 'immutable';
import type {Dayjs} from 'dayjs';
import dayjs from 'dayjs';
import {api} from '@/utils/api';
import {FinishedGame} from "@/server/api/routers/games";
import {useRouter} from "next/router";
import {useAuth} from "@clerk/nextjs";

interface GameProps {
    problems: Problem[];
}

interface Attempt {
    order: number;
    value: number;
    time: Dayjs;
}

const Game: React.FC<GameProps> = ({problems}) => {
    const [value, setValue] = useState<string>('');
    const [problemStack, setProblemStack] = useState<Stack<Problem>>(
        Stack(problems).pop(),
    );
    const [currentProblem, setCurrentProblem] = useState<Problem>(problems[0]!);
    const [history, setHistory] = useState<Stack<SolvedProblem>>(
        Stack<SolvedProblem>(),
    );
    const [lastAnsAt, setLastAnsAt] = useState<Dayjs>(dayjs());
    const {userId} = useAuth();
    const submitGame = api.game.addFinishedGame.useMutation();
    const router = useRouter();


    // check if the answer is correct
    useEffect(() => {
        if (value === '') {
            return;
        }



        if (Number(value) === currentProblem.answer) {
            updateHistory();
            const nextProblem = problemStack.peek();

            if (!nextProblem) {
                void endGame();
                return;
            }

            setProblemStack(problemStack.pop());
            setCurrentProblem(nextProblem);
            setValue('');
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [value, currentProblem, history, problemStack]);

    const endGame = async () => {
        const orderedHistory = history.reverse().toArray();

        await completeGame({
            userId: userId!,
            startedAt: dayjs().subtract(history.size, 'second').toDate(),
            solvedProblems: orderedHistory,
            completionTime: totalTime(),
        });
    }

    async function completeGame(game: FinishedGame) {
        await submitGame.mutateAsync(game);

        if(submitGame.isSuccess) {
            await router.push(`/game/${submitGame.data.id}/complete`);
        }
    }

    function updateHistory() {
        const solvedDate = dayjs();
        const timeDiff = solvedDate.diff(lastAnsAt); // diff in ms
        setHistory(
            history.push({
                ...currentProblem,
                solvedAt: solvedDate,
                solveTime: timeDiff,
            }),
        );
        setLastAnsAt(solvedDate);
    }

    function totalTime() {
        return history.reduce((acc, problem) => acc + problem.solveTime, 0);
    }

    return (
        <div className="flex h-full flex-col font-mono text-lg font-semibold">
            <Display className="p-10" value={value} problem={currentProblem} />
            <Numpad value={value} setValue={setValue} />
        </div>
    );
};

export {Game as default};
