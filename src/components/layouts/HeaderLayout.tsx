import React from "react";
import { useTheme, type UseThemeProps } from "next-themes";
import Link from "next/link";
import type { Theme } from "@/pages/_app";
import { useAuthUser } from "@/hooks/useAuthUser";

interface ThemeProps extends UseThemeProps {
  theme: Theme;
}

const SwitchThemeButton: React.FC = () => {
  const { theme, setTheme } = useTheme() as ThemeProps;

  const toggleTheme = () => {
    setTheme(theme === "dark" ? "light" : "dark");
  };

  return (
    <button
      onClick={() => toggleTheme()}
      className="text-[11px] uppercase tracking-[0.08em] text-muted-foreground transition-colors hover:text-foreground"
    >
      {/* Rendered via CSS so SSR output matches the client before hydration. */}
      <span className="dark:hidden">Light ●</span>
      <span className="hidden dark:inline">Dark ●</span>
    </button>
  );
};

interface Props {
  children: React.ReactNode;
}

const SignOutButton = () => {
  const { userId, loading, signOut } = useAuthUser();

  if (loading || !userId) {
    return null;
  }

  return (
    <button
      onClick={() => void signOut()}
      className="text-[11px] uppercase tracking-[0.08em] text-muted-foreground transition-colors hover:text-foreground"
    >
      Sign out
    </button>
  );
};

const Header = () => (
  <header className="top-0 z-40 w-full border-b bg-background">
    <div className="flex h-14 items-center px-5 sm:px-8">
      <Link
        href="/"
        className="text-[13px] font-semibold uppercase tracking-[0.08em]"
      >
        MathGame
      </Link>
      <nav className="ml-auto flex items-center gap-5">
        <SwitchThemeButton />
        <SignOutButton />
      </nav>
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
