"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ThemeToggle = ThemeToggle;
var async_storage_1 = require("@react-native-async-storage/async-storage");
var react_native_1 = require("react-native");
var android_navigation_bar_1 = require("@mg/ui/src/lib/android-navigation-bar");
var MoonStar_1 = require("@mg/ui/src/lib/icons/MoonStar");
var Sun_1 = require("@mg/ui/src/lib/icons/Sun");
var useColorScheme_1 = require("@mg/ui/src/lib/useColorScheme");
var utils_1 = require("@mg/ui/src/lib/utils");
function ThemeToggle() {
    var _a = (0, useColorScheme_1.useColorScheme)(), isDarkColorScheme = _a.isDarkColorScheme, setColorScheme = _a.setColorScheme;
    return (<react_native_1.Pressable onPress={function () {
            var newTheme = isDarkColorScheme ? 'light' : 'dark';
            setColorScheme(newTheme);
            (0, android_navigation_bar_1.setAndroidNavigationBar)(newTheme);
            async_storage_1.default.setItem('theme', newTheme);
        }} className='web:ring-offset-background web:transition-colors web:focus-visible:outline-none web:focus-visible:ring-2 web:focus-visible:ring-ring web:focus-visible:ring-offset-2'>
      {function (_a) {
            var pressed = _a.pressed;
            return (<react_native_1.View className={(0, utils_1.cn)('flex-1 aspect-square pt-0.5 justify-center items-start web:px-5', pressed && 'opacity-70')}>
          {isDarkColorScheme ? (<MoonStar_1.MoonStar className='text-foreground' size={23} strokeWidth={1.25}/>) : (<Sun_1.Sun className='text-foreground' size={24} strokeWidth={1.25}/>)}
        </react_native_1.View>);
        }}
    </react_native_1.Pressable>);
}
