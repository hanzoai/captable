import { createRequire } from "node:module";
import path from "node:path";

import withBundleAnalyzer from "@next/bundle-analyzer";
import { withSentryConfig } from "@sentry/nextjs";

const require = createRequire(import.meta.url);
// @hanzo/gui (Tamagui) targets react-native; on web the bare specifier maps to
// react-native-web. Absolute path so every importer in the pnpm graph hits the
// same physical copy (one module registry — themes/media live in module state).
const reactNativeWeb = path.dirname(
  require.resolve("react-native-web/package.json"),
);

const bundleAnalyzer = withBundleAnalyzer({
  enabled: process.env.ANALYZE === "true",
});

/**
 * Run `build` or `dev` with `SKIP_ENV_VALIDATION` to skip env validation. This is especially useful
 * for Docker builds.
 */
await import("./src/env.js");

/** @type {import("next").NextConfig} */
const nextConfig = {
  output: process.env.DOCKER_OUTPUT ? "standalone" : undefined,
  images: {
    remotePatterns: [
      {
        hostname: "randomuser.me",
        protocol: "https",
      },
      {
        hostname: "avatars.githubusercontent.com",
        protocol: "https",
      },
    ],
  },
  webpack: (config, { isServer }) => {
    /**
     * Critical: prevents " ⨯ ./node_modules/canvas/build/Release/canvas.node
     * Module parse failed: Unexpected character '�' (1:0)" error
     */
    config.resolve.alias.canvas = false;
    config.resolve.alias["react-native$"] = reactNativeWeb;

    // PREPEND web extensions so react-native packages (react-native-svg via
    // @hanzogui/lucide-icons-2) resolve their .web.js siblings instead of
    // fabric NativeComponent files webpack cannot parse.
    config.resolve.extensions = [
      ".web.tsx",
      ".web.ts",
      ".web.jsx",
      ".web.js",
      ...config.resolve.extensions,
    ];

    if (isServer) {
      config.ignoreWarnings = [{ module: /opentelemetry/ }];
    }

    return config;
  },
  serverExternalPackages: [
    "pino",
    "pino-pretty",
    "pdf-lib",
    "@aws-sdk/s3-request-presigner",
    "@react-pdf/renderer",
  ],
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
};

const hasSentry = !!(
  process.env.SENTRY_ORG &&
  process.env.SENTRY_PROJECT &&
  process.env.NEXT_PUBLIC_SENTRY_DSN
);

export default hasSentry
  ? withSentryConfig(bundleAnalyzer(nextConfig), {
      org: process.env.SENTRY_ORG,
      project: process.env.SENTRY_PROJECT,
      silent: true,
      widenClientFileUpload: true,
      hideSourceMaps: true,
      disableLogger: true,
    })
  : bundleAnalyzer(nextConfig);
