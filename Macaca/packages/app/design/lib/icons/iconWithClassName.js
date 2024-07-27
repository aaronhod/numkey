"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.iconWithClassName = iconWithClassName;
var nativewind_1 = require("nativewind");
function iconWithClassName(icon) {
    (0, nativewind_1.cssInterop)(icon, {
        className: {
            target: 'style',
            nativeStyleToProp: {
                color: true,
                opacity: true,
            },
        },
    });
}
