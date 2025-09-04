import { dirname } from "path";
import { fileURLToPath } from "url";
import { FlatCompat } from "@eslint/eslintrc";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const compat = new FlatCompat({
  baseDirectory: __dirname,
});

const eslintConfig = [
  ...compat.extends("next/core-web-vitals"),
  ...compat.extends("plugin:@typescript-eslint/recommended"),
  {
    rules: {
      "@typescript-eslint/no-explicit-any": "off",
      "@typescript-eslint/no-unused-vars": "off",
      "no-unused-disable": "off",
      "eslint-comments/no-unused-disable": "off",
      "@typescript-eslint/no-unused-expressions": "off",
      "@typescript-eslint/no-empty-object-type": "off",
      "@typescript-eslint/no-this-alias": "off",
      "@typescript-eslint/no-unsafe-function-type": "off",
      "@typescript-eslint/no-require-imports": "off",
      "@typescript-eslint/no-wrapper-object-types": "off",
      "react/no-unescaped-entities": "off",
      "react/display-name": "off",
      "@next/next/no-img-element": "warn"
    },
  }, {
    ignores: [
      "node_modules/*",
      ".next/*",
      "out/*",
      "public/*",
      "**/*.min.js",
      "**/*.worker.js",
      "**/dist/**"
    ]
  },
];

export default eslintConfig;
