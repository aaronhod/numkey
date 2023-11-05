import { type AppType } from "next/app";

import { api } from "@/utils/api";

import "@/styles/style.css";
import { ThemeProvider } from "@/components/theme-provider";
import { ClerkProvider } from "@clerk/nextjs";

const themes = ["dark", "light", "system"];
export type Theme = (typeof themes)[number];

const MyApp: AppType = ({ Component, pageProps }) => {
  return (
    <ClerkProvider {...pageProps}>
      <ThemeProvider attribute="class" defaultTheme="dark" enableSystem>
        <Component {...pageProps} />
      </ThemeProvider>
    </ClerkProvider>
  );
};

export default api.withTRPC(MyApp);
