import {type AppType} from 'next/app';

import {api} from '@/utils/api';

import '../styles/globals.css';
import {ThemeProvider} from '@/components/theme-provider';

const themes = ['dark', 'light', 'system'];
export type Theme = typeof themes[number];

const MyApp: AppType = ({Component, pageProps}) => {

    return (
        <ThemeProvider themes={themes} defaultTheme="dark" enableSystem>
            <Component {...pageProps} />
        </ThemeProvider>
    );
};

export default api.withTRPC(MyApp);
