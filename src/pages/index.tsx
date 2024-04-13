import Head from "next/head";
import React, { type ReactElement } from "react";
import HeaderLayout from "@/components/layouts/HeaderLayout";
import { type NextPageWithLayout } from "@/pages/_app";
import { Button } from "@/components/shad-ui/button";
import {
  BookOpenText,
  BrainCog,
  Calculator,
  Gamepad2,
  type LucideIcon,
} from "lucide-react";
import { useRouter } from "next/router";

interface SelectIconProps {
  onClick: () => void;
  Icon: LucideIcon;
  title: string;
}

const SelectIcon = ({ onClick, Icon, title }: SelectIconProps) => (
  <Button className="flex aspect-square h-32 w-32" onClick={onClick}>
    <div className="flex flex-col items-center justify-center">
      <Icon className="h-10 w-10" />
      <span className="text-lg font-semibold">{title}</span>
    </div>
  </Button>
);

const QuadrantMenu = () => {
  const router = useRouter();

  return (
    <main className="mt-24 grid grid-cols-2 gap-2 self-center">
      <SelectIcon
        onClick={() => router.push("/practice")}
        Icon={Calculator}
        title="Practice"
      />
      <SelectIcon
        onClick={() => router.push("/game-smart")}
        Icon={Gamepad2}
        title="QuickPlay"
      />
      <SelectIcon
        onClick={() => router.push("/game-custom")}
        Icon={BookOpenText}
        title="Custom"
      />
      <SelectIcon
        onClick={() => router.push("/game-battle")}
        Icon={BrainCog}
        title="battle"
      />
    </main>
  );
};

const Page: NextPageWithLayout = () => {
  return (
    <>
      <Head>
        <title>Math Game</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <QuadrantMenu />
    </>
  );
};

Page.getLayout = (page: ReactElement) => <HeaderLayout>{page}</HeaderLayout>;

export default Page;
