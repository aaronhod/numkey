"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SafeAreaProvider = exports.initialWindowMetrics = void 0;
var react_native_safe_area_context_1 = require("react-native-safe-area-context");
exports.initialWindowMetrics = {
    frame: { x: 0, y: 0, width: 0, height: 0 },
    insets: { top: 0, left: 0, right: 0, bottom: 0 },
};
var SafeAreaProvider = function (_a) {
    var children = _a.children;
    return <react_native_safe_area_context_1.SafeAreaProvider initialMetrics={exports.initialWindowMetrics}>{children}</react_native_safe_area_context_1.SafeAreaProvider>;
};
exports.SafeAreaProvider = SafeAreaProvider;
