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
exports.TooltipTrigger = exports.TooltipContent = exports.Tooltip = void 0;
var React = require("react");
var react_native_1 = require("react-native");
var react_native_reanimated_1 = require("react-native-reanimated");
var text_1 = require("@mg/ui/src/components/ui/text");
var TooltipPrimitive = require("@rn-primitives/tooltip");
var utils_1 = require("@mg/ui/src/lib/utils");
var Tooltip = TooltipPrimitive.Root;
exports.Tooltip = Tooltip;
var TooltipTrigger = TooltipPrimitive.Trigger;
exports.TooltipTrigger = TooltipTrigger;
var TooltipContent = React.forwardRef(function (_a, ref) {
    var className = _a.className, _b = _a.sideOffset, sideOffset = _b === void 0 ? 4 : _b, portalHost = _a.portalHost, props = __rest(_a, ["className", "sideOffset", "portalHost"]);
    return (<TooltipPrimitive.Portal hostName={portalHost}>
    <TooltipPrimitive.Overlay style={react_native_1.Platform.OS !== 'web' ? react_native_1.StyleSheet.absoluteFill : undefined}>
      <react_native_reanimated_1.default.View entering={react_native_1.Platform.select({ web: undefined, default: react_native_reanimated_1.FadeIn })} exiting={react_native_1.Platform.select({ web: undefined, default: react_native_reanimated_1.FadeOut })}>
        <text_1.TextClassContext.Provider value='text-sm native:text-base text-popover-foreground'>
          <TooltipPrimitive.Content ref={ref} sideOffset={sideOffset} className={(0, utils_1.cn)('z-50 overflow-hidden rounded-md border border-border bg-popover px-3 py-1.5 shadow-md shadow-foreground/5 web:animate-in web:fade-in-0 web:zoom-in-95 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2', className)} {...props}/>
        </text_1.TextClassContext.Provider>
      </react_native_reanimated_1.default.View>
    </TooltipPrimitive.Overlay>
  </TooltipPrimitive.Portal>);
});
exports.TooltipContent = TooltipContent;
TooltipContent.displayName = TooltipPrimitive.Content.displayName;
