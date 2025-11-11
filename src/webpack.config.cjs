const path = require('path');

module.exports = {
  entry: './app.js',
  mode: 'production',
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: 'bundle.js',
  },
  module: {
    rules: [
      {
        test: /\.(js|jsx)$/,
        exclude: /node_modules/,
        use: {
          loader: 'babel-loader',
        },
      },
      {
        test: /\.css$/,
        use: ['style-loader', 'css-loader'],
      },
    ],
  },
  resolve: {
    extensions: ['.js', '.jsx'],
    fullySpecified: false
  },
  externals: {
    // Tauri API will be loaded via script tag
    '@tauri-apps/api/core': 'window.__TAURI__',
  },
};