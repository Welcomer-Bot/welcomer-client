import nextVitals from "eslint-config-next/core-web-vitals";
import nextTs from "eslint-config-next/typescript";
import prettier from "eslint-config-prettier/flat";
import { defineConfig, globalIgnores } from "eslint/config";

const eslintConfig = defineConfig([
  prettier,
  ...nextVitals,
  ...nextTs,
  {
    files: ["**/*.{ts,tsx}"],
    rules: {
      "no-restricted-imports": [
        "error",
        {
          paths: [
            {
              name: "@/providers/sourceStoreProvider",
              message: "Use @/features/dashboard/modules/providers instead.",
            },
            {
              name: "@/providers/imageCardStoreProvider",
              message: "Use @/features/dashboard/modules/providers instead.",
            },
            {
              name: "@/state/source",
              message: "Use @/features/dashboard/modules/stores instead.",
            },
            {
              name: "@/state/imageCard",
              message: "Use @/features/dashboard/modules/stores instead.",
            },
            {
              name: "@/state/guild",
              message: "Guild store was removed during refactor; use feature-local state.",
            },
            {
              name: "@/lib/dal",
              message: "Import from @/lib/dal/session, @/lib/dal/sources, or @/lib/dal/discord.",
            },
            {
              name: "@/lib/actions",
              importNames: [
                "createSource",
                "removeSource",
                "updateSource",
                "createImageCard",
                "updateImageCard",
                "deleteImageCard",
                "deleteActiveImageCard",
              ],
              message: "Use @/features/dashboard/modules/actions instead.",
            },
          ],
        },
      ],
    },
  },
  // Override default ignores of eslint-config-next.
  globalIgnores([
    // Default ignores of eslint-config-next:
    ".next/**",
    "prisma/**",
    "generated/**",
    "node_modules/**",
    "bower_components/**",
    "public/**",
    "static/**",
    "out/**",
    "build/**",
    "next-env.d.ts",
  ]),
]);

export default eslintConfig;
