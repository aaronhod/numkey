import {useState} from 'react';
import {SelectionScreen} from '@/components/layouts/SelectionScreen';
import type {FinishedGame} from '@/components/game/Game';
import FinishedGameScreen from '@/components/layouts/FinishedGameScreen';

const Layout = () => {
    // const [finishedGame, setFinishedGame] = useState<FinishedGame>();
    //
    // if (finishedGame) {
    //     return (
    //         <FinishedGameScreen
    //             finishedGame={finishedGame}
    //             resetGame={() => setFinishedGame(undefined)}
    //         />
    //     );
    // }

    return <SelectionScreen />;
};

export {Layout as default};
