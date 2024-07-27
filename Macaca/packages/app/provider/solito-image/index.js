"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SolitoImageProvider = exports.getImageUrl = void 0;
var localhost_native_1 = require("app/utils/trpc/localhost.native");
var image_1 = require("solito/image");
var getImageUrl = function () {
    var imageUrl = "".concat(process.env.EXPO_PUBLIC_APP_URL);
    return (0, localhost_native_1.replaceLocalhost)(imageUrl);
};
exports.getImageUrl = getImageUrl;
var SolitoImageProvider = function (_a) {
    var children = _a.children;
    return (<image_1.SolitoImageProvider nextJsURL={(0, exports.getImageUrl)()}>
      {children}
    </image_1.SolitoImageProvider>);
};
exports.SolitoImageProvider = SolitoImageProvider;
