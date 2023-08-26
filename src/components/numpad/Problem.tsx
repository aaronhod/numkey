import type {Dayjs} from 'dayjs';

type Operator = '+' | '-' | '×' | '÷';

interface Problem {
    leftValue: number;
    rightValue: number;
    operator: Operator;
    answer?: number;
}

interface SolvedProblem extends Problem {
    solvedAt: Dayjs;
    solveTime: number;
}

const MAX_NUM = 12;
const MIN_NUM = 2;

function solveProblem(problem: Problem): Problem {
    const {leftValue, rightValue, operator} = problem;
    let answer: number;

    switch (operator) {
        case '+':
            answer = leftValue + rightValue;
            break;
        case '-':
            answer = leftValue - rightValue;
            break;
        case '×':
            answer = leftValue * rightValue;
            break;
        case '÷':
            answer = leftValue / rightValue;
            break;
        default:
            throw new Error('Invalid operator');
    }

    return {
        leftValue: leftValue,
        rightValue: rightValue,
        operator: operator,
        answer: answer,
    };
}

function generateProblems(
    number: number,
    operator: Operator,
): Problem[] {
    const problems: Problem[] = [];

    for (let i = MIN_NUM; i < MAX_NUM + 1; i++) {
        problems.push(solveProblem({leftValue: i, rightValue: number, operator}));
    }

    return problems;
}

function shuffleProblems(problems: Problem[]): Problem[] {
    return problems.sort(() => Math.random() - 0.5).map(shuffleProblem);
}

function shuffleProblem(problem: Problem): Problem {
    const {leftValue, rightValue} = problem;
    const rand = Math.random();

    if (rand < 0.5) {
        return {
            ...problem,
            leftValue: rightValue,
            rightValue: leftValue,
            operator: problem.operator,
        };
    }

    return problem;
}

export type {Operator, Problem, SolvedProblem};
export {generateProblems, shuffleProblem, shuffleProblems};
