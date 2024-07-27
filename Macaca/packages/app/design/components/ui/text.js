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
exports.TextClassContext = exports.Text = void 0;
var Slot = require("@rn-primitives/slot");
var React = require("react");
var react_native_1 = require("react-native");
var utils_1 = require("@mg/ui/src/lib/utils");
var TextClassContext = React.createContext(undefined);
exports.TextClassContext = TextClassContext;
var Text = React.forwardRef(function (_a, ref) {
    var className = _a.className, _b = _a.asChild, asChild = _b === void 0 ? false : _b, props = __rest(_a, ["className", "asChild"]);
    var textClass = React.useContext(TextClassContext);
    var Component = asChild ? Slot.Text : react_native_1.Text;
    return (<Component className={(0, utils_1.cn)('text-base text-foreground web:select-text', textClass, className)} ref={ref} {...props}/>);
});
exports.Text = Text;
Text.displayName = 'Text';
