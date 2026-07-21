import { defineCloudflareConfig } from "@opennextjs/cloudflare";

/**
 * OpenNext adapter config for deploying this Next.js app to Cloudflare Workers.
 *
 * The default config runs the app on the Workers runtime with no persistent
 * incremental cache. To add one later (recommended for SSG/ISR-heavy apps),
 * wire an R2 or KV incremental cache here — see
 * https://opennext.js.org/cloudflare/caching
 */
export default defineCloudflareConfig();
