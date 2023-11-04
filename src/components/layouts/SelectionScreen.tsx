import { useRouter } from "next/router";
import type { ReactNode } from "react";
import React, { useState } from "react";
import { getGameRouteSimple } from "@/constants/routes";
import type { Operator } from "@/components/game/Problem";
import { Button } from "@/components/ui/button";
import { cn } from "@/utils/shad";
import {
  Activity,
  Dice6,
  Divide,
  Layers,
  Minus,
  Plus,
  RefreshCw,
  Timer,
  X,
} from "lucide-react";
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "@/components/ui/hover-card";

type Modifier = "random" | "timed" | "endless" | "lives" | "stack";

const SelectionScreen = () => {
  const [selectedOperator, setSelectedOperator] = useState<Operator | null>(
    null,
  );
  const [selectedNumber, setSelectedNumber] = useState<number | null>(null);
  const [selectedModes, setSelectedModes] = useState<Modifier[]>([]);
  const router = useRouter();

  function startGame(operator: Operator, number: number): void {
    const gameRoute = getGameRouteSimple(number, operator);
    router.push(gameRoute).catch((err) => console.error(err));
  }

  const SelectButton = React.forwardRef<
    HTMLButtonElement,
    {
      onClick: () => void;
      isSelected: boolean;
      children?: React.ReactNode;
    }
  >(({ onClick, isSelected, children, ...props }, ref): JSX.Element => {
    return (
      <Button
        ref={ref}
        variant="secondary"
        className={cn("h-20 w-20 cursor-pointer", {
          "bg-primary": isSelected,
          "opacity-100": !isSelected,
        })}
        onClick={onClick}
        {...props}
      >
        {children}
      </Button>
    );
  });
  SelectButton.displayName = "SelectButton";

  const NumberSelect: React.FC<{ number: number }> = ({ number }) => {
    const isSelected = selectedNumber === number;
    return (
      <SelectButton
        onClick={() =>
          setSelectedNumber((prev) => (number === prev ? null : number))
        }
        isSelected={isSelected}
      >
        {number}
      </SelectButton>
    );
  };

  const OperatorSelect: React.FC<{
    operator: Operator;
    children: ReactNode;
  }> = ({ operator, children }) => {
    const isSelected = selectedOperator === operator;
    return (
      <SelectButton
        onClick={() =>
          setSelectedOperator((prev) => (operator === prev ? null : operator))
        }
        isSelected={isSelected}
      >
        {children}
      </SelectButton>
    );
  };

  const ModeSelect = React.forwardRef<
    HTMLButtonElement,
    { mode: Modifier; children: ReactNode }
  >(({ mode, children, ...props }, ref) => {
    const isSelected = selectedModes.includes(mode);

    return (
      <SelectButton
        ref={ref}
        onClick={() =>
          setSelectedModes((prev) =>
            isSelected ? prev.filter((m) => m !== mode) : [...prev, mode],
          )
        }
        isSelected={isSelected}
        {...props}
      >
        {children}
      </SelectButton>
    );
  });
  ModeSelect.displayName = "ModeSelect";

  /**
   * TODO: Card mode select component. Improve layout of this component, determine what combinations are possible
   * for mode types.
   */

  return (
    <div className="mt-10 flex h-full flex-col items-center gap-8">
      <div className="flex flex-wrap justify-center gap-4 px-28">
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
      <div className="flex flex-row gap-4">
        <OperatorSelect key="+" operator="+">
          <Plus />
        </OperatorSelect>
        <OperatorSelect key="-" operator="-">
          <Minus />
        </OperatorSelect>
        <OperatorSelect key="×" operator="×">
          <X />
        </OperatorSelect>
        <OperatorSelect key="÷" operator="÷">
          <Divide />
        </OperatorSelect>
      </div>
      <div className="flex flex-row gap-4">
        <ModeSelect key="random" mode="random">
          <Dice6 />
        </ModeSelect>
        <ModeSelect key="timed" mode="timed">
          <Timer />
        </ModeSelect>
        <HoverCard>
          <HoverCardTrigger asChild>
            <ModeSelect key="endless" mode="endless" data-state={"open"}>
              <RefreshCw />
            </ModeSelect>
          </HoverCardTrigger>
          <HoverCardContent className="w-80">
            <div className="flex justify-between space-x-4">
              <RefreshCw />
              <div className="space-y-1">
                <h4 className="text-sm font-semibold">@nextjs</h4>
                <p className="text-sm">
                  The React Framework – created and maintained by @vercel.
                </p>
                <div className="flex items-center pt-2">
                  <span className="text-xs text-muted-foreground">
                    Joined December 2021
                  </span>
                </div>
              </div>
            </div>
          </HoverCardContent>
        </HoverCard>
        <ModeSelect key="lives" mode="lives">
          <Activity />
        </ModeSelect>
        <ModeSelect key="stack" mode="stack">
          <Layers />
        </ModeSelect>
      </div>
      <div className="p-6 text-3xl">
        <Button
          variant="secondary"
          size="lg"
          disabled={!(selectedNumber && selectedOperator)}
          onClick={() => startGame(selectedOperator!, selectedNumber!)}
          className={
            "w-60 bg-primary disabled:bg-secondary disabled:opacity-40"
          }
        >
          Start
        </Button>
      </div>
    </div>
  );
};

export { SelectionScreen };
