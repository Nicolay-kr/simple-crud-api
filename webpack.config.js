const path = require('path');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');

module.exports = {
  mode: 'production',
  target: 'node',
  entry: {
    main: path.resolve(__dirname, './src/index.js'),
  },
  output: {
    path: path.resolve(__dirname, './dist'),
    filename: 'app.js',
  },
  plugins: [
    new CleanWebpackPlugin(),
  ],
};
