"use strict";
/**
 * TODO: This is a WIP. The goal is to have a single source of truth for all environment variables.
 * Different prefixes for public environments across Expo & Next.js currently block this.
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.env = void 0;
var valibot_1 = require("valibot");
var envSchema = (0, valibot_1.object)({
    NODE_ENV: (0, valibot_1.string)(),
    // Routing
    NEXT_PUBLIC_API_URL: (0, valibot_1.string)(),
    NEXT_PUBLIC_APP_URL: (0, valibot_1.string)(),
    // Authentication
    NEXT_PUBLIC_SUPABASE_ANON_KEY: (0, valibot_1.string)(),
    NEXT_PUBLIC_SUPABASE_URL: (0, valibot_1.string)(),
    JWT_VERIFICATION_KEY: (0, valibot_1.string)(),
    // Customer Support
    NEXT_PUBLIC_SUPPORT_EMAIL: (0, valibot_1.string)(),
    // Web Metadata
    NEXT_PUBLIC_METADATA_NAME: (0, valibot_1.string)(),
});
exports.env = (0, valibot_1.parse)(envSchema, process.env);
