import {useRouter} from 'next/router';
import React, {useState} from 'react';
import {getGameRouteSimple} from '@/constants/routes';
import type {Operator} from '@/components/numpad/Problem';
import {Button} from '@/components/ui/button';

const SelectionScreen = () => {
    const [selectedOperator, setSelectedOperator] = useState<Operator | null>(null);
    const [selectedNumber, setSelectedNumber] = useState<number | null>(null);
    const router = useRouter();

    function startGame(operator: Operator, number: number): void {
        const gameRoute = getGameRouteSimple(number, operator);
        router.push(gameRoute).catch((err) => (console.error(err)));
    }

    const SelectButton = ({
        onClick,
        isSelected,
        children,
    }: {
        onClick: () => void;
        isSelected: boolean;
        children?: React.ReactNode;
    }): JSX.Element => {
        return (
            <Button
                disabled={isSelected}
                variant="secondary"
                className={`h-20 w-20 cursor-pointer disabled:bg-primary disabled:opacity-100`}
                onClick={onClick}
            >
                {children}
            </Button>
        );
    };

    const NumberSelect: React.FC<{number: number}> = ({number}) => {
        const isSelected = selectedNumber === number;
        return (
            <SelectButton
                onClick={() => setSelectedNumber(number)}
                isSelected={isSelected}
            >
                {number}
            </SelectButton>
        );
    };

    const OperatorSelect: React.FC<{operator: Operator}> = ({operator}) => {
        const isSelected = selectedOperator === operator;
        return (
            <SelectButton
                onClick={() => setSelectedOperator(operator)}
                isSelected={isSelected}
            >
                {operator}
            </SelectButton>
        );
    };

    return (
        <div className="my-auto flex h-full flex-col items-center">
            <div className="mt-10 flex flex-wrap justify-center gap-4 px-28">
                <NumberSelect key={2} number={2} />
                <NumberSelect key={3} number={3} />
                <NumberSelect key={4} number={4} />
                <NumberSelect key={5} number={5} />
                <NumberSelect key={6} number={6} />
                <NumberSelect key={7} number={7} />
                <NumberSelect key={8} number={8} />
                <NumberSelect key={9} number={9} />
                <NumberSelect key={10} number={10} />
                <NumberSelect key={11} number={11} />
                <NumberSelect key={12} number={12} />
            </div>
            <div className="mt-10 flex flex-row gap-4">
                <OperatorSelect key="+" operator="+" />
                <OperatorSelect key="-" operator="-" />
                <OperatorSelect key="×" operator="×" />
                <OperatorSelect key="÷" operator="÷" />
            </div>
            <div className="mt-10 mb-72 p-6 text-3xl">
                <Button
                    variant="secondary"
                    size="lg"
                    disabled={!(selectedNumber && selectedOperator)}
                    onClick={() => startGame(selectedOperator!, selectedNumber!)}
                    className={'w-60 bg-primary disabled:bg-secondary disabled:opacity-40'}
                >
                    Start
                </Button>
            </div>
        </div>
    );
};

export {SelectionScreen};
