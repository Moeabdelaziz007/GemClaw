const eslintConfig = [
  {
    ignores: [".next/*", "node_modules/*", "out/*", ".firebase/*"],
  },
  {
    files: ["**/*.ts", "**/*.tsx", "**/*.js", "**/*.jsx"],
    plugins: {
      "@next/next": (await import("@next/eslint-plugin-next")).default,
    },
    rules: {
      "@typescript-eslint/no-unused-vars": "warn",
      "@typescript-eslint/no-explicit-any": "warn",
      "react/no-unescaped-entities": "off",
    }
  }
];

export default eslintConfig;
