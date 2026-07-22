import React from "react";
import { useTheme, type UseThemeProps } from "next-themes";
import Link from "next/link";
import { useRouter } from "next/router";
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
      className="text-muted-foreground hover:text-foreground text-[11px] tracking-[0.08em] uppercase transition-colors"
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
      className="text-muted-foreground hover:text-foreground text-[11px] tracking-[0.08em] uppercase transition-colors"
    >
      Sign out
    </button>
  );
};

const BackButton = () => {
  const router = useRouter();

  if (router.pathname === "/") {
    return null;
  }

  const goBack = () => {
    // Direct entries (deep link, new tab) have nothing to go back to.
    if (window.history.length > 1) {
      router.back();
    } else {
      void router.push("/");
    }
  };

  return (
    <button
      onClick={goBack}
      aria-label="Go back"
      className="text-muted-foreground hover:text-foreground mr-4 text-[11px] tracking-[0.08em] uppercase transition-colors"
    >
      ← Back
    </button>
  );
};

const Header = () => (
  <header className="bg-background top-0 z-40 w-full border-b">
    <div className="flex h-14 items-center px-5 sm:px-8">
      <BackButton />
      <Link
        href="/"
        className="text-[13px] font-semibold tracking-[0.08em] uppercase"
      >
        numkey
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
