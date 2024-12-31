import eslint from '@eslint/js';
import stylistic from '@stylistic/eslint-plugin';
import tseslint from 'typescript-eslint';

export default tseslint.config(
    eslint.configs.recommended,
    ...tseslint.configs.recommended,
    { ignores: ["dist"] },
    {
        files: ['**/*.ts', '**/*.spec.ts'],
        plugins: {
            '@stylistic': stylistic,
        },
        rules: {
            '@stylistic/no-multiple-empty-lines': [
                'error',
                {
                    max: 1,
                    maxEOF: 1,
                    maxBOF: 0,
                },
            ],
            '@stylistic/indent': ['error', 2, { SwitchCase: 1 }],
            '@stylistic/quotes': ['error', 'double'],
            '@stylistic/semi': ['error', 'always'],
            '@stylistic/comma-dangle': ['error', 'always-multiline'],
            '@stylistic/no-tabs': ['error'],
            '@stylistic/max-len': [
                'error',
                {
                    code: 120,
                    tabWidth: 2,
                },
            ],
            '@stylistic/arrow-parens': ['error', 'always'],
            '@stylistic/brace-style': ['error', '1tbs', { allowSingleLine: false }],
            '@stylistic/no-inner-declarations': 'off',
            '@typescript-eslint/no-explicit-any': 'off',
            '@typescript-eslint/no-empty-object-type': 'off',
            '@typescript-eslint/no-unused-vars': ['error', { argsIgnorePattern: '^_' }],
        },
    },
);
