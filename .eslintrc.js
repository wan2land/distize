module.exports = {
  overrides: [
    {
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
    },
    {
      files: [
        '**/*.js',
      ],
      extends: [
        'stable',
      ],
    },
  ],
}
