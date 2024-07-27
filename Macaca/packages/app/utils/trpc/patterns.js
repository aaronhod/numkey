"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.success = exports.empty = exports.loading = exports.error = void 0;
var ts_pattern_1 = require("ts-pattern");
/**
 * Common states for tRPC data fetching
 *
 */
exports.error = {
    failureReason: ts_pattern_1.P.not(null),
};
exports.loading = {
    isLoading: ts_pattern_1.P.when(function (isLoading) { return isLoading === true; }),
};
exports.empty = {
    data: ts_pattern_1.P.when(function (data) { return data === null || data === undefined || data.length === 0; }),
};
exports.success = {
    isLoading: ts_pattern_1.P.when(function (isLoading) { return isLoading === false; }),
    failureReason: ts_pattern_1.P.when(function (status) { return status === null; }),
};
