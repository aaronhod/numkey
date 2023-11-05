import { useRouter } from "next/router";
import type { ReactNode } from "react";
import React, { useState } from "react";
import { getGameRouteSimple } from "@/constants/routes";
import type { Operator } from "@/components/game/Problem";
import { Button } from "@/components/ui/button";
import { cn } from "@/utils/shad";
import {
  Activity,
  Calculator,
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
import type { VariantProps } from "class-variance-authority";
import { cva } from "class-variance-authority";

type Modifier = "random" | "timed" | "sorted";
type Mode = "normal" | "endless" | "lives" | "stack";

function SelectionHeader({ children }: { children?: ReactNode }) {
  return (
    <h2 className="text-lg font-semibold leading-tight text-foreground/70">
      {children}
    </h2>
  );
}

const SelectionScreen = () => {
  const [selectedOperator, setSelectedOperator] = useState<Operator | null>(
    null,
  );
  const [selectedNumber, setSelectedNumber] = useState<number | null>(null);
  const [selectedMode, setSelectedMode] = useState<Mode | null>("normal");
  const [selectedModifiers, setSelectedModifiers] = useState<Modifier[]>([]);
  const router = useRouter();

  function startGame(operator: Operator, number: number): void {
    const gameRoute = getGameRouteSimple(number, operator);
    router.push(gameRoute).catch((err) => console.error(err));
  }

  const selectButtonVariants = cva("cursor-pointer", {
    variants: {
      size: {
        large: "h-24 w-24",
        default: "h-18 w-18 sm:h-20 sm:w-20",
        small: "h-14 w-14",
      },
    },
    defaultVariants: {
      size: "default",
    },
  });

  const SelectButton = React.forwardRef<
    HTMLButtonElement,
    {
      onClick: () => void;
      isSelected: boolean;
      children?: React.ReactNode;
      className?: string;
    } & VariantProps<typeof selectButtonVariants>
  >(({ onClick, isSelected, size, className, children, ...props }, ref) => {
    return (
      <Button
        ref={ref}
        variant="secondary"
        className={cn(selectButtonVariants({ size, className }), {
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
    { mode: Mode; children: ReactNode }
  >(({ mode, children, ...props }, ref) => {
    const isSelected = selectedMode === mode;

    return (
      <SelectButton
        ref={ref}
        onClick={() => setSelectedMode(mode)}
        isSelected={isSelected}
        {...props}
      >
        {children}
      </SelectButton>
    );
  });
  ModeSelect.displayName = "ModeSelect";

  const ModifierSelect = React.forwardRef<
    HTMLButtonElement,
    { modifier: Modifier; children: ReactNode }
  >(({ modifier, children, ...props }, ref) => {
    const isSelected = selectedModifiers.includes(modifier);
    return (
      <SelectButton
        ref={ref}
        size="small"
        onClick={() =>
          setSelectedModifiers((prev) =>
            isSelected
              ? prev.filter((m) => m !== modifier)
              : [...prev, modifier],
          )
        }
        isSelected={isSelected}
        {...props}
      >
        {children}
      </SelectButton>
    );
  });
  ModifierSelect.displayName = "ModifierSelect";

  /**
   * TODO: Card mode select component. Improve layout of this component, determine what combinations are possible
   * for mode types.
   */

  return (
    <div className="flex h-full flex-col items-center gap-4">
      <div className="flex">
        <h1 className="mt-5 text-5xl font-bold leading-tight tracking-tighter ">
          Start Game
        </h1>
      </div>
      <div className="flex h-full flex-col items-center gap-1.5">
        <SelectionHeader>Mode</SelectionHeader>
        <div className="flex flex-row gap-2">
          <ModeSelect key="normal" mode="normal">
            <Calculator />
          </ModeSelect>
          <HoverCard>
            <HoverCardTrigger asChild>
              <ModeSelect key="endless" mode="endless" data-state={"open"}>
                <RefreshCw />
              </ModeSelect>
            </HoverCardTrigger>
            <HoverCardContent className="w-80">
              <div>endless mode</div>
            </HoverCardContent>
          </HoverCard>
          <ModeSelect key="lives" mode="lives">
            <Activity />
          </ModeSelect>
          <ModeSelect key="stack" mode="stack">
            <Layers />
          </ModeSelect>
        </div>
      </div>
      <div className="flex flex-col items-center gap-1.5">
        <SelectionHeader>Operator</SelectionHeader>
        <div className="flex flex-row flex-wrap justify-center gap-2 sm:gap-4">
          <OperatorSelect key="add" operator="ADD">
            <Plus />
          </OperatorSelect>
          <OperatorSelect key="subtract" operator="SUBTRACT">
            <Minus />
          </OperatorSelect>
          <OperatorSelect key="multiply" operator="MULTIPLY">
            <X />
          </OperatorSelect>
          <OperatorSelect key="divide" operator="DIVIDE">
            <Divide />
          </OperatorSelect>
        </div>
      </div>
      <div className="flex flex-col items-center gap-1.5 px-10">
        <SelectionHeader>Numbers</SelectionHeader>
        <div className="flex  flex-wrap content-start justify-center gap-1 sm:w-3/6 sm:gap-2">
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
      </div>
      <div className="flex flex-col gap-3">
        <div className="flex h-full flex-col items-center gap-1.5">
          <SelectionHeader>Modifiers</SelectionHeader>
          <div className="flex flex-row gap-1">
            <ModifierSelect key="random" modifier="random">
              <Dice6 />
            </ModifierSelect>
            <ModifierSelect key="timed" modifier="timed">
              <Timer />
            </ModifierSelect>
            <ModifierSelect key="stack" modifier="sorted">
              <Layers />
            </ModifierSelect>
          </div>
        </div>
      </div>
      <div className="flex h-full w-full flex-col content-center items-center justify-center gap-4 py-8">
        <Button
          variant="secondary"
          size="lg"
          disabled={!(selectedNumber && selectedOperator)}
          onClick={() => startGame(selectedOperator!, selectedNumber!)}
          className={
            "w-60 bg-primary text-lg disabled:bg-secondary disabled:opacity-40"
          }
        >
          Start
        </Button>
      </div>
    </div>
  );
};

export { SelectionScreen };
