import { type AppProps, type AppType } from "next/app";

import { api } from "@/utils/api";

import "@/styles/style.css";
import { ThemeProvider } from "@/components/ThemeProvider";
import { CapacitorInit } from "@/components/CapacitorInit";
import { type NextPage } from "next/types";
import { type ReactElement, type ReactNode } from "react";

const themes = ["dark", "light", "system"];
export type Theme = (typeof themes)[number];

export type NextPageWithLayout<P = NonNullable<unknown>, IP = P> = NextPage<
  P,
  IP
> & {
  getLayout?: (page: ReactElement) => ReactNode;
};

type AppPropsWithLayout = AppProps & {
  Component: NextPageWithLayout;
};

const MyApp: AppType = ({ Component, pageProps }: AppPropsWithLayout) => {
  const getLayout = Component.getLayout ?? ((page) => page);

  return (
    <ThemeProvider attribute="class" defaultTheme="dark" enableSystem>
      <CapacitorInit />
      {/* Full-viewport hairline frame — the design's "site inside a border" motif. */}
      <div
        aria-hidden
        className="pointer-events-none fixed z-[9999] border border-foreground/35"
        style={{ inset: "var(--frame-inset)" }}
      />
      <a
        href="https://aaronhodgins.com"
        target="_blank"
        rel="noopener noreferrer"
        className="fixed z-[9999] bg-background px-1.5 text-[9px] uppercase tracking-[0.08em] text-muted-foreground/40 transition-colors hover:text-muted-foreground/70"
        style={{
          bottom: "calc(var(--frame-inset) - 0.45em)",
          right: "calc(var(--frame-inset) + 0.75rem)",
        }}
      >
        aaronhodgins.com
      </a>
      {getLayout(<Component {...pageProps} />)}
    </ThemeProvider>
  );
};

export default api.withTRPC(MyApp);
