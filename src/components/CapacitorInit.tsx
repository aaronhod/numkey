"use client";

import { useEffect } from "react";
import { Capacitor } from "@capacitor/core";

/**
 * Runs native-only setup when the web app is hosted inside the Capacitor shell.
 * On the web (`isNativePlatform()` === false) this is a no-op, so it is safe to
 * always render.
 */
export function CapacitorInit() {
  useEffect(() => {
    if (!Capacitor.isNativePlatform()) return;

    void (async () => {
      try {
        const { SplashScreen } = await import("@capacitor/splash-screen");
        await SplashScreen.hide();
        const { StatusBar, Style } = await import("@capacitor/status-bar");
        await StatusBar.setStyle({ style: Style.Dark });
      } catch (err) {
        console.error("Capacitor native init failed", err);
      }
    })();
  }, []);

  return null;
}
