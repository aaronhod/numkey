"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ErrorBoundary = void 0;
exports.default = RootLayout;
var provider_1 = require("app/provider");
var expo_router_1 = require("expo-router");
var expo_router_2 = require("expo-router");
// Catch any errors thrown by the Layout component.
Object.defineProperty(exports, "ErrorBoundary", { enumerable: true, get: function () { return expo_router_2.ErrorBoundary; } });
// Prevent the splash screen from auto-hiding before asset loading is complete.
expo_router_1.SplashScreen.preventAutoHideAsync();
function RootLayout() {
    return (<provider_1.Provider initialSession={null}>
      <expo_router_1.Stack />
    </provider_1.Provider>);
}
