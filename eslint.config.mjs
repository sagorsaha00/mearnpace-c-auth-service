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
         'no-console': 'error',
         'dot-notation': 'error',
         // '@typescript-eslint/no-misused-promises': 'off',
         '@typescript-eslint/no-unused-vars': 'off',
         '@typescript-eslint/no-unsafe-assignment': 'off',
         '@typescript-eslint/no-floating-promises': 'off',
         '@typescript-eslint/parser': 'off',
         '@typescript-eslint/no-unsafe-call': 'off',
         '@typescript-eslint/no-misused-promises': 'off',
      },
   },
)
