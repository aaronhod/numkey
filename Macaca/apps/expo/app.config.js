"use strict";
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = (function (_a) {
    var config = _a.config;
    return (__assign(__assign({}, config), { extra: {
            eas: {
                projectId: process.env.EXPO_PUBLIC_EAS_PROJECT_ID,
            },
        }, owner: process.env.EXPO_PUBLIC_EAS_OWNER, plugins: ['expo-router'], experiments: {
            tsconfigPaths: true,
            typedRoutes: true,
        }, platforms: ['ios', 'android'], name: 'T4 App', slug: 't4-app', updates: {
            url: 'https://u.expo.dev/85fc6ccd-0ce1-4e4d-804c-b15df989f97e',
        }, runtimeVersion: {
            policy: 'sdkVersion',
        } }));
});
