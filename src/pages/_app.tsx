import {type AppType} from 'next/app';

import {api} from '@/lib/api';

import '@/styles/style.css';
import {ThemeProvider} from '@/components/theme-provider';

const themes = ['dark', 'light', 'system'];
export type Theme = typeof themes[number];

const MyApp: AppType = ({Component, pageProps}) => {

    return (
        <ThemeProvider attribute="class" defaultTheme="dark" enableSystem>
            <Component {...pageProps} />
        </ThemeProvider>
    );
};

export default api.withTRPC(MyApp);
