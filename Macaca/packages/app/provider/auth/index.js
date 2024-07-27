"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthProvider = void 0;
var auth_helpers_react_1 = require("@supabase/auth-helpers-react");
var client_1 = require("app/utils/supabase/client");
var AuthStatusChangeHandler_1 = require("../../utils/supabase/components/AuthStatusChangeHandler");
var AuthProvider = function (_a) {
    var children = _a.children, initialSession = _a.initialSession;
    return (<auth_helpers_react_1.SessionContextProvider supabaseClient={client_1.supabase} initialSession={initialSession}>
      <AuthStatusChangeHandler_1.AuthStatusChangeHandler />
      {children}
    </auth_helpers_react_1.SessionContextProvider>);
};
exports.AuthProvider = AuthProvider;
