"use server";

import React from "react";
import { Button } from "@/app/_components/shad-ui/button";
import {
  BookOpenText,
  BrainCog,
  Calculator,
  Gamepad2,
  type LucideIcon,
} from "lucide-react";
import Link from "next/link";

interface SelectIconProps {
  path: string;
  Icon: LucideIcon;
  title: string;
}

const SelectIcon = ({ path, Icon, title }: SelectIconProps) => (
  <Button asChild className="flex aspect-square h-32 w-32">
    <Link href={path}>
      <div className="flex flex-col items-center justify-center">
        <Icon className="h-10 w-10" />
        <span className="text-lg font-semibold">{title}</span>
      </div>
    </Link>
  </Button>
);

const Home = () => {
  return (
    <main className="mt-24 grid grid-cols-2 gap-2 self-center">
      <SelectIcon path={"/practice"} Icon={Calculator} title="Practice" />
      <SelectIcon path={"/game-smart"} Icon={Gamepad2} title="QuickPlay" />
      <SelectIcon path={"/game-custom"} Icon={BookOpenText} title="Custom" />
      <SelectIcon path={"/game-battle"} Icon={BrainCog} title="battle" />
    </main>
  );
};

export default Home;
