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
        className="pointer-events-none fixed z-50 border border-foreground/35"
        style={{ inset: "var(--frame-inset)" }}
      />
      {getLayout(<Component {...pageProps} />)}
    </ThemeProvider>
  );
};

export default api.withTRPC(MyApp);
