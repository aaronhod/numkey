"use strict";
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getToken = exports.secureCookieOptions = exports.AUTH_TOKEN_COOKIE_NAME = void 0;
exports.getCookieValue = getCookieValue;
var auth_helpers_shared_1 = require("@supabase/auth-helpers-shared");
function getCookieValue(cookieName) {
    var cookieString = document.cookie;
    var cookieNameLength = cookieName.length;
    var cookies = cookieString.split(';');
    for (var i = 0, len = cookies.length; i < len; i++) {
        var cookie = cookies[i];
        if ((cookie === null || cookie === void 0 ? void 0 : cookie.length) === 0)
            continue;
        while ((cookie === null || cookie === void 0 ? void 0 : cookie.charAt(0)) === ' ') {
            cookie = cookie.substring(1);
        }
        if ((cookie === null || cookie === void 0 ? void 0 : cookie.indexOf(cookieName)) === 0) {
            var cookieValue = cookie.replace('-code-verifier', '').substring(cookieNameLength + 1);
            return decodeURIComponent(cookieValue);
        }
    }
    return undefined;
}
exports.AUTH_TOKEN_COOKIE_NAME = 'auth-token';
exports.secureCookieOptions = __assign(__assign({}, auth_helpers_shared_1.DEFAULT_COOKIE_OPTIONS), { name: exports.AUTH_TOKEN_COOKIE_NAME, sameSite: 'Strict', secure: true });
var getToken = function () {
    var token = getCookieValue(exports.AUTH_TOKEN_COOKIE_NAME);
    if (token !== undefined) {
        var parse = JSON.parse(token);
        if (Array.isArray(parse) && parse.length > 0) {
            token = parse[0];
        }
    }
    return token;
};
exports.getToken = getToken;
