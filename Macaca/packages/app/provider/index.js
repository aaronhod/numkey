"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Provider = Provider;
var ui_1 = require("@mg/ui");
var auth_1 = require("./auth");
var safe_area_1 = require("./safe-area");
var solito_image_1 = require("./solito-image");
var toast_viewport_1 = require("./toast-viewport");
var trpc_1 = require("./trpc");
function Provider(_a) {
    var children = _a.children, initialSession = _a.initialSession;
    return (<safe_area_1.SafeAreaProvider>
      <solito_image_1.SolitoImageProvider>
        <ui_1.ToastProvider swipeDirection='horizontal' duration={6000} native={['mobile']}>
          <auth_1.AuthProvider initialSession={initialSession}>
            <trpc_1.TRPCProvider>{children}</trpc_1.TRPCProvider>
            <ui_1.CustomToast />
            <toast_viewport_1.ToastViewport />
          </auth_1.AuthProvider>
        </ui_1.ToastProvider>
      </solito_image_1.SolitoImageProvider>
    </safe_area_1.SafeAreaProvider>);
}
