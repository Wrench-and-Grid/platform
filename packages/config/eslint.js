/**
 * Factory that builds a React + TypeScript ESLint flat config array.
 * The caller supplies its own plugin imports so this package needs zero deps.
 *
 * @param {{ js, tseslint, reactHooks, globals, reactRefresh? }} plugins
 * @returns {import("eslint").Linter.Config[]}
 */
export function reactTsConfig({ js, tseslint, reactHooks, globals, reactRefresh = null }) {
  const configs = [
    js.configs.recommended,
    ...tseslint.configs.recommended,
    reactHooks.configs.flat.recommended,
    {
      languageOptions: {
        ecmaVersion: 2020,
        globals: globals.browser,
      },
      rules: {
        'no-console': ['warn', { allow: ['warn', 'error'] }],
      },
    },
  ]

  if (reactRefresh) {
    configs.push(reactRefresh.configs.vite)
  }

  return configs
}
