"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getLocalhost = getLocalhost;
exports.replaceLocalhost = replaceLocalhost;
var expo_constants_1 = require("expo-constants");
var localhost;
var PROTOCOL = 'http:';
var localhostRegex = new RegExp("".concat(PROTOCOL, "//localhost:"), 'g');
function getLocalhost() {
    var _a, _b;
    if (localhost !== undefined) {
        return localhost;
    }
    var debuggerHost = (_a = expo_constants_1.default.expoConfig) === null || _a === void 0 ? void 0 : _a.hostUri;
    localhost = (_b = debuggerHost === null || debuggerHost === void 0 ? void 0 : debuggerHost.split(':')[0]) !== null && _b !== void 0 ? _b : 'localhost';
    return localhost;
}
function replaceLocalhost(address) {
    return address.replace(localhostRegex, function () { return "".concat(PROTOCOL, "//").concat(getLocalhost(), ":"); });
}
