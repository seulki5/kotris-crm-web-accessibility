import { dirname } from "path";
import { fileURLToPath } from "url";
import { FlatCompat } from "@eslint/eslintrc";
import nextPlugin from '@next/eslint-plugin-next'

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const compat = new FlatCompat({
    baseDirectory: __dirname,
});

const eslintConfig = [
    ...compat.extends("next/core-web-vitals"),
    {
        files: ['**/*.{js,jsx}'],
        plugins: {
            '@next/next': nextPlugin,
        },
        rules: {
            '@next/next/no-html-link-for-pages': ['error'],
            '@next/next/no-img-element': ['error'],
            'react-hooks/rules-of-hooks': 'error',
            'react-hooks/exhaustive-deps': 'warn',
        },
        // parser: "espree"
    },
];

export default eslintConfig;
