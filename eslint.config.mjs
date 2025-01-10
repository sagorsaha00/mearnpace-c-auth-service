// @ts-check
import eslint from '@eslint/js'
// @ts-ignore
import tseslint from 'typescript-eslint'

export default tseslint.config(
   eslint.configs.recommended,
   ...tseslint.configs.recommendedTypeChecked,

   {
      ignores: ['dist', 'node-modules', 'eslint.config.mjs', 'jest.config.js'],
   },
   {
      languageOptions: {
         parserOptions: {
            projectService: true,
            tsconfigRootDir: import.meta.dirname,
         },
      },
      rules: {
         // "no-console": "error",
         // "dot-notation": "error",
         '@typescript-eslint/no-misused-promises': 'off',
      },
   },
)

// import eslint from '@eslint/js';
// import tseslint from '@typescript-eslint/eslint-plugin';
// import tsparser from '@typescript-eslint/parser';

// export default [
//   eslint.configs.recommended, // Base recommended ESLint rules
//   ...tseslint.configs.recommendedTypeChecked, // TypeScript ESLint rules
//   {
//     languageOptions: {
//       parser: tsparser, // Set the TypeScript parser
//       parserOptions: {
//         projectService: true,
//         tsconfigRootDir: import.meta.dirname,
//       },
//     },
//     ignores: ['dist', 'node_modules', 'eslint.config.mjs', 'jest.config.js'],
//     rules: {
//       '@typescript-eslint/no-misused-promises': 'off',
//     },
//   },
// ];
