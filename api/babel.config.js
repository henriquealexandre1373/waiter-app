module.exports = {
  presets: ['@babel/preset-env', '@babel/preset-typescript'],
  plugins: [
    [
      'module-resolver',
      {
        alias: {
          '@src': './src',
          '@test': './test',
        },
      },
    ],
  ],
}
