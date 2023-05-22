import HTMLWebpackPlugin from 'html-webpack-plugin';

export default {
  mode: 'development',
  entry: './src/index.js',
  output: {
    filename: 'bundle.js',
  },
  plugins: [
    new HTMLWebpackPlugin({
      template: './index.html',
    }),
  ],
  module: {
    rules: [
      {
        test: /\.css$/i,
        use: ['style-loader', 'css-loader'],
      },
    ],
  },
};
