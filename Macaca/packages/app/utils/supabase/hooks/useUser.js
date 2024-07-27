"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.useUser = void 0;
var useSessionContext_1 = require("./useSessionContext");
var useUser = function () {
    var _a = (0, useSessionContext_1.useSessionContext)(), session = _a.session, isLoading = _a.isLoading;
    var user = session === null || session === void 0 ? void 0 : session.user;
    // TODO: Load profile information from external sources here
    // Ex: profile photo, display name, etc.
    return {
        session: session,
        user: user,
        isLoading: isLoading,
    };
};
exports.useUser = useUser;
