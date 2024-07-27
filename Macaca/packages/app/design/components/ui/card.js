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
exports.CardTitle = exports.CardHeader = exports.CardFooter = exports.CardDescription = exports.CardContent = exports.Card = void 0;
var React = require("react");
var react_native_1 = require("react-native");
var text_1 = require("@mg/ui/src/components/ui/text");
var utils_1 = require("@mg/ui/src/lib/utils");
var Card = React.forwardRef(function (_a, ref) {
    var className = _a.className, props = __rest(_a, ["className"]);
    return (<react_native_1.View ref={ref} className={(0, utils_1.cn)('rounded-lg border border-border bg-card shadow-sm shadow-foreground/10', className)} {...props}/>);
});
exports.Card = Card;
Card.displayName = 'Card';
var CardHeader = React.forwardRef(function (_a, ref) {
    var className = _a.className, props = __rest(_a, ["className"]);
    return (<react_native_1.View ref={ref} className={(0, utils_1.cn)('flex flex-col space-y-1.5 p-6', className)} {...props}/>);
});
exports.CardHeader = CardHeader;
CardHeader.displayName = 'CardHeader';
var CardTitle = React.forwardRef(function (_a, ref) {
    var className = _a.className, props = __rest(_a, ["className"]);
    return (<react_native_1.Text role='heading' aria-level={3} ref={ref} className={(0, utils_1.cn)('text-2xl text-card-foreground font-semibold leading-none tracking-tight', className)} {...props}/>);
});
exports.CardTitle = CardTitle;
CardTitle.displayName = 'CardTitle';
var CardDescription = React.forwardRef(function (_a, ref) {
    var className = _a.className, props = __rest(_a, ["className"]);
    return (<react_native_1.Text ref={ref} className={(0, utils_1.cn)('text-sm text-muted-foreground', className)} {...props}/>);
});
exports.CardDescription = CardDescription;
CardDescription.displayName = 'CardDescription';
var CardContent = React.forwardRef(function (_a, ref) {
    var className = _a.className, props = __rest(_a, ["className"]);
    return (<text_1.TextClassContext.Provider value='text-card-foreground'>
      <react_native_1.View ref={ref} className={(0, utils_1.cn)('p-6 pt-0', className)} {...props}/>
    </text_1.TextClassContext.Provider>);
});
exports.CardContent = CardContent;
CardContent.displayName = 'CardContent';
var CardFooter = React.forwardRef(function (_a, ref) {
    var className = _a.className, props = __rest(_a, ["className"]);
    return (<react_native_1.View ref={ref} className={(0, utils_1.cn)('flex flex-row items-center p-6 pt-0', className)} {...props}/>);
});
exports.CardFooter = CardFooter;
CardFooter.displayName = 'CardFooter';
