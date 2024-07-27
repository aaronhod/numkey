"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.App = App;
var expo_1 = require("expo");
// https://docs.expo.dev/router/reference/troubleshooting/#expo_router_app_root-not-defined
// Must be exported or Fast Refresh won't update the context
function App() {
    var ctx = require.context('./app');
    return context;
    {
        ctx;
    }
    />;
}
(0, expo_1.registerRootComponent)(App);
