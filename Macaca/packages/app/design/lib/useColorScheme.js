"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.useColorScheme = useColorScheme;
var nativewind_1 = require("nativewind");
function useColorScheme() {
    var _a = (0, nativewind_1.useColorScheme)(), colorScheme = _a.colorScheme, setColorScheme = _a.setColorScheme, toggleColorScheme = _a.toggleColorScheme;
    return {
        colorScheme: colorScheme !== null && colorScheme !== void 0 ? colorScheme : 'dark',
        isDarkColorScheme: colorScheme === 'dark',
        setColorScheme: setColorScheme,
        toggleColorScheme: toggleColorScheme,
    };
}
