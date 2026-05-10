import { nestJsConfig } from '@jrai/linters/nestjs';

/** @type {import("eslint").Linter.Config} */
export default [
  ...nestJsConfig,
  {
    ignores: ['prettier.config.mjs', 'eslint.config.mjs'],
  },
];
