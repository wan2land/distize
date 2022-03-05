module.exports = {
  overrides: [
    {
      env: {
        jest: true,
      },
      files: [
        '**/*.ts',
      ],
      extends: [
        'stable',
        'stable/typescript',
      ],
      parserOptions: {
        parser: '@typescript-eslint/parser',
        tsconfigRootDir: __dirname,
        project: ['./tsconfig.json'],
      },
      rules: {
        'unicorn/prefer-spread': 'warn',
      },
    },
    {
      files: [
        '**/*.js',
      ],
      extends: [
        'stable',
      ],
      rules: {
        'unicorn/prefer-spread': 'warn',
      },
    },
  ],
}
