"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.useSupabase = void 0;
var auth_helpers_react_1 = require("@supabase/auth-helpers-react");
var useSupabase = function () {
    return (0, auth_helpers_react_1.useSupabaseClient)();
};
exports.useSupabase = useSupabase;
