import React from 'react';
import {Button} from '@/components/ui/button';
import {Moon, Sun} from 'lucide-react';
import {useTheme} from 'next-themes';
import type {UseThemeProps} from 'next-themes/dist/types';
import Link from 'next/link';
import type {Theme} from '@/pages/_app';

interface ThemeProps extends UseThemeProps {
    theme: Theme;
}

const SwitchThemeButton: React.FC = () => {
    //eslint-disable-next-line @typescript-eslint/no-unsafe-call
    const {theme, setTheme} = useTheme() as ThemeProps;

    const toggleTheme = () => {
        setTheme(theme === 'dark' ? 'light' : 'dark');
    };

    return (
        <Button variant="secondary" size="icon" onClick={() => toggleTheme()}>
            <Sun className="rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
            <Moon className="absolute rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
        </Button>
    );
};

const Navbar: React.FC = () => {
    return (
        <div className="navbar flex flex-row max-h-20 bg-accent">
            <Button variant="secondary">
                <Link href="/">Math</Link>
            </Button>
            <div className="ml-auto">
                <SwitchThemeButton />
            </div>
        </div>
    );
};

export default Navbar;

