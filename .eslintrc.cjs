const { defineConfig } = require('eslint-define-config')

module.exports = defineConfig({
  extends: '@antfu',
  rules: {
    '@typescript-eslint/prefer-ts-expect-error': 'off',
    '@typescript-eslint/ban-ts-comment': 'off',
  },
})
