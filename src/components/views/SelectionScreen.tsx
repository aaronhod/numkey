import { useRouter } from "next/router";
import type { ReactNode } from "react";
import React, { useState } from "react";
import { getGameRouteCustom } from "@/constants/routes";
import type { Operator } from "@/game/problem";
import { getOperatorChar } from "@/game/problem";
import { Button } from "@/components/shad-ui/button";
import { cn } from "@/utils/shad";
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "@/components/shad-ui/hover-card";
import type { VariantProps } from "class-variance-authority";
import { cva } from "class-variance-authority";
import type {
  GameMode,
  GameModifierName,
} from "@/components/views/GameSettings";

function SelectionHeader({ children }: { children?: ReactNode }) {
  return (
    <h2 className="text-[11px] uppercase tracking-[0.08em] text-muted-foreground">
      {children}
    </h2>
  );
}

const SelectionScreen = () => {
  const [selectedOperators, setSelectedOperators] = useState<Operator[]>([]);
  const [selectedNumbers, setSelectedNumbers] = useState<number[]>([]);
  const [selectedMode, setSelectedMode] = useState<GameMode | null>(null);
  const [selectedModifiers, setSelectedModifiers] = useState<
    GameModifierName[]
  >([]);
  const router = useRouter();

  function startGame(): void {
    if (
      selectedNumbers.length < 1 ||
      selectedOperators.length < 1 ||
      !selectedMode
    ) {
      console.error(
        "Invalid game selection called. User shouldn't have been able to start",
        {
          selectedNumbers,
          selectedOperators,
          selectedMode,
        },
      );
      return;
    }

    const gameRoute = getGameRouteCustom({
      numbers: selectedNumbers,
      operators: selectedOperators,
      gameMode: selectedMode,
      modifiers: selectedModifiers,
    });
    router.push(gameRoute).catch((err) => console.error(err));
  }

  const selectButtonVariants = cva("cursor-pointer", {
    variants: {
      size: {
        large: "h-24 w-24",
        default: "h-14 w-14 text-lg sm:h-16 sm:w-16",
        label: "h-11 px-4",
        small: "h-9 px-3 text-xs",
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
        variant="outline"
        className={cn(selectButtonVariants({ size, className }), {
          "border-foreground bg-foreground text-background hover:bg-foreground":
            isSelected,
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
    const isSelected = selectedNumbers.includes(number);
    return (
      <SelectButton
        onClick={() =>
          setSelectedNumbers((prev) =>
            isSelected ? prev.filter((m) => m !== number) : [...prev, number],
          )
        }
        isSelected={isSelected}
      >
        {number}
      </SelectButton>
    );
  };

  const OperatorSelect: React.FC<{
    operator: Operator;
  }> = ({ operator }) => {
    const isSelected = selectedOperators.includes(operator);
    return (
      <SelectButton
        onClick={() =>
          setSelectedOperators((prev) =>
            isSelected
              ? prev.filter((m) => m !== operator)
              : [...prev, operator],
          )
        }
        isSelected={isSelected}
      >
        {getOperatorChar(operator)}
      </SelectButton>
    );
  };

  const ModeSelect = React.forwardRef<
    HTMLButtonElement,
    { mode: GameMode; children: ReactNode }
  >(({ mode, children, ...props }, ref) => {
    const isSelected = selectedMode === mode;

    return (
      <SelectButton
        ref={ref}
        size="label"
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
    { modifier: GameModifierName; children: ReactNode }
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

  return (
    <div className="mx-auto flex h-full w-full max-w-2xl flex-col gap-8 px-5 pb-12 pt-10 sm:px-8">
      <div className="flex flex-col gap-3">
        <p className="text-[11px] uppercase tracking-[0.08em] text-muted-foreground">
          03 Custom
        </p>
        <h1 className="text-4xl font-bold leading-[1.1] tracking-[-0.01em]">
          Start Game
        </h1>
      </div>
      <div className="flex flex-col gap-3">
        <SelectionHeader>01 Mode</SelectionHeader>
        <div className="flex flex-row flex-wrap gap-2">
          <ModeSelect key="normal" mode="normal">
            Normal
          </ModeSelect>
          <HoverCard>
            <HoverCardTrigger asChild>
              <ModeSelect key="endless" mode="endless" data-state={"open"}>
                Endless
              </ModeSelect>
            </HoverCardTrigger>
            <HoverCardContent className="w-80">
              <div>endless mode</div>
            </HoverCardContent>
          </HoverCard>
          <ModeSelect key="lives" mode="lives">
            Lives
          </ModeSelect>
          <ModeSelect key="stack" mode="stack">
            Stack
          </ModeSelect>
        </div>
      </div>
      <div className="flex flex-col gap-3">
        <SelectionHeader>02 Operators</SelectionHeader>
        <div className="flex flex-row flex-wrap gap-2">
          <OperatorSelect key="add" operator="ADD" />
          <OperatorSelect key="subtract" operator="SUBTRACT" />
          <OperatorSelect key="multiply" operator="MULTIPLY" />
          <OperatorSelect key="divide" operator="DIVIDE" />
        </div>
      </div>
      <div className="flex flex-col gap-3">
        <SelectionHeader>03 Numbers</SelectionHeader>
        <div className="flex flex-wrap content-start gap-2">
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
        <SelectionHeader>04 Modifiers</SelectionHeader>
        <div className="flex flex-row flex-wrap gap-2">
          <ModifierSelect key="random" modifier="random">
            Random
          </ModifierSelect>
          <ModifierSelect key="timed" modifier="timed">
            Timed
          </ModifierSelect>
          <ModifierSelect key="shuffled" modifier="shuffled">
            Shuffled
          </ModifierSelect>
        </div>
      </div>
      <div className="mt-auto flex w-full flex-col py-6">
        <Button
          size="lg"
          disabled={selectedNumbers.length < 1 && selectedOperators.length < 1}
          onClick={() => startGame()}
          className="w-full sm:w-60"
        >
          Start →
        </Button>
      </div>
    </div>
  );
};

export { SelectionScreen };
