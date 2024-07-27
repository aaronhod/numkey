"use strict";
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AvatarImage = exports.AvatarFallback = exports.Avatar = void 0;
var React = require("react");
var AvatarPrimitive = require("@rn-primitives/avatar");
var utils_1 = require("@mg/ui/src/lib/utils");
var AvatarPrimitiveRoot = AvatarPrimitive.Root;
var AvatarPrimitiveImage = AvatarPrimitive.Image;
var AvatarPrimitiveFallback = AvatarPrimitive.Fallback;
var Avatar = React.forwardRef(function (_a, ref) {
    var className = _a.className, props = __rest(_a, ["className"]);
    return (<AvatarPrimitiveRoot ref={ref} className={(0, utils_1.cn)('relative flex h-10 w-10 shrink-0 overflow-hidden rounded-full', className)} {...props}/>);
});
exports.Avatar = Avatar;
Avatar.displayName = AvatarPrimitiveRoot.displayName;
var AvatarImage = React.forwardRef(function (_a, ref) {
    var className = _a.className, props = __rest(_a, ["className"]);
    return (<AvatarPrimitiveImage ref={ref} className={(0, utils_1.cn)('aspect-square h-full w-full', className)} {...props}/>);
});
exports.AvatarImage = AvatarImage;
AvatarImage.displayName = AvatarPrimitiveImage.displayName;
var AvatarFallback = React.forwardRef(function (_a, ref) {
    var className = _a.className, props = __rest(_a, ["className"]);
    return (<AvatarPrimitiveFallback ref={ref} className={(0, utils_1.cn)('flex h-full w-full items-center justify-center rounded-full bg-muted', className)} {...props}/>);
});
exports.AvatarFallback = AvatarFallback;
AvatarFallback.displayName = AvatarPrimitiveFallback.displayName;
