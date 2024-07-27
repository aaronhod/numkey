"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.supabase = exports.ExpoSecureStoreAdapter = void 0;
var supabase_js_1 = require("@supabase/supabase-js");
var SecureStore = require("expo-secure-store");
require("react-native-url-polyfill/auto");
var supabaseUrl = process.env.EXPO_PUBLIC_SUPABASE_URL;
var supabaseKey = process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY;
exports.ExpoSecureStoreAdapter = {
    getItem: function (key) { return SecureStore.getItemAsync(key); },
    setItem: function (key, value) { return SecureStore.setItemAsync(key, value); },
    removeItem: function (key) { return SecureStore.deleteItemAsync(key); },
};
exports.supabase = (0, supabase_js_1.createClient)(supabaseUrl, supabaseKey, {
    auth: {
        storage: exports.ExpoSecureStoreAdapter,
        autoRefreshToken: true,
        persistSession: true,
        detectSessionInUrl: true,
        flowType: 'pkce',
    },
});
