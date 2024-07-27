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
exports.buttonVariants = exports.buttonTextVariants = exports.Button = void 0;
var class_variance_authority_1 = require("class-variance-authority");
var React = require("react");
var react_native_1 = require("react-native");
var text_1 = require("@mg/ui/src/components/ui/text");
var utils_1 = require("@mg/ui/src/lib/utils");
var buttonVariants = (0, class_variance_authority_1.cva)('group flex items-center justify-center rounded-md web:ring-offset-background web:transition-colors web:focus-visible:outline-none web:focus-visible:ring-2 web:focus-visible:ring-ring web:focus-visible:ring-offset-2', {
    variants: {
        variant: {
            default: 'bg-primary web:hover:opacity-90 active:opacity-90',
            destructive: 'bg-destructive web:hover:opacity-90 active:opacity-90',
            outline: 'border border-input bg-background web:hover:bg-accent web:hover:text-accent-foreground active:bg-accent',
            secondary: 'bg-secondary web:hover:opacity-80 active:opacity-80',
            ghost: 'web:hover:bg-accent web:hover:text-accent-foreground active:bg-accent',
            link: 'web:underline-offset-4 web:hover:underline web:focus:underline ',
        },
        size: {
            default: 'h-10 px-4 py-2 native:h-12 native:px-5 native:py-3',
            sm: 'h-9 rounded-md px-3',
            lg: 'h-11 rounded-md px-8 native:h-14',
            icon: 'h-10 w-10',
        },
    },
    defaultVariants: {
        variant: 'default',
        size: 'default',
    },
});
exports.buttonVariants = buttonVariants;
var buttonTextVariants = (0, class_variance_authority_1.cva)('web:whitespace-nowrap text-sm native:text-base font-medium text-foreground web:transition-colors', {
    variants: {
        variant: {
            default: 'text-primary-foreground',
            destructive: 'text-destructive-foreground',
            outline: 'group-active:text-accent-foreground',
            secondary: 'text-secondary-foreground group-active:text-secondary-foreground',
            ghost: 'group-active:text-accent-foreground',
            link: 'text-primary group-active:underline',
        },
        size: {
            default: '',
            sm: '',
            lg: 'native:text-lg',
            icon: '',
        },
    },
    defaultVariants: {
        variant: 'default',
        size: 'default',
    },
});
exports.buttonTextVariants = buttonTextVariants;
var Button = React.forwardRef(function (_a, ref) {
    var className = _a.className, variant = _a.variant, size = _a.size, props = __rest(_a, ["className", "variant", "size"]);
    return (<text_1.TextClassContext.Provider value={(0, utils_1.cn)(props.disabled && 'web:pointer-events-none', buttonTextVariants({ variant: variant, size: size }))}>
        <react_native_1.Pressable className={(0, utils_1.cn)(props.disabled && 'opacity-50 web:pointer-events-none', buttonVariants({ variant: variant, size: size, className: className }))} ref={ref} role='button' {...props}/>
      </text_1.TextClassContext.Provider>);
});
exports.Button = Button;
Button.displayName = 'Button';
