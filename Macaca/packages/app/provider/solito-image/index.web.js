"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SolitoImageProvider = void 0;
var image_1 = require("solito/image");
var imageURL = process.env.NEXT_PUBLIC_APP_URL;
var SolitoImageProvider = function (_a) {
    var children = _a.children;
    return (<image_1.SolitoImageProvider loader={function (_a) {
            var quality = _a.quality, width = _a.width, src = _a.src;
            return "".concat(imageURL).concat(src, "?w=").concat(width, "&q=").concat(quality);
        }}>
      {children}
    </image_1.SolitoImageProvider>);
};
exports.SolitoImageProvider = SolitoImageProvider;
