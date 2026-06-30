import React from "react";
import { Button } from "@/components/shad-ui/button";
import { Moon, Sun } from "lucide-react";
import { useTheme, type UseThemeProps } from "next-themes";
import Link from "next/link";
import type { Theme } from "@/pages/_app";
import { UserButton } from "@clerk/nextjs";

interface ThemeProps extends UseThemeProps {
  theme: Theme;
}

const SwitchThemeButton: React.FC = () => {
  const { theme, setTheme } = useTheme() as ThemeProps;

  const toggleTheme = () => {
    setTheme(theme === "dark" ? "light" : "dark");
  };

  return (
    <Button variant="ghost" size="icon" onClick={() => toggleTheme()}>
      <Sun
        size={30}
        className="rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0"
      />
      <Moon
        size={30}
        className="absolute rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100"
      />
    </Button>
  );
};

interface Props {
  children: React.ReactNode;
}

const Header = () => (
  <header className="top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
    <div className="container flex h-14 items-center">
      <div className="mr-4 hidden md:flex">
        <Link href="/" className="mr-6 flex items-center space-x-2">
          <span className="hidden font-bold sm:inline-block">MathGame</span>
        </Link>
      </div>
      <div className="flex flex-1 items-center justify-between space-x-2 md:justify-end">
        <nav className="flex items-center gap-1">
          <SwitchThemeButton />
          <div>
            <UserButton />
          </div>
        </nav>
      </div>
    </div>
  </header>
);

const HeaderLayout = ({ children }: Props) => {
  return (
    <main className="relative flex h-full flex-col">
      <Header />
      {children}
    </main>
  );
};

export default HeaderLayout;
