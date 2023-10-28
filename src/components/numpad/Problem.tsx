type Operator = '+' | '-' | '×' | '÷';

interface Problem {
    leftValue: number;
    rightValue: number;
    operator: Operator;
    answer: number;
}

const MAX_NUM = 12;
const MIN_NUM = 2;

function createProblem({leftValue, rightValue, operator}: Omit<Problem, "answer">): Problem {
    const calculateAnswer = (() => {
        switch (operator) {
            case '+':
                return leftValue + rightValue;
            case '-':
                return leftValue - rightValue;
            case '×':
                return leftValue * rightValue;
            case '÷':
                return leftValue / rightValue;
            default:
                throw new Error(`Unknown operator ${operator as string}`);
        }
    });

    return {
        leftValue: leftValue,
        rightValue: rightValue,
        operator: operator,
        answer: calculateAnswer(),
    };
}

function generateProblems(
    number: number,
    operator: Operator,
): Problem[] {
    const problems: Problem[] = [];

    for (let i = MIN_NUM; i < MAX_NUM + 1; i++) {
        problems.push(createProblem({leftValue: i, rightValue: number, operator}));
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

export type {Operator, Problem};
export {generateProblems, shuffleProblem, shuffleProblems};
