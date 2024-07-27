"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthStatusChangeHandler = void 0;
var useAuthRedirect_1 = require("app/utils/supabase/hooks/useAuthRedirect");
var AuthStatusChangeHandler = function () {
    (0, useAuthRedirect_1.useAuthRedirect)();
    return null;
};
exports.AuthStatusChangeHandler = AuthStatusChangeHandler;
