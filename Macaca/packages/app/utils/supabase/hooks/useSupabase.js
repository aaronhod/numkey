"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.useSupabase = void 0;
var client_1 = require("../client");
var useSupabase = function () {
    return client_1.supabase;
};
exports.useSupabase = useSupabase;
