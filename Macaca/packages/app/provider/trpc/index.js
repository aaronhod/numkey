"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TRPCProvider = void 0;
var trpc_1 = require("../../utils/trpc");
var TRPCProvider = function (_a) {
    var children = _a.children;
    return <trpc_1.TRPCProvider>{children}</trpc_1.TRPCProvider>;
};
exports.TRPCProvider = TRPCProvider;
