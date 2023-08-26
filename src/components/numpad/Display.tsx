import type {Problem} from './Problem';
import {cn} from '@/lib/utils';
import React from 'react';

interface DisplayProps {
    className?: string;
    problem: Problem;
    value: string;
}

function formatProblem(problem: Problem) {
    return `${problem.leftValue} ${problem.operator} ${problem.rightValue} = `;
}

const Display: React.FC<DisplayProps> = ({className, problem, value}) => {
    return (
        <h1 className={cn("my-auto pl-16 pr-16 text-8xl", className) }>
            {`${formatProblem(problem)} ${value ?? ''}`}
        </h1>
    );
};

export {Display};
