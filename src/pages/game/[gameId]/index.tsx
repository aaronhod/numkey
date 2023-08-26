import {useRouter} from 'next/router';
import type {ParsedUrlQuery} from 'querystring';
import {useEffect, useState} from 'react';
import Game from '../../../components/numpad/Game';
import type {Operator, Problem} from '@/components/numpad/Problem';
import {generateProblems} from '@/components/numpad/Problem';
import {getStorageValueUnsafe} from '@/lib/storage';

const PROBLEM_STORAGE_KEY = 'game-problems';

interface QueryParams {
    operator: Operator;
    number: number;
    gameId: string;
}

function parseQueryParams(query: ParsedUrlQuery): QueryParams {
    // error handle if any null

    const {operator, number, gameId} = query;
    return {
        operator: operator as Operator,
        number: parseInt(number as string),
        gameId: gameId as string,
    };
}

const RunningGame = () => {
    const [problems, setProblems] = useState<Problem[]>();

    const router = useRouter();

    const {operator, number, gameId} = parseQueryParams(router.query);

    useEffect(() => {
        let currentProblems: Problem[] | undefined = getStorageValueUnsafe(
            getProblemsKey(gameId),
            'localStorage',
        );
        if (!currentProblems) {
            currentProblems = generateProblems(number, operator);
            localStorage.setItem(
                getProblemsKey(gameId),
                JSON.stringify(currentProblems),
            );
        }

        setProblems(currentProblems);
    }, []);

    function getProblemsKey(gameId: string) {
        return `${PROBLEM_STORAGE_KEY}-${gameId}`;
    }

    if (!problems) {
        return null;
    }

    return (
        <Game problems={problems} />
    );
};

export {RunningGame as default};
