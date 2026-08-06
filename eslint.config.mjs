import { dirname } from "path";
import { fileURLToPath } from "url";
import { FlatCompat } from "@eslint/eslintrc";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const compat = new FlatCompat({
  baseDirectory: __dirname,
});

// Match a layer both by its `@/` alias and by any relative path that climbs into
// it, so `../../infrastructure/x` is caught as well as `@/infrastructure/x`.
const layer = (name) => [`@/${name}`, `@/${name}/**`, `**/${name}/**`];

// Layers are ordered outermost-last. Each may only import from those to its left.
const DEPENDENCY_RULE = [
  {
    // The domain is the core: pure business rules, no framework, no I/O.
    files: ["src/domain/**/*.{js,jsx}"],
    forbidden: [
      ...layer("application"),
      ...layer("infrastructure"),
      ...layer("app"),
      ...layer("components"),
      ...layer("context"),
      ...layer("hooks"),
      ...layer("lib"),
      "react",
      "react-dom",
      "next",
      "next/**",
      "@supabase/**",
    ],
    message:
      "domain/ is the innermost layer: it may only import from domain/. Move the dependency behind a port instead.",
  },
  {
    // Use cases orchestrate the domain through ports; they never know the adapter.
    files: ["src/application/**/*.{js,jsx}"],
    forbidden: [
      ...layer("infrastructure"),
      ...layer("app"),
      ...layer("components"),
      ...layer("context"),
      ...layer("hooks"),
      ...layer("lib"),
      "react",
      "react-dom",
      "next",
      "next/**",
      "@supabase/**",
    ],
    message:
      "application/ may only import from domain/ (plus zod). Depend on a port in application/ports and let infrastructure/container.js supply the adapter.",
  },
  {
    // Adapters implement the ports. They may reach inward, never outward.
    files: ["src/infrastructure/**/*.{js,jsx}"],
    forbidden: [
      ...layer("app"),
      ...layer("components"),
      ...layer("context"),
      ...layer("hooks"),
      ...layer("lib"),
    ],
    message:
      "infrastructure/ may only import from application/ and domain/, never from the presentation layer.",
  },
  {
    // Presentation talks to use cases and the HTTP adapter — never to the database.
    files: [
      "src/app/**/*.{js,jsx}",
      "src/components/**/*.{js,jsx}",
      "src/context/**/*.{js,jsx}",
      "src/hooks/**/*.{js,jsx}",
    ],
    forbidden: [
      "@/infrastructure/supabase",
      "@/infrastructure/supabase/**",
      "@/infrastructure/container",
      "@supabase/supabase-js",
      // Not-yet-migrated modules. Each warning here is a remaining slice of
      // work; src/lib keeps only utils.js when the migration is done.
      "@/lib/supabase",
      "@/lib/auth",
      "@/lib/admin",
      "@/lib/roles",
      "@/lib/pdfGenerator",
      "@/lib/pdfStorage",
    ],
    message:
      "The presentation layer must not touch Supabase directly. Call a route handler through infrastructure/http/apiClient, or use a use case inside a route handler.",
  },
];

const eslintConfig = [
  ...compat.extends("next/core-web-vitals"),
  {
    ignores: [
      "node_modules/**",
      ".next/**",
      "out/**",
      "build/**",
      "next-env.d.ts",
    ],
  },
  ...DEPENDENCY_RULE.map(({ files, forbidden, message }) => ({
    files,
    rules: {
      // Warn during the migration; raised to "error" in the final sweep once
      // every module has moved off the src/lib shims.
      "no-restricted-imports": [
        "warn",
        { patterns: [{ group: forbidden, message }] },
      ],
    },
  })),
  {
    // Route handlers are the composition point: they are the one part of app/
    // allowed to build a container and call use cases directly.
    files: ["src/app/api/**/*.{js,jsx}"],
    rules: {
      "no-restricted-imports": "off",
    },
  },
];

export default eslintConfig;
