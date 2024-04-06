import { type NextPageWithLayout } from "@/pages/_app";
import Head from "next/head";
import HeaderLayout from "@/components/layouts/HeaderLayout";
import { type PropsWithChildren, type ReactElement, useState } from "react";
import { type Operator, OPERATOR_CHARS } from "@/game/problem";
import { Toggle } from "@/components/shad-ui/toggle";
import {
  BookOpenText,
  BrainCog,
  Gamepad2,
  type LucideIcon,
} from "lucide-react";
import { Button } from "@/components/shad-ui/button";

const LEARNING_MODES = ["flashcards", "game", "repetition"] as const;
type LearningMode = (typeof LEARNING_MODES)[number];
const LEARNING_MODE_ICONS: Record<LearningMode, LucideIcon> = {
  flashcards: BookOpenText,
  game: Gamepad2,
  repetition: BrainCog,
};

const NUMBER_OPTIONS = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12];

interface ToggleButtonProps {
  children: React.ReactNode;
  active: boolean;
  onClick: () => void;
}

const ToggleButton = ({ children, active, onClick }: ToggleButtonProps) => {
  return (
    <Toggle
      pressed={active}
      onPressedChange={onClick}
      className={
        "h-14 w-14 bg-secondary text-secondary-foreground hover:bg-secondary/50 data-[state=on]:bg-primary data-[state=on]:hover:bg-primary/50"
      }
    >
      {children}
    </Toggle>
  );
};

const Page: NextPageWithLayout = () => {
  const [operator, setOperator] = useState<null | Operator>(null);
  const [number, setNumber] = useState<null | number>(null);
  const [mode, setMode] = useState<null | LearningMode>(null);

  const startDisabled = !operator || !number || !mode;
  const startPractice = () => {
    if (startDisabled) {
      return;
    }
    console.log("Starting practice with", { operator, number, mode });
  };

  const SelectionSection = ({ children }: PropsWithChildren) => {
    return (
      <section className="flex flex-col rounded-md border p-3">
        {children}
      </section>
    );
  };

  const SelectionSectionHeader = ({ text }: { text: string }) => {
    return (
      <h2 className="mb-3 text-xl font-bold leading-tight tracking-tighter">
        {text}
      </h2>
    );
  };

  return (
    <>
      <Head>
        <title>Practice</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main className="flex min-h-screen w-full flex-col px-12">
        <h1 className="my-4 text-4xl font-bold leading-tight tracking-tighter">
          Practice
        </h1>
        <div className="flex flex-col gap-4">
          <SelectionSection>
            <SelectionSectionHeader text="Operator" />
            <div className="flex flex-row gap-4">
              {OPERATOR_CHARS.map((op) => (
                <ToggleButton
                  key={op}
                  active={op === operator}
                  onClick={() => setOperator(op)}
                >
                  {op}
                </ToggleButton>
              ))}
            </div>
          </SelectionSection>
          <SelectionSection>
            <SelectionSectionHeader text="Number" />
            {/*flex flex-wrap justify-evenly gap-1*/}
            <div className=" grid grid-flow-col grid-rows-3 gap-1 ">
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
            <SelectionSectionHeader text="Mode" />
            <div className="flex flex-row gap-2">
              {LEARNING_MODES.map((m) => {
                const Icon = LEARNING_MODE_ICONS[m];
                return (
                  <ToggleButton
                    key={m}
                    active={m === mode}
                    onClick={() => setMode(m)}
                  >
                    <Icon />
                  </ToggleButton>
                );
              })}
            </div>
          </SelectionSection>
          <Button
            className="text-foreground disabled:bg-secondary"
            disabled={startDisabled}
            onClick={startPractice}
          >
            Start
          </Button>
        </div>
      </main>
    </>
  );
};

Page.getLayout = (page: ReactElement) => <HeaderLayout>{page}</HeaderLayout>;

export default Page;
