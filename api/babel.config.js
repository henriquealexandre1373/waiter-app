module.exports = {
  presets: ['@babel/preset-env', '@babel/preset-typescript'],
  plugins: [
    [
      'module-resolver',
      {
        alias: {
          '@src': './src',
          '@test': './test',
          '@useCases': './src/app/useCases',
          '@interfaces': './src/app/interfaces',
          '@validators': './src/app/validators',
          '@customTypes': './src/app/customTypes',
          '@models': './src/app/models',
          '@services': './src/app/services',
        },
      },
    ],
  ],
};
