/**
 * Run `build` or `dev` with `SKIP_ENV_VALIDATION` to skip env validation. This is especially useful
 * for Docker builds.
 */
import "./src/env.js";

/** @type {import("next").NextConfig} */
const config = {
    reactStrictMode: false, // Disables strict mode to reduce hydration mismatches
    typescript: {
        ignoreBuildErrors: true,
    },
    eslint: {
        ignoreDuringBuilds: true,
    },
    experimental: {
        reactRoot: "concurrent", // Helps with hydration in React 18+
    },
    headers: async () => [
        {
          source: "/(.*)",
          headers: [
            {
              key: "Content-Security-Policy",
              value: "default-src 'self' 'unsafe-inline' 'unsafe-eval' data: blob:;",
            },
          ],
        },
      ],
};

export default config;
