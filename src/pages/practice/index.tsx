import { type NextPageWithLayout } from "@/pages/_app";
import Head from "next/head";
import HeaderLayout from "@/components/layouts/HeaderLayout";
import { type PropsWithChildren, type ReactElement, useState } from "react";
import { getOperatorChar, type Operator, OPERATORS } from "@/game/problem";
import { Toggle } from "@/components/shad-ui/toggle";
import { Button } from "@/components/shad-ui/button";
import { useRouter } from "next/router";
import { cn } from "@/utils/shad";

const LEARNING_MODES = ["flashcards", "game", "repetition"] as const;
type LearningMode = (typeof LEARNING_MODES)[number];
const NUMBER_OPTIONS = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12];

interface ToggleButtonProps {
  children: React.ReactNode;
  active: boolean;
  onClick: () => void;
  className?: string;
}

const ToggleButton = ({
  children,
  active,
  onClick,
  className,
}: ToggleButtonProps) => {
  return (
    <Toggle
      pressed={active}
      onPressedChange={onClick}
      className={cn("h-12 w-12 text-base", className)}
    >
      {children}
    </Toggle>
  );
};

const SelectionSection = ({ children }: PropsWithChildren) => {
  return <section className="flex flex-col gap-3">{children}</section>;
};

const SelectionSectionHeader = ({ text }: { text: string }) => {
  return (
    <h2 className="text-[11px] uppercase tracking-[0.08em] text-muted-foreground">
      {text}
    </h2>
  );
};

const Page: NextPageWithLayout = () => {
  const [operator, setOperator] = useState<null | Operator>(null);
  const [number, setNumber] = useState<null | number>(null);
  const [mode, setMode] = useState<null | LearningMode>(null);
  const router = useRouter();
  const startDisabled = !operator || !number || !mode;

  const startPractice = async () => {
    if (startDisabled) {
      return;
    }

    await router.push(`practice/${mode}/${operator}_${number}`);
  };

  return (
    <>
      <Head>
        <title>Practice</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main className="mx-auto flex w-full max-w-2xl flex-col px-5 pb-12 pt-10 sm:px-8">
        <p className="text-[11px] uppercase tracking-[0.08em] text-muted-foreground">
          02 Practice
        </p>
        <h1 className="mb-8 mt-3 text-4xl font-bold leading-[1.1] tracking-[-0.01em]">
          Practice
        </h1>
        <div className="flex flex-col gap-8">
          <SelectionSection>
            <SelectionSectionHeader text="01 Operator" />
            <div className="flex flex-row flex-wrap gap-2">
              {OPERATORS.map((op) => (
                <ToggleButton
                  key={op}
                  active={op === operator}
                  onClick={() => setOperator(op)}
                >
                  {getOperatorChar(op)}
                </ToggleButton>
              ))}
            </div>
          </SelectionSection>
          <SelectionSection>
            <SelectionSectionHeader text="02 Number" />
            <div className="flex flex-wrap gap-2">
              {NUMBER_OPTIONS.map((num) => (
                <ToggleButton
                  key={num}
                  active={num === number}
                  onClick={() => setNumber(num)}
                >
                  {num}
                </ToggleButton>
              ))}
            </div>
          </SelectionSection>
          <SelectionSection>
            <SelectionSectionHeader text="03 Mode" />
            <div className="flex flex-row flex-wrap gap-2">
              {LEARNING_MODES.map((m) => {
                return (
                  <ToggleButton
                    key={m}
                    active={m === mode}
                    onClick={() => setMode(m)}
                    className="h-11 w-auto px-4 text-[13px]"
                  >
                    {m}
                  </ToggleButton>
                );
              })}
            </div>
          </SelectionSection>
          <Button
            className="mt-2 w-full sm:w-60"
            size="lg"
            disabled={startDisabled}
            onClick={startPractice}
          >
            Start →
          </Button>
        </div>
      </main>
    </>
  );
};

Page.getLayout = (page: ReactElement) => <HeaderLayout>{page}</HeaderLayout>;

export default Page;
