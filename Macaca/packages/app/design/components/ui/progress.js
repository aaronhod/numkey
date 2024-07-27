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
exports.Progress = void 0;
var React = require("react");
var react_native_1 = require("react-native");
var react_native_reanimated_1 = require("react-native-reanimated");
var ProgressPrimitive = require("@rn-primitives/progress");
var utils_1 = require("@mg/ui/src/lib/utils");
var Progress = React.forwardRef(function (_a, ref) {
    var className = _a.className, value = _a.value, indicatorClassName = _a.indicatorClassName, props = __rest(_a, ["className", "value", "indicatorClassName"]);
    return (<ProgressPrimitive.Root ref={ref} className={(0, utils_1.cn)('relative h-4 w-full overflow-hidden rounded-full bg-secondary', className)} {...props}>
      <Indicator value={value} className={indicatorClassName}/>
    </ProgressPrimitive.Root>);
});
exports.Progress = Progress;
Progress.displayName = ProgressPrimitive.Root.displayName;
function Indicator(_a) {
    var value = _a.value, className = _a.className;
    var progress = (0, react_native_reanimated_1.useDerivedValue)(function () { return value !== null && value !== void 0 ? value : 0; });
    var indicator = (0, react_native_reanimated_1.useAnimatedStyle)(function () {
        return {
            width: (0, react_native_reanimated_1.withSpring)("".concat((0, react_native_reanimated_1.interpolate)(progress.value, [0, 100], [1, 100], react_native_reanimated_1.Extrapolation.CLAMP), "%"), { overshootClamping: true }),
        };
    });
    if (react_native_1.Platform.OS === 'web') {
        return (<react_native_1.View className={(0, utils_1.cn)('h-full w-full flex-1 bg-primary web:transition-all', className)} style={{ transform: "translateX(-".concat(100 - (value !== null && value !== void 0 ? value : 0), "%)") }}>
        <ProgressPrimitive.Indicator className={(0, utils_1.cn)('h-full w-full ', className)}/>
      </react_native_1.View>);
    }
    return (<ProgressPrimitive.Indicator asChild>
      <react_native_reanimated_1.default.View style={indicator} className={(0, utils_1.cn)('h-full bg-foreground', className)}/>
    </ProgressPrimitive.Indicator>);
}
