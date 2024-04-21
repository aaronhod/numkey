import { type AppProps, type AppType } from "next/app";

import { api } from "@/utils/api";

import "@/styles/style.css";
import { ThemeProvider } from "@/components/ThemeProvider";
import { ClerkProvider } from "@clerk/nextjs";
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
    <ClerkProvider {...pageProps}>
      <ThemeProvider attribute="class" defaultTheme="dark" enableSystem>
        {getLayout(<Component {...pageProps} />)}
      </ThemeProvider>
    </ClerkProvider>
  );
};

export default api.withTRPC(MyApp);
