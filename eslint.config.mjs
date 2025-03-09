import { nextEslintConfig } from 'next/eslint';
import globals from 'globals';
import pluginJs from '@eslint/js';
import tseslint from 'typescript-eslint';
import pluginReact from 'eslint-plugin-react';
import nextPlugin from 'eslint-plugin-next';

export default [
  { languageOptions: { globals: globals.browser } },
  pluginJs.configs.recommended,
  ...tseslint.configs.recommended,
  pluginReact.configs.flat.recommended,
  nextPlugin.configs.recommended,
  nextPlugin.configs['core-web-vitals'], 
  {
    rules: {
      'react/prop-types': 'off', 
      '@typescript-eslint/no-unused-vars': ['warn'], 
      'next/no-html-link-for-pages': 'off', 
    },
  },
];
