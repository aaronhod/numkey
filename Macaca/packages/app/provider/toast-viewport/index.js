"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ToastViewport = void 0;
var ui_1 = require("@mg/ui");
var react_native_safe_area_context_1 = require("react-native-safe-area-context");
var ToastViewport = function () {
    var _a = (0, react_native_safe_area_context_1.useSafeAreaInsets)(), top = _a.top, right = _a.right, left = _a.left;
    return <ui_1.ToastViewport top={top + 5} left={left} right={right}/>;
};
exports.ToastViewport = ToastViewport;
