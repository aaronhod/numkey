"use strict";
var __spreadArray = (this && this.__spreadArray) || function (to, from, pack) {
    if (pack || arguments.length === 2) for (var i = 0, l = from.length, ar; i < l; i++) {
        if (ar || !(i in from)) {
            if (!ar) ar = Array.prototype.slice.call(from, 0, i);
            ar[i] = from[i];
        }
    }
    return to.concat(ar || Array.prototype.slice.call(from));
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.useSessionContext = void 0;
exports.useSession = useSession;
exports.useIsLoadingSession = useIsLoadingSession;
var jotai_1 = require("jotai");
var useSessionContext = function () {
    var session = useSession()[0];
    var isLoading = useIsLoadingSession()[0];
    // TODO: Load profile information from external sources here
    // Ex: profile photo, display name, etc.
    return {
        session: session,
        user: session === null || session === void 0 ? void 0 : session.user,
        isLoading: isLoading,
    };
};
exports.useSessionContext = useSessionContext;
var sessionAtom = (0, jotai_1.atom)(null);
function useSession() {
    return __spreadArray([], (0, jotai_1.useAtom)(sessionAtom), true);
}
var isLoadingSessionAtom = (0, jotai_1.atom)(true);
function useIsLoadingSession() {
    return __spreadArray([], (0, jotai_1.useAtom)(isLoadingSessionAtom), true);
}
