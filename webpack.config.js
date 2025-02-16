export default {
  entry: './src/index.js',
  output: {
    filename: 'video-plugin.js',
    path: new URL('./dist', import.meta.url).pathname,
    library: {
      name: 'VideoPlugin',
      type: 'umd',
      export: ['Video', 'videoParser'],
    },
    globalObject: 'this'
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        use: {
          loader: 'babel-loader',
          options: {
            presets: ['@babel/preset-env']
          }
        }
      }
    ]
  }
}; 