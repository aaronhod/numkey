"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthProvider = void 0;
var auth_helpers_nextjs_1 = require("@supabase/auth-helpers-nextjs");
var auth_helpers_react_1 = require("@supabase/auth-helpers-react");
var cookies_1 = require("app/utils/supabase/cookies");
var react_1 = require("react");
var AuthStatusChangeHandler_1 = require("../../utils/supabase/components/AuthStatusChangeHandler");
var AuthProvider = function (_a) {
    var children = _a.children, initialSession = _a.initialSession;
    var supabaseClient = (0, react_1.useState)(function () {
        return (0, auth_helpers_nextjs_1.createPagesBrowserClient)({
            cookieOptions: cookies_1.secureCookieOptions,
        });
    })[0];
    return (<auth_helpers_react_1.SessionContextProvider supabaseClient={supabaseClient} initialSession={initialSession}>
      <AuthStatusChangeHandler_1.AuthStatusChangeHandler />
      {children}
    </auth_helpers_react_1.SessionContextProvider>);
};
exports.AuthProvider = AuthProvider;
